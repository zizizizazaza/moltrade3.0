"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  User,
  Shield,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
} from "lucide-react";
import {
  type ChatMessage,
  type AnalysisResult,
} from "@/lib/mock-data";

interface ChatPanelProps {
  question: string;
  analysis: AnalysisResult | null;
  onAnalysisStart: () => void;
  isAnalyzing: boolean;
  analysisPhase: number;
  autoStart?: boolean;
}

const agentMeta: Record<
  string,
  { name: string; avatar: string; avatarClass: string; color: string }
> = {
  "agent-alpha": {
    name: "Agent Alpha",
    avatar: "α",
    avatarClass: "bg-[#2a3031] text-[#e0e0e0]",
    color: "text-[#c8c8c8]",
  },
  "agent-beta": {
    name: "Agent Beta",
    avatar: "β",
    avatarClass: "bg-[#212627] text-[#888]",
    color: "text-[#888]",
  },
  "agent-gamma": {
    name: "Agent Gamma",
    avatar: "γ",
    avatarClass: "bg-[#212525] text-[#555]",
    color: "text-[#555]",
  },
  consensus: {
    name: "Consensus",
    avatar: "⚡",
    avatarClass: "bg-[#16c784]/10 text-[#16c784]",
    color: "text-[#16c784]",
  },
};

export function ChatPanel({
  question,
  analysis,
  onAnalysisStart,
  isAnalyzing,
  analysisPhase,
  autoStart = false,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [expandedMsgs, setExpandedMsgs] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoStartedRef = useRef(false);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-start analysis when arriving with a question
  useEffect(() => {
    if (autoStart && !autoStartedRef.current && !hasStarted) {
      autoStartedRef.current = true;
      handleSend(`Analyze: ${question}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  // Build agent messages from analysis data as phases progress
  useEffect(() => {
    if (!analysis || !hasStarted) return;

    const agents = analysis.agents;

    // Phase 1: Agent Alpha
    if (analysisPhase >= 1 && !messages.find((m) => m.role === "agent-alpha")) {
      const a = agents[0];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "alpha-response",
            role: "agent-alpha",
            content: a.reasoning,
            timestamp: new Date().toISOString(),
            agentMeta: { direction: a.direction, confidence: a.confidence },
          },
        ]);
      }, 800);
    }

    // Phase 2: Agent Beta
    if (analysisPhase >= 2 && !messages.find((m) => m.role === "agent-beta")) {
      const b = agents[1];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "beta-response",
            role: "agent-beta",
            content: b.reasoning,
            timestamp: new Date().toISOString(),
            agentMeta: { direction: b.direction, confidence: b.confidence },
          },
        ]);
      }, 600);
    }

    // Phase 3: Agent Gamma
    if (analysisPhase >= 3 && !messages.find((m) => m.role === "agent-gamma")) {
      const g = agents[2];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "gamma-response",
            role: "agent-gamma",
            content: g.reasoning,
            timestamp: new Date().toISOString(),
            agentMeta: { direction: g.direction, confidence: g.confidence },
          },
        ]);
      }, 600);
    }

    // Phase 4: Consensus
    if (analysisPhase >= 4 && !messages.find((m) => m.role === "consensus")) {
      const c = analysis.consensus;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "consensus-result",
            role: "consensus",
            content: `**${c.direction} @ ${c.confidence}% confidence**\n\n${c.summary}\n\n⚠️ Key Disagreement: ${c.keyDisagreement}`,
            timestamp: new Date().toISOString(),
            agentMeta: { direction: c.direction, confidence: c.confidence },
          },
        ]);
      }, 800);
    }
  }, [analysisPhase, analysis, hasStarted, messages]);

  const handleSend = (text?: string) => {
    const content = text || inputValue.trim();
    if (!content) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    if (!hasStarted) {
      // First message triggers analysis
      setHasStarted(true);

      // Add system message
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "system-start",
            role: "system",
            content:
              "Starting Multi-Agent analysis. Three agents with different perspectives will analyze this question independently, then reach a consensus.",
            timestamp: new Date().toISOString(),
          },
        ]);
        onAnalysisStart();
      }, 500);
    } else {
      // Follow-up message → mock a system acknowledgment
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `system-ack-${Date.now()}`,
            role: "system",
            content:
              "Noted. This parameter will be factored into the next analysis cycle. In the live version, agents will re-evaluate with your updated instructions.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedMsgs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderMessage = (msg: ChatMessage) => {
    if (msg.role === "user") {
      return (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <div className="max-w-[85%] flex items-start gap-2.5 flex-row-reverse">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#242829] text-[#888]">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-xl rounded-tr-sm bg-[#242829] border border-[#32393a] px-3.5 py-2.5">
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        </motion.div>
      );
    }

    if (msg.role === "system") {
      return (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 border border-border/30">
            <Sparkles className="h-3 w-3 text-[#566163]" />
            <p className="text-xs text-muted-foreground">{msg.content}</p>
          </div>
        </motion.div>
      );
    }

    if (msg.role === "consensus") {
      const isYes = msg.agentMeta?.direction === "YES";
      return (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div
            className={`rounded-xl border p-4 ${
              isYes
                ? "border-green-500/30 bg-green-500/5"
                : "border-red-500/30 bg-red-500/5"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#16c784]/10 text-[#16c784] text-xs font-bold">
                ⚡
              </div>
              <span className="text-sm font-semibold">
                Multi-Agent Consensus
              </span>
              <span
                className={`text-sm font-bold ml-auto ${
                  isYes ? "text-green-400" : "text-red-400"
                }`}
              >
                {msg.agentMeta?.direction} @ {msg.agentMeta?.confidence}%
              </span>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {msg.content
                .replace(/\*\*/g, "")
                .split("\n\n")
                .map((para, i) => (
                  <p key={i} className={i > 0 ? "mt-2" : ""}>
                    {para.startsWith("⚠️") ? (
                      <span className="flex items-start gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                        <span>{para.replace("⚠️ ", "")}</span>
                      </span>
                    ) : i === 0 ? (
                      <span className="flex items-start gap-1.5">
                        <Shield
                          className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
                            isYes ? "text-green-400" : "text-red-400"
                          }`}
                        />
                        <span className="font-medium text-foreground">
                          {para}
                        </span>
                      </span>
                    ) : (
                      para
                    )}
                  </p>
                ))}
            </div>
          </div>
        </motion.div>
      );
    }

    // Agent messages
    const meta = agentMeta[msg.role];
    if (!meta) return null;
    const isExpanded = expandedMsgs.has(msg.id);
    const isYes = msg.agentMeta?.direction === "YES";

    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex"
      >
        <div className="max-w-[90%] flex items-start gap-2.5">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${meta.avatarClass} text-xs font-bold`}
          >
            {meta.avatar}
          </div>
          <div className="flex-1 min-w-0">
            {/* Agent name + direction */}
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold ${meta.color}`}>
                {meta.name}
              </span>
              {msg.agentMeta?.direction && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isYes
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {msg.agentMeta.direction} {msg.agentMeta.confidence}%
                </span>
              )}
            </div>
            {/* Reasoning */}
            <div className="rounded-2xl rounded-tl-sm bg-secondary/60 border border-border/30 px-4 py-2.5">
              <p
                className={`text-sm leading-relaxed text-muted-foreground ${
                  !isExpanded ? "line-clamp-3" : ""
                }`}
              >
                {msg.content}
              </p>
              <button
                onClick={() => toggleExpand(msg.id)}
                className="mt-1 flex items-center gap-1 text-xs text-[#566163] hover:text-[#888] transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" /> Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" /> Read more
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome state — before any messages */}
        {messages.length === 0 && !hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="flex items-center gap-2 text-[#2e3435] mb-3">
              <LinkIcon className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-[0.15em]">How to start</span>
            </div>
            <p className="text-[12px] text-[#445e51] leading-relaxed max-w-[260px]">
              Paste a Polymarket URL or type any prediction question below to begin multi-agent analysis.
            </p>
          </motion.div>
        )}

        {/* Empty state after start */}
        {messages.length === 0 && hasStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <p className="text-[12px] text-[#445e51]">Waiting for agent responses...</p>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence mode="popLayout">
          {messages.map(renderMessage)}
        </AnimatePresence>

        {/* Typing indicators */}
        {isAnalyzing && analysisPhase > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-muted-foreground pl-10"
          >
            <span className="flex gap-1">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </span>
            {analysisPhase < 4
              ? `Agent ${analysisPhase === 1 ? "Beta" : analysisPhase === 2 ? "Gamma" : "Consensus"} is analyzing...`
              : "Building consensus..."}
          </motion.div>
        )}
      </div>

      {/* ── Input — always at bottom ── */}
      <div className="shrink-0 px-3 py-2.5 border-t border-[#212525]">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasStarted ? "Add context or follow-up..." : "Paste Polymarket URL or type a question..."}
            className="flex-1 bg-[#141616] border border-[#272c2d] rounded-lg px-3 py-2.5 text-[13px] text-[#e0e0e0] focus:outline-none focus:border-[#16c784]/40 placeholder:text-[#2b3031] transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#16c784] text-[#0e0e0e] hover:bg-[#13b571] disabled:opacity-20 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
