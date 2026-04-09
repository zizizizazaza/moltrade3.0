"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { type AnalysisResult, type DebateSession, debateSessions } from "@/lib/mock-data";
import { useState } from "react";

// ── Visual constants ─────────────────────────────────────────
const VIS = 192;   // visual box px
const R   = 68;    // orbit radius px
const C   = VIS / 2;
const AV  = 30;    // avatar size px
const AH  = AV / 2;

const ORBIT = [
  { name: "Alpha", angleDeg: -90  }, // top
  { name: "Beta",  angleDeg: 30   }, // bottom-right
  { name: "Gamma", angleDeg: 150  }, // bottom-left
];

const AGENT_STYLE: Record<string, { avatar: string; avatarClass: string }> = {
  Alpha: { avatar: "α", avatarClass: "bg-[#2a3031] text-[#e0e0e0]" },
  Beta:  { avatar: "β", avatarClass: "bg-[#212627] text-[#888]" },
  Gamma: { avatar: "γ", avatarClass: "bg-[#212525] text-[#666]" },
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
            <circle
              cx={C} cy={C} r={R}
              fill="none"
              stroke="#191919"
              strokeWidth="1"
              strokeDasharray="3 6"
            />
            {isDone && ORBIT.map((a) => {
              const rad = a.angleDeg * Math.PI / 180;
              return (
                <line
                  key={a.name}
                  x1={C} y1={C}
                  x2={C + Math.cos(rad) * R}
                  y2={C + Math.sin(rad) * R}
                  stroke="#16c784"
                  strokeWidth="0.75"
                  strokeOpacity="0.18"
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
              style={{ width: 56, height: 56 }}
            >
              {isDone && verdict ? (
                <>
                  <span className={`text-[14px] font-bold leading-none ${
                    verdict.direction === "YES" ? "text-[#16c784]" : "text-[#ff6b6b]"
                  }`}>{verdict.direction}</span>
                  <span className="text-[10px] text-[#555] tabular-nums mt-0.5">
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
                    className={`relative flex items-center justify-center rounded-lg text-[11px] font-bold transition-all duration-500 ${meta.avatarClass} ${
                      isDone ? "ring-1 ring-white/5 shadow-sm shadow-[#16c784]/10" : ""
                    }`}
                    style={{ width: AV, height: AV }}
                  >
                    {meta.avatar}
                    {/* Vote badge — shown when done */}
                    {isDone && finalVote && (
                      <span className={`absolute -bottom-1.5 -right-1 text-[7px] font-black px-0.5 rounded-sm leading-none py-[1px] ${
                        finalVote.direction === "YES"
                          ? "bg-[#16c784] text-[#16191a]"
                          : "bg-[#ff6b6b] text-[#16191a]"
                      }`}>{finalVote.direction}</span>
                    )}
                  </div>
                  {/* Name label */}
                  <span className="text-[8px] text-[#32393a] font-medium mt-1 leading-none select-none">
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
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#0e0e0e] transition-colors duration-150 text-left"
                >
                  <span className="shrink-0 text-[10px] font-bold text-[#3b4243] bg-[#212525] border border-[#2b3031] rounded-md px-1.5 py-0.5 tracking-widest uppercase">
                    R{round.round}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold text-[#16c784]">{round.yesCount} YES</span>
                    <span className="text-[#282828]">·</span>
                    <span className="text-[12px] font-bold text-[#ff6b6b]">{round.noCount} NO</span>
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
                      <div className="px-4 pb-3 space-y-2">
                        {round.votes.map((vote) => {
                          const meta = AGENT_STYLE[vote.agent];
                          return (
                            <div key={vote.agent} className="flex gap-3">
                              <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
                                <div className={`h-6 w-6 rounded-md flex items-center justify-center text-[11px] font-bold ${meta.avatarClass}`}>
                                  {meta.avatar}
                                </div>
                                <span className={`text-[9px] font-bold tabular-nums ${
                                  vote.direction === "YES" ? "text-[#16c784]" : "text-[#ff6b6b]"
                                }`}>{vote.direction}</span>
                              </div>
                              <div className="flex-1 min-w-0 bg-[#181b1c] rounded-lg px-3 py-2 border border-[#242829]">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="text-[10px] font-semibold text-[#555]">{vote.agent}</span>
                                  <span className="text-[9px] text-[#32393a]">{AGENT_ROLE[vote.agent]}</span>
                                  <span className="ml-auto text-[10px] text-[#3b4243] tabular-nums">{vote.confidence}%</span>
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
              className={`px-4 py-4 ${
                session.finalVerdict.direction === "YES"
                  ? "bg-[#16c784]/5"
                  : "bg-[#ff6b6b]/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16c784]" />
                <span className="text-[11px] font-bold text-[#16c784] uppercase tracking-wider">Final Verdict</span>
                <span className={`ml-auto text-[14px] font-bold tabular-nums ${
                  session.finalVerdict.direction === "YES" ? "text-[#16c784]" : "text-[#ff6b6b]"
                }`}>
                  {session.finalVerdict.direction} · {session.finalVerdict.confidence}%
                </span>
              </div>
              <p className="text-[11px] text-[#666] leading-relaxed">
                {session.finalVerdict.summary}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
