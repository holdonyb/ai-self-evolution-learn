export type ReadingArticle = {
  title: string;
  source: string;
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

export const readingModules: ReadingModule[] = [
  {
    id: "origins",
    title: "概念与思想起源",
    guidingQuestion: "所谓“AI 自进化”到底是什么，它为什么会让人既兴奋又紧张？",
    synthesis:
      "这一组解决的是概念边界问题。Good 提出的不是“模型自动微调”这么窄的想法，而是一个更强的反馈回路：一个足够强的系统开始改进制造更强系统的过程本身。MIRI FAQ 把这条链条拆成定义、可行性与后果，而 2026 年的 TechCrunch 则把古老概念重新翻译成今天的工程语言：模型诊断自身短板、提出修改、验证修改、再继续下一轮。",
    takeaways: [
      "“自进化”不是单次优化，而是会反复运行的改进闭环。",
      "核心不是模型会不会写代码，而是它能不能参与“改进 AI 本身”的完整链条。",
      "概念层面必须区分局部自优化、领域内自增强和广义递归自我改进。",
      "今天的讨论已经从哲学猜想转到工程问题：评测、验证器、反馈回路和安全控制。",
    ],
    articles: [
      {
        title: "Speculations Concerning the First Ultraintelligent Machine",
        source: "I. J. Good",
        url: "https://www.historyofinformation.com/detail.php?id=2142",
        published: "1965",
        isPrimer: true,
        summary:
          "Good 提出“智能爆炸”的原型论证：如果机器在几乎所有智力活动上超过人类，而“设计更好的机器”也是智力活动之一，那么它就可能启动加速改进循环。",
        whyItMatters:
          "这是后来所有“递归自我改进”“奇点”“超智能”讨论的概念源头。",
        caveat:
          "这是思想实验，不是工程路线图；它提出了方向，但没有解释实现细节、约束条件和速度上限。",
        tags: ["智能爆炸", "思想史", "超智能", "递归改进"],
      },
      {
        title: "Intelligence Explosion FAQ",
        source: "MIRI",
        url: "https://intelligence.org/ie-faq/",
        published: "2015",
        summary:
          "FAQ 把智能爆炸论证拆成可讨论的部件：什么叫更强智能、为什么更强智能可能更有力量、哪些路径可能抵达这种状态，以及安全问题为什么会提前出现。",
        whyItMatters:
          "它给这条赛道提供了一套早期风险叙事和术语框架。",
        caveat:
          "立场明显偏向长期风险与安全，对现实工程摩擦和产业约束讨论较少。",
        tags: ["MIRI", "风险", "AGI", "定义"],
      },
      {
        title: "What happens when AI starts building itself?",
        source: "TechCrunch",
        url: "https://techcrunch.com/2026/05/14/what-happens-when-ai-starts-building-itself/",
        published: "2026-05-14",
        summary:
          "文章把 RSI 翻译成更贴近当前产业的版本：AI 不只是辅助写代码，而是能诊断自身缺陷、提出新设计、自动实验并把结果纳入下一轮改进。",
        whyItMatters:
          "它把 1965 年的思想与 2026 年创业公司和大模型工程现实接上了。",
        caveat:
          "媒体稿偏趋势判断，很多能力仍建立在公司愿景和早期内部结果上。",
        tags: ["产业趋势", "媒体综述", "创业", "RSI"],
      },
    ],
  },
  {
    id: "self-play",
    title: "自我对弈：AI 第一次自己变强",
    guidingQuestion: "机器第一次“自己练自己”到底发生了什么？",
    synthesis:
      "自我对弈是 RSI 最容易理解的低风险原型。AlphaZero 的关键不是单纯赢棋，而是它证明：在规则明确、反馈清晰、胜负可验证的封闭环境中，系统可以不靠人类示范数据，仅凭自博弈和搜索快速超过人类长期积累。它展示了“自动生成训练数据 + 自动评估 + 自动迭代”这一最小闭环。",
    takeaways: [
      "自我对弈是 RSI 的第一个成功模板，但它依赖清晰规则和自动评分器。",
      "AlphaZero 的成功来自环境闭合，而不是通用世界理解。",
      "它说明 AI 可以靠自生成经验变强，但不等于 AI 已能在开放世界里自进化。",
      "从封闭博弈走向现实世界，关键瓶颈是验证器和任务边界。",
    ],
    articles: [
      {
        title: "A general reinforcement learning algorithm that masters chess, shogi, and Go through self-play",
        source: "Science / DeepMind",
        url: "https://www.science.org/doi/10.1126/science.aar6404",
        published: "2018",
        isPrimer: true,
        summary:
          "AlphaZero 从随机下法起步，只使用游戏规则，通过自我对弈训练策略网络和价值网络，再结合搜索，在象棋、将棋和围棋上达到超人水平。",
        whyItMatters:
          "它是“机器通过与自己互动获得能力跃迁”的最经典证据。",
        caveat:
          "其成功高度依赖封闭规则、明确奖励和大量计算资源，不可直接类比开放世界智能。",
        tags: ["AlphaZero", "自我对弈", "强化学习", "搜索"],
      },
      {
        title: "How AlphaZero works, what sets it apart, and what it can tell us",
        source: "Towards Data Science",
        url: "https://towardsdatascience.com/alphazero-chess-how-it-works-what-sets-it-apart-and-what-it-can-tell-us-4ab3d2d08867/",
        published: "2018",
        summary:
          "通俗解释 AlphaZero 如何把自对弈、蒙特卡洛树搜索和神经网络结合，强调它与传统手工规则棋类引擎的差别。",
        whyItMatters:
          "适合把 AlphaZero 从“新闻奇迹”还原成可理解的工程结构。",
        caveat:
          "属于二级讲解资料，准确性依赖原论文，细节上不如论文完整。",
        tags: ["科普", "MCTS", "棋类", "工程解释"],
      },
      {
        title: "Self-play reinforcement learning for strategic games",
        source: "Medium",
        url: "https://medium.com/biased-algorithms/self-play-reinforcement-learning-for-strategic-games-886cf4b9baf8",
        published: "2018",
        summary:
          "从更一般的战略博弈视角解释自我对弈的训练逻辑，说明为什么让代理反复对抗自己会自然制造课程学习。",
        whyItMatters:
          "帮助把 AlphaZero 看成一类方法，而不是单个名词。",
        caveat:
          "案例导向强，但对现实世界中的失败模式讨论不多。",
        tags: ["自博弈", "课程学习", "强化学习"],
      },
    ],
  },
  {
    id: "algorithm-discovery",
    title: "AI 自己发现算法",
    guidingQuestion: "从学会下棋，到发明新算法，中间跨过了哪道坎？",
    synthesis:
      "这一组说明 RSI 的下一个层级不是“自己玩环境”，而是“自己改方法”。AlphaEvolve 把大模型的代码生成能力、自动评测器和进化搜索结合起来，用于算法发现和系统优化；AutoML-Zero 则更像前身，展示了从极简原子操作中重新长出基础学习算法的可能性。两者共同点是：评价函数仍然至关重要，AI 不是凭空发明，而是在可验证目标下搜索。",
    takeaways: [
      "AI 真正开始“改进 AI”时，验证器比生成器更关键。",
      "AlphaEvolve 代表的是“LLM + evaluator + evolutionary loop”的新范式。",
      "AutoML-Zero 证明从低级操作重新发现算法是可能的，但计算代价极高。",
      "算法自发现目前更适合目标清晰、可自动评分的问题，而不是开放式研究。",
    ],
    articles: [
      {
        title: "AlphaEvolve: A Gemini-powered coding agent for designing advanced algorithms",
        source: "Google DeepMind",
        url: "https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/",
        published: "2025-05-14",
        isPrimer: true,
        summary:
          "AlphaEvolve 用大模型提出代码候选，用自动评测器检验，再通过进化策略保留和改写更优方案，面向数学与计算基础设施中的算法优化问题。",
        whyItMatters:
          "它把“AI 会写代码”升级成“AI 能在评测闭环里持续改进算法”。",
        caveat:
          "仍然依赖明确的评分函数和任务边界，不等于开放式科学研究自动化。",
        tags: ["AlphaEvolve", "算法发现", "代码代理", "评测器"],
      },
      {
        title: "AlphaEvolve impact",
        source: "Google DeepMind",
        url: "https://deepmind.google/blog/alphaevolve-impact/",
        published: "2026-05-09",
        summary:
          "后续博文强调 AlphaEvolve 的真实影响已经扩展到数据中心调度、芯片设计、AI 训练效率和量子电路等场景，显示其从演示走向生产价值。",
        whyItMatters:
          "这说明“自发现算法”已经不只是论文展示，而是 Google 内部基础设施优化工具。",
        caveat:
          "博客展示的是精选成功案例，外界难以独立复现实验全部细节。",
        tags: ["生产应用", "Google", "算力优化", "量子"],
      },
      {
        title: "AutoML-Zero: Evolving Machine Learning Algorithms From Scratch",
        source: "arXiv / ICML",
        url: "https://arxiv.org/abs/2003.03384",
        published: "2020",
        summary:
          "AutoML-Zero 从极其基础的数学和程序操作出发，通过进化搜索重新发现类似两层网络、反向传播、梯度下降和正则化技巧。",
        whyItMatters:
          "它说明“从零进化出学习算法”不是纯理论猜想，而是可在小规模问题上实现。",
        caveat:
          "论文明确承认这是初步成果，搜索空间巨大、计算昂贵，离通用算法发明还很远。",
        tags: ["AutoML-Zero", "进化搜索", "元学习", "算法演化"],
      },
      {
        title: "AutoML-Zero: Evolving Code that Learns",
        source: "Google Research Blog",
        url: "https://research.google/blog/automl-zero-evolving-code-that-learns/",
        published: "2020-07-09",
        summary:
          "Google 博文用更直观的方式解释了 AutoML-Zero：从空程序开始，通过突变与选择，在稀疏搜索空间里慢慢长出学习规则。",
        whyItMatters:
          "很适合作为 AlphaEvolve 的历史前情：先有“进化出会学的程序”，再有“LLM 驱动的算法搜索代理”。",
        caveat:
          "博客可读性强，但技术细节和边界仍需回到论文核对。",
        tags: ["Google Research", "科普", "演化算法"],
      },
      {
        title: "Recursive self-improvement",
        source: "IEEE Spectrum",
        url: "https://spectrum.ieee.org/recursive-self-improvement",
        published: "2026",
        summary:
          "文章把 AutoML-Zero、AlphaEvolve 与更广义的 RSI 研究串在一起，强调算法自发现已从学术边缘话题变成大厂和创业公司的重点赌注。",
        whyItMatters:
          "它提供了跨论文、跨公司、跨叙事的中层总结。",
        caveat:
          "作为媒体报道，深度和技术可证性不如一手论文。",
        tags: ["媒体综述", "IEEE", "RSI", "产业化"],
      },
      {
        title: "Using AI to design AI chips",
        source: "IEEE Spectrum",
        url: "https://spectrum.ieee.org/recursive-self-improvement",
        published: "2026",
        summary:
          "这一线索强调递归改进不只发生在模型或算法上，还可体现在 AI 反过来优化支撑 AI 的硬件与系统设计。",
        whyItMatters:
          "它把“自进化”的影响面从软件扩展到了硬件基础设施。",
        caveat:
          "硬件设计周期长，闭环速度和开放性都与软件领域不同。",
        tags: ["芯片设计", "硬件", "基础设施"],
      },
    ],
  },
  {
    id: "continual-learning",
    title: "让模型边用边学",
    guidingQuestion: "为什么今天的大模型大多是“训练完即冻结”，而继续学习这么难？",
    synthesis:
      "这一组聚焦 RSI 最硬的一堵墙：持续学习。现有大模型会在训练结束后冻结权重，靠上下文窗口和检索临时补知识，但不会像人一样长期积累。Nested Learning 试图把模型视为多层嵌套、不同更新频率的优化问题，并借助 Hope 这样的自修改架构缓解灾难性遗忘。它不是简单增大上下文，而是改学习机制本身。",
    takeaways: [
      "持续学习的核心难题是学新东西时别把旧能力弄丢。",
      "上下文变长和真正会学习不是一回事。",
      "Nested Learning 试图把“架构”和“优化器”统一看成多层学习系统。",
      "Hope 之类原型显示方向可行，但距离大规模稳定落地还有很长路。",
    ],
    articles: [
      {
        title: "Introducing Nested Learning: A new ML paradigm for continual learning",
        source: "Google Research",
        url: "https://research.google/blog/introducing-nested-learning-a-new-ml-paradigm-for-continual-learning/",
        published: "2025-11-07",
        isPrimer: true,
        summary:
          "Google 提出 Nested Learning，把模型理解为一组嵌套且并行的优化问题，每层有自己的上下文流与更新频率，以此缓解灾难性遗忘。",
        whyItMatters:
          "这是从“让模型记更多”转向“让模型持续更新自身学习机制”的代表性尝试。",
        caveat:
          "目前仍是研究阶段，Hope 只是概念验证，远未成为主流生产架构。",
        tags: ["Nested Learning", "continual learning", "catastrophic forgetting", "Hope"],
      },
      {
        title: "Nested Learning and HOPE explained",
        source: "AI Papers Academy",
        url: "https://aipapersacademy.com/nested-learning-hope/",
        published: "2025",
        summary:
          "该文把 Nested Learning 的层级更新、多时间尺度记忆和 Hope 原型用更易懂的方式拆开讲解。",
        whyItMatters:
          "适合把论文中的抽象概念翻译成可理解的架构图景。",
        caveat:
          "属于二级解读，准确理解仍需回到原博客与论文。",
        tags: ["解读", "Hope", "记忆系统"],
      },
      {
        title: "Nested Learning: The Illusion of Deep Learning Architectures",
        source: "arXiv",
        url: "https://arxiv.org/abs/2512.24695",
        published: "2025-12-31",
        summary:
          "论文正式化了 Nested Learning，把深度学习系统表述成多层优化流，并报告在语言建模、知识注入和长上下文推理上的初步结果。",
        whyItMatters:
          "它提供了比博客更严格的技术主张与实验背景。",
        caveat:
          "论文发布时间近，结论还缺少更广泛复现与社区检验。",
        tags: ["论文", "连续学习", "长上下文", "自修改"],
      },
    ],
  },
  {
    id: "industry",
    title: "产业前沿：谁在押注自进化",
    guidingQuestion: "为什么 2026 年资本和实验室突然重新追这条线？",
    synthesis:
      "这一组讲的是资金、组织和叙事如何把 RSI 从边缘概念拉回主舞台。Recursive Superintelligence 的大额融资表明，投资者相信下一阶段竞争不只是拼更大模型，而是拼谁能把模型、评测、研究自动化和开放式搜索串成更强飞轮。与此同时，主流媒体和研究机构也开始把“AI 帮助构建下一代 AI”当成现实中的近中期命题。",
    takeaways: [
      "产业界押注 RSI，本质上是在押注“研发自动化”会成为下一代护城河。",
      "资本现在接受的不是科幻叙事本身，而是更快的研究与系统优化闭环。",
      "创业公司常把 open-endedness、rainbow teaming、自动研究员等概念绑在一起讲。",
      "商业化落地短期仍集中在可评估的内部基础设施优化，而不是完全自治科学家。",
    ],
    articles: [
      {
        title: "Recursive Superintelligence raises $650 million to pursue self-improving AI",
        source: "Unite.AI",
        url: "https://www.unite.ai/recursive-superintelligence-raises-650-million-to-pursue-self-improving-ai/",
        published: "2026-05-15",
        isPrimer: true,
        summary:
          "文章介绍了 Recursive Superintelligence 的融资、团队背景和核心主张：构建能自主提出、实现、测试并迭代改进的 AI 研究系统。",
        whyItMatters:
          "它显示 RSI 已从思想史和论文话题进入真金白银的创业赛道。",
        caveat:
          "大部分叙述仍是愿景，公开可验证的产品和结果还有限。",
        tags: ["创业", "融资", "Recursive", "open-endedness"],
      },
      {
        title: "Recursive self-improvement edges closer in AI labs",
        source: "IEEE Spectrum",
        url: "https://spectrum.ieee.org/recursive-self-improvement",
        published: "2026-05",
        summary:
          "IEEE 总结了实验室内部的 RSI 迹象，同时强调研究者并不一致认为会出现无摩擦的指数级爆炸，更可能是带损耗的自改进。",
        whyItMatters:
          "它是少数同时覆盖能力进展与边界怀疑的产业媒体报道。",
        caveat:
          "该文本身不是技术报告，更多是对研究趋势的整合与采访。",
        tags: ["IEEE", "实验室趋势", "lossy self-improvement"],
      },
      {
        title: "What happens when AI starts building itself?",
        source: "TechCrunch",
        url: "https://techcrunch.com/2026/05/14/what-happens-when-ai-starts-building-itself/",
        published: "2026-05-14",
        summary:
          "TechCrunch 把创业视角与研究背景合并在一起，强调 2026 年的关键变化是：AI 已开始进入 AI 研发工具链本身。",
        whyItMatters:
          "它让非研究读者看到产业为何突然重谈这一命题。",
        caveat:
          "媒体更擅长讲趋势，不擅长证明这些系统已经闭环可用。",
        tags: ["媒体", "创业公司", "趋势"],
      },
    ],
  },
  {
    id: "skepticism",
    title: "另一种声音：冷静与质疑",
    guidingQuestion: "为什么很多人认为“智能爆炸”未必会以人们想象的方式发生？",
    synthesis:
      "这一组的价值不在于泼冷水，而在于校正尺度。Chollet 的核心反驳是：智能从来不是脱离身体、环境、文化与工具的纯脑力变量；现实世界中的自改进系统通常受瓶颈、收益递减和外部摩擦限制，更像线性或 S 型增长，而不是无穷加速。IEEE 的报道则把这类怀疑更新到了 2026 年：即便实验室里出现越来越多自改进迹象，它们也很可能是‘带损耗的飞轮’，而非无上限爆炸。",
    takeaways: [
      "怀疑者并不否认 AI 会持续变强，否认的是无摩擦、无上限、瞬时爆炸。",
      "评估 RSI 时必须把环境摩擦、验证成本和真实世界约束算进去。",
      "单个模型的能力，不等于整个文明级认知系统的能力。",
      "真正值得警惕的，也许不是神话式奇点，而是更现实的研发加速与风险扩散。",
    ],
    articles: [
      {
        title: "The implausibility of intelligence explosion",
        source: "François Chollet / Medium",
        url: "https://medium.com/@francois.chollet/the-impossibility-of-intelligence-explosion-5be4a9eda6ec",
        published: "2017-11-27",
        isPrimer: true,
        summary:
          "Chollet 认为智能是情境性的、外部化的、文明级分布式的，因此所谓单个“脑中之脑”式的递归爆炸在现实中既缺乏经验支持，也忽略了系统摩擦。",
        whyItMatters:
          "这是对 Good 叙事最系统、最有影响力的现代反驳之一。",
        caveat:
          "文章的很多论点偏哲学与系统论，不是直接的工程反例，也因此持续引发争论。",
        tags: ["Chollet", "怀疑论", "情境智能", "S 曲线"],
      },
      {
        title: "Recursive self-improvement",
        source: "IEEE Spectrum",
        url: "https://spectrum.ieee.org/recursive-self-improvement",
        published: "2026-05",
        summary:
          "报道中多位研究者认为，AI 自改进更可能表现为有摩擦的提升过程，而不是平滑的指数爆炸，尤其在开放世界任务中。",
        whyItMatters:
          "它把怀疑从 2017 年的哲学文章更新到 2026 年实验室视角。",
        caveat:
          "采访体裁会压缩论证链，适合作为平衡材料，不宜替代原始研究。",
        tags: ["IEEE", "限制", "实验室观察", "损耗飞轮"],
      },
    ],
  },
];

export const glossary = [
  {
    term: "递归自我改进",
    definition:
      "AI 系统不只是完成外部任务，还参与设计、训练、评测或部署下一轮更强 AI 的闭环。",
  },
  {
    term: "智能爆炸",
    definition:
      "Good 提出的假设：一旦机器在设计更强机器这件事上超过人类，可能触发加速增强循环。",
  },
  {
    term: "自我对弈",
    definition:
      "代理通过与自己反复交互来生成训练数据和课程，从而提升能力。",
  },
  {
    term: "灾难性遗忘",
    definition:
      "模型在学习新任务或新知识时显著丢失旧能力的现象，是持续学习的核心难题。",
  },
  {
    term: "开放式进化",
    definition:
      "系统不追单一固定目标，而是在不断生成的新挑战和环境中持续适应和扩展能力。",
  },
];
