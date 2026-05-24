import { describe, expect, it } from "vitest";

import { extractStreamingTranscript, mergeStreamingTranscript } from "@/lib/streaming-transcript";

describe("extractStreamingTranscript", () => {
  it("uses utterances plus current chunk when the SDK only returns a short current text", () => {
    expect(
      extractStreamingTranscript("继续研究", {
        result: {
          text: "继续研究",
          utterances: [{ text: "今天这个主题" }],
        },
      }),
    ).toBe("今天这个主题继续研究");
  });

  it("does not duplicate when utterances already contain the current text", () => {
    expect(
      extractStreamingTranscript("主题", {
        result: {
          text: "主题",
          utterances: [{ text: "今天这个主题" }],
        },
      }),
    ).toBe("今天这个主题");
  });
});

describe("mergeStreamingTranscript", () => {
  it("handles cumulative packets", () => {
    expect(mergeStreamingTranscript("今天这个", "今天这", "今天这个主题")).toBe("今天这个主题");
  });

  it("handles chunk packets", () => {
    expect(mergeStreamingTranscript("今天这个", "这个", "主题")).toBe("今天这个主题");
  });

  it("deduplicates overlap across packets", () => {
    expect(mergeStreamingTranscript("AlphaZero", "Zero", "Zero和AlphaEvolve")).toBe("AlphaZero和AlphaEvolve");
  });
});
