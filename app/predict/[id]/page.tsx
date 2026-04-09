"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

import { ArrowLeft, ExternalLink } from "lucide-react";

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
  const [rightTab, setRightTab] = useState<"debate" | "markets">("debate");
  const [expandedMarketId, setExpandedMarketId] = useState<string | null>(null);
  const [tradeDirection, setTradeDirection] = useState<"YES" | "NO">("YES");
  const [tradeAmount, setTradeAmount] = useState("");

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
      {/* ── Top bar ──────────────────────────────── */}
      <div className="shrink-0 border-b border-[#212525] bg-[#16191a] px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-[1600px] flex items-center gap-4">
          {/* Back */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[12px] text-[#566163] hover:text-[#888] transition-colors shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Markets</span>
          </Link>

          <div className="h-3.5 w-px bg-[#2e3435] shrink-0" />

          {/* Market info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {market && (
              <span className="text-base shrink-0 opacity-60">{market.imageEmoji}</span>
            )}
            <h1 className="text-[13px] font-medium text-[#a0a0a0] truncate">{question}</h1>
            {isCustom && (
              <span className="shrink-0 text-[10px] font-medium text-[#566163] bg-[#242829] border border-[#2e3435] px-2 py-0.5 rounded-md">
                Custom
              </span>
            )}
          </div>

          {/* Stats */}
          {market && (
            <div className="hidden md:flex items-center gap-4 shrink-0 text-[11px] text-[#566163] tabular-nums">
              <span>{formatVolume(market.volume)} vol</span>
              <span>{formatCountdown(market.endDate)}</span>
              <span className="text-[#16c784] font-bold">
                YES {Math.round(market.yesPrice * 100)}¢
              </span>
              <span className="text-[#ff6b6b] font-bold">
                NO {Math.round(market.noPrice * 100)}¢
              </span>
              <a
                href={`https://polymarket.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[#888] transition-colors"
              >
                Polymarket
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ── Main dual-panel layout ────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        <div className="mx-auto max-w-[1600px] h-full flex gap-0">

          {/* ── LEFT PANEL: Chat workspace ──────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col w-full md:w-[45%] lg:w-[40%] border-r border-[#212525] min-h-0"
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

          {/* ── RIGHT PANEL: Tabs ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden md:flex flex-col flex-1 min-h-0 bg-[#131717]"
          >
            {/* Tab bar */}
            <div className="shrink-0 flex items-center border-b border-[#1e2223] px-4 pt-1">
              {(["debate", "markets"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightTab(tab)}
                  className={`relative px-3 py-3 text-[12px] font-medium transition-colors duration-150 ${rightTab === tab
                      ? "text-[#ededed]"
                      : "text-[#445e51] hover:text-[#888]"
                    }`}
                >
                  {tab === "debate" ? "Roundtable" : "Markets"}
                  {rightTab === tab && (
                    <motion.div
                      layoutId="right-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#16c784]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 min-h-0 overflow-y-auto">

              {/* ── Tab 1: Roundtable Debate ── */}
              {rightTab === "debate" && (
                <div className="p-4">
                  <AgentProcess
                    analysis={analysis}
                    analysisPhase={analysisPhase}
                    isAnalyzing={isAnalyzing}
                  />
                </div>
              )}

              {/* ── Tab 2: Related Markets + Trade ── */}
              {rightTab === "markets" && (
                <div className="p-3 space-y-1.5">
                  {related.length === 0 && (
                    <p className="text-center text-[11px] text-[#2b3031] py-10">No related markets found</p>
                  )}

                  {related.map((m) => {
                    const isOpen = expandedMarketId === m.id;
                    const price = tradeDirection === "YES" ? m.yesPrice : m.noPrice;
                    const numAmt = parseFloat(tradeAmount) || 0;
                    const shares = numAmt > 0 ? (numAmt / price).toFixed(1) : null;
                    const ret = numAmt > 0 ? (numAmt / price).toFixed(2) : null;

                    return (
                      <div key={m.id} className={`rounded-xl border overflow-hidden transition-colors duration-150 ${isOpen ? "border-[#16c784]/25 bg-[#16c784]/3" : "border-[#272c2d] bg-[#181b1c]"
                        }`}>

                        {/* ─ Row header ─ */}
                        <button
                          onClick={() => {
                            setExpandedMarketId(isOpen ? null : m.id);
                            setTradeDirection("YES");
                            setTradeAmount("");
                          }}
                          className="w-full text-left p-3 flex items-start gap-2.5 hover:bg-white/[0.015] transition-colors"
                        >
                          <span className="text-sm shrink-0 opacity-50 mt-0.5">{m.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[12px] font-medium leading-snug ${isOpen ? "text-[#e0e0e0]" : "text-[#888]"
                              } ${!isOpen && "line-clamp-2"}`}>{m.question}</p>
                            {!isOpen && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[11px] font-bold text-[#16c784] tabular-nums shrink-0">{Math.round(m.yesPrice * 100)}%</span>
                                <div className="flex-1 h-[2px] bg-[#252525] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#16c784] rounded-full" style={{ width: `${m.yesPrice * 100}%` }} />
                                </div>
                                <span className="text-[11px] font-bold text-[#ff6b6b] tabular-nums shrink-0">{Math.round(m.noPrice * 100)}%</span>
                                <span className="text-[10px] text-[#445e51] tabular-nums ml-1">{formatVolume(m.volume)}</span>
                              </div>
                            )}
                          </div>
                          <span className={`shrink-0 mt-0.5 text-[10px] transition-transform duration-200 ${isOpen ? "rotate-180 text-[#16c784]" : "text-[#2b3031]"
                            }`}>▾</span>
                        </button>

                        {/* ─ Expanded content ─ */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-4 border-t border-[#16c784]/10 pt-3 space-y-3">

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-2">
                                  <div className="bg-[#141616] border border-[#212525] rounded-lg px-2.5 py-2">
                                    <p className="text-[9px] text-[#445e51] uppercase tracking-wider mb-0.5">Volume</p>
                                    <p className="text-[12px] font-bold text-[#e0e0e0] tabular-nums">{formatVolume(m.volume)}</p>
                                  </div>
                                  <div className="bg-[#141616] border border-[#212525] rounded-lg px-2.5 py-2">
                                    <p className="text-[9px] text-[#445e51] uppercase tracking-wider mb-0.5">Closes</p>
                                    <p className="text-[12px] font-bold text-[#e0e0e0]">{formatCountdown(m.endDate)}</p>
                                  </div>
                                  <div className="bg-[#141616] border border-[#212525] rounded-lg px-2.5 py-2">
                                    <p className="text-[9px] text-[#445e51] uppercase tracking-wider mb-0.5">Spread</p>
                                    <p className="text-[12px] font-bold text-[#e0e0e0] tabular-nums">{Math.round(m.yesPrice * 100)}/{Math.round(m.noPrice * 100)}¢</p>
                                  </div>
                                </div>

                                {/* Odds bar with labels */}
                                <div>
                                  <div className="h-[3px] bg-[#252525] rounded-full overflow-hidden mb-1.5">
                                    <div className="h-full bg-[#16c784] rounded-full" style={{ width: `${m.yesPrice * 100}%` }} />
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-[10px] font-bold text-[#16c784] tabular-nums">YES {Math.round(m.yesPrice * 100)}%</span>
                                    <span className="text-[10px] font-bold text-[#ff6b6b] tabular-nums">NO {Math.round(m.noPrice * 100)}%</span>
                                  </div>
                                </div>

                                {/* Option selector */}
                                <div className="grid grid-cols-2 gap-1.5">
                                  <button
                                    onClick={() => setTradeDirection("YES")}
                                    className={`py-2.5 rounded-lg text-[12px] font-bold transition-all ${tradeDirection === "YES"
                                        ? "bg-[#16c784]/15 text-[#16c784] border border-[#16c784]/35"
                                        : "bg-[#1b1f1f] text-[#566163] border border-[#272c2d] hover:border-[#2e3435]"
                                      }`}
                                  >
                                    YES &mdash; {Math.round(m.yesPrice * 100)}¢
                                  </button>
                                  <button
                                    onClick={() => setTradeDirection("NO")}
                                    className={`py-2.5 rounded-lg text-[12px] font-bold transition-all ${tradeDirection === "NO"
                                        ? "bg-[#ff6b6b]/10 text-[#ff6b6b] border border-[#ff6b6b]/30"
                                        : "bg-[#1b1f1f] text-[#566163] border border-[#272c2d] hover:border-[#2e3435]"
                                      }`}
                                  >
                                    NO &mdash; {Math.round(m.noPrice * 100)}¢
                                  </button>
                                </div>

                                {/* Amount input */}
                                <div>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#445e51] text-[13px]">$</span>
                                    <input
                                      type="number"
                                      value={tradeAmount}
                                      onChange={(e) => setTradeAmount(e.target.value)}
                                      placeholder="0.00"
                                      min="0"
                                      className="w-full bg-[#141616] border border-[#272c2d] rounded-lg pl-6 pr-3 py-2.5 text-[13px] text-[#e0e0e0] placeholder:text-[#2b3031] focus:outline-none focus:border-[#16c784]/40 transition-colors"
                                    />
                                  </div>
                                  <div className="flex gap-1 mt-1.5">
                                    {[10, 25, 50, 100].map((v) => (
                                      <button
                                        key={v}
                                        onClick={() => setTradeAmount(v.toString())}
                                        className="flex-1 py-1 text-[10px] text-[#445e51] bg-[#181b1c] hover:bg-[#1e2223] border border-[#272c2d] rounded transition-colors"
                                      >
                                        ${v}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Return preview */}
                                {shares && ret && (
                                  <div className="flex items-center justify-between text-[11px] px-1">
                                    <span className="text-[#445e51]">{shares} shares</span>
                                    <span className={tradeDirection === "YES" ? "text-[#16c784] font-semibold" : "text-[#ff6b6b] font-semibold"}>
                                      Max return ${ret}
                                    </span>
                                  </div>
                                )}

                                {/* Buy button */}
                                <button
                                  disabled={numAmt <= 0}
                                  onClick={() => alert(`Demo: ${tradeDirection} $${tradeAmount} on "${m.question}"`)}
                                  className={`w-full py-2.5 rounded-lg text-[13px] font-bold transition-all ${numAmt > 0
                                      ? tradeDirection === "YES"
                                        ? "bg-[#16c784] text-[#0e0e0e] hover:bg-[#13b571]"
                                        : "bg-[#ff6b6b] text-[#0e0e0e] hover:bg-[#e55]"
                                      : "bg-[#1b1f1f] text-[#2b3031] border border-[#272c2d] cursor-not-allowed"
                                    }`}
                                >
                                  {numAmt > 0 ? `Buy ${tradeDirection} — $${tradeAmount}` : "Enter amount"}
                                </button>

                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
