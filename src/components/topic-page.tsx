import Link from "next/link";

import type { ReadingModule } from "@/content/reading-list";
import { getAdjacentModules } from "@/lib/knowledge";

type TopicPageProps = {
  module: ReadingModule;
};

export function TopicPage({ module }: TopicPageProps) {
  const { previous, next } = getAdjacentModules(module.id);

  return (
    <main className="topic-page">
      <section className="topic-hero">
        <div className="topic-shell">
          <div className="topic-topbar">
            <Link href="/" className="topic-back">
              返回首页
            </Link>
            <p className="eyebrow">topic / {module.id}</p>
          </div>

          <div className="topic-hero-grid">
            <div>
              <h1>{module.title}</h1>
              <p className="topic-question">{module.guidingQuestion}</p>
              <p className="topic-synthesis">{module.synthesis}</p>
            </div>

            <aside className="topic-sidebar">
              <p className="eyebrow">本页你会拿走什么</p>
              <ul className="topic-takeaways">
                {module.takeaways.map((takeaway) => (
                  <li key={takeaway}>{takeaway}</li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">阅读节点</p>
          <h2>这一主题下的文章不是并列列表，而是一条理解路径</h2>
        </div>

        <div className="topic-article-list">
          {module.articles.map((article, index) => (
            <article className="topic-article" key={article.title}>
              <div className="topic-article-index">0{index + 1}</div>
              <div className="topic-article-main">
                <div className="topic-article-head">
                  <h3>
                    {article.isPrimer ? "★ " : ""}
                    {article.title}
                  </h3>
                  <span>
                    {article.source} · {article.published}
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
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">主题导航</p>
          <h2>读完这一页后，继续往前还是往后</h2>
        </div>

        <div className="topic-nav-grid">
          {previous ? (
            <Link href={`/topic/${previous.id}`} className="topic-nav-card">
              <span>上一个主题</span>
              <strong>{previous.title}</strong>
            </Link>
          ) : (
            <div className="topic-nav-card topic-nav-card-muted">
              <span>上一个主题</span>
              <strong>已经是第一章</strong>
            </div>
          )}

          {next ? (
            <Link href={`/topic/${next.id}`} className="topic-nav-card topic-nav-card-accent">
              <span>进入下一个主题</span>
              <strong>{next.title}</strong>
            </Link>
          ) : (
            <div className="topic-nav-card topic-nav-card-accent">
              <span>下一个主题</span>
              <strong>已经到最后一章</strong>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
