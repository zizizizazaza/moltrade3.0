"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Consensus } from "@/lib/mock-data";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ConsensusBlockProps {
  consensus: Consensus;
  visible: boolean;
}

export function ConsensusBlock({ consensus, visible }: ConsensusBlockProps) {
  const isYes = consensus.direction === "YES";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className={`rounded-xl overflow-hidden border ${
            isYes ? "border-green-500/30" : "border-red-500/30"
          }`}
        >
          {/* Header */}
          <div
            className={`px-5 py-3 flex items-center gap-3 ${
              isYes
                ? "bg-gradient-to-r from-green-500/15 to-green-500/5"
                : "bg-gradient-to-r from-red-500/15 to-red-500/5"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                isYes ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <Shield
                className={`h-4 w-4 ${isYes ? "text-green-400" : "text-red-400"}`}
              />
            </div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-sm">Multi-Agent Consensus</h3>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`text-lg font-bold ${
                  isYes ? "text-green-400" : "text-red-400"
                }`}
              >
                {consensus.direction} @ {consensus.confidence}%
              </motion.span>
            </div>
          </div>

          {/* Body */}
          <div className="glass-card p-5 space-y-4 border-0 rounded-none">
            {/* Summary */}
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {consensus.summary}
              </p>
            </div>

            {/* Key disagreement */}
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-amber-400 mb-1">
                  Key Disagreement
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {consensus.keyDisagreement}
                </p>
              </div>
            </div>

            {/* Confidence meter */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Consensus Strength</span>
                <span className="font-medium">
                  {consensus.confidence >= 75
                    ? "🟢 Strong"
                    : consensus.confidence >= 55
                    ? "🟡 Moderate"
                    : "🔴 Weak"}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${consensus.confidence}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                  className={`h-full rounded-full ${
                    isYes
                      ? "bg-gradient-to-r from-green-600 to-green-400"
                      : "bg-gradient-to-r from-red-600 to-red-400"
                  }`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
