import { NextResponse } from "next/server";

type VoiceResponse =
  | { text?: string; transcript?: string; result?: string }
  | { data?: { text?: string; transcript?: string; result?: string } };

function extractTranscript(payload: VoiceResponse): string {
  if ("text" in payload && typeof payload.text === "string" && payload.text.trim()) {
    return payload.text.trim();
  }

  if ("transcript" in payload && typeof payload.transcript === "string" && payload.transcript.trim()) {
    return payload.transcript.trim();
  }

  if ("result" in payload && typeof payload.result === "string" && payload.result.trim()) {
    return payload.result.trim();
  }

  if ("data" in payload && payload.data) {
    return extractTranscript(payload.data);
  }

  return "";
}

export async function POST(request: Request) {
  const targetUrl = process.env.DOUBAO_ASR_URL;

  if (!targetUrl) {
    return NextResponse.json({ error: "DOUBAO_ASR_URL is missing" }, { status: 500 });
  }

  const formData = await request.formData();
  const audioFile = formData.get("audio");

  if (!(audioFile instanceof File)) {
    return NextResponse.json({ error: "audio file is required" }, { status: 400 });
  }

  const upstreamForm = new FormData();
  upstreamForm.append("audio", audioFile, audioFile.name || "recording.webm");
  upstreamForm.append("language", "zh-CN");
  upstreamForm.append("provider", "doubao");

  const headers = new Headers();
  if (process.env.DOUBAO_ASR_BEARER_TOKEN) {
    headers.set("Authorization", `Bearer ${process.env.DOUBAO_ASR_BEARER_TOKEN}`);
  }

  const upstream = await fetch(targetUrl, {
    method: "POST",
    headers,
    body: upstreamForm,
  });

  if (!upstream.ok) {
    const detail = await upstream.text();
    return NextResponse.json(
      { error: "doubao voice request failed", detail },
      { status: upstream.status },
    );
  }

  const payload = (await upstream.json()) as VoiceResponse;
  const text = extractTranscript(payload);

  if (!text) {
    return NextResponse.json(
      { error: "empty transcript", detail: "The voice service returned no transcript text." },
      { status: 502 },
    );
  }

  return NextResponse.json({ text });
}
