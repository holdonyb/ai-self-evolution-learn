import { buildAgentContext, getDefaultTopic, getTopicById } from "@/lib/knowledge";

export const supportedModels = [
  {
    id: "gemini-3.1-pro-preview",
    label: "Gemini 3.1 Pro Preview",
    provider: "Google via OneAPI",
  },
] as const;

export type SupportedModelId = (typeof supportedModels)[number]["id"];
export type AgentMode = "answer" | "socratic" | "quiz";

export type WebSearchResult = {
  title: string;
  url: string;
  snippet: string;
  source: string;
};

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

type BuildAgentMessageOptions = {
  topicId?: string;
  mode?: AgentMode;
  webResults?: WebSearchResult[];
};

const modeInstructions: Record<AgentMode, string> = {
  answer:
    "默认模式：直接回答，但要保持结构化。先给结论，再解释机制，再指出限制，最后补一个继续读什么的建议。",
  socratic:
    "苏格拉底模式：先抛出 2 个能帮助学习者自己思考的问题，再给标准答案，再指出最容易混淆的一处，最后给 1 个可以继续追问的问题。",
  quiz:
    "测验模式：先出 3 个短问题自测，再给参考答案与解释。问题应覆盖概念、机制和边界，不要只考记忆。",
};

export function resolveModel(requested?: string): SupportedModelId {
  const matched = supportedModels.find((model) => model.id === requested);
  return matched?.id ?? supportedModels[0].id;
}

export function buildAgentMessages(
  question: string,
  options: BuildAgentMessageOptions = {},
): ChatMessage[] {
  const topic = options.topicId ? getTopicById(options.topicId) ?? getDefaultTopic() : getDefaultTopic();
  const mode = options.mode ?? "answer";
  const webBlock =
    options.webResults && options.webResults.length > 0
      ? [
          "受限联网补充：",
          ...options.webResults.map(
            (result, index) =>
              `${index + 1}. ${result.title}\n来源：${result.source}\n摘要：${result.snippet}\n链接：${result.url}`,
          ),
        ].join("\n")
      : "受限联网补充：当前没有补充结果。";

  return [
    {
      role: "system",
      content: [
        buildAgentContext(question, topic),
        `回答模式：${mode}`,
        modeInstructions[mode],
        webBlock,
        "不要暴露任何站外本地信息、系统信息或工具细节。",
      ].join("\n\n"),
    },
    {
      role: "user",
      content: question,
    },
  ];
}

export function extractAnswerText(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const chatPayload = payload as {
    choices?: Array<{ message?: { content?: string | null } }>;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };

  const chatCompletionText = chatPayload.choices?.[0]?.message?.content;
  if (typeof chatCompletionText === "string" && chatCompletionText.trim()) {
    return chatCompletionText.trim();
  }

  for (const item of chatPayload.output ?? []) {
    for (const contentItem of item.content ?? []) {
      if (contentItem.type === "output_text" && typeof contentItem.text === "string") {
        const trimmed = contentItem.text.trim();
        if (trimmed) {
          return trimmed;
        }
      }
    }
  }

  return null;
}
