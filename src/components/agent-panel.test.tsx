import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

type PartialHandler = (text: string, fullData: unknown) => void;
type VoidHandler = () => void;

const streamingState = vi.hoisted(() => {
  let onStart: VoidHandler | null = null;
  let onClose: VoidHandler | null = null;
  let onPartialText: PartialHandler | null = null;

  return {
    reset() {
      onStart = null;
      onClose = null;
      onPartialText = null;
    },
    bindHandlers(handlers: {
      onStart?: VoidHandler;
      onClose?: VoidHandler;
      onPartialText?: PartialHandler;
    }) {
      onStart = handlers.onStart ?? null;
      onClose = handlers.onClose ?? null;
      onPartialText = handlers.onPartialText ?? null;
    },
    emitStart() {
      onStart?.();
    },
    emitPartial(text: string, fullData: unknown = {}) {
      onPartialText?.(text, fullData);
    },
    emitClose() {
      onClose?.();
    },
  };
});

vi.mock("@/lib/voice-streaming", () => ({
  startStreamingVoice: vi.fn(async (options: { onStart?: VoidHandler; onClose?: VoidHandler; onPartialText?: PartialHandler }) => {
    streamingState.bindHandlers(options);
    options.onStart?.();
    return {
      stop() {
        options.onClose?.();
      },
    };
  }),
}));

import { AgentPanel } from "@/components/agent-panel";

describe("AgentPanel", () => {
  it("keeps the streamed transcript in the textarea after stopping recording", async () => {
    streamingState.reset();
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue({}),
      },
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        if (String(input).includes("/api/voice/stream-auth")) {
          return {
            ok: true,
            json: async () => ({
              url: "wss://example.com",
              auth: {},
              config: {
                user: { uid: "user-1" },
                audio: { format: "pcm", rate: 16000, bits: 16, channel: 1 },
                request: { model_name: "bigmodel" },
              },
              expires_in_seconds: 300,
            }),
          } as Response;
        }

        throw new Error(`unexpected fetch: ${String(input)}`);
      }),
    );

    render(<AgentPanel />);

    const voiceButton = screen.getByRole("button", { name: "流式语音" });
    fireEvent.click(voiceButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "停止语音" })).toBeInTheDocument();
    });

    await act(async () => {
      streamingState.emitPartial("主题", {
        result: {
          text: "主题",
          utterances: [{ text: "今天这个" }],
        },
      });
    });

    const textarea = screen.getByRole("textbox");
    await waitFor(() => {
      expect(textarea).toHaveValue("今天这个主题");
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "停止语音" }));
    });

    await waitFor(() => {
      expect(textarea).toHaveValue("今天这个主题");
    });
  });
});
