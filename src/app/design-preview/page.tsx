import Image from "next/image";

import homepageConcept from "@/assets/design/homepage-concept.png";
import topicConcept from "@/assets/design/topic-concept.png";
import { SiteHeader } from "@/components/site-header";

const principles = [
  "研究型学习站，而不是营销页",
  "温暖纸张 + 石墨深色 + 氧化蓝绿",
  "首页做导航，topic 页做深读",
  "结构优先，装饰克制，阅读路径清晰",
];

export default function DesignPreviewPage() {
  return (
    <main className="learn-page">
      <SiteHeader active="topics" />

      <section className="section">
        <div className="design-preview-shell">
          <div className="section-heading">
            <p className="eyebrow">Visual Preview</p>
            <h2>AI 自进化学习站的设计稿与视觉方向</h2>
          </div>

          <div className="design-principles">
            {principles.map((item, index) => (
              <article key={item}>
                <span>0{index + 1}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>

          <div className="design-preview-grid">
            <article className="design-shot">
              <div className="design-shot-head">
                <p className="eyebrow">Homepage Concept</p>
                <h3>首页视觉稿</h3>
              </div>
              <Image
                src={homepageConcept}
                alt="AI 自进化学习站首页设计稿"
                className="design-shot-image"
                priority
              />
            </article>

            <article className="design-shot">
              <div className="design-shot-head">
                <p className="eyebrow">Topic Page Concept</p>
                <h3>Topic 页视觉稿</h3>
              </div>
              <Image
                src={topicConcept}
                alt="AI 自进化学习站 topic 页设计稿"
                className="design-shot-image"
              />
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
