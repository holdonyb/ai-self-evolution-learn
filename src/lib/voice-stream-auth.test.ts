import { describe, expect, it, vi } from "vitest";

import { issueVoiceStreamAuth } from "@/lib/voice-stream-auth";

describe("issueVoiceStreamAuth", () => {
  it("builds a stream auth payload from project env vars", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ jwt_token: "token-123" }),
    });

    const payload = await issueVoiceStreamAuth({
      uid: "learn-user",
      env: {
        DOUBAO_ASR_APP_KEY: "app-key",
        DOUBAO_ASR_ACCESS_KEY: "access-key",
        DOUBAO_ASR_STS_ENDPOINT: "https://openspeech.bytedance.com/api/v1/sts/token",
        DOUBAO_STREAM_ASR_URL: "wss://openspeech.bytedance.com/api/v3/sauc/bigmodel",
        DOUBAO_STREAM_ASR_RESOURCE_ID: "volc.bigasr.sauc.duration",
        DOUBAO_STREAM_TOKEN_DURATION_SECONDS: "240",
      },
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledWith("https://openspeech.bytedance.com/api/v1/sts/token", {
      method: "POST",
      headers: {
        Authorization: "Bearer; access-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appid: "app-key",
        duration: 240,
      }),
    });
    expect(payload).toEqual({
      url: "wss://openspeech.bytedance.com/api/v3/sauc/bigmodel",
      auth: {
        api_resource_id: "volc.bigasr.sauc.duration",
        api_app_key: "app-key",
        api_access_key: "Jwt; token-123",
      },
      config: {
        user: { uid: "learn-user" },
        audio: { format: "pcm", rate: 16000, bits: 16, channel: 1 },
        request: {
          model_name: "bigmodel",
          show_utterances: true,
          enable_itn: true,
          enable_punc: true,
          enable_ddc: true,
        },
      },
      expires_in_seconds: 240,
    });
  });

  it("falls back to AgentHub env names when local env vars are absent", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "token-456" }),
    });

    const payload = await issueVoiceStreamAuth({
      uid: "learn-user",
      env: {
        AGENTHUB_DOUBAO_ASR_APP_KEY: "agenthub-app-key",
        AGENTHUB_DOUBAO_ASR_ACCESS_KEY: "agenthub-access-key",
      },
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledWith("https://openspeech.bytedance.com/api/v1/sts/token", {
      method: "POST",
      headers: {
        Authorization: "Bearer; agenthub-access-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appid: "agenthub-app-key",
        duration: 300,
      }),
    });
    expect(payload.url).toBe("wss://openspeech.bytedance.com/api/v3/sauc/bigmodel");
    expect(payload.auth.api_resource_id).toBe("volc.bigasr.sauc.duration");
    expect(payload.auth.api_access_key).toBe("Jwt; token-456");
    expect(payload.expires_in_seconds).toBe(300);
  });
});
