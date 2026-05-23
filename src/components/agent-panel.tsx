"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, BadgeInfo, Sparkles } from "lucide-react";

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
    <section className="panel-shell" id="assistant">
      <div className="panel-header">
        <div>
          <p className="eyebrow">站内 AI 助教</p>
          <h3>把阅读清单压成一个可追问的研究伴读</h3>
          <div className="panel-meta">
            <span>
              <Sparkles size={15} />
              优先使用站内结构
            </span>
            <span>
              <BadgeInfo size={15} />
              主动标注争议和限制
            </span>
          </div>
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
          placeholder="例如：AlphaZero、AlphaEvolve、Nested Learning 三者是什么关系？它们分别代表哪一层自进化能力？"
          rows={5}
        />
        <div className="agent-actions">
          <p>适合追问概念差异、技术路线、真实边界、以及 2026 年产业含义。</p>
          <button type="submit" disabled={isPending || !question.trim()}>
            {isPending ? "思考中..." : "开始追问"}
            <ArrowUpRight size={16} />
          </button>
        </div>
      </form>

      <div className="agent-output" aria-live="polite">
        {error ? <p className="agent-error">{error}</p> : null}
        {answer ? (
          <p>{answer}</p>
        ) : (
          <p>默认回答方式是：先给结论，再拆机制，然后指出边界，最后告诉你下一篇该读什么。</p>
        )}
      </div>
    </section>
  );
}
