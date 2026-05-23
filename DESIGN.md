# Design System - AI 自进化学习站

## Product Context
- **What this is:** A structured learning site that compresses a reading list on recursive self-improvement into a navigable, topic-based study experience.
- **Who it's for:** Chinese-speaking builders, researchers, and advanced learners who want a dense but readable understanding of AI self-improvement.
- **Space/industry:** AI research learning, technical editorial products, knowledge tools.
- **Project type:** Learning web app with editorial structure and utility surfaces.

## Aesthetic Direction
- **Direction:** Editorial research notebook
- **Decoration level:** Intentional
- **Mood:** Calm, serious, intelligent, and quietly premium. It should feel closer to a well-designed research atlas than a SaaS dashboard or marketing page.
- **Reference mood:** Printed paper, scientific diagrams, restrained institutional interfaces, annotated notebooks.

## Typography
- **Display/Hero:** `Bodoni Moda SC` style reference for Chinese display feel via image concepts; in implementation keep `Space Grotesk` for Latin accents and use `Noto Serif SC` as the Chinese display family.
- **Body:** `Noto Sans SC`
- **UI/Labels:** `Noto Sans SC`
- **Data/Tables:** `Noto Sans SC` with tabular numerals where needed
- **Code:** `JetBrains Mono`
- **Loading:** Google Fonts through Next font loader
- **Scale:** hero `clamp(3.6rem, 8vw, 7rem)`, section title `clamp(2rem, 4vw, 3.4rem)`, topic hero `clamp(2.8rem, 6vw, 5.2rem)`, card title `1.35rem`, body `1rem`, annotation `0.9rem`

## Color
- **Approach:** Restrained
- **Primary:** `#155e63` - oxidized teal for orientation, action, and key diagrams
- **Secondary:** `#a6783f` - muted brass for counters, accents, and structural emphasis
- **Neutrals:** `#f7f1e3`, `#efe7d7`, `#e4d8c3`, `#8a7f70`, `#3e3a34`, `#121a21`
- **Semantic:** success `#2f7d5a`, warning `#b07a22`, error `#b34a36`, info `#2f667f`
- **Dark mode:** Deep graphite surfaces with warm paper overlays, reduce saturation by 12% and keep brass minimal

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable but information-dense
- **Scale:** 2xs(4) xs(8) sm(12) md(16) lg(24) xl(32) 2xl(48) 3xl(64) 4xl(88)

## Layout
- **Approach:** Hybrid
- **Grid:** 12-column desktop, 8-column tablet, 4-column mobile
- **Max content width:** `1280px`
- **Border radius:** `4px` for data/surfaces, `8px` for larger panels, `9999px` only for circular diagram nodes
- **Structural rule:** Use full-width bands and panel surfaces, not nested card piles

## Motion
- **Approach:** Minimal-functional
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for enter, `ease` for hover, `ease-in-out` for diagram drift
- **Duration:** micro `80ms`, short `160ms`, medium `240ms`, long `420ms`

## Page Patterns
- **Homepage:** Full-bleed hero with an orbit/knowledge diagram, quick stats, topic atlas, comparison matrix, assistant panel, and thesis blocks.
- **Topic page:** Large chapter heading, right rail for takeaways/resources, structured reading path, supporting concept diagram, and next/previous navigation.
- **Assistant panel:** Integrated study tool, presented as a reading companion rather than a chatbot product.

## Anti-Patterns
- No purple gradients
- No floating card soup
- No oversized CTA marketing blocks
- No heavily rounded pills as the dominant motif
- No decorative blobs or bokeh

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-23 | Shifted from engineering summary page to editorial research notebook system | Better fits subject matter and makes the learning path feel authoritative |
| 2026-05-23 | Locked warm paper + graphite + oxidized teal palette | Gives the site a durable identity without looking like generic AI product design |
| 2026-05-23 | Introduced separate homepage and topic-page art direction | Homepage should orient, topic pages should support long-form study |
