"use client";

import { motion } from "framer-motion";
import { type RelatedMarket, formatVolume, formatCountdown } from "@/lib/mock-data";
import { Layers } from "lucide-react";

interface RelatedMarketsProps {
  markets: RelatedMarket[];
  onSelectMarket?: (market: RelatedMarket) => void;
}

export function RelatedMarkets({ markets, onSelectMarket }: RelatedMarketsProps) {
  if (markets.length === 0) return null;

  return (
    <div className="border border-[#272c2d] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#212525] flex items-center gap-2">
        <Layers className="h-4 w-4 text-[#445e51]" />
        <h3 className="text-[13px] font-semibold text-[#a0a0a0]">Related Markets</h3>
        <span className="text-[11px] text-[#445e51] ml-auto tabular-nums">
          {markets.length} markets
        </span>
      </div>

      <div className="p-2 space-y-1.5">
        {markets.map((market, i) => (
          <motion.button
            key={market.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onSelectMarket?.(market)}
            className="w-full text-left p-3 rounded-lg hover:bg-[#1b1f1f] transition-colors group cursor-pointer"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-base mt-0.5 opacity-50">{market.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium leading-snug text-[#888] group-hover:text-[#c0c0c0] transition-colors line-clamp-2">
                  {market.question}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-[#16c784] font-semibold tabular-nums">
                    {Math.round(market.yesPrice * 100)}% YES
                  </span>
                  <div className="flex-1 h-[2px] rounded-full bg-[#242829] overflow-hidden max-w-[60px]">
                    <div
                      className="h-full bg-[#16c784] rounded-full"
                      style={{ width: `${market.yesPrice * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#ff6b6b] font-semibold tabular-nums">
                    {Math.round(market.noPrice * 100)}% NO
                  </span>
                  <span className="text-[10px] text-[#445e51] ml-auto tabular-nums">
                    {formatVolume(market.volume)}
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
