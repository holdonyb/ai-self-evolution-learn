import Link from "next/link";
import { ArrowRight, Bot, BookOpenText, Compass, Network } from "lucide-react";

import { AgentPanel } from "@/components/agent-panel";
import { SiteHeader } from "@/components/site-header";
import { getKnowledgeStats, learningTopics } from "@/lib/knowledge";

export function LearningHome() {
  const stats = getKnowledgeStats();
  const featuredTopic = learningTopics[0];

  return (
    <main className="learn-page">
      <SiteHeader active="home" />

      <section className="hero">
        <div className="home-gateway">
          <div className="home-gateway-copy">
            <p className="eyebrow">learn.ifix.xin</p>
            <h1>
              <span>选择主题</span>
              <span>开始学习</span>
            </h1>
            <p className="hero-summary">
              首页只负责把你带到合适的主题。真正的图谱、文章、追问和深读路径，都放在主题页里完成。
            </p>

            <div className="hero-actions">
              <Link href={`/topic/${featuredTopic.id}`} className="hero-link-primary">
                进入 AI 自进化
                <ArrowRight size={17} />
              </Link>
              <Link href="#assistant" className="hero-link-secondary">
                问学习助手
              </Link>
            </div>
          </div>

          <Link className="home-featured-topic" href={`/topic/${featuredTopic.id}`}>
            <div className="topic-card-head">
              <span className="module-index">01</span>
              <p>{featuredTopic.deck}</p>
            </div>
            <div className="home-topic-icon" aria-hidden="true">
              <Compass size={28} />
            </div>
            <h2>{featuredTopic.title}</h2>
            <p>{featuredTopic.themeQuestion}</p>
            <div className="home-topic-metrics">
              <span>{stats.moduleCount} 个模块</span>
              <span>{stats.articleCount} 篇材料</span>
              <span>AI 助教</span>
            </div>
            <strong>
              打开主题页
              <ArrowRight size={17} />
            </strong>
          </Link>
        </div>
      </section>

      <section className="section" id="topics">
        <div className="section-heading">
          <p className="eyebrow">主题目录</p>
          <h2>首页只放入口，深内容进主题页</h2>
        </div>
        <div className="topic-card-grid">
          {learningTopics.map((topic, index) => (
            <Link className="topic-card" key={topic.id} href={`/topic/${topic.id}`}>
              <div className="topic-card-head">
                <span className="module-index">0{index + 1}</span>
                <p>/{topic.id}</p>
              </div>
              <div className="topic-card-icon" aria-hidden="true">
                <BookOpenText size={22} />
              </div>
              <p className="eyebrow">{topic.deck}</p>
              <h3>{topic.title}</h3>
              <p className="module-question">{topic.themeQuestion}</p>
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

      <section className="section home-flow-section">
        <div className="section-heading">
          <p className="eyebrow">学习方式</p>
          <h2>先进入主题，再用问题把知识问深</h2>
        </div>
        <div className="home-flow-grid">
          <article>
            <Network size={22} />
            <h3>看图谱</h3>
            <p>先知道这个主题由哪几块组成。</p>
          </article>
          <article>
            <BookOpenText size={22} />
            <h3>读证据</h3>
            <p>再进入论文、官方材料和反方观点。</p>
          </article>
          <article>
            <Bot size={22} />
            <h3>继续问</h3>
            <p>用助手把不懂的关系问到具体。</p>
          </article>
        </div>
      </section>

      <section className="section" id="assistant">
        <div className="section-heading">
          <p className="eyebrow">学习助手</p>
          <h2>可以先问，但更适合读完主题页后追问</h2>
        </div>
        <AgentPanel topicId={featuredTopic.id} quickPrompts={featuredTopic.socraticStarts.slice(0, 3)} />
      </section>
    </main>
  );
}
