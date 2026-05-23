import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Compass, LibraryBig, Orbit, ScrollText, Waypoints } from "lucide-react";

import { AgentPanel } from "@/components/agent-panel";
import { SiteHeader } from "@/components/site-header";
import { glossary } from "@/content/reading-list";
import { getKnowledgeStats, learningTopics } from "@/lib/knowledge";

const comparisonRows = [
  {
    stage: "自我对弈",
    mechanism: "自己生成训练数据，自己承担对手",
    verifier: "胜负结果",
    ceiling: "封闭规则世界",
  },
  {
    stage: "算法发现",
    mechanism: "提出代码候选，再用评测器淘汰与保留",
    verifier: "自动评分器 / benchmark / 系统指标",
    ceiling: "必须可编程验证",
  },
  {
    stage: "持续学习",
    mechanism: "边运行边更新记忆与参数结构",
    verifier: "新任务表现 + 旧任务保真",
    ceiling: "灾难性遗忘与稳定性",
  },
  {
    stage: "产业 RSI",
    mechanism: "把模型、评测、研究工具链串成研发飞轮",
    verifier: "研发速度、基础设施收益、可控性",
    ceiling: "现实世界摩擦与安全治理",
  },
];

export function LearningHome() {
  const stats = getKnowledgeStats();
  const featuredTopic = learningTopics[0];

  return (
    <main className="learn-page">
      <SiteHeader active="home" />

      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">learn.ifix.xin / structured learning themes</p>
            <h1>结构化自主学习主题站</h1>
            <p className="hero-kicker">不是把文章排好，而是把一个主题学成结构。</p>
            <p className="hero-summary">
              Learn 是主题导航站，不把整个站写成某一个主题。你先选主题，再进入它的下级学习页，沿着图谱、模块、文章和 AI 助教，把材料真正学成一个体系。
            </p>
            <div className="hero-stats">
              <div>
                <span>{stats.topicCount}</span>
                <p>学习主题</p>
              </div>
              <div>
                <span>{stats.moduleCount}</span>
                <p>模块层级</p>
              </div>
              <div>
                <span>{stats.articleCount}</span>
                <p>文章节点</p>
              </div>
            </div>

            <div className="hero-actions">
              <Link href="#topics" className="hero-link-primary">
                选择学习主题
                <ArrowRight size={17} />
              </Link>
              <Link href="#assistant" className="hero-link-secondary">
                先试学习助手
              </Link>
            </div>

            <div className="hero-rail">
              <article>
                <span>导航</span>
                <p>先选主题，而不是一上来掉进文章列表。</p>
              </article>
              <article>
                <span>理解</span>
                <p>顺着图谱看清主题、模块、文章与争议边界之间的关系。</p>
              </article>
              <article>
                <span>追问</span>
                <p>用苏格拉底式提问把“不懂”继续推到更具体。</p>
              </article>
            </div>
          </div>
          <div className="hero-map" aria-hidden="true">
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <div className="orbit orbit-c" />
            <div className="map-core">
              <span>Learn</span>
              <p>主题站壳层</p>
            </div>
            <div className="map-annotations">
              <article>
                <strong>主题</strong>
                <span>先确定学习对象</span>
              </article>
              <article>
                <strong>模块</strong>
                <span>再看内部结构</span>
              </article>
              <article>
                <strong>文章</strong>
                <span>最后读证据节点</span>
              </article>
              <article>
                <strong>追问</strong>
                <span>把模糊处继续问深</span>
              </article>
              <article>
                <strong>内化</strong>
                <span>把材料变成判断</span>
              </article>
            </div>
            <ul>
              {featuredTopic.modules.map((module, index) => (
                <li key={module.id} style={{ "--index": index } as CSSProperties}>
                  {module.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="topics">
        <div className="section-heading">
          <p className="eyebrow">主题目录</p>
          <h2>首页负责导航，真正的深读发生在每个主题的下级页面</h2>
        </div>
        <div className="topic-card-grid">
          {learningTopics.map((topic, index) => (
            <Link className="topic-card" key={topic.id} href={`/topic/${topic.id}`}>
              <div className="topic-card-head">
                <span className="module-index">0{index + 1}</span>
                <p>/{topic.id}</p>
              </div>
              <div className="topic-card-icon" aria-hidden="true">
                {index === 0 ? <Compass size={22} /> : null}
                {index === 1 ? <Orbit size={22} /> : null}
                {index === 2 ? <Waypoints size={22} /> : null}
                {index === 3 ? <LibraryBig size={22} /> : null}
                {index === 4 ? <Bot size={22} /> : null}
                {index === 5 ? <ScrollText size={22} /> : null}
              </div>
              <p className="eyebrow">{topic.deck}</p>
              <h3>{topic.title}</h3>
              <p className="module-question">{topic.themeQuestion}</p>
              <p className="module-synthesis">{topic.summary}</p>
              <div className="topic-card-footer">
                <span>{topic.modules.length} 个模块</span>
                <strong>
                  进入这个主题
                  <ArrowRight size={16} />
                </strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section split-section" id="framework">
        <div>
          <div className="section-heading">
            <p className="eyebrow">一张表看明白</p>
            <h2>{featuredTopic.title} 不是一个词，而是一条能力台阶</h2>
          </div>
          <div className="comparison-table">
            <div className="comparison-head">
              <span>层级</span>
              <span>它怎么变强</span>
              <span>谁来判分</span>
              <span>现实天花板</span>
            </div>
            {comparisonRows.map((row) => (
              <div className="comparison-row" key={row.stage}>
                <span>{row.stage}</span>
                <span>{row.mechanism}</span>
                <span>{row.verifier}</span>
                <span>{row.ceiling}</span>
              </div>
            ))}
          </div>
        </div>
        <AgentPanel topicId={featuredTopic.id} quickPrompts={featuredTopic.socraticStarts.slice(0, 3)} />
      </section>

      <section className="section notes-section">
        <div className="section-heading">
          <p className="eyebrow">主题判断</p>
          <h2>如果只记住三条判断，这个主题至少该留下这些</h2>
        </div>
        <div className="thesis-list">
          {featuredTopic.theses.map((thesis) => (
            <article key={thesis}>
              <h3>{thesis}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section glossary-section">
        <div className="section-heading">
          <p className="eyebrow">术语表</p>
          <h2>把讨论里最容易混掉的词先钉住</h2>
        </div>
        <div className="glossary-grid">
          {glossary.map((item) => (
            <article key={item.term}>
              <span className="glossary-tag">TERM</span>
              <h3>{item.term}</h3>
              <p>{item.definition}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
