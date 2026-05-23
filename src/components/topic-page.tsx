import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenText, FileStack, Milestone, Tags } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { TopicAssistantDock } from "@/components/topic-assistant-dock";
import type { LearningTopic } from "@/content/reading-list";

type TopicPageProps = {
  topic: LearningTopic;
};

export function TopicPage({ topic }: TopicPageProps) {
  const tags = Array.from(
    new Set(topic.modules.flatMap((module) => module.articles.flatMap((article) => article.tags)).slice(0, 18)),
  ).slice(0, 10);

  return (
    <main className="topic-page">
      <SiteHeader active="topics" />

      <section className="topic-hero">
        <div className="topic-shell">
          <div className="topic-topbar">
            <Link href="/" className="topic-back">
              <ArrowLeft size={16} />
              返回首页
            </Link>
            <p className="eyebrow">topic / {topic.id}</p>
          </div>

          <div className="topic-hero-grid">
            <div className="topic-copy">
              <div className="topic-kicker">
                <span>{topic.deck}</span>
                <strong>{topic.id}</strong>
              </div>
              <h1>{topic.title}</h1>
              <p className="topic-question">{topic.themeQuestion}</p>
              <p className="topic-synthesis">{topic.summary}</p>
              <p className="topic-synthesis">{topic.whyThisTheme}</p>

              <div className="topic-meta-row">
                <span>
                  <Milestone size={16} />
                  {topic.modules.length} 个模块层级
                </span>
                <span>
                  <BookOpenText size={16} />
                  按主题路径阅读
                </span>
                <span>
                  <FileStack size={16} />
                  从概念、机制到边界与产业
                </span>
              </div>
            </div>

            <aside className="topic-sidebar">
              <figure className="topic-sidebar-figure">
                <div className="topic-sidebar-image">
                  <Image
                    src="/design/path-algorithm-discovery.png"
                    alt="自我对弈与算法发现"
                    className="media-fill"
                    fill
                    unoptimized
                  />
                </div>
              </figure>
              <p className="eyebrow">本页先想清什么</p>
              <ul className="topic-takeaways">
                {topic.socraticStarts.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ul>

              <div className="topic-side-block">
                <p className="eyebrow">关键词</p>
                <div className="topic-tag-list">
                  {tags.map((tag) => (
                    <span key={tag}>
                      <Tags size={13} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section topic-map-section" id="map">
        <div className="section-heading topic-map-heading">
          <p className="eyebrow">主题图谱</p>
          <h2>六步读懂 AI 自进化</h2>
          <p className="section-lede">先建立阅读路线，再进入每一节的证据、边界和追问。</p>
        </div>

        <div className="topic-path-layout">
          <aside className="topic-path-summary">
            <span>01-06</span>
            <strong>从封闭规则走到开放系统</strong>
            <p>这条线不是按文章发布时间排，而是按理解门槛排：先看什么算闭环，再看闭环如何变强，最后看它在哪里会失真。</p>
            <div className="topic-path-checks" aria-label="阅读判断轴">
              <span>规则是否封闭</span>
              <span>反馈能否自动验证</span>
              <span>能力是否能长期保留</span>
            </div>
          </aside>

          <nav className="topic-path-board" aria-label="AI 自进化主题路径">
            {topic.modules.map((module, index) => (
              <a key={module.id} href={`#module-${module.id}`} className="topic-path-step">
                <span className="topic-path-index">0{index + 1}</span>
                <strong>{module.title}</strong>
                <p>{module.guidingQuestion}</p>
                <span className="topic-path-action">
                  读这一节
                  <ArrowRight size={14} />
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="section topic-reading-shell">
        <div className="topic-reading-layout">
          <div className="topic-reading-main">
            <section className="topic-reading-section">
              <div className="section-heading">
                <p className="eyebrow">学习路径</p>
                <h2>今天这组主题学的不是某一篇文章，而是一整条能力演化路径</h2>
              </div>

              <div className="topic-assistant-inline-note">
                <p className="eyebrow">边读边问</p>
                <p>读到卡住的地方，不必滑到页尾，右侧助教会一直跟着当前主题。</p>
                <a href="#assistant">
                  打开助教
                  <ArrowRight size={15} />
                </a>
              </div>

              <figure className="topic-lead-figure">
                <div className="topic-lead-figure-copy">
                  <p className="eyebrow">持续学习与部署</p>
                  <p>真正困难的地方，不是生成候选，而是让系统在长期记忆、评测和生产反馈里稳定变强。</p>
                </div>
                <div className="topic-lead-figure-image">
                  <Image
                    src="/design/hero-research-atlas.png"
                    alt="持续学习与产业验证"
                    className="media-fill"
                    fill
                    unoptimized
                  />
                </div>
              </figure>

              <div className="topic-article-list">
                {topic.modules.map((module, moduleIndex) => (
                  <section className="topic-module-block" key={module.id} id={`module-${module.id}`}>
                    <div className="topic-module-heading">
                      <div className="topic-article-index">0{moduleIndex + 1}</div>
                      <div>
                        <p className="eyebrow">模块 / {module.id}</p>
                        <h3>{module.title}</h3>
                        <p>{module.guidingQuestion}</p>
                        <p>{module.synthesis}</p>
                      </div>
                    </div>

                    <ul className="topic-takeaways">
                      {module.takeaways.map((takeaway) => (
                        <li key={takeaway}>{takeaway}</li>
                      ))}
                    </ul>

                    {module.articles.map((article, index) => (
                      <article className="topic-article" key={article.title}>
                        <div className="topic-article-index">
                          {moduleIndex + 1}-{index + 1}
                        </div>
                        <div className="topic-article-main">
                          <div className="topic-article-head">
                            <h4>
                              {article.isPrimer ? "★ " : ""}
                              {article.title}
                            </h4>
                            <span>
                              {article.source} · {article.published} · {article.sourceType}
                            </span>
                          </div>
                          <p>{article.summary}</p>
                        </div>
                        <div className="topic-article-notes">
                          <div>
                            <strong>为什么值得读</strong>
                            <p>{article.whyItMatters}</p>
                          </div>
                          <div>
                            <strong>边界或争议</strong>
                            <p>{article.caveat}</p>
                          </div>
                          <a href={article.url} target="_blank" rel="noreferrer">
                            打开原文
                            <ArrowRight size={15} />
                          </a>
                        </div>
                      </article>
                    ))}
                  </section>
                ))}
              </div>
            </section>

            <section className="topic-reading-section">
              <div className="section-heading">
                <p className="eyebrow">下一步</p>
                <h2>读完主题页后，你可以回首页换题，或者继续追问这组材料</h2>
              </div>

              <div className="topic-nav-grid">
                <Link href="/" className="topic-nav-card">
                  <span>返回主题目录</span>
                  <strong>继续选别的主题</strong>
                </Link>

                <a href="#assistant" className="topic-nav-card topic-nav-card-accent">
                  <span>继续追问</span>
                  <strong>把模块、文章和争议边界串起来</strong>
                </a>
              </div>
            </section>
          </div>

          <TopicAssistantDock topic={topic} />
        </div>
      </div>
    </main>
  );
}
