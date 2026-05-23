import { buildAgentContext } from "@/lib/knowledge";

export const supportedModels = [
  {
    id: "claude-opus-4.7",
    label: "Claude Opus 4.7",
    provider: "Anthropic via OneAPI",
  },
  {
    id: "gemini-3.1-pro-preview",
    label: "Gemini 3.1 Pro Preview",
    provider: "Google via OneAPI",
  },
] as const;

export type SupportedModelId = (typeof supportedModels)[number]["id"];

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

export function resolveModel(requested?: string): SupportedModelId {
  const matched = supportedModels.find((model) => model.id === requested);
  return matched?.id ?? supportedModels[0].id;
}

export function buildAgentMessages(question: string): ChatMessage[] {
  return [
    {
      role: "system",
      content: buildAgentContext(question),
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
