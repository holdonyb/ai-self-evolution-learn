import { NextResponse } from "next/server";

import { buildAgentMessages, extractAnswerText, resolveModel } from "@/lib/agent";

type AskRequest = {
  question?: string;
  model?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as AskRequest;
  const question = body.question?.trim();

  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  const apiKey = process.env.ONEAPI_API_KEY;
  const baseUrl = process.env.ONEAPI_BASE_URL ?? "https://oneapi.keath.ai";

  if (!apiKey) {
    return NextResponse.json({ error: "ONEAPI_API_KEY is missing" }, { status: 500 });
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: resolveModel(body.model),
      temperature: 0.3,
      messages: buildAgentMessages(question),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: "upstream request failed", detail: errorText },
      { status: response.status },
    );
  }

  const payload = (await response.json()) as unknown;
  const answer = extractAnswerText(payload);

  if (!answer) {
    return NextResponse.json(
      { error: "empty answer", detail: "The upstream model returned no readable text." },
      { status: 502 },
    );
  }

  return NextResponse.json({ answer });
}
