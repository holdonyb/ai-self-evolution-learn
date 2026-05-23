"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, BadgeInfo, Mic, MicOff, Sparkles, Volume2, VolumeX } from "lucide-react";

import type { AgentMode } from "@/lib/agent";
import { resolveModel, supportedModels } from "@/lib/agent";

type AgentPanelProps = {
  topicId?: string;
  quickPrompts?: string[];
};

type AgentResponse = {
  answer?: string;
  error?: string;
  detail?: string;
};

const modeLabels: Array<{ id: AgentMode; label: string }> = [
  { id: "answer", label: "直接回答" },
  { id: "socratic", label: "苏格拉底" },
  { id: "quiz", label: "小测一轮" },
];

export function AgentPanel({ topicId, quickPrompts = [] }: AgentPanelProps) {
  const [question, setQuestion] = useState("");
  const [model, setModel] = useState<(typeof supportedModels)[number]["id"]>(supportedModels[0].id);
  const [mode, setMode] = useState<AgentMode>("socratic");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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

  useEffect(() => {
    return () => {
      recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
          mode,
          topicId,
        }),
      });

      const payload = (await response.json()) as AgentResponse;

      if (!response.ok) {
        setError(payload.detail ?? payload.error ?? "请求失败");
        return;
      }

      setAnswer(payload.answer ?? "");
    });
  };

  const uploadVoiceBlob = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("audio", new File([blob], "doubao-recording.webm", { type: blob.type || "audio/webm" }));

    const response = await fetch("/api/voice/transcribe", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json()) as { text?: string; error?: string; detail?: string };

    if (!response.ok) {
      throw new Error(payload.detail ?? payload.error ?? "语音识别失败");
    }

    return payload.text ?? "";
  };

  const stopRecording = async () => {
    const recorder = recorderRef.current;
    if (!recorder) {
      return;
    }

    await new Promise<void>((resolve) => {
      recorder.addEventListener(
        "stop",
        async () => {
          try {
            const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
            const transcript = await uploadVoiceBlob(blob);
            setQuestion((current) => [current.trim(), transcript.trim()].filter(Boolean).join("\n"));
            setVoiceError("");
          } catch (voiceIssue) {
            setVoiceError(voiceIssue instanceof Error ? voiceIssue.message : "语音识别失败");
          } finally {
            recorder.stream.getTracks().forEach((track) => track.stop());
            recorderRef.current = null;
            chunksRef.current = [];
            setIsRecording(false);
            resolve();
          }
        },
        { once: true },
      );

      recorder.stop();
    });
  };

  const toggleVoiceInput = async () => {
    if (isRecording) {
      await stopRecording();
      return;
    }

    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setVoiceError("当前浏览器不支持录音");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorderRef.current = recorder;
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });
      recorder.start();
      setVoiceError("");
      setIsRecording(true);
    } catch (recordingIssue) {
      setVoiceError(recordingIssue instanceof Error ? recordingIssue.message : "无法打开麦克风");
    }
  };

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setVoiceError("当前浏览器不支持 TTS");
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
    <section className="panel-shell" id="assistant">
      <div className="panel-header">
        <div>
          <p className="eyebrow">站内 AI 助教</p>
          <h3>不是只回答，而是带着你继续学下去</h3>
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

      <div className="agent-mode-row" role="tablist" aria-label="学习模式">
        {modeLabels.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === mode ? "agent-mode-button is-active" : "agent-mode-button"}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {quickPrompts.length > 0 ? (
        <div className="agent-prompt-strip">
          {quickPrompts.map((prompt) => (
            <button key={prompt} type="button" className="agent-prompt-chip" onClick={() => setQuestion(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      <form className="agent-form" onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="例如：AlphaZero、AlphaEvolve、Nested Learning 三者是什么关系？它们分别代表哪一层自进化能力？"
          rows={5}
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
              {isRecording ? "停止语音" : "语音输入"}
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
