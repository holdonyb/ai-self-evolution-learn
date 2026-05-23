import { NextResponse } from "next/server";

import { VoiceStreamAuthError, issueVoiceStreamAuth } from "@/lib/voice-stream-auth";

export async function POST() {
  try {
    const payload = await issueVoiceStreamAuth({
      uid: `learn-${crypto.randomUUID()}`,
    });

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof VoiceStreamAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "流式语音鉴权失败" }, { status: 502 });
  }
}
