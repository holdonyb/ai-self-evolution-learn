"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";

import { resolveModel, supportedModels } from "@/lib/agent";

export function AgentPanel() {
  const [question, setQuestion] = useState("");
  const [model, setModel] = useState<(typeof supportedModels)[number]["id"]>(supportedModels[0].id);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      setError("");
      setAnswer("");

      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          model,
        }),
      });

      const payload = (await response.json()) as { answer?: string; error?: string; detail?: string };

      if (!response.ok) {
        setError(payload.detail ?? payload.error ?? "请求失败");
        return;
      }

      setAnswer(payload.answer ?? "");
    });
  };

  return (
    <section className="panel-shell">
      <div className="panel-header">
        <div>
          <p className="eyebrow">站内 AI 助教</p>
          <h3>把阅读清单压成一个可追问的老师</h3>
        </div>
        <label className="model-picker">
          <span>模型</span>
          <select value={model} onChange={(event) => setModel(resolveModel(event.target.value))}>
            {supportedModels.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form className="agent-form" onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="例如：AlphaZero、AlphaEvolve、Nested Learning 三者是什么关系？"
          rows={5}
        />
        <div className="agent-actions">
          <p>回答会优先引用站内知识结构，并主动标注限制与争议。</p>
          <button type="submit" disabled={isPending || !question.trim()}>
            {isPending ? "思考中..." : "开始追问"}
          </button>
        </div>
      </form>

      <div className="agent-output" aria-live="polite">
        {error ? <p className="agent-error">{error}</p> : null}
        {answer ? <p>{answer}</p> : <p>适合追问概念差异、历史脉络、技术限制和 2026 年产业含义。</p>}
      </div>
    </section>
  );
}
