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
- Reading list distilled into `src/content/reading-list.ts`
- Search and agent context builder implemented in `src/lib/knowledge.ts`
- OneAPI-backed site assistant route implemented in `src/app/api/ask/route.ts`
- Learning homepage implemented with structured modules, comparison table, glossary, and AI panel
- Vitest coverage in place for knowledge search, agent payload assembly, and homepage rendering
- Standalone deployment target selected for nginx + pm2 on the `openai-api` VM
- Production-verified assistant model path currently uses `gemini-3.1-pro-preview`

## Active Work

1. finish deployment files and GitHub Actions
2. push repo to GitHub and configure Actions secrets
3. deploy to `learn.ifix.xin`
4. verify live site and iterate on any runtime issues

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
- The reading summaries are synthesized for learning value; if deeper source annotation is needed, add article-by-article note pages later.
- Current DNS for `learn.ifix.xin` resolves to the target VM from the server side.
