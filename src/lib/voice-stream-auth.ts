import type { VoiceStreamAuthPayload } from "@/lib/voice-streaming";

const DEFAULT_DOUBAO_ASR_STS_ENDPOINT = "https://openspeech.bytedance.com/api/v1/sts/token";
const DEFAULT_DOUBAO_STREAM_ASR_URL = "wss://openspeech.bytedance.com/api/v3/sauc/bigmodel";
const DEFAULT_DOUBAO_STREAM_ASR_RESOURCE_ID = "volc.bigasr.sauc.duration";
const DEFAULT_DOUBAO_STREAM_TOKEN_DURATION_SECONDS = 300;
const STS_SUCCESS_KEYS = ["jwt_token", "token"] as const;

type VoiceStreamAuthEnv = Record<string, string | undefined>;

type FetchLike = (input: string, init?: RequestInit) => Promise<{
  ok: boolean;
  status?: number;
  json: () => Promise<unknown>;
  text?: () => Promise<string>;
}>;

export class VoiceStreamAuthError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "VoiceStreamAuthError";
    this.status = status;
  }
}

export async function issueVoiceStreamAuth(options: {
  uid: string;
  env?: VoiceStreamAuthEnv;
  fetchImpl?: FetchLike;
}): Promise<VoiceStreamAuthPayload> {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const appKey = readEnv(env, "DOUBAO_ASR_APP_KEY", "AGENTHUB_DOUBAO_ASR_APP_KEY");
  const accessKey = readEnv(env, "DOUBAO_ASR_ACCESS_KEY", "AGENTHUB_DOUBAO_ASR_ACCESS_KEY");

  if (!appKey || !accessKey) {
    throw new VoiceStreamAuthError("Doubao streaming ASR credentials are not configured", 503);
  }

  const stsEndpoint =
    readEnv(env, "DOUBAO_ASR_STS_ENDPOINT", "AGENTHUB_DOUBAO_ASR_STS_ENDPOINT") || DEFAULT_DOUBAO_ASR_STS_ENDPOINT;
  const streamUrl =
    readEnv(env, "DOUBAO_STREAM_ASR_URL", "AGENTHUB_DOUBAO_STREAM_ASR_URL") || DEFAULT_DOUBAO_STREAM_ASR_URL;
  const resourceId =
    readEnv(env, "DOUBAO_STREAM_ASR_RESOURCE_ID", "AGENTHUB_DOUBAO_STREAM_ASR_RESOURCE_ID") ||
    DEFAULT_DOUBAO_STREAM_ASR_RESOURCE_ID;
  const durationSeconds = parseDurationSeconds(
    readEnv(env, "DOUBAO_STREAM_TOKEN_DURATION_SECONDS", "AGENTHUB_DOUBAO_STREAM_TOKEN_DURATION_SECONDS"),
  );

  const response = await fetchImpl(stsEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer; ${accessKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appid: appKey,
      duration: durationSeconds,
    }),
  });

  if (!response.ok) {
    const detail = response.text ? await response.text() : "";
    throw new VoiceStreamAuthError(
      detail ? `Doubao streaming ASR token request failed: ${detail}` : "Doubao streaming ASR token request failed",
      response.status ?? 502,
    );
  }

  const body = await response.json();
  const token = extractToken(body);
  if (!token) {
    throw new VoiceStreamAuthError("Doubao streaming ASR token response was empty", 502);
  }

  return {
    url: streamUrl,
    auth: {
      api_resource_id: resourceId,
      api_app_key: appKey,
      api_access_key: `Jwt; ${token}`,
    },
    config: {
      user: {
        uid: options.uid,
      },
      audio: {
        format: "pcm",
        rate: 16000,
        bits: 16,
        channel: 1,
      },
      request: {
        model_name: "bigmodel",
        show_utterances: true,
        enable_itn: true,
        enable_punc: true,
        enable_ddc: true,
      },
    },
    expires_in_seconds: durationSeconds,
  };
}

function readEnv(env: VoiceStreamAuthEnv, primaryKey: string, fallbackKey: string) {
  const primaryValue = env[primaryKey];
  if (typeof primaryValue === "string" && primaryValue.trim()) {
    return primaryValue.trim();
  }

  const fallbackValue = env[fallbackKey];
  if (typeof fallbackValue === "string" && fallbackValue.trim()) {
    return fallbackValue.trim();
  }

  return "";
}

function parseDurationSeconds(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return DEFAULT_DOUBAO_STREAM_TOKEN_DURATION_SECONDS;
}

function extractToken(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const payloadRecord = payload as Record<string, unknown>;
  for (const key of STS_SUCCESS_KEYS) {
    const value = payloadRecord[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}
