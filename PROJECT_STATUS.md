# Project Status

## Purpose

`ai-self-evolution-learn` is a dedicated learning site for the reading list in `AI自进化_对外阅读清单.md`.

It turns a scattered article pack into:

- a structured six-module knowledge map
- article-level summaries and takeaways
- a site-local AI study assistant powered by OneAPI
- a deployable standalone Next.js app for `learn.ifix.xin`

## Current State

- Next.js 16 App Router project created under `E:\Work\ai-self-evolution-learn`
- Reading list upgraded into a source-tiered knowledge base in `src/content/reading-list.ts`
- Search and agent context builder implemented in `src/lib/knowledge.ts`
- OneAPI-backed site assistant route implemented in `src/app/api/ask/route.ts`
- Doubao streaming voice input implemented via `/api/voice/stream-auth` + browser-side partial transcript streaming
- Learning homepage simplified into a learner-facing navigation entry; deep module/article content lives under topic pages
- Vitest coverage in place for knowledge search, agent payload assembly, and homepage rendering
- Standalone deployment target selected for nginx + pm2 on the `openai-api` VM
- Production-verified assistant model path currently uses `gemini-3.1-pro-preview`
- Research write-up for the content refresh stored at `E:\Work\contexts\survey_sessions\ai_self_evolution_survey_20260523.md`

## Active Work

1. continue improving article-level rigor and source coverage
2. consider exposing source-type filters or badges in the UI
3. make the streaming voice input feel better on mobile and verify browser compatibility

## How to Run

```bash
npm install
npm run dev
```

## How to Validate

```bash
npm test
npm run lint
npm run build
```

## Deployment Target

- Host: `openai-api` (`60.205.57.216`)
- Runtime: Node 20.18, npm 10.8, pm2 6
- Domain: `learn.ifix.xin`
- Reverse proxy: nginx `sites-available` / `sites-enabled`

## Risks / Notes

- The site assistant depends on `ONEAPI_API_KEY`; without it the page still renders but `/api/ask` will return a 500 error.
- Streaming voice depends on Doubao STS credentials; production now supports direct project envs or fallback from same-host `AgentHub` env.
- The reading summaries are synthesized for learning value; if deeper source annotation is needed, add article-by-article note pages later.
- Current DNS for `learn.ifix.xin` resolves to the target VM from the server side.
- nginx now sends `no-store` for HTML/page responses while keeping hashed `/_next/static/` assets cacheable, so homepage copy changes should not remain stale on mobile browsers.
