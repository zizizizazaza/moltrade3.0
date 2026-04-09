"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  getMarket,
  getAnalysis,
  getRelatedMarkets,
  formatVolume,
  formatCountdown,
  analysisResults,
  type Market,
  type AnalysisResult,
  type RelatedMarket,
} from "@/lib/mock-data";
import { ChatPanel } from "@/components/chat-panel";
import { AgentProcess } from "@/components/agent-process";
import { TradingPanel } from "@/components/trading-panel";
import { RelatedMarkets } from "@/components/related-markets";



export default function PredictPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);

  const isCustom = id === "custom";
  const customQuestion = searchParams.get("q") || "Custom prediction question";

  // Data
  const market: Market | null = isCustom ? null : (getMarket(id) ?? null);
  const analysis: AnalysisResult | null = isCustom
    ? analysisResults["custom-prediction"]
    : (getAnalysis(id) ?? analysisResults["custom-prediction"]);
  const relatedKey = isCustom ? "custom-prediction" : id;
  const related: RelatedMarket[] = getRelatedMarkets(relatedKey);

  const question = isCustom
    ? customQuestion
    : market?.question ?? "Prediction Market";

  // Auto-start when coming from homepage with a real question or for a known market
  const hasQuestion = isCustom ? customQuestion !== "Custom prediction question" : true;

  // Phase timer — only runs after user triggers analysis
  useEffect(() => {
    if (!hasTriggered) return;

    setIsAnalyzing(true);
    setAnalysisPhase(1);

    const t2 = setTimeout(() => setAnalysisPhase(2), 2200);
    const t3 = setTimeout(() => setAnalysisPhase(3), 4400);
    const t4 = setTimeout(() => {
      setAnalysisPhase(4);
      setIsAnalyzing(false);
    }, 7000);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [hasTriggered]);

  const handleAnalysisStart = () => {
    if (!hasTriggered) setHasTriggered(true);
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#16191a]">
      {/* ── Main dual-panel layout ────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        <div className="mx-auto max-w-[1600px] h-full flex gap-0">

          {/* ── LEFT PANEL: Chat workspace ──────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col w-full md:w-1/3 border-r border-[#212525] min-h-0"
          >
            <ChatPanel
              question={question}
              analysis={analysis}
              onAnalysisStart={handleAnalysisStart}
              isAnalyzing={isAnalyzing}
              analysisPhase={analysisPhase}
              autoStart={hasQuestion}
            />
          </motion.div>

          {/* ── RIGHT PANEL ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden md:flex flex-col flex-1 min-h-0 bg-[#111415]"
          >
            {/* ── Top: Market question + stats ── */}
            <div className="shrink-0 border-b border-[#1e2223]">
              <div className="px-6 py-5">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 mb-2">
                      {market && (
                        <span className="text-lg shrink-0">{market.imageEmoji}</span>
                      )}
                      {isCustom && (
                        <span className="text-[9px] font-bold text-[#a78bfa] uppercase tracking-[0.15em]">Custom</span>
                      )}
                    </div>
                    <h2 className="text-[22px] font-bold text-[#ededed] leading-tight tracking-[-0.02em]">{question}</h2>
                    {market && (
                      <div className="flex items-center gap-4 mt-3 text-[11px] tabular-nums text-[#555]">
                        <span>{formatVolume(market.volume)} vol</span>
                        <span className="text-[#333]">·</span>
                        <span>{formatCountdown(market.endDate)}</span>
                      </div>
                    )}
                  </div>
                  {market && (
                    <div className="shrink-0 flex items-center gap-3 pt-1">
                      <div className="text-right">
                        <span className="block text-[28px] font-black text-[#16c784] leading-none tabular-nums tracking-tight">
                          {Math.round(market.yesPrice * 100)}¢
                        </span>
                        <span className="text-[10px] font-bold text-[#16c784]/50 uppercase tracking-[0.1em]">Yes</span>
                      </div>
                      <div className="w-px h-10 bg-[#272c2d]" />
                      <div className="text-left">
                        <span className="block text-[28px] font-black text-[#ff6b6b] leading-none tabular-nums tracking-tight">
                          {Math.round(market.noPrice * 100)}¢
                        </span>
                        <span className="text-[10px] font-bold text-[#ff6b6b]/50 uppercase tracking-[0.1em]">No</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Body: 2/3 roundtable + 1/3 trade ── */}
            <div className="flex-1 min-h-0 flex">
              {/* Left 2/3: Roundtable */}
              <div className="w-2/3 min-h-0 overflow-y-auto border-r border-[#1e2223] p-4">
                <AgentProcess
                  analysis={analysis}
                  analysisPhase={analysisPhase}
                  isAnalyzing={isAnalyzing}
                />
              </div>

              {/* Right 1/3: Trade + Related Markets */}
              <div className="w-1/3 min-h-0 overflow-y-auto p-4 space-y-4">
                <TradingPanel market={market} />
                <RelatedMarkets markets={related} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
