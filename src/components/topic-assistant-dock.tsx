"use client";

import { useState } from "react";
import { Bot, MessageSquareText, X } from "lucide-react";

import { AgentPanel } from "@/components/agent-panel";
import type { AgentPanelState } from "@/components/agent-panel";
import type { LearningTopic } from "@/content/reading-list";
import { supportedModels } from "@/lib/agent";

type TopicAssistantDockProps = {
  topic: LearningTopic;
};

const initialAssistantState: AgentPanelState = {
  question: "",
  model: supportedModels[0].id,
  mode: "socratic",
  answer: "",
  error: "",
  voiceError: "",
};

export function TopicAssistantDock({ topic }: TopicAssistantDockProps) {
  const [assistantState, setAssistantState] = useState<AgentPanelState>(initialAssistantState);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const hasConversation = Boolean(assistantState.question.trim() || assistantState.answer.trim());
  const mobileStatus = hasConversation ? "已保留本轮追问" : "边读边问";

  return (
    <>
      <aside className="topic-assistant-rail" aria-label="AI 助教伴读">
        <div className="topic-assistant-rail-intro">
          <p className="eyebrow">常驻助教</p>
          <strong>读到哪里，就在这里继续追问。</strong>
          <p>不离开当前模块，直接把概念差异、验证逻辑和边界条件问穿。</p>
        </div>
        <AgentPanel
          panelId="assistant"
          topicId={topic.id}
          quickPrompts={topic.socraticStarts}
          variant="rail"
          state={assistantState}
          onStateChange={setAssistantState}
        />
      </aside>

      <div className="topic-assistant-mobile-bar" aria-label="移动端 AI 助教">
        <div className="topic-assistant-mobile-copy">
          <span>
            <Bot size={16} />
            AI 助教伴读
          </span>
          <p>{mobileStatus}</p>
        </div>
        <button type="button" className="topic-assistant-mobile-toggle" onClick={() => setIsMobileOpen(true)}>
          <MessageSquareText size={16} />
          打开助手
        </button>
      </div>

      {isMobileOpen ? (
        <div className="topic-assistant-mobile-overlay" role="dialog" aria-modal="true" aria-label="AI 助教伴读">
          <button
            type="button"
            className="topic-assistant-mobile-backdrop"
            aria-label="关闭助手"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="topic-assistant-mobile-sheet">
            <div className="topic-assistant-mobile-handle" aria-hidden="true" />
            <div className="topic-assistant-mobile-sheet-head">
              <div>
                <p className="eyebrow">移动伴读</p>
                <strong>AI 助教伴读</strong>
              </div>
              <button type="button" className="topic-assistant-mobile-close" onClick={() => setIsMobileOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <AgentPanel
              panelId="assistant-mobile"
              topicId={topic.id}
              quickPrompts={topic.socraticStarts}
              variant="sheet"
              state={assistantState}
              onStateChange={setAssistantState}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
