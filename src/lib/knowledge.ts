import { glossary, readingModules } from "@/content/reading-list";
import type { ReadingModule } from "@/content/reading-list";

type SearchHit = {
  moduleId: string;
  moduleTitle: string;
  moduleSynthesis: string;
  articleTitle: string;
  sourceType: string;
  articleUrl: string;
  articleSummary: string;
  whyItMatters: string;
  caveat: string;
  score: number;
};

const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");

const tokenize = (query: string) =>
  normalize(query)
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 1);

export { readingModules, glossary };

export function getKnowledgeStats() {
  const articleCount = readingModules.reduce((total, module) => total + module.articles.length, 0);
  const starredCount = readingModules.reduce(
    (total, module) => total + module.articles.filter((article) => article.isPrimer).length,
    0,
  );

  return {
    moduleCount: readingModules.length,
    articleCount,
    starredCount,
  };
}

export function getTopicIds() {
  return readingModules.map((module) => module.id);
}

export function getModuleById(topicId: string) {
  return readingModules.find((module) => module.id === topicId);
}

export function getAdjacentModules(topicId: string): {
  previous?: ReadingModule;
  next?: ReadingModule;
} {
  const index = readingModules.findIndex((module) => module.id === topicId);

  if (index === -1) {
    return {};
  }

  return {
    previous: index > 0 ? readingModules[index - 1] : undefined,
    next: index < readingModules.length - 1 ? readingModules[index + 1] : undefined,
  };
}

export function searchKnowledge(query: string, limit = 6): SearchHit[] {
  const tokens = tokenize(query);

  return readingModules
    .flatMap((module) =>
      module.articles.map((article) => {
        const weightedFields = [
          [normalize(module.title), 4],
          [normalize(module.guidingQuestion), 3],
          [normalize(module.synthesis), 2],
          [normalize(article.title), 4],
          [normalize(article.summary), 2],
          [normalize(article.whyItMatters), 3],
          [normalize(article.caveat), 1],
          [normalize(article.tags.join(" ")), 4],
        ] as const;

        const score =
          tokens.reduce((total, token) => {
            const tokenScore = weightedFields.reduce((fieldTotal, [fieldValue, weight]) => {
              if (fieldValue.includes(token)) {
                return fieldTotal + weight;
              }
              return fieldTotal;
            }, 0);

            return total + tokenScore;
          }, 0) + (article.isPrimer ? 1 : 0);

        return {
          moduleId: module.id,
          moduleTitle: module.title,
          moduleSynthesis: module.synthesis,
          articleTitle: article.title,
          sourceType: article.sourceType,
          articleUrl: article.url,
          articleSummary: article.summary,
          whyItMatters: article.whyItMatters,
          caveat: article.caveat,
          score,
        };
      }),
    )
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export function buildAgentContext(query: string) {
  const hits = searchKnowledge(query, 8);
  const grouped = new Map<
    string,
    { moduleTitle: string; moduleSynthesis: string; entries: SearchHit[] }
  >();

  for (const hit of hits) {
    const current = grouped.get(hit.moduleId);
    if (current) {
      current.entries.push(hit);
      continue;
    }

    grouped.set(hit.moduleId, {
      moduleTitle: hit.moduleTitle,
      moduleSynthesis: hit.moduleSynthesis,
      entries: [hit],
    });
  }

  const moduleBlocks = Array.from(grouped.values()).map((group) => {
    const articles = group.entries
      .map(
        (entry) =>
          `- ${entry.articleTitle}\n  来源类型：${entry.sourceType}\n  核心：${entry.articleSummary}\n  价值：${entry.whyItMatters}\n  边界：${entry.caveat}\n  链接：${entry.articleUrl}`,
      )
      .join("\n");

    return `模块：${group.moduleTitle}\n模块摘要：${group.moduleSynthesis}\n相关文章：\n${articles}`;
  });

  const glossaryBlock = glossary
    .map((item) => `- ${item.term}：${item.definition}`)
    .join("\n");

  return [
    `问题：${query}`,
    "你是 AI 自进化学习站内的学习助教，需要只基于下方知识库回答。",
    "优先解释概念差异、机制、适用边界和现实限制，避免空泛口号。",
    moduleBlocks.join("\n\n"),
    "关键术语：",
    glossaryBlock,
    "回答要求：",
    "1. 先给结论，再解释原因。",
    "2. 明确区分已证实、初步迹象和愿景性主张。",
    "3. 必须指出至少一个限制或争议点。",
    "4. 结尾补一个“继续读什么”的建议。",
  ].join("\n\n");
}
