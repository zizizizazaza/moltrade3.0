"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Market } from "@/lib/mock-data";
import {
  ArrowRightLeft,
  Wallet,
  Info,
  TrendingUp,
} from "lucide-react";

interface TradingPanelProps {
  market: Market | null;
}

export function TradingPanel({ market }: TradingPanelProps) {
  const [direction, setDirection] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("");

  const price = market
    ? direction === "YES"
      ? market.yesPrice
      : market.noPrice
    : direction === "YES"
    ? 0.65
    : 0.35;

  const numAmount = parseFloat(amount) || 0;

  const calculation = useMemo(() => {
    if (numAmount <= 0) return null;
    const shares = numAmount / price;
    const potentialReturn = shares * 1.0; // Each share pays $1 if correct
    const profit = potentialReturn - numAmount;
    const platformFee = numAmount * 0.005; // 0.5%
    return {
      shares: shares.toFixed(1),
      potentialReturn: potentialReturn.toFixed(2),
      profit: profit.toFixed(2),
      roi: ((profit / numAmount) * 100).toFixed(0),
      platformFee: platformFee.toFixed(2),
    };
  }, [numAmount, price]);

  const handleTrade = () => {
    alert(
      `🎉 Demo: Would place ${direction} bet of $${amount} at ${(
        price * 100
      ).toFixed(0)}¢ per share`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl overflow-hidden border border-[#272c2d] bg-[#161919]"
    >

      {/* Header */}
        <div className="px-4 py-3 border-b border-[#272c2d]">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-3.5 w-3.5 text-[#555]" />
            <h3 className="font-black text-[12px] text-[#999] uppercase tracking-[0.1em]">Trade</h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Direction toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDirection("YES")}
            className={`py-3 rounded-lg text-[13px] font-black tracking-wide transition-all ${
              direction === "YES"
                ? "bg-[#16c784]/15 text-[#16c784] border border-[#16c784]/40"
                : "bg-[#1b1f1f] text-[#555] border border-[#272c2d] hover:border-[#333]"
            }`}
          >
            YES {market ? `${Math.round(market.yesPrice * 100)}¢` : "65¢"}
          </button>
          <button
            onClick={() => setDirection("NO")}
            className={`py-3 rounded-lg text-[13px] font-black tracking-wide transition-all ${
              direction === "NO"
                ? "bg-[#ff6b6b]/12 text-[#ff6b6b] border border-[#ff6b6b]/35"
                : "bg-[#1b1f1f] text-[#555] border border-[#272c2d] hover:border-[#333]"
            }`}
          >
            NO {market ? `${Math.round(market.noPrice * 100)}¢` : "35¢"}
          </button>
        </div>

        {/* Amount input */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">
            Amount (USDC)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="1"
              className="w-full bg-[#1b1f1f] border border-[#2e3435] rounded-lg pl-7 pr-3 py-2.5 text-[13px] text-[#e0e0e0] focus:outline-none focus:border-[#16c784]/50 transition-colors placeholder:text-[#3b4243]"
            />
          </div>
          {/* Quick amounts */}
          <div className="flex gap-1.5 mt-2">
            {[10, 25, 50, 100].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v.toString())}
                className="flex-1 py-1 text-xs text-muted-foreground bg-muted/30 hover:bg-muted/50 rounded transition-colors"
              >
                ${v}
              </button>
            ))}
          </div>
        </div>

        {/* Calculation */}
        {calculation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2 pt-2 border-t border-border/20"
          >
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Shares</span>
              <span>{calculation.shares}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg Price</span>
              <span>{(price * 100).toFixed(0)}¢</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                Platform Fee
                <Info className="h-3 w-3" />
              </span>
              <span>${calculation.platformFee}</span>
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-border/20">
              <span className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Potential Return
              </span>
              <span className="text-green-400 font-semibold">
                ${calculation.potentialReturn}{" "}
                <span className="text-green-400/70">(+{calculation.roi}%)</span>
              </span>
            </div>
          </motion.div>
        )}

        {/* Submit */}
        <Button
          onClick={handleTrade}
          disabled={numAmount <= 0}
          className={`w-full py-5 font-black text-[13px] tracking-wide border-0 transition-all ${
            numAmount > 0
              ? direction === "YES"
                ? "bg-[#16c784] hover:bg-[#13b571] text-[#0a0a0a]"
                : "bg-[#ff6b6b] hover:bg-[#e55a5a] text-[#0a0a0a]"
              : "bg-[#1e2223] text-[#444]"
          }`}
        >
          {numAmount > 0 ? (
            <>
              Buy {direction} — ${amount}
            </>
          ) : (
            <span className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Enter amount to trade
            </span>
          )}
        </Button>

        <p className="text-[10px] text-center text-muted-foreground/60">
          Trades execute on Polymarket via Polygon (USDC.e)
        </p>
      </div>
    </motion.div>
  );
}
