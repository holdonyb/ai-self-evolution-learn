import { describe, expect, it } from "vitest";

import {
  buildAgentContext,
  getAdjacentModules,
  getModuleById,
  getKnowledgeStats,
  getTopicIds,
  readingModules,
  searchKnowledge,
} from "@/lib/knowledge";

describe("readingModules", () => {
  it("covers the six modules from the reading list", () => {
    expect(readingModules).toHaveLength(6);
    expect(readingModules.map((module) => module.title)).toEqual([
      "概念与思想起源",
      "自我对弈：AI 第一次自己变强",
      "AI 自己发现算法",
      "让模型边用边学",
      "产业前沿：谁在押注自进化",
      "另一种声音：冷静与质疑",
    ]);
  });

  it("tracks article counts and starred primers", () => {
    const stats = getKnowledgeStats();

    expect(stats.moduleCount).toBe(6);
    expect(stats.articleCount).toBeGreaterThanOrEqual(17);
    expect(stats.starredCount).toBe(6);
  });
});

describe("topic routing helpers", () => {
  it("returns all topic ids for static routes", () => {
    expect(getTopicIds()).toEqual([
      "origins",
      "self-play",
      "algorithm-discovery",
      "continual-learning",
      "industry",
      "skepticism",
    ]);
  });

  it("finds a module by topic id", () => {
    expect(getModuleById("self-play")?.title).toBe("自我对弈：AI 第一次自己变强");
    expect(getModuleById("missing-topic")).toBeUndefined();
  });

  it("builds previous and next navigation for a topic page", () => {
    const adjacent = getAdjacentModules("continual-learning");

    expect(adjacent.previous?.id).toBe("algorithm-discovery");
    expect(adjacent.next?.id).toBe("industry");
  });
});

describe("searchKnowledge", () => {
  it("finds continual learning material for memory-related questions", () => {
    const results = searchKnowledge("catastrophic forgetting continual learning");

    expect(results[0]?.moduleTitle).toBe("让模型边用边学");
    expect(results.some((result) => result.articleTitle.includes("Nested Learning"))).toBe(true);
  });

  it("finds industry signals for startup and funding questions", () => {
    const results = searchKnowledge("startup funding recursive self-improvement");

    expect(results[0]?.moduleTitle).toBe("产业前沿：谁在押注自进化");
    expect(results.some((result) => result.articleTitle.includes("Recursive Superintelligence"))).toBe(true);
  });
});

describe("buildAgentContext", () => {
  it("assembles a structured answer context for the site agent", () => {
    const context = buildAgentContext("AlphaZero 和 AlphaEvolve 的区别是什么？");

    expect(context).toContain("问题：AlphaZero 和 AlphaEvolve 的区别是什么？");
    expect(context).toContain("模块：自我对弈：AI 第一次自己变强");
    expect(context).toContain("模块：AI 自己发现算法");
    expect(context).toContain("回答要求");
  });
});
