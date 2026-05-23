import { describe, expect, it } from "vitest";

import {
  buildAgentMessages,
  extractAnswerText,
  resolveModel,
  supportedModels,
} from "@/lib/agent";

describe("resolveModel", () => {
  it("keeps an allowed model", () => {
    expect(resolveModel("gemini-3.1-pro-preview")).toBe("gemini-3.1-pro-preview");
  });

  it("falls back to the default model for unsupported ids", () => {
    expect(resolveModel("unknown-model")).toBe(supportedModels[0].id);
  });
});

describe("buildAgentMessages", () => {
  it("creates a system prompt grounded in the learning topic knowledge base", () => {
    const messages = buildAgentMessages("为什么 Nested Learning 值得关注？", {
      topicId: "ai-self-evolution",
      mode: "socratic",
    });

    expect(messages).toHaveLength(2);
    expect(messages[0]?.role).toBe("system");
    expect(messages[0]?.content).toContain("Learn 站内的学习助教");
    expect(messages[0]?.content).toContain("当前主题：AI 自进化");
    expect(messages[0]?.content).toContain("回答模式：socratic");
    expect(messages[0]?.content).toContain("不要直接给标准答案");
    expect(messages[0]?.content).toContain("一次只推进一个小问题");
    expect(messages[1]).toEqual({
      role: "user",
      content: "为什么 Nested Learning 值得关注？",
    });
  });
});

describe("extractAnswerText", () => {
  it("reads the assistant answer from a chat completions response", () => {
    const text = extractAnswerText({
      choices: [
        {
          message: {
            content: "这是答案",
          },
        },
      ],
    });

    expect(text).toBe("这是答案");
  });

  it("reads the assistant answer from a responses-style payload", () => {
    const text = extractAnswerText({
      output: [
        {
          content: [
            {
              type: "output_text",
              text: "另一种答案",
            },
          ],
        },
      ],
    });

    expect(text).toBe("另一种答案");
  });
});
