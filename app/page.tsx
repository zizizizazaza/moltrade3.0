"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { markets, formatVolume, formatCountdown } from "@/lib/mock-data";
import { motion } from "framer-motion";

const CATEGORIES = ["all", "crypto", "politics", "ai", "economics", "sports"] as const;
type Filter = (typeof CATEGORIES)[number];

const FILTER_LABELS: Record<string, string> = {
  all: "All",
  crypto: "Crypto",
  politics: "Politics",
  ai: "AI",
  economics: "Economics",
  sports: "Sports",
};

const EXAMPLES = [
  "Will Bitcoin hit $200k this year?",
  "Will the Fed cut rates before summer?",
  "Will OpenAI achieve AGI in 2026?",
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [exampleIdx, setExampleIdx] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/predict/custom?q=${encodeURIComponent(q)}` : `/predict/custom`);
  };

  const visible =
    filter === "all" ? markets : markets.filter((m) => m.category === filter);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#16191a]">
      <div className="mx-auto max-w-5xl px-5 sm:px-10">

        {/* ── Hero ──────────────────────────────────── */}
        <section className="pt-16 sm:pt-28 pb-16 sm:pb-20 flex flex-col items-center text-center">
          <motion.h1
            className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#ededed] mb-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Multi-agent Prediction<br />
            <span className="text-[#4a5a55]">for Polymarket</span>
          </motion.h1>

          <motion.p
            className="text-[13px] text-[#566163] mb-10 leading-relaxed max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Three AI agents analyse every question from opposing angles — see where they agree and where they split.
          </motion.p>

          {/* Search */}
          <motion.form
            onSubmit={handleSubmit}
            className="mb-4 w-full max-w-2xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center bg-[#131313] border-2 border-[#2e3435] focus-within:border-[#16c784] transition-colors duration-200 rounded-2xl p-2 pl-5 shadow-[0_0_0_0] focus-within:shadow-[0_0_24px_rgba(22,199,132,0.07)]">
              <Search className="h-4 w-4 text-[#444] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setExampleIdx((i) => (i + 1) % EXAMPLES.length)}
                placeholder={EXAMPLES[exampleIdx]}
                className="flex-1 bg-transparent text-[15px] text-[#ededed] placeholder:text-[#3b4243] focus:outline-none py-2 px-3"
              />
              <button
                type="submit"
                className="shrink-0 flex items-center gap-1.5 bg-[#16c784] text-[#16191a] text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-[#13b571] active:bg-[#10a265] transition-colors duration-150"
              >
                Simulation
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.form>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 w-full max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <span className="text-[11px] text-[#2e2e2e]">Try:</span>
            {EXAMPLES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuery(q)}
                className="text-[11px] text-[#3a3a3a] hover:text-[#888] underline underline-offset-2 decoration-[#2e3435] hover:decoration-[#444] transition-colors duration-150"
              >
                {q}
              </button>
            ))}
          </motion.div>
        </section>

        {/* ── Markets ───────────────────────────────── */}
        <section className="pb-24">

          {/* Filter bar */}
          <motion.div
            className="flex items-center gap-1 border-b border-[#212525] pb-3 overflow-x-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <span className="text-[10px] font-semibold text-[#32393a] tracking-[0.18em] uppercase mr-3 shrink-0">
              Markets
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors duration-150 ${
                  filter === cat
                    ? "bg-[#242829] text-[#ededed]"
                    : "text-[#3a3a3a] hover:text-[#888]"
                }`}
              >
                {FILTER_LABELS[cat]}
              </button>
            ))}
            <span className="ml-auto shrink-0 text-[10px] text-[#2b3031] tabular-nums pl-4">
              {new Date().toISOString().split("T")[0].replace(/-/g, ".")}
            </span>
          </motion.div>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
            {visible.map((market, i) => (
              <motion.button
                key={market.id}
                onClick={() => router.push(`/predict/${market.id}`)}
                className="group w-full text-left bg-[#181b1c] border border-[#272c2d] hover:border-[#2e2e2e] hover:bg-[#1b1f1f] rounded-xl p-5 transition-all duration-200 flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.32 + i * 0.04 }}
              >
                {/* Top row: category + emoji */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold text-[#6b8a80] uppercase tracking-widest">
                    {FILTER_LABELS[market.category]}
                  </span>
                  <span className="text-base opacity-40">{market.imageEmoji}</span>
                </div>

                {/* Question */}
                <p className="text-[13px] font-medium text-[#888] group-hover:text-[#c8c8c8] transition-colors duration-150 leading-snug mb-5 flex-1 text-left">
                  {market.question}
                </p>

                {/* Odds bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-bold text-[#16c784] tabular-nums">
                      {Math.round(market.yesPrice * 100)}% YES
                    </span>
                    <span className="text-[12px] font-semibold text-[#444] tabular-nums">
                      {Math.round(market.noPrice * 100)}% NO
                    </span>
                  </div>
                  <div className="h-[2px] bg-[#242829] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#16c784] rounded-full"
                      style={{ width: `${Math.round(market.yesPrice * 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-[#32393a] tabular-nums">
                      Vol {formatVolume(market.volume)}
                    </span>
                    <span className="text-[10px] text-[#32393a] tabular-nums">
                      {formatCountdown(market.endDate)}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
