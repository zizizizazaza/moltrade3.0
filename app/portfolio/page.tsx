"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { positions, formatCountdown } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  PieChart,
  DollarSign,
  Activity,
} from "lucide-react";

type TabType = "active" | "history";

export default function PortfolioPage() {
  const [tab, setTab] = useState<TabType>("active");

  const activePositions = positions.filter((p) => p.status === "active");
  const totalInvested = activePositions.reduce(
    (sum, p) => sum + p.investedAmount,
    0
  );
  const totalValue = activePositions.reduce(
    (sum, p) => sum + p.currentValue,
    0
  );
  const totalPnL = totalValue - totalInvested;
  const totalPnLPercent =
    totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const winCount = activePositions.filter((p) => p.pnl > 0).length;
  const winRate =
    activePositions.length > 0
      ? Math.round((winCount / activePositions.length) * 100)
      : 0;

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 hero-gradient pointer-events-none opacity-30" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <PieChart className="h-7 w-7 text-violet-400" />
            Portfolio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your prediction market positions
          </p>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Total Value
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">
              ${totalValue.toFixed(2)}
            </p>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              {totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className="text-xs text-muted-foreground">
                Total P&L
              </span>
            </div>
            <p
              className={`text-xl sm:text-2xl font-bold ${
                totalPnL >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
            </p>
            <p
              className={`text-xs ${
                totalPnL >= 0
                  ? "text-green-400/70"
                  : "text-red-400/70"
              }`}
            >
              {totalPnLPercent >= 0 ? "+" : ""}
              {totalPnLPercent.toFixed(1)}%
            </p>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Invested</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">
              ${totalInvested.toFixed(2)}
            </p>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Win Rate</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{winRate}%</p>
            <p className="text-xs text-muted-foreground">
              {winCount}/{activePositions.length} positions
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-1 mb-6 bg-muted/30 rounded-lg p-1 w-fit"
        >
          <button
            onClick={() => setTab("active")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              tab === "active"
                ? "bg-violet-500/20 text-violet-300 shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Active ({activePositions.length})
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              tab === "history"
                ? "bg-violet-500/20 text-violet-300 shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            History
          </button>
        </motion.div>

        {/* Positions list */}
        <div className="space-y-3">
          {tab === "active" &&
            activePositions.map((pos, i) => (
              <motion.div
                key={pos.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
              >
                <Link href={`/predict/${pos.marketId}`}>
                  <div className="glass-card rounded-xl p-4 sm:p-5 hover:scale-[1.01] transition-all duration-200 cursor-pointer group">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      {/* Left: question + direction */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-2 py-0.5 ${
                              pos.direction === "YES"
                                ? "bg-green-500/15 text-green-400 border-green-500/30"
                                : "bg-red-500/15 text-red-400 border-red-500/30"
                            }`}
                          >
                            {pos.direction}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatCountdown(pos.endDate)}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium truncate group-hover:text-violet-200 transition-colors">
                          {pos.question}
                        </h3>
                      </div>

                      {/* Right: P&L + values */}
                      <div className="flex items-center gap-6 sm:gap-8 shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Invested
                          </p>
                          <p className="text-sm font-medium">
                            ${pos.investedAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Current
                          </p>
                          <p className="text-sm font-medium">
                            ${pos.currentValue.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="text-xs text-muted-foreground">P&L</p>
                          <p
                            className={`text-sm font-bold flex items-center justify-end gap-1 ${
                              pos.pnl >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {pos.pnl >= 0 ? "+" : ""}$
                            {pos.pnl.toFixed(2)}
                            <span className="text-xs font-normal opacity-70">
                              ({pos.pnl >= 0 ? "+" : ""}
                              {pos.pnlPercent.toFixed(1)}%)
                            </span>
                          </p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

          {tab === "history" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-xl p-8 text-center"
            >
              <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                No settled positions yet
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Your resolved trades will appear here
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
