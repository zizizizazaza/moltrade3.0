"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { type AnalysisResult, type DebateSession, debateSessions } from "@/lib/mock-data";
import { useState } from "react";

// ── Visual constants ─────────────────────────────────────────
const VIS = 260;   // visual box px
const R   = 92;    // orbit radius px
const C   = VIS / 2;
const AV  = 38;    // avatar size px
const AH  = AV / 2;

const ORBIT = [
  { name: "Alpha", angleDeg: -90  }, // top
  { name: "Beta",  angleDeg: 30   }, // bottom-right
  { name: "Gamma", angleDeg: 150  }, // bottom-left
];

const AGENT_STYLE: Record<string, { avatar: string; avatarClass: string; color: string; glowColor: string }> = {
  Alpha: { avatar: "α", avatarClass: "bg-[#0d2818] text-[#34d399] border border-[#16c784]/30", color: "#34d399", glowColor: "rgba(52,211,153,0.15)" },
  Beta:  { avatar: "β", avatarClass: "bg-[#1a0f2e] text-[#a78bfa] border border-[#a78bfa]/30", color: "#a78bfa", glowColor: "rgba(167,139,250,0.15)" },
  Gamma: { avatar: "γ", avatarClass: "bg-[#2a1f0a] text-[#fbbf24] border border-[#fbbf24]/30", color: "#fbbf24", glowColor: "rgba(251,191,36,0.15)" },
};

interface AgentProcessProps {
  analysis: AnalysisResult | null;
  analysisPhase: number;
  isAnalyzing: boolean;
}

const AGENT_ROLE: Record<string, string> = {
  Alpha: "On-Chain Data",
  Beta:  "Macro Economics",
  Gamma: "Sentiment & Tech",
};

export function AgentProcess({
  analysis,
  analysisPhase,
  isAnalyzing,
}: AgentProcessProps) {
  const [expandedRounds, setExpandedRounds] = useState<Set<number>>(new Set([0]));

  const session: DebateSession | null = analysis
    ? (debateSessions[analysis.marketId] ?? debateSessions["custom-prediction"])
    : null;

  const visibleRoundCount = Math.max(0, Math.min(
    session?.rounds.length ?? 0,
    analysisPhase === 0 ? 0 :
    analysisPhase === 1 ? 1 :
    analysisPhase === 2 ? 1 :
    analysisPhase === 3 ? Math.min(2, session?.rounds.length ?? 1) :
    session?.rounds.length ?? 0
  ));

  const isDone       = analysisPhase >= 4;
  const isSpinning   = isAnalyzing && analysisPhase > 0;
  const verdict      = session?.finalVerdict;
  const latestRound  = visibleRoundCount > 0 ? session?.rounds[visibleRoundCount - 1] : null;

  // shared framer-motion transition for orbit spin / stop
  const spinTransition = isSpinning
    ? { duration: 7, repeat: Infinity, ease: "linear" as const }
    : { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const };

  const toggleRound = (i: number) => {
    setExpandedRounds(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div>
      {/* Status indicator */}
      <div className="flex items-center gap-2 mb-3">
        {isAnalyzing && <Loader2 className="h-3.5 w-3.5 text-[#566163] animate-spin" />}
        {!isAnalyzing && isDone && <CheckCircle2 className="h-3.5 w-3.5 text-[#16c784]" />}
        {isAnalyzing && <span className="text-[11px] text-[#566163]">Agents are debating...</span>}
        {!isAnalyzing && isDone && <span className="text-[11px] text-[#16c784]">Consensus reached</span>}
      </div>

      {/* ── Visual Roundtable ─────────────────────────────── */}
      <div className="flex flex-col items-center pt-2 pb-4 border-b border-[#1e2223]">
        <div className="relative" style={{ width: VIS, height: VIS }}>

          {/* Orbit track + done-state connection lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={VIS} height={VIS}
          >
            {/* Gradient definitions for agent connection lines */}
            <defs>
              {ORBIT.map((a) => {
                const meta = AGENT_STYLE[a.name];
                return (
                  <radialGradient key={`glow-${a.name}`} id={`glow-${a.name}`}>
                    <stop offset="0%" stopColor={meta.color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={meta.color} stopOpacity="0" />
                  </radialGradient>
                );
              })}
            </defs>
            <circle
              cx={C} cy={C} r={R}
              fill="none"
              stroke={isSpinning ? "#1a2a20" : "#191919"}
              strokeWidth="1"
              strokeDasharray="3 6"
            />
            {isDone && ORBIT.map((a) => {
              const rad = a.angleDeg * Math.PI / 180;
              const meta = AGENT_STYLE[a.name];
              return (
                <line
                  key={a.name}
                  x1={C} y1={C}
                  x2={C + Math.cos(rad) * R}
                  y2={C + Math.sin(rad) * R}
                  stroke={meta.color}
                  strokeWidth="0.75"
                  strokeOpacity="0.25"
                />
              );
            })}
          </svg>

          {/* Center status circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={isDone ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col items-center justify-center rounded-full transition-all duration-500 ${
                isDone
                  ? "border border-[#16c784]/30 bg-[#16c784]/5"
                  : "border border-[#272c2d] bg-[#181b1c]"
              }`}
              style={{ width: 72, height: 72 }}
            >
              {isDone && verdict ? (
                <>
                  <span className={`text-[18px] font-black leading-none tracking-tight ${
                    verdict.direction === "YES" ? "text-[#16c784]" : "text-[#ff6b6b]"
                  }`}>{verdict.direction}</span>
                  <span className="text-[11px] text-[#555] tabular-nums mt-0.5 font-bold">
                    {verdict.confidence}%
                  </span>
                </>
              ) : isSpinning ? (
                <>
                  <span className="text-[10px] font-bold text-[#3b4243] leading-none">
                    R{Math.max(1, visibleRoundCount)}
                  </span>
                  <Loader2 className="h-2.5 w-2.5 text-[#32393a] animate-spin mt-1" />
                </>
              ) : analysisPhase > 0 ? (
                <span className="text-[10px] text-[#3b4243] font-medium">Done</span>
              ) : (
                <div className="flex gap-0.5">
                  {["α","β","γ"].map(a => (
                    <span key={a} className="text-[8px] text-[#272c2d] font-bold">{a}</span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Orbiting agents wrapper — rotates CW */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: isSpinning ? 360 : 0 }}
            transition={spinTransition}
          >
            {ORBIT.map((a) => {
              const rad  = a.angleDeg * Math.PI / 180;
              const x    = C + Math.cos(rad) * R - AH;
              const y    = C + Math.sin(rad) * R - AH;
              const meta = AGENT_STYLE[a.name];
              const finalVote = latestRound?.votes.find(v => v.agent === a.name);

              return (
                /* Each agent counter-rotates CCW — stays visually upright while orbiting */
                <motion.div
                  key={a.name}
                  className="absolute flex flex-col items-center"
                  style={{ left: x, top: y }}
                  animate={{ rotate: isSpinning ? -360 : 0 }}
                  transition={spinTransition}
                >
                  {/* Avatar */}
                  <div
                    className={`relative flex items-center justify-center rounded-lg text-[14px] font-black transition-all duration-500 ${meta.avatarClass}`}
                    style={{
                      width: AV, height: AV,
                      boxShadow: isDone ? `0 0 16px ${meta.glowColor}` : isSpinning ? `0 0 10px ${meta.glowColor}` : "none",
                    }}
                  >
                    {meta.avatar}
                    {/* Vote badge — shown when done */}
                    {isDone && finalVote && (
                      <span className={`absolute -bottom-1.5 -right-1.5 text-[8px] font-black px-1 rounded-sm leading-none py-[2px] ${
                        finalVote.direction === "YES"
                          ? "bg-[#16c784] text-[#0a0a0a]"
                          : "bg-[#ff6b6b] text-[#0a0a0a]"
                      }`}>{finalVote.direction}</span>
                    )}
                  </div>
                  {/* Name + role label */}
                  <span className="text-[9px] font-bold mt-1.5 leading-none select-none uppercase tracking-[0.08em]"
                    style={{ color: meta.color, opacity: 0.7 }}>
                    {a.name}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Round progress dots */}
        {session && session.rounds.length > 1 && (
          <div className="flex items-center gap-1.5 mt-2">
            {session.rounds.map((round, i) => (
              <motion.div
                key={i}
                className="h-1 rounded-full"
                initial={{ width: 6 }}
                animate={{
                  width: i < visibleRoundCount ? 16 : 6,
                  backgroundColor:
                    i < visibleRoundCount
                      ? round.consensusReached ? "#16c784" : "#566163"
                      : "#272c2d",
                  opacity: i < visibleRoundCount ? 1 : 0.25,
                }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Accordion rounds ─────────────────────────────── */}
      <div className="divide-y divide-[#1e2223]">
        {analysisPhase === 0 && (
          <div className="py-8 text-center">
            <p className="text-[11px] text-[#32393a]">Waiting for analysis...</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {session?.rounds.slice(0, visibleRoundCount).map((round, i) => {
            const isExpanded = expandedRounds.has(i);
            const isLatest   = i === visibleRoundCount - 1;
            const isLoading  = isLatest && isAnalyzing && analysisPhase < 4;

            return (
              <motion.div
                key={round.round}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={() => toggleRound(i)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#0e0e0e] transition-colors duration-150 text-left"
                >
                  <span className="shrink-0 text-[11px] font-black text-[#555] tracking-widest uppercase">
                    R{round.round}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-black text-[#16c784] tabular-nums">{round.yesCount}</span>
                    <span className="text-[10px] font-bold text-[#16c784]/40 uppercase">Yes</span>
                    <span className="text-[#222] mx-1">—</span>
                    <span className="text-[13px] font-black text-[#ff6b6b] tabular-nums">{round.noCount}</span>
                    <span className="text-[10px] font-bold text-[#ff6b6b]/40 uppercase">No</span>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 text-[#3b4243] animate-spin" />
                    ) : round.consensusReached ? (
                      <span className="text-[10px] text-[#16c784] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Consensus
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#566163]">No consensus</span>
                    )}
                    {isExpanded
                      ? <ChevronUp className="h-3 w-3 text-[#3b4243]" />
                      : <ChevronDown className="h-3 w-3 text-[#3b4243]" />
                    }
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2.5">
                        {round.votes.map((vote) => {
                          const meta = AGENT_STYLE[vote.agent];
                          return (
                            <div key={vote.agent} className="flex gap-3">
                              <div className="shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
                                <div
                                  className={`h-7 w-7 rounded-md flex items-center justify-center text-[12px] font-black ${meta.avatarClass}`}
                                  style={{ boxShadow: `0 0 8px ${meta.glowColor}` }}
                                >
                                  {meta.avatar}
                                </div>
                                <span className={`text-[10px] font-black tabular-nums ${
                                  vote.direction === "YES" ? "text-[#16c784]" : "text-[#ff6b6b]"
                                }`}>{vote.direction}</span>
                              </div>
                              <div
                                className="flex-1 min-w-0 rounded-lg px-3 py-2.5 border border-[#242829] bg-[#181b1c]"
                                style={{
                                  borderLeftWidth: 2,
                                  borderLeftColor: `${meta.color}40`,
                                }}
                              >
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-[11px] font-bold" style={{ color: meta.color }}>{vote.agent}</span>
                                  <span className="text-[10px] text-[#445e51]">{AGENT_ROLE[vote.agent]}</span>
                                  <span className="ml-auto text-[12px] text-[#666] tabular-nums font-black">{vote.confidence}%</span>
                                </div>
                                <p className="text-[11px] text-[#888] leading-relaxed">{vote.argument}</p>
                              </div>
                            </div>
                          );
                        })}
                        <div className={`mt-1 rounded-lg border px-3 py-2 ${
                          round.consensusReached
                            ? "bg-[#16c784]/5 border-[#16c784]/15"
                            : "bg-[#1b1f1f] border-[#272c2d]"
                        }`}>
                          <p className="text-[11px] text-[#555] leading-relaxed">
                            {round.consensusReached ? round.summary : round.keyDisagreement}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Final verdict */}
        <AnimatePresence>
          {isDone && session?.finalVerdict && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="px-5 py-5"
            >
              <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#16c784]" />
                  <span className="text-[10px] font-black text-[#16c784] uppercase tracking-[0.15em]">Final Verdict</span>
                </div>
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className={`text-[36px] font-black leading-none tracking-tight tabular-nums ${
                  session.finalVerdict.direction === "YES" ? "text-[#16c784]" : "text-[#ff6b6b]"
                }`}>
                  {session.finalVerdict.direction}
                </span>
                <span className={`text-[20px] font-black tabular-nums leading-none ${
                  session.finalVerdict.direction === "YES" ? "text-[#16c784]/40" : "text-[#ff6b6b]/40"
                }`}>
                  {session.finalVerdict.confidence}%
                </span>
              </div>
              <p className="text-[12px] text-[#777] leading-relaxed">
                {session.finalVerdict.summary}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
