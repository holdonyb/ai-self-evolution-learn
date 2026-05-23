import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Compass, LibraryBig, Orbit, ScrollText, Waypoints } from "lucide-react";

import { AgentPanel } from "@/components/agent-panel";
import { SiteHeader } from "@/components/site-header";
import { glossary, readingModules } from "@/content/reading-list";
import { getKnowledgeStats } from "@/lib/knowledge";

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

  return (
    <main className="learn-page">
      <SiteHeader active="home" />

      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">learn.ifix.xin / editorial knowledge system</p>
            <h1>AI 自进化学习站</h1>
            <p className="hero-kicker">让知识自我进化，让学习持续发生。</p>
            <p className="hero-summary">
              把一组分散的文章压缩成一个能顺着读、能横向比、也能直接追问的研究型学习站。
            </p>
            <div className="hero-stats">
              <div>
                <span>{stats.moduleCount}</span>
                <p>主题模块</p>
              </div>
              <div>
                <span>{stats.articleCount}</span>
                <p>文章节点</p>
              </div>
              <div>
                <span>{stats.starredCount}</span>
                <p>入门首选</p>
              </div>
            </div>

            <div className="hero-actions">
              <Link href="#topics" className="hero-link-primary">
                进入六大主题
                <ArrowRight size={17} />
              </Link>
              <Link href="#assistant" className="hero-link-secondary">
                直接问学习助手
              </Link>
            </div>

            <div className="hero-rail">
              <article>
                <span>输入</span>
                <p>阅读清单、论文、媒体、实验室线索</p>
              </article>
              <article>
                <span>理解</span>
                <p>概念边界、能力台阶、验证器逻辑</p>
              </article>
              <article>
                <span>迭代</span>
                <p>顺着 topic 路由，把零散材料变成长期知识</p>
              </article>
            </div>
          </div>
          <div className="hero-map" aria-hidden="true">
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <div className="orbit orbit-c" />
            <div className="map-core">
              <span>RSI</span>
              <p>从自我对弈到自改研究飞轮</p>
            </div>
            <div className="map-annotations">
              <article>
                <strong>输入</strong>
                <span>信息摄入</span>
              </article>
              <article>
                <strong>理解</strong>
                <span>意义建构</span>
              </article>
              <article>
                <strong>内化</strong>
                <span>知识融通</span>
              </article>
              <article>
                <strong>输出</strong>
                <span>表达与应用</span>
              </article>
              <article>
                <strong>迭代</strong>
                <span>反馈与演化</span>
              </article>
            </div>
            <ul>
              {readingModules.map((module, index) => (
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
          <p className="eyebrow">六大主题</p>
          <h2>首页负责导航和定位，真正的深读发生在每个 topic 页</h2>
        </div>
        <div className="topic-card-grid">
          {readingModules.map((module, index) => (
            <Link className="topic-card" key={module.id} href={`/topic/${module.id}`}>
              <div className="topic-card-head">
                <span className="module-index">0{index + 1}</span>
                <p>/{module.id}</p>
              </div>
              <div className="topic-card-icon" aria-hidden="true">
                {index === 0 ? <Compass size={22} /> : null}
                {index === 1 ? <Orbit size={22} /> : null}
                {index === 2 ? <Waypoints size={22} /> : null}
                {index === 3 ? <LibraryBig size={22} /> : null}
                {index === 4 ? <Bot size={22} /> : null}
                {index === 5 ? <ScrollText size={22} /> : null}
              </div>
              <h3>{module.title}</h3>
              <p className="module-question">{module.guidingQuestion}</p>
              <p className="module-synthesis">{module.synthesis}</p>
              <div className="topic-card-footer">
                <span>{module.articles.length} 篇文章</span>
                <strong>
                  进入主题
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
            <h2>“AI 自进化”不是一件事，而是四层能力台阶</h2>
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
        <AgentPanel />
      </section>

      <section className="section notes-section">
        <div className="section-heading">
          <p className="eyebrow">关键判断</p>
          <h2>读完整个清单后，最值得留下的三条判断</h2>
        </div>
        <div className="thesis-list">
          <article>
            <h3>今天最真实的自进化，不是“全面自治”，而是“局部闭环越来越多”。</h3>
            <p>
              AlphaZero 在封闭规则里闭环，AlphaEvolve 在算法评测里闭环，Nested Learning 试图在记忆更新里闭环。真正的突破不是一句“AI 会自我改进”，而是闭环范围在不断扩张。
            </p>
          </article>
          <article>
            <h3>验证器决定了这条路能走多远。</h3>
            <p>
              只会生成不算自进化。能不能自动知道“这次变得更好了吗”，才是把输出变成飞轮的关键。越难验证的任务，离真正 RSI 就越远。
            </p>
          </article>
          <article>
            <h3>最该警惕的不是神话式奇点，而是现实中的研发加速。</h3>
            <p>
              怀疑者反对的是无摩擦爆炸，不是能力提升本身。对组织和社会真正有影响的，是 AI 越来越深地进入 AI 研发、测试、安全和基础设施链路。
            </p>
          </article>
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
