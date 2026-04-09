"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Agent } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Brain } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
  index: number;
  isAnalyzing: boolean;
  revealDelay: number;
}

export function AgentCard({ agent, index, isAnalyzing, revealDelay }: AgentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAnalyzing) {
      // No animation, show immediately
      setRevealed(true);
      setTypedText(agent.reasoning);
      setShowKeyPoints(true);
      return;
    }

    const revealTimer = setTimeout(() => {
      setRevealed(true);
      // Start typing effect
      let charIndex = 0;
      intervalRef.current = setInterval(() => {
        charIndex++;
        setTypedText(agent.reasoning.slice(0, charIndex));
        if (charIndex >= agent.reasoning.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => setShowKeyPoints(true), 300);
        }
      }, 15);
    }, revealDelay);

    return () => {
      clearTimeout(revealTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnalyzing, revealDelay, agent.reasoning]);

  const borderColor = agent.direction === "YES" ? "border-green-500/30" : "border-red-500/30";
  const glowClass = agent.direction === "YES" ? "glow-green" : "glow-red";

  const agentAvatarClass: Record<string, string> = {
    Alpha: "bg-[#2a3031] text-[#e0e0e0]",
    Beta:  "bg-[#212627] text-[#888]",
    Gamma: "bg-[#212525] text-[#555]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: revealed ? 1 : 0.3, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`border rounded-xl overflow-hidden transition-all duration-500 ${
        revealed ? `${borderColor}` : "border-[#272c2d]"
      }`}
    >
      {/* Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${
                agentColors[agent.name] || "from-gray-500 to-gray-600"
              } text-white font-bold text-lg shadow-lg`}
            >
              {agent.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Agent {agent.name}</h3>
                {!revealed && isAnalyzing && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Brain className="h-3 w-3 animate-pulse" />
                    Thinking...
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{agent.style}</p>
            </div>
          </div>

          {/* Direction badge */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Badge
                  className={`text-sm font-bold px-3 py-1 ${
                    agent.direction === "YES"
                      ? "bg-green-500/15 text-green-400 border-green-500/30"
                      : "bg-red-500/15 text-red-400 border-red-500/30"
                  }`}
                  variant="outline"
                >
                  {agent.direction}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confidence bar */}
        {revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-semibold">{agent.confidence}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#272c2d] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${agent.confidence}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className={`h-full rounded-full ${
                  agent.direction === "YES"
                    ? "bg-[#16c784]"
                    : "bg-[#ff6b6b]"
                }`}
              />
            </div>
          </motion.div>
        )}

        {/* Reasoning text */}
        {revealed && (
          <div>
            <p
              className={`text-sm text-muted-foreground leading-relaxed ${
                !expanded && "line-clamp-3"
              }`}
            >
              {isAnalyzing ? typedText : agent.reasoning}
              {isAnalyzing && typedText.length < agent.reasoning.length && (
                <span className="typing-cursor" />
              )}
            </p>

            {/* Key points */}
            <AnimatePresence>
              {showKeyPoints && expanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 space-y-1.5 overflow-hidden"
                >
                  {agent.keyPoints.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                          agent.direction === "YES" ? "bg-green-400" : "bg-red-400"
                        }`}
                      />
                      {point}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            {/* Expand toggle */}
            {showKeyPoints && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 flex items-center gap-1 text-xs text-[#566163] hover:text-[#888] transition-colors"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" /> Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" /> More details
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Skeleton when not revealed */}
        {!revealed && isAnalyzing && (
          <div className="space-y-2 animate-pulse">
            <div className="h-2 bg-muted/30 rounded w-full" />
            <div className="h-2 bg-muted/30 rounded w-4/5" />
            <div className="h-2 bg-muted/30 rounded w-3/5" />
          </div>
        )}
      </div>

      {/* Win rate footer */}
      {revealed && (
        <div className="px-4 sm:px-5 py-2.5 border-t border-[#272c2d] bg-[#181b1c]">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{agent.styleTag}</span>
            <span className="italic">
              {agent.winRate ? `${agent.winRate}% win rate` : "Accumulating data..."}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
