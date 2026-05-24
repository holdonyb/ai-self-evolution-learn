"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, BadgeInfo, Mic, MicOff, Sparkles, Volume2, VolumeX } from "lucide-react";

import type { AgentMode, SupportedModelId } from "@/lib/agent";
import { resolveModel, supportedModels } from "@/lib/agent";
import { extractStreamingTranscript, mergeStreamingTranscript } from "@/lib/streaming-transcript";
import { startStreamingVoice, type StreamingVoiceController, type VoiceStreamAuthPayload } from "@/lib/voice-streaming";

type AgentPanelProps = {
  topicId?: string;
  quickPrompts?: string[];
  variant?: "full" | "rail" | "sheet";
  state?: AgentPanelState;
  onStateChange?: (nextState: AgentPanelState) => void;
  panelId?: string;
};

type AgentResponse = {
  answer?: string;
  error?: string;
  detail?: string;
};

export type AgentPanelState = {
  question: string;
  model: SupportedModelId;
  mode: AgentMode;
  answer: string;
  error: string;
  voiceError: string;
};

const modeLabels: Array<{ id: AgentMode; label: string }> = [
  { id: "answer", label: "直接回答" },
  { id: "socratic", label: "苏格拉底" },
  { id: "quiz", label: "小测一轮" },
];

const initialAgentPanelState: AgentPanelState = {
  question: "",
  model: supportedModels[0].id,
  mode: "socratic",
  answer: "",
  error: "",
  voiceError: "",
};

export function AgentPanel({
  topicId,
  quickPrompts = [],
  variant = "full",
  state,
  onStateChange,
  panelId = "assistant",
}: AgentPanelProps) {
  const [internalState, setInternalState] = useState<AgentPanelState>(initialAgentPanelState);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isRecording, setIsRecording] = useState(false);
  const streamingControllerRef = useRef<StreamingVoiceController | null>(null);
  const streamingBaseQuestionRef = useRef("");
  const streamingAppliedTextRef = useRef("");
  const streamingLastTextRef = useRef("");
  const streamingManualEditRef = useRef(false);
  const activeState = state ?? internalState;

  const setAgentState = (nextState: AgentPanelState | ((current: AgentPanelState) => AgentPanelState)) => {
    const resolvedState = typeof nextState === "function" ? nextState(activeState) : nextState;
    if (onStateChange) {
      onStateChange(resolvedState);
      return;
    }

    setInternalState(resolvedState);
  };

  const patchAgentState = (patch: Partial<AgentPanelState>) => {
    setAgentState((current) => ({ ...current, ...patch }));
  };

  const { question, model, mode, answer, error, voiceError } = activeState;

  const modeHint = useMemo(() => {
    switch (mode) {
      case "answer":
        return "适合直接厘清概念差异、机制和边界。";
      case "quiz":
        return "适合快速自测，看看自己是不是真的懂了。";
      default:
        return "适合你自己不断回答问题，助教只负责把问题一步步压实。";
    }
  }, [mode]);

  const submitLabel = mode === "socratic" ? "开始对话" : "开始追问";
  const speechLabel = mode === "socratic" ? "朗读问题" : "朗读回答";
  const stopSpeechLabel = mode === "socratic" ? "停止朗读问题" : "停止朗读";
  const outputFallback =
    mode === "socratic"
      ? "苏格拉底模式不会先替你回答，它会先把你的问题拆成你必须自己作答的小问题。"
      : "默认学习方式是：先建立判断，再拆机制，再补边界，然后继续追问。";
  const panelTitle = variant === "full" ? "不是只回答，而是带着你继续学下去" : "AI 助教伴读";
  const panelClassName =
    variant === "rail"
      ? "panel-shell panel-shell-rail"
      : variant === "sheet"
        ? "panel-shell panel-shell-sheet"
        : "panel-shell";
  const showMeta = variant === "full";
  const showHeaderEyebrow = variant !== "sheet";
  const trimmedPrompts = variant === "rail" ? quickPrompts.slice(0, 2) : quickPrompts;

  useEffect(() => {
    return () => {
      streamingControllerRef.current?.stop();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const resetStreamingQuestionState = () => {
    streamingBaseQuestionRef.current = "";
    streamingAppliedTextRef.current = "";
    streamingLastTextRef.current = "";
    streamingManualEditRef.current = false;
  };

  const applyStreamingQuestionPartial = (text: string) => {
    const normalized = text.trim();
    const previousPacket = streamingLastTextRef.current;
    const previousApplied = streamingAppliedTextRef.current;
    const merged = mergeStreamingTranscript(previousApplied, previousPacket, normalized);
    streamingLastTextRef.current = normalized;
    streamingAppliedTextRef.current = merged;

    if (streamingManualEditRef.current) {
      if (!merged) {
        return;
      }

      const suffix = merged.startsWith(previousApplied) ? merged.slice(previousApplied.length) : normalized;
      if (!suffix) {
        return;
      }

      setAgentState((current) => ({
        ...current,
        question: `${current.question}${suffix}`,
      }));
      return;
    }

    setAgentState((current) => ({
      ...current,
      question: merged
        ? `${streamingBaseQuestionRef.current}${merged}`
        : streamingBaseQuestionRef.current,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      patchAgentState({ error: "", answer: "" });

      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          model,
          mode,
          topicId,
        }),
      });

      const payload = (await response.json()) as AgentResponse;

      if (!response.ok) {
        patchAgentState({ error: payload.detail ?? payload.error ?? "请求失败" });
        return;
      }

      patchAgentState({ answer: payload.answer ?? "" });
    });
  };

  const stopRecording = async () => {
    if (streamingControllerRef.current) {
      streamingControllerRef.current.stop();
    }
  };

  const fetchVoiceStreamAuth = async () => {
    const response = await fetch("/api/voice/stream-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const payload = (await response.json()) as VoiceStreamAuthPayload & { error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? "流式语音鉴权失败");
    }

    return payload;
  };

  const finalizeStreamingVoice = (options?: { errorMessage?: string }) => {
    setIsRecording(false);
    streamingControllerRef.current = null;
    resetStreamingQuestionState();
    patchAgentState({ voiceError: options?.errorMessage ?? "" });
  };

  const startStreamingVoiceInput = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      patchAgentState({ voiceError: "当前浏览器不支持录音" });
      return;
    }

    try {
      const auth = await fetchVoiceStreamAuth();
      resetStreamingQuestionState();
      streamingBaseQuestionRef.current = question.trim() ? `${question.trimEnd()}\n` : "";
      const controller = await startStreamingVoice({
        auth,
        onStart: () => {
          setIsRecording(true);
          patchAgentState({ voiceError: "" });
        },
        onPartialText: (text, fullData) => {
          const normalized = extractStreamingTranscript(String(text || ""), fullData);
          if (normalized) {
            applyStreamingQuestionPartial(normalized);
          }
        },
        onRecovering: (attempt) => {
          patchAgentState({ voiceError: `语音连接中断，正在第 ${attempt} 次重连…` });
        },
        onClose: () => {
          finalizeStreamingVoice();
        },
        onError: () => {
          finalizeStreamingVoice({ errorMessage: "流式语音连接中断，请重试" });
        },
      });
      streamingControllerRef.current = controller;
    } catch (recordingIssue) {
      finalizeStreamingVoice({
        errorMessage: recordingIssue instanceof Error ? recordingIssue.message : "流式语音启动失败",
      });
    }
  };

  const toggleVoiceInput = async () => {
    if (isRecording) {
      await stopRecording();
      return;
    }

    await startStreamingVoiceInput();
  };

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      patchAgentState({ voiceError: "当前浏览器不支持 TTS" });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!answer.trim()) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.lang = "zh-CN";
    utterance.rate = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <section className={panelClassName} id={panelId}>
      <div className="panel-header">
        <div>
          {showHeaderEyebrow ? <p className="eyebrow">站内 AI 助教</p> : null}
          <h3>{panelTitle}</h3>
          {showMeta ? (
            <div className="panel-meta">
              <span>
                <Sparkles size={15} />
                优先使用站内结构
              </span>
              <span>
                <BadgeInfo size={15} />
                仅限知识库检索与受限联网补充
              </span>
            </div>
          ) : (
            <p className="panel-note">读到哪里就问到哪里，不需要跳出当前主题。</p>
          )}
        </div>
        <label className="model-picker">
          <span>模型</span>
          <select value={model} onChange={(event) => patchAgentState({ model: resolveModel(event.target.value) })}>
            {supportedModels.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="agent-mode-row" role="tablist" aria-label="学习模式">
        {modeLabels.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === mode ? "agent-mode-button is-active" : "agent-mode-button"}
            onClick={() => patchAgentState({ mode: item.id })}
          >
            {item.label}
          </button>
        ))}
      </div>

      {trimmedPrompts.length > 0 ? (
        <div className="agent-prompt-strip">
          {trimmedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="agent-prompt-chip"
              onClick={() => patchAgentState({ question: prompt })}
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      <form className="agent-form" onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(event) => {
            const nextQuestion = event.target.value;
            if (isRecording && streamingControllerRef.current) {
              const applied = streamingAppliedTextRef.current;
              const expected = `${streamingBaseQuestionRef.current}${applied}`;
              if (!streamingManualEditRef.current && nextQuestion === expected) {
                patchAgentState({ question: nextQuestion });
                return;
              }

              if (!streamingManualEditRef.current && applied && nextQuestion.endsWith(applied)) {
                streamingBaseQuestionRef.current = nextQuestion.slice(0, nextQuestion.length - applied.length);
              } else {
                streamingManualEditRef.current = true;
                streamingBaseQuestionRef.current = nextQuestion;
                streamingAppliedTextRef.current = "";
              }
            }

            patchAgentState({ question: nextQuestion });
          }}
          placeholder="例如：AlphaZero、AlphaEvolve、Nested Learning 三者是什么关系？它们分别代表哪一层自进化能力？"
          rows={variant === "rail" ? 4 : 5}
        />
        <div className="agent-actions">
          <p>{modeHint}</p>
          <div className="agent-action-row">
            <button
              type="button"
              className={isRecording ? "voice-button is-recording" : "voice-button"}
              onClick={toggleVoiceInput}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              {isRecording ? "停止语音" : "流式语音"}
            </button>
            <button type="submit" disabled={isPending || !question.trim()}>
              {isPending ? "思考中..." : submitLabel}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </form>

      <div className="agent-output" aria-live="polite">
        {voiceError ? <p className="agent-error">{voiceError}</p> : null}
        {error ? <p className="agent-error">{error}</p> : null}
        {answer ? (
          <>
            <div className="agent-output-tools">
              <button type="button" className="agent-audio-button" onClick={toggleSpeech}>
                {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                {isSpeaking ? stopSpeechLabel : speechLabel}
              </button>
            </div>
            <p>{answer}</p>
          </>
        ) : (
          <p>{outputFallback}</p>
        )}
      </div>
    </section>
  );
}
