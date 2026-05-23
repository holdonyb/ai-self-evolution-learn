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
              <span>AI 自进化</span>
              <span>学习地图</span>
            </h1>
            <p className="hero-summary">
              从自我对弈到算法发现，把分散材料整理成一条能读、能问、能复盘的学习路径。
            </p>

            <div className="hero-actions">
              <Link href={`/topic/${featuredTopic.id}`} className="hero-link-primary">
                进入学习地图
                <ArrowRight size={17} />
              </Link>
              <Link href="#assistant" className="hero-link-secondary">
                问 AI 助教
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
              进入学习
              <ArrowRight size={17} />
            </strong>
          </Link>
        </div>
      </section>

      <section className="section" id="topics">
        <div className="section-heading">
          <p className="eyebrow">主题目录</p>
          <h2>选择一个主题开始</h2>
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
          <h2>一条路径读下来</h2>
        </div>
        <div className="home-flow-grid">
          <article>
            <Network size={22} />
            <h3>建立问题</h3>
            <p>先抓住：AI 自进化到底在改进什么。</p>
          </article>
          <article>
            <BookOpenText size={22} />
            <h3>对照证据</h3>
            <p>再看论文、产品路线和反方观点。</p>
          </article>
          <article>
            <Bot size={22} />
            <h3>追问内化</h3>
            <p>最后把模糊概念问成自己的判断。</p>
          </article>
        </div>
      </section>

      <section className="section" id="assistant">
        <div className="section-heading">
          <p className="eyebrow">学习助手</p>
          <h2>用问题继续往深处走</h2>
        </div>
        <AgentPanel topicId={featuredTopic.id} quickPrompts={featuredTopic.socraticStarts.slice(0, 3)} />
      </section>
    </main>
  );
}
