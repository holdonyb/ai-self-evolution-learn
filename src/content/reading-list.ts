export type ReadingArticle = {
  title: string;
  source: string;
  sourceType: "一手论文" | "官方博客" | "公司主页" | "媒体综述" | "观点文章" | "二手解读";
  url: string;
  published: string;
  isPrimer?: boolean;
  summary: string;
  whyItMatters: string;
  caveat: string;
  tags: string[];
};

export type ReadingModule = {
  id: string;
  title: string;
  guidingQuestion: string;
  synthesis: string;
  takeaways: string[];
  articles: ReadingArticle[];
};

export type LearningTopic = {
  id: string;
  title: string;
  deck: string;
  summary: string;
  themeQuestion: string;
  whyThisTheme: string;
  theses: string[];
  socraticStarts: string[];
  modules: ReadingModule[];
};

export const readingModules: ReadingModule[] = [
  {
    id: "origins",
    title: "概念与思想起源",
    guidingQuestion: "所谓“AI 自进化”到底是什么，它为什么会让人既兴奋又紧张？",
    synthesis:
      "这一组要先把概念边界钉住。Good 在 1965 年提出的是一个极强命题：如果机器在“设计更强机器”这件事上也超过人类，就可能出现加速的改进回路。后来 MIRI 把这条论证拆成定义、条件和风险；而 2026 年的媒体与创业叙事，则把它翻译成更贴近今天工程语境的版本：模型开始参与诊断自身缺陷、提出修改、自动实验，再把结果并回下一轮研发流程。真正需要区分的是三层东西：局部优化、可验证任务里的研发自动化，以及广义递归自我改进。它们相关，但强度完全不同。",
    takeaways: [
      "“AI 自进化”首先是一个闭环概念，不是一次性调参或单次工具调用。",
      "最弱版本是局部自优化，最强版本才是 Good 意义上的递归自我改进。",
      "今天最可信的进展集中在“AI 进入 AI 研发工具链”，而不是完整的智能爆炸。",
      "讨论这件事时，必须同时问两件事：它能不能改进自己，以及谁来验证它真的变好了。",
    ],
    articles: [
      {
        title: "Speculations Concerning the First Ultraintelligent Machine",
        source: "I. J. Good",
        sourceType: "一手论文",
        url: "https://vtechworks.lib.vt.edu/bitstream/handle/10919/89424/TechReport05-3.pdf",
        published: "1965",
        isPrimer: true,
        summary:
          "Good 给出了后来“智能爆炸”叙事的原型论证：如果机器能够胜过人类完成绝大多数智力活动，而设计更好的机器本身也是智力活动，那么它就可能持续产出更强的后继系统。",
        whyItMatters:
          "它不是在讲某个具体算法，而是在定义一类反馈结构：智能被用于提升制造智能的过程本身。后面所有 RSI 讨论，本质上都在回答这条链条哪里成立、哪里会断。",
        caveat:
          "这是一篇高度思辨的早期论文，不是工程蓝图。它提出了方向与危险，但没有解决验证器、资源约束、收益递减和现实摩擦这些后来最关键的问题。",
        tags: ["智能爆炸", "思想史", "超智能", "递归改进"],
      },
      {
        title: "Intelligence Explosion FAQ",
        source: "MIRI",
        sourceType: "官方博客",
        url: "https://intelligence.org/ie-faq/",
        published: "2015",
        summary:
          "MIRI 把“智能爆炸”拆成一组更容易辩论的子问题：什么叫更强智能、为什么能力可能转化为影响力、哪些路径可能接近这种状态，以及为什么安全问题会在能力彻底成熟前出现。",
        whyItMatters:
          "它把原本偏科幻的概念整理成了术语框架，适合建立这条话题的风险词汇表和推理骨架。",
        caveat:
          "FAQ 的立场明显偏长期主义与风险分析，对现实工程中的摩擦、组织成本和经济约束讲得不够多，读时要意识到它不是中性综述。",
        tags: ["MIRI", "风险", "AGI", "定义"],
      },
      {
        title: "What happens when AI starts building itself?",
        source: "TechCrunch",
        sourceType: "媒体综述",
        url: "https://techcrunch.com/2026/05/14/what-happens-when-ai-starts-building-itself/",
        published: "2026-05-14",
        summary:
          "这篇文章把 Good 的宏大命题翻译成今天更容易落地的工程叙事：AI 进入模型研发流程本身，开始帮人类做诊断、搜索、试错和自动化实验。",
        whyItMatters:
          "它的价值不在技术新颖，而在把老概念和今天的创业公司、实验室、代理式 coding 系统接上。读完后会明白为什么 2026 年又重新开始高频讨论 RSI。",
        caveat:
          "媒体文章擅长建立趋势感，但不负责给出严格证据链。它适合当今天语境的入口，不适合当“已经闭环实现”的证明。",
        tags: ["产业趋势", "媒体综述", "创业", "RSI"],
      },
    ],
  },
  {
    id: "self-play",
    title: "自我对弈：AI 第一次自己变强",
    guidingQuestion: "机器第一次“自己练自己”到底发生了什么？",
    synthesis:
      "自我对弈是理解自进化最干净的入口，因为它把闭环条件缩到极小：环境规则明确、胜负可自动判定、训练数据可以由系统自己生成。AlphaZero 证明了，只要世界足够封闭，AI 可以不依赖人类示范，直接通过和自己反复博弈实现跃迁。OpenAI 的 competitive self-play 进一步说明，这个思路不是棋类特例，而是一种更一般的能力自举机制。真正要抓住的不是“它会下棋”，而是它已经展示了闭环中的三件核心部件：自生成经验、自我评估和按结果迭代。",
    takeaways: [
      "自我对弈是 RSI 的第一个强证据，但证据范围严格限定在可验证的封闭环境。",
      "它证明了 AI 可以自己制造课程和对手，从而减少对人工标签与示范的依赖。",
      "从棋盘走向现实世界，最大缺口不是生成能力，而是验证器从清晰胜负变成高噪声、多目标和长时程。",
      "理解自我对弈的意义，在于看见“闭环为何成立”，而不是把它误读成通用智能已经出现。",
    ],
    articles: [
      {
        title: "A general reinforcement learning algorithm that masters chess, shogi, and Go through self-play",
        source: "Science / DeepMind",
        sourceType: "一手论文",
        url: "https://www.science.org/doi/10.1126/science.aar6404",
        published: "2018",
        isPrimer: true,
        summary:
          "AlphaZero 只知道游戏规则，从随机下法起步，通过自我对弈、神经网络和搜索，在象棋、将棋和围棋上达到超人水平，且不依赖人类棋谱或手工棋理。",
        whyItMatters:
          "它是“系统靠自己制造经验并快速变强”的经典里程碑。这里第一次清楚展示了：当环境闭合、目标清晰时，机器确实能靠自举获得超越人类长期积累的表现。",
        caveat:
          "AlphaZero 的强，不等于开放世界里的自进化。它依赖的是完美规则、自动反馈和巨量算力，这些条件在真实研发和现实任务里通常都不存在。",
        tags: ["AlphaZero", "自我对弈", "强化学习", "搜索"],
      },
      {
        title: "AlphaZero: Shedding new light on chess, shogi, and Go",
        source: "Google DeepMind",
        sourceType: "官方博客",
        url: "https://deepmind.google/blog/alphazero-shedding-new-light-on-chess-shogi-and-go/",
        published: "2018-12-06",
        summary:
          "DeepMind 的官方解读强调 AlphaZero 从随机对弈起步，仅凭游戏基本规则就学成史上最强棋手，并把它定位为“通用玩法”的一次验证，而非只会某一种棋的专用系统。",
        whyItMatters:
          "它帮助你把论文结论翻译成更直观的工程直觉：关键不是某个棋类技巧，而是“同一学习框架在多个封闭世界里复用”的意义。",
        caveat:
          "官方博客天然会突出成功叙事。具体实验资源、失败尝试和可复现难度，仍然要回到论文和后续复现实验里看。",
        tags: ["DeepMind", "自我对弈", "通用算法", "封闭环境"],
      },
      {
        title: "Competitive self-play",
        source: "OpenAI",
        sourceType: "官方博客",
        url: "https://openai.com/index/competitive-self-play/",
        published: "2017-11-16",
        summary:
          "OpenAI 从更一般的多智能体训练视角解释 self-play：让代理不断和更强版本的自己交手，就能在多轮竞争中把性能一步步自举上去，而不是完全依赖静态数据集。",
        whyItMatters:
          "这篇材料把“自己练自己”从棋类扩展成一种通用训练图式，说明它背后真正可迁移的是 bootstrapping 逻辑，而不是棋盘本身。",
        caveat:
          "多智能体 self-play 同样容易遇到分布脆弱性、策略捷径和环境特化问题。它能产生强策略，不代表会产生稳健的开放世界能力。",
        tags: ["OpenAI", "multi-agent", "bootstrapping", "self-play"],
      },
    ],
  },
  {
    id: "algorithm-discovery",
    title: "AI 自己发现算法",
    guidingQuestion: "从学会下棋，到发明新算法，中间跨过了哪道坎？",
    synthesis:
      "这一组对应的是从“在固定环境里变强”跨到“改进方法本身”。难点在于：棋局里胜负天然存在，但算法发现里你需要先构造评价函数，再让系统在代码空间里搜索。AlphaEvolve 展示的是 2025 年之后最重要的新范式之一：大模型负责提出候选，评测器负责给出硬反馈，进化搜索负责保留和重组更优解。AutoML-Zero 则给出更早的基线视角，证明即便只给极简原子操作，系统也能重新长出一些基本学习算法。两者共同指向一个核心判断：生成器很强不够，验证器和搜索机制才决定这条路能走多远。",
    takeaways: [
      "从“自己玩环境”到“自己改算法”，真正新增的是程序级搜索和可靠评测。",
      "AlphaEvolve 的代表意义不只是会写代码，而是把 LLM、评测器和进化循环绑成一个连续优化系统。",
      "AutoML-Zero 证明了算法可被重新发现，但同时也暴露了搜索空间爆炸和算力成本问题。",
      "今天算法自发现最适合目标明确、反馈自动化、正确性可验证的问题，而不是开放式模糊研究。",
    ],
    articles: [
      {
        title: "AlphaEvolve: A Gemini-powered coding agent for designing advanced algorithms",
        source: "Google DeepMind",
        sourceType: "官方博客",
        url: "https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/",
        published: "2025-05-14",
        isPrimer: true,
        summary:
          "DeepMind 把 AlphaEvolve 描述为一个面向算法设计的 coding agent：模型生成代码候选，自动评测器给分，进化流程保留并重组更优方案，用来推进数学、计算机科学和基础设施优化问题。",
        whyItMatters:
          "这篇是进入当代“AI 改 AI / AI 改算法”话题的最好入口，因为它把代理、代码、评测器和进化回路如何拼起来讲得最清楚。",
        caveat:
          "博客里的案例都建立在任务边界清楚且验证器可靠的前提上。它展示的是一种有效范式，不是开放式科学发现已经被解决。",
        tags: ["AlphaEvolve", "算法发现", "代码代理", "评测器"],
      },
      {
        title: "AlphaEvolve: A coding agent for scientific and algorithmic discovery",
        source: "arXiv",
        sourceType: "一手论文",
        url: "https://arxiv.org/abs/2506.13131",
        published: "2025-06-16",
        summary:
          "AlphaEvolve 论文把官方博客中的故事技术化：这是一个自治式 coding pipeline，直接改代码、反复跑评测，并在开放科学问题和 Google 计算基础设施的关键组件上寻找更优算法和实现。",
        whyItMatters:
          "它把“AI 自己发现算法”从宣传叙事落到了可检验的系统描述上。读这篇才能真正看清闭环里每个部件各自负责什么，以及为什么它不是简单的 prompt engineering。",
        caveat:
          "论文展示了很强的案例，但外界目前仍难完整复现全部生产级结果。越是依赖内部基础设施的数据点，越要把它理解成“强迹象”而不是完全公共可证事实。",
        tags: ["AlphaEvolve", "论文", "进化搜索", "基础设施"],
      },
      {
        title: "AlphaEvolve impact",
        source: "Google DeepMind",
        sourceType: "官方博客",
        url: "https://deepmind.google/blog/alphaevolve-impact/",
        published: "2026-05-09",
        summary:
          "这篇后续文章聚焦 AlphaEvolve 的真实影响面：数据中心调度、硬件加速器电路简化、训练效率提升以及若干数学与计算问题，强调它已不只是实验演示，而是开始接入生产优化链路。",
        whyItMatters:
          "它说明这类系统最先兑现价值的地方，不是通用 AI 科学家，而是高价值、强验证、可自动回归的内部优化任务。",
        caveat:
          "影响案例主要来自官方精选成功样本。它证明“有用”，但不自动证明“通用”或“可大规模无痛迁移”。",
        tags: ["生产应用", "Google", "系统优化", "算力"],
      },
      {
        title: "AutoML-Zero: Evolving Machine Learning Algorithms From Scratch",
        source: "arXiv / ICML",
        sourceType: "一手论文",
        url: "https://arxiv.org/abs/2003.03384",
        published: "2020-03-08",
        summary:
          "AutoML-Zero 从非常原始的数学和程序操作出发，让进化搜索在巨大的程序空间中重组候选，最终重新发现了类似梯度下降、反向传播和简单网络结构的学习规则。",
        whyItMatters:
          "它是 AlphaEvolve 之前最关键的前身之一，证明“学习算法本身可以成为搜索对象”，不是只能由人类手工设计。",
        caveat:
          "这篇论文最重要的价值其实是揭示困难：搜索空间极大、效率低、扩展难。它说明方向存在，但距离通用算法发明仍然很远。",
        tags: ["AutoML-Zero", "进化搜索", "元学习", "算法演化"],
      },
      {
        title: "AutoML-Zero: Evolving Code that Learns",
        source: "Google Research Blog",
        sourceType: "官方博客",
        url: "https://research.google/blog/automl-zero-evolving-code-that-learns/",
        published: "2020-07-09",
        summary:
          "Google 用更直观的方式讲 AutoML-Zero：从空白程序和最小操作开始，通过突变与选择让会学习的代码逐步出现，帮助读者建立“算法是怎样被搜索出来的”这一直觉。",
        whyItMatters:
          "如果你觉得 AlphaEvolve 太像今天的大模型产物，这篇能补出更长的历史线：先有低层级程序演化，再有 LLM 驱动的高层代码搜索。",
        caveat:
          "它是解释材料，不提供论文级细节。理解研究边界时仍应以 ICML 论文为准。",
        tags: ["Google Research", "科普", "演化算法", "历史前情"],
      },
    ],
  },
  {
    id: "continual-learning",
    title: "让模型边用边学",
    guidingQuestion: "为什么今天的大模型大多是“训练完即冻结”，而继续学习这么难？",
    synthesis:
      "这一组直面 RSI 最硬的一堵墙：持续学习。今天的大模型看起来能持续吸收信息，很多时候靠的是长上下文、检索和外部工具，而不是权重层面的稳定学习。真正的难点是：学新东西时别把旧能力毁掉。Nested Learning 尝试把“模型架构”和“优化器”统一看成多层嵌套的优化系统，并用 Hope 这样的自修改架构去处理不同时间尺度的记忆和更新。这比“把 context window 做大”更接近自进化的本质，因为它动的是学习机制本身。",
    takeaways: [
      "长上下文、RAG 和真正持续学习不是一回事；前者更像临时接入，后者要求能力被稳定保留。",
      "持续学习的核心难题仍然是灾难性遗忘，而不是单纯的参数更新速度。",
      "Nested Learning 的新意在于把架构和优化统一成多层更新系统，而不是把它们分开看。",
      "这类研究目前更像有前景的研究原型，还没有变成主流大模型生产范式。",
    ],
    articles: [
      {
        title: "Introducing Nested Learning: A new ML paradigm for continual learning",
        source: "Google Research",
        sourceType: "官方博客",
        url: "https://research.google/blog/introducing-nested-learning-a-new-ml-paradigm-for-continual-learning/",
        published: "2025-11-07",
        isPrimer: true,
        summary:
          "Google 把 Nested Learning 定义为一种新的学习视角：把模型看成一组嵌套、并行、不同更新频率的优化问题，目标是缓解灾难性遗忘，并让系统能在更长时间尺度上吸收新知识。",
        whyItMatters:
          "这是目前少数明确把“自改进”从调用层搬到学习机制层的公开研究线索。它不仅谈记住更多信息，而是在问模型如何长期改变自己。",
        caveat:
          "这是研究博客，不是生产已验证架构。它告诉你方向变了，但还不足以说明这条路线已经成熟可部署。",
        tags: ["Nested Learning", "continual learning", "catastrophic forgetting", "Hope"],
      },
      {
        title: "Nested Learning: The Illusion of Deep Learning Architectures",
        source: "arXiv",
        sourceType: "一手论文",
        url: "https://arxiv.org/abs/2512.24695",
        published: "2025-12-31",
        summary:
          "论文正式化了 Nested Learning，把深度学习系统表述成多层优化流，并报告了 Hope 这种自修改架构在语言建模、知识注入、长上下文与持续学习任务上的初步实验结果。",
        whyItMatters:
          "它让这个方向从概念进入技术细节。要判断它是不是只是换术语，还是确实在提出新范式，必须看这篇。",
        caveat:
          "发布时间很近，外部复现和社区检验都还有限。现阶段更适合把它当作值得跟踪的前沿，而不是已被证明的行业标准。",
        tags: ["论文", "连续学习", "长上下文", "自修改"],
      },
      {
        title: "Nested Learning and HOPE explained",
        source: "AI Papers Academy",
        sourceType: "二手解读",
        url: "https://aipapersacademy.com/nested-learning-hope/",
        published: "2025",
        summary:
          "这篇解读把 Nested Learning、continuum memory system 和 Hope 的多层更新时间尺度拆得更平实，适合在读完官方材料后补一层“它到底像什么”的直觉。",
        whyItMatters:
          "如果用户不是专门做 continual learning，这类二手解读能显著降低理解门槛，帮助把抽象术语转成结构图景。",
        caveat:
          "它不具备一手证据地位，只适合作为辅助理解材料，不能替代论文与官方博客中的真实主张。",
        tags: ["解读", "Hope", "记忆系统", "学习机制"],
      },
    ],
  },
  {
    id: "industry",
    title: "产业前沿：谁在押注自进化",
    guidingQuestion: "为什么 2026 年资本和实验室突然重新追这条线？",
    synthesis:
      "这一组解释的是叙事为什么在 2026 年突然升温。原因不是大家一夜之间相信科幻版奇点，而是越来越多组织开始相信：把 AI 接入 AI 研发流程本身，可能成为下一代能力与效率优势。Recursive 这类新公司把 open-ended algorithms、自改进 coding agents、自动红队和自动研究员这些概念绑成一个愿景包；DeepMind、OpenAI、Anthropic 等实验室的公开线索，则让投资人与媒体开始把 RSI 当成近中期能力前沿，而不是纯哲学命题。这里最值得看的是“资本在为哪种闭环买单”：通常不是通用超智能，而是研发自动化与基础设施优化。",
    takeaways: [
      "产业界重谈 RSI，本质上是在押注“研发飞轮自动化”会成为新护城河。",
      "最早兑现商业价值的地方通常是内部系统优化，而不是完全自治的科学家代理。",
      "创业公司的愿景叙事会比公开证据走得更远，读时要区分公司主张、媒体转述和一手成果。",
      "2026 年的关键信号不是概念新，而是资金、组织和一手研究线索开始同时出现。",
    ],
    articles: [
      {
        title: "Recursive",
        source: "Recursive Superintelligence",
        sourceType: "公司主页",
        url: "https://www.recursive.com/",
        published: "2026",
        isPrimer: true,
        summary:
          "Recursive 官方网站直接给出了公司的核心主张：通过 open-ended algorithms 和递归改进，让 AI 自动化知识发现，并先从“AI 改进 AI”这条主线切入。",
        whyItMatters:
          "要理解产业为什么兴奋，最好的办法不是先看媒体，而是先看公司自己把问题定义成什么。这里可以直接看到他们押注的是哪种闭环、哪种团队能力和哪种长期方向。",
        caveat:
          "公司主页是愿景文本，不是一手实验报告。它能帮助你理解叙事和组织定位，但不能拿来证明技术闭环已经成立。",
        tags: ["Recursive", "open-endedness", "创业", "愿景"],
      },
      {
        title: "Recursive Superintelligence raises $650 million to pursue self-improving AI",
        source: "Unite.AI",
        sourceType: "媒体综述",
        url: "https://www.unite.ai/recursive-superintelligence-raises-650-million-to-pursue-self-improving-ai/",
        published: "2026-05-15",
        summary:
          "报道梳理了 Recursive 的融资、创始团队和技术定位，指出资本已经愿意为“把 AI 研发自动化本身做成产品与实验室”的想法付出高估值。",
        whyItMatters:
          "这篇能帮助你把公司官网的愿景放回资本市场语境里：投资人到底在买什么，媒体又是怎样向外界解释这件事的。",
        caveat:
          "融资新闻会天然强调增长叙事和团队履历，对产品可证性与失败风险的描述通常不够细。",
        tags: ["融资", "创业", "Recursive", "资本"],
      },
      {
        title: "Recursive Self-Improvement Edges Closer In AI Labs",
        source: "IEEE Spectrum",
        sourceType: "媒体综述",
        url: "https://spectrum.ieee.org/recursive-self-improvement",
        published: "2026-05-08",
        summary:
          "IEEE 把 DeepMind、创业公司和研究者对 RSI 的当下判断串起来，给出一个比融资报道更平衡的图景：实验室里确实出现了越来越多自改进迹象，但很多研究者认为它更像带损耗的自改进，而不是无摩擦爆炸。",
        whyItMatters:
          "这是连接“能力进展”和“审慎判断”的关键桥梁材料。它能帮助读者把产业兴奋和技术边界同时放在一张图上看。",
        caveat:
          "它仍然是采访和整合型媒体文章，不替代论文或官方技术文档；更适合用来建立全局判断，而不是确认单一技术细节。",
        tags: ["IEEE", "实验室趋势", "lossy self-improvement", "媒体"],
      },
      {
        title: "What happens when AI starts building itself?",
        source: "TechCrunch",
        sourceType: "媒体综述",
        url: "https://techcrunch.com/2026/05/14/what-happens-when-ai-starts-building-itself/",
        published: "2026-05-14",
        summary:
          "TechCrunch 从创业和行业观察视角强调 2026 年的关键转折：AI 不再只是写应用，而是越来越深地进入模型、评测和研究流程本身。",
        whyItMatters:
          "它补足的是公众叙事层。很多非研究读者会先在这里理解“为什么忽然人人都在谈自进化”。",
        caveat:
          "它对趋势的感知敏锐，但对技术主张的证据密度不高，最好与 IEEE、公司主页和一手论文交叉着看。",
        tags: ["媒体", "趋势", "研发自动化", "创业公司"],
      },
    ],
  },
  {
    id: "skepticism",
    title: "另一种声音：冷静与质疑",
    guidingQuestion: "为什么很多人认为“智能爆炸”未必会以人们想象的方式发生？",
    synthesis:
      "这一组不是用来泼冷水，而是用来校正尺度。怀疑者并不一定否认 AI 会继续变强，他们主要质疑的是“单个系统可以几乎无摩擦地无限递归加速”这一强命题。Chollet 的批评抓住一个关键点：如果智能本质上是技能获取效率，并且高度依赖任务分布、先验、经验与环境，那么把它想象成一个可脱离世界约束的纯量变量，本身就可能是错的。IEEE 2026 年的报道则把这类怀疑更新成工程语言：更现实的图景也许是 lossy self-improvement，也就是每一轮改进都有摩擦、有损耗、有验证成本。理解这些反对意见，反而能帮助你更精确地判断哪些进展真的重要。",
    takeaways: [
      "怀疑者反对的往往不是“AI 会持续进步”，而是“它会无摩擦爆炸”。",
      "现实世界中的验证成本、资源约束和分布漂移，都会把递归改进从理想指数拉回有损耗飞轮。",
      "如果智能不是单一标量，而是和任务范围、经验与先验纠缠在一起，那么“智能爆炸”的直觉就需要被重新审视。",
      "读完质疑材料后，你会更容易区分宣传口号、真实能力跃迁和仍然没有被解决的理论漏洞。",
    ],
    articles: [
      {
        title: "The implausibility of intelligence explosion",
        source: "François Chollet",
        sourceType: "观点文章",
        url: "https://medium.com/@francois.chollet/the-impossibility-of-intelligence-explosion-5be4a9eda6ec",
        published: "2017-11-27",
        isPrimer: true,
        summary:
          "Chollet 认为把智能想成一个孤立、可无限放大的纯脑力变量是有问题的。现实中的智能总是嵌在环境、文化、身体、工具和任务分布里，因此单系统的快速递归爆炸并不自然。",
        whyItMatters:
          "这是对 Good 叙事最有影响力的现代反驳之一。它迫使你把注意力从抽象“更聪明”转向更可操作的问题：什么能力、在什么环境里、凭什么可转移。",
        caveat:
          "这篇更像一篇强观点文章而不是严格证明，很多论点属于系统论和认识论层面的挑战，所以它很适合校正直觉，但不等于直接反驳所有工程进展。",
        tags: ["Chollet", "怀疑论", "情境智能", "S 曲线"],
      },
      {
        title: "On the Measure of Intelligence",
        source: "François Chollet",
        sourceType: "一手论文",
        url: "https://arxiv.org/abs/1911.01547",
        published: "2019-11-05",
        summary:
          "这篇论文从形式化角度重新定义智能，把它描述为 skill-acquisition efficiency，并引入 scope、generalization difficulty、priors 和 experience 等维度，反对把分数或参数规模直接当作普遍智能的代理。",
        whyItMatters:
          "它给怀疑立场补上了理论地基。把这篇和上一条搭配读，能看见 Chollet 不是单纯唱反调，而是在重新定义“什么才算智能增长”。",
        caveat:
          "这篇论文主要解决定义与评估问题，不直接裁决 RSI 是否会发生。它提供的是一个更严格的分析框架，而不是经验世界中的最终判决书。",
        tags: ["ARC", "智能测度", "泛化", "理论框架"],
      },
      {
        title: "Recursive Self-Improvement Edges Closer In AI Labs",
        source: "IEEE Spectrum",
        sourceType: "媒体综述",
        url: "https://spectrum.ieee.org/recursive-self-improvement",
        published: "2026-05-08",
        summary:
          "IEEE 的平衡点在于，它既承认实验室里确实出现越来越多 AI 改 AI 的迹象，也强调很多研究者更愿意用“lossy self-improvement”而不是“intelligence explosion”来描述现实路径。",
        whyItMatters:
          "它把 2017 年偏哲学的怀疑，更新到了 2026 年的工程现场。读完你会更容易接受这样一种判断：自改进可能是真的，但它未必呈现为神话式奇点。",
        caveat:
          "采访文章不提供严密形式论证，适合用来捕捉研究共同体的温度，而不是单独承担理论证据角色。",
        tags: ["IEEE", "限制", "实验室观察", "损耗飞轮"],
      },
    ],
  },
];

export const glossary = [
  {
    term: "递归自我改进",
    definition:
      "AI 不只完成外部任务，还参与设计、训练、评测或部署下一轮更强 AI 的闭环。强版本接近 Good 的设想，弱版本则可能只是局部研发自动化。",
  },
  {
    term: "智能爆炸",
    definition:
      "Good 在 1965 年提出的假设：如果机器在“设计更强机器”这类活动上超过人类，可能触发加速增强循环。但这是一种强命题，不等于今天所有“AI 改 AI”的进展。",
  },
  {
    term: "验证器",
    definition:
      "用来判断某次改动是否真的更好的机制。可以是胜负、benchmark 分数、系统指标、形式证明或人工审查。没有验证器，就很难形成稳定自进化闭环。",
  },
  {
    term: "自我对弈",
    definition:
      "代理通过与自己或更强版本的自己反复交互来生成训练数据和课程，从而提升能力。它是最经典的“自生成经验”范式。",
  },
  {
    term: "灾难性遗忘",
    definition:
      "模型在学习新任务或新知识时显著损失旧能力的现象，是持续学习迟迟难以真正落地的核心障碍之一。",
  },
  {
    term: "开放式进化",
    definition:
      "系统不围绕单一固定目标优化，而是在不断产生的新挑战和新环境中持续扩展能力。它常被创业公司当作通往更强自进化系统的长期路线。",
  },
];

export const learningTopics: LearningTopic[] = [
  {
    id: "ai-self-evolution",
    title: "AI 自进化",
    deck: "主题 01",
    summary:
      "把“AI 改进 AI”拆成一条真正能学懂的路径：思想起源、自我对弈、算法发现、持续学习、产业押注，以及反方质疑。",
    themeQuestion:
      "如果 AI 不只是辅助人类，而是逐步参与“改进 AI 本身”，这条能力链条现在到底走到了哪一层？",
    whyThisTheme:
      "这组材料适合做 Learn 的第一个主题，因为它同时包含概念边界、工程闭环、验证逻辑、产业现实和反方视角，天然适合做成结构化图谱而不是文章堆叠。",
    theses: [
      "今天最真实的自进化，不是全面自治，而是局部闭环越来越多。",
      "验证器决定这条路能走多远，生成器只是闭环的一半。",
      "最该警惕的不是神话式奇点，而是研发速度和能力扩散的现实加速。",
    ],
    socraticStarts: [
      "如果没有可靠验证器，为什么“AI 改进 AI”很容易沦为空话？",
      "AlphaZero、AlphaEvolve 和 Nested Learning 分别代表哪一层能力台阶？",
      "为什么很多人不否认 AI 会变强，却依然质疑“智能爆炸”？",
      "如果让你给这条路线排序，今天最可信的突破发生在规则世界、算法搜索，还是持续学习？为什么？",
    ],
    modules: readingModules,
  },
];
