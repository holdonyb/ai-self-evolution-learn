# AI 自进化学习站

把 `AI自进化_对外阅读清单.md` 里的文章整理成一个结构化学习网站，并挂到 `learn.ifix.xin`。

## 这个项目做什么

- 用六个模块把“AI 如何改进自己”讲清楚
- 为每篇文章提炼核心价值、边界和继续追问方向
- 提供站内 AI 助教，把本地知识库压成可问答的学习入口
- 以独立仓库、独立部署链路运行，不耦合其他 `ifix.xin` 项目

## 当前信息架构

1. 概念与思想起源
2. 自我对弈：AI 第一次自己变强
3. AI 自己发现算法
4. 让模型边用边学
5. 产业前沿：谁在押注自进化
6. 另一种声音：冷静与质疑

## 技术栈

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Vitest + Testing Library
- OneAPI-compatible chat endpoint for the study assistant
- nginx + pm2 deployment on the `openai-api` VM

Current verified production model:

- `gemini-3.1-pro-preview`

## 本地运行

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 环境变量

Copy `.env.example` into `.env.local` or `.env.production`:

```env
ONEAPI_API_KEY=replace-me
ONEAPI_BASE_URL=https://oneapi.keath.ai
NEXT_PUBLIC_SITE_URL=https://learn.ifix.xin
DOUBAO_ASR_APP_KEY=
DOUBAO_ASR_ACCESS_KEY=
```

流式语音使用 Doubao streaming token。线上如果没有单独给学习站配置这些变量，部署脚本会尝试从同机 `AgentHub` 的 `.env` 里复用已有的 Doubao streaming 配置。

## 验证

```bash
npm test
npm run lint
npm run build
```

## 部署

- GitHub Actions workflow: `.github/workflows/deploy.yml`
- nginx config: `deploy/nginx/learn.ifix.xin.conf`
- pm2 config: `deploy/ecosystem.config.cjs`

The workflow pushes source to `/opt/learn-ifix/app`, builds on the server, reloads pm2, validates nginx, and reloads nginx.
