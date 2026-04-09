// ============================================================
// MoltTrade Mock Data
// ============================================================

export interface Market {
  id: string;
  question: string;
  category: "crypto" | "politics" | "sports" | "ai" | "economics";
  yesPrice: number;
  noPrice: number;
  volume: number;
  endDate: string;
  imageEmoji: string;
  status: "active" | "resolved";
}

export interface Agent {
  name: string;
  style: string;
  styleTag: string;
  avatar: string;
  color: string;
  direction: "YES" | "NO";
  confidence: number;
  reasoning: string;
  keyPoints: string[];
  winRate: number | null;
}

export interface Consensus {
  direction: "YES" | "NO";
  confidence: number;
  summary: string;
  keyDisagreement: string;
}

export interface AnalysisResult {
  marketId: string;
  timestamp: string;
  agents: Agent[];
  consensus: Consensus;
}

export interface Position {
  id: string;
  marketId: string;
  question: string;
  direction: "YES" | "NO";
  shares: number;
  avgPrice: number;
  currentPrice: number;
  investedAmount: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  endDate: string;
  status: "active" | "settled";
  settledResult?: "won" | "lost";
}

// ── Markets ──────────────────────────────────────────────────

export const markets: Market[] = [
  {
    id: "fed-rate-cut-july-2026",
    question: "Will the Fed cut interest rates before July 2026?",
    category: "economics",
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 2_450_000,
    endDate: "2026-07-01T00:00:00Z",
    imageEmoji: "🏦",
    status: "active",
  },
  {
    id: "btc-200k-2026",
    question: "Will Bitcoin exceed $200,000 by end of 2026?",
    category: "crypto",
    yesPrice: 0.32,
    noPrice: 0.68,
    volume: 8_920_000,
    endDate: "2026-12-31T00:00:00Z",
    imageEmoji: "₿",
    status: "active",
  },
  {
    id: "eth-etf-staking",
    question: "Will the SEC approve ETH ETF staking by Q3 2026?",
    category: "crypto",
    yesPrice: 0.78,
    noPrice: 0.22,
    volume: 3_100_000,
    endDate: "2026-09-30T00:00:00Z",
    imageEmoji: "⟠",
    status: "active",
  },
  {
    id: "us-ai-regulation-2026",
    question: "Will the US pass comprehensive AI regulation in 2026?",
    category: "ai",
    yesPrice: 0.41,
    noPrice: 0.59,
    volume: 1_670_000,
    endDate: "2026-12-31T00:00:00Z",
    imageEmoji: "🤖",
    status: "active",
  },
  {
    id: "trump-approval-50",
    question: "Will Trump's approval rating exceed 50% by June 2026?",
    category: "politics",
    yesPrice: 0.29,
    noPrice: 0.71,
    volume: 5_340_000,
    endDate: "2026-06-30T00:00:00Z",
    imageEmoji: "🇺🇸",
    status: "active",
  },
  {
    id: "world-cup-2026-winner",
    question: "Will Brazil win the 2026 FIFA World Cup?",
    category: "sports",
    yesPrice: 0.18,
    noPrice: 0.82,
    volume: 12_500_000,
    endDate: "2026-07-19T00:00:00Z",
    imageEmoji: "⚽",
    status: "active",
  },
  {
    id: "openai-agi-2026",
    question: "Will OpenAI announce AGI achievement in 2026?",
    category: "ai",
    yesPrice: 0.12,
    noPrice: 0.88,
    volume: 4_200_000,
    endDate: "2026-12-31T00:00:00Z",
    imageEmoji: "🧠",
    status: "active",
  },
  {
    id: "sol-flip-eth",
    question: "Will Solana's market cap surpass Ethereum in 2026?",
    category: "crypto",
    yesPrice: 0.15,
    noPrice: 0.85,
    volume: 6_780_000,
    endDate: "2026-12-31T00:00:00Z",
    imageEmoji: "◎",
    status: "active",
  },
];

// ── Agent Personalities ──────────────────────────────────────

const agentAlpha: Omit<Agent, "direction" | "confidence" | "reasoning" | "keyPoints"> = {
  name: "Alpha",
  style: "On-Chain Data Analyst",
  styleTag: "Data-Driven",
  avatar: "α",
  color: "#3B82F6",
  winRate: null,
};

const agentBeta: Omit<Agent, "direction" | "confidence" | "reasoning" | "keyPoints"> = {
  name: "Beta",
  style: "Macro Economist",
  styleTag: "Conservative",
  avatar: "β",
  color: "#8B5CF6",
  winRate: null,
};

const agentGamma: Omit<Agent, "direction" | "confidence" | "reasoning" | "keyPoints"> = {
  name: "Gamma",
  style: "Sentiment & Technical",
  styleTag: "Contrarian",
  avatar: "γ",
  color: "#F59E0B",
  winRate: null,
};

// ── Analysis Results ─────────────────────────────────────────

export const analysisResults: Record<string, AnalysisResult> = {
  "fed-rate-cut-july-2026": {
    marketId: "fed-rate-cut-july-2026",
    timestamp: "2026-04-08T09:30:00Z",
    agents: [
      {
        ...agentAlpha,
        direction: "YES",
        confidence: 72,
        reasoning:
          "On-chain stablecoin flows show significant accumulation in rate-sensitive DeFi protocols over the past 30 days. Institutional wallet activity on Aave and Compound has increased 34%, historically correlated with anticipated rate cuts.",
        keyPoints: [
          "Stablecoin TVL in lending protocols up 34% in 30 days",
          "Smart money positioning heavily in rate-sensitive assets",
          "Treasury yield curve inversion has deepened",
        ],
      },
      {
        ...agentBeta,
        direction: "YES",
        confidence: 58,
        reasoning:
          "Latest CPI data shows continued deceleration to 2.3%, and labor market indicators are showing cooling signals. However, the Fed rhetoric remains hawkish, and services inflation is sticky. A cut is likely but not certain.",
        keyPoints: [
          "CPI decelerated to 2.3%, approaching 2% target",
          "Non-farm payrolls showing slowdown trend",
          "Fed rhetoric remains cautious — risk of delay",
        ],
      },
      {
        ...agentGamma,
        direction: "NO",
        confidence: 61,
        reasoning:
          "Twitter and Reddit sentiment is overwhelmingly bullish on rate cuts — historically, such consensus is a contrarian indicator. Options market is pricing in only 1 cut, not the 2-3 cuts the crowd expects. The crowd will be disappointed.",
        keyPoints: [
          "Social media sentiment too uniformly bullish (82% YES)",
          "CME FedWatch only pricing 1 cut vs crowd expecting 2-3",
          "Historical pattern: extreme consensus often gets faded",
        ],
      },
    ],
    consensus: {
      direction: "YES",
      confidence: 64,
      summary:
        "2 vs 1 majority leans YES, but Gamma's contrarian view on sentiment overheating deserves attention. Moderate confidence — the macro case is solid, but the crowd may be too far ahead.",
      keyDisagreement:
        "Alpha and Beta focus on fundamental data trends supporting a cut. Gamma warns that extreme market consensus historically precedes reversals.",
    },
  },
  "btc-200k-2026": {
    marketId: "btc-200k-2026",
    timestamp: "2026-04-08T09:30:00Z",
    agents: [
      {
        ...agentAlpha,
        direction: "NO",
        confidence: 68,
        reasoning:
          "On-chain data shows long-term holders (LTH) have been distributing steadily since BTC crossed $120k. Exchange inflows have spiked 45% in the past 2 weeks, a classic distribution pattern. The supply dynamics don't support a 2x from here.",
        keyPoints: [
          "LTH distribution accelerating above $120k",
          "Exchange inflows spiked 45% — selling pressure building",
          "Miners selling post-halving profit at accelerated rate",
        ],
      },
      {
        ...agentBeta,
        direction: "NO",
        confidence: 55,
        reasoning:
          "A $200k BTC implies a $4T market cap, which would require massive new capital inflows. While ETF demand is strong, global liquidity conditions are tightening. Possible but requires a perfect macro storm.",
        keyPoints: [
          "$200k = $4T market cap, ambitious target",
          "ETF inflows strong but plateauing",
          "Global M2 growth slowing",
        ],
      },
      {
        ...agentGamma,
        direction: "YES",
        confidence: 74,
        reasoning:
          "The market is in a classic mid-cycle consolidation. Social media sentiment is bearish which is actually bullish. The halving supply shock hasn't fully played out yet. Every cycle, people underestimate the blow-off top.",
        keyPoints: [
          "Mid-cycle consolidation, not a top",
          "Bearish retail sentiment = contrarian buy signal",
          "Halving supply shock still in early innings",
        ],
      },
    ],
    consensus: {
      direction: "NO",
      confidence: 56,
      summary:
        "2 vs 1 lean NO, but with low conviction. Alpha sees distribution, Beta sees valuation constraints, but Gamma's cycle thesis is compelling. This is a genuine split — proceed with caution.",
      keyDisagreement:
        "Alpha and Beta see structural headwinds at current prices. Gamma argues the market is mid-cycle and the blow-off top is yet to come.",
    },
  },
  "eth-etf-staking": {
    marketId: "eth-etf-staking",
    timestamp: "2026-04-08T09:30:00Z",
    agents: [
      {
        ...agentAlpha,
        direction: "YES",
        confidence: 82,
        reasoning:
          "On-chain governance proposals from major ETF issuers show active preparation for staking integration. BlackRock's ETHA fund wallet has been testing staking transactions on testnet. This is happening.",
        keyPoints: [
          "BlackRock ETHA wallet active on staking testnet",
          "3 major issuers filed S-1 amendments for staking",
          "Lido and Rocket Pool TVL surging in anticipation",
        ],
      },
      {
        ...agentBeta,
        direction: "YES",
        confidence: 71,
        reasoning:
          "The regulatory environment has shifted dramatically. The new SEC chair has signaled openness to staking within ETF structures. The precedent set by commodity ETFs holding yield-bearing instruments supports approval.",
        keyPoints: [
          "New SEC chair publicly supportive of innovation",
          "Legal precedent exists for yield-bearing ETFs",
          "Bipartisan Congressional support for crypto reform",
        ],
      },
      {
        ...agentGamma,
        direction: "YES",
        confidence: 85,
        reasoning:
          "Market sentiment has shifted from skepticism to expectation. Options markets are heavily positioned for ETH outperformance. The smart money is all-in on this trade — and for once, the smart money is right.",
        keyPoints: [
          "ETH/BTC ratio breakout confirms rotation",
          "Options skew heavily favoring call side",
          "Institutional reports unanimously bullish on approval",
        ],
      },
    ],
    consensus: {
      direction: "YES",
      confidence: 79,
      summary:
        "Rare unanimous agreement: all 3 agents lean YES with high confidence. Regulatory, on-chain, and sentiment data all align. This is one of the highest conviction calls.",
      keyDisagreement:
        "Minimal disagreement. Main risk is regulatory surprise or political shift, but all current indicators point toward approval.",
    },
  },
  // Generic fallback for user-submitted questions
  "custom-prediction": {
    marketId: "custom-prediction",
    timestamp: new Date().toISOString(),
    agents: [
      {
        ...agentAlpha,
        direction: "YES",
        confidence: 62,
        reasoning:
          "Based on available on-chain and market data, there are moderate signals supporting a positive outcome. Key metrics show early-stage trend formation that historically precedes significant moves.",
        keyPoints: [
          "Data patterns show emerging positive trend",
          "Smart money positioning favors this outcome",
          "Historical precedents suggest 60%+ probability",
        ],
      },
      {
        ...agentBeta,
        direction: "NO",
        confidence: 54,
        reasoning:
          "From a macroeconomic perspective, the current environment creates significant headwinds. While the fundamental thesis has merit, the timing may be premature given prevailing market conditions.",
        keyPoints: [
          "Macro headwinds create uncertainty",
          "Timing risk is the primary concern",
          "Fundamental case is sound but premature",
        ],
      },
      {
        ...agentGamma,
        direction: "YES",
        confidence: 67,
        reasoning:
          "Sentiment analysis reveals an interesting divergence — public perception is skeptical, which often precedes positive surprises. Technical indicators suggest a breakout pattern forming.",
        keyPoints: [
          "Contrarian sentiment signal is bullish",
          "Technical breakout pattern forming",
          "Social media skepticism = opportunity",
        ],
      },
    ],
    consensus: {
      direction: "YES",
      confidence: 61,
      summary:
        "2 vs 1 lean YES with moderate confidence. Alpha and Gamma see positive signals, while Beta urges caution on timing. A balanced position with defined risk is advisable.",
      keyDisagreement:
        "Alpha/Gamma see emerging positive trends. Beta is concerned about macro timing and premature positioning.",
    },
  },
};

// ── Portfolio / Positions ────────────────────────────────────

export const positions: Position[] = [
  {
    id: "pos_001",
    marketId: "fed-rate-cut-july-2026",
    question: "Will the Fed cut interest rates before July 2026?",
    direction: "YES",
    shares: 150,
    avgPrice: 0.62,
    currentPrice: 0.65,
    investedAmount: 93.0,
    currentValue: 97.5,
    pnl: 4.5,
    pnlPercent: 4.84,
    endDate: "2026-07-01T00:00:00Z",
    status: "active",
  },
  {
    id: "pos_002",
    marketId: "eth-etf-staking",
    question: "Will the SEC approve ETH ETF staking by Q3 2026?",
    direction: "YES",
    shares: 200,
    avgPrice: 0.71,
    currentPrice: 0.78,
    investedAmount: 142.0,
    currentValue: 156.0,
    pnl: 14.0,
    pnlPercent: 9.86,
    endDate: "2026-09-30T00:00:00Z",
    status: "active",
  },
  {
    id: "pos_003",
    marketId: "btc-200k-2026",
    question: "Will Bitcoin exceed $200,000 by end of 2026?",
    direction: "NO",
    shares: 100,
    avgPrice: 0.65,
    currentPrice: 0.68,
    investedAmount: 65.0,
    currentValue: 68.0,
    pnl: 3.0,
    pnlPercent: 4.62,
    endDate: "2026-12-31T00:00:00Z",
    status: "active",
  },
  {
    id: "pos_004",
    marketId: "us-ai-regulation-2026",
    question: "Will the US pass comprehensive AI regulation in 2026?",
    direction: "NO",
    shares: 80,
    avgPrice: 0.55,
    currentPrice: 0.59,
    investedAmount: 44.0,
    currentValue: 47.2,
    pnl: 3.2,
    pnlPercent: 7.27,
    endDate: "2026-12-31T00:00:00Z",
    status: "active",
  },
  {
    id: "pos_005",
    marketId: "sol-flip-eth",
    question: "Will Solana's market cap surpass Ethereum in 2026?",
    direction: "YES",
    shares: 300,
    avgPrice: 0.12,
    currentPrice: 0.15,
    investedAmount: 36.0,
    currentValue: 45.0,
    pnl: 9.0,
    pnlPercent: 25.0,
    endDate: "2026-12-31T00:00:00Z",
    status: "active",
    settledResult: undefined,
  },
];

// ── Helpers ──────────────────────────────────────────────────

export function getMarket(id: string): Market | undefined {
  return markets.find((m) => m.id === id);
}

export function getAnalysis(id: string): AnalysisResult | undefined {
  return analysisResults[id];
}

export function formatVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function formatCountdown(endDate: string): string {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 30) return `${Math.floor(days / 30)}mo left`;
  if (days > 0) return `${days}d left`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `${hours}h left`;
}

// ── Debate Round types ───────────────────────────────────────

export interface DebateVote {
  agent: string;   // "Alpha" | "Beta" | "Gamma"
  direction: "YES" | "NO";
  confidence: number;
  argument: string;
}

export interface DebateRound {
  round: number;
  votes: DebateVote[];
  yesCount: number;
  noCount: number;
  consensusReached: boolean;
  summary?: string;           // only when consensusReached
  keyDisagreement?: string;   // only when not yet reached
}

export interface DebateSession {
  marketId: string;
  rounds: DebateRound[];
  finalVerdict?: {
    direction: "YES" | "NO";
    confidence: number;
    summary: string;
  };
}

// ── Debate Data ──────────────────────────────────────────────

export const debateSessions: Record<string, DebateSession> = {
  "fed-rate-cut-july-2026": {
    marketId: "fed-rate-cut-july-2026",
    rounds: [
      {
        round: 1,
        votes: [
          {
            agent: "Alpha",
            direction: "YES",
            confidence: 72,
            argument: "Stablecoin flows into rate-sensitive DeFi protocols up 34%. Smart money is already positioned for a cut.",
          },
          {
            agent: "Beta",
            direction: "YES",
            confidence: 58,
            argument: "CPI decelerated to 2.3%. Labor market showing cooling signals. Macro fundamentals support a cut.",
          },
          {
            agent: "Gamma",
            direction: "NO",
            confidence: 61,
            argument: "Social consensus is 82% YES — historically a contrarian sell. CME FedWatch prices only 1 cut, not the 2–3 the crowd expects.",
          },
        ],
        yesCount: 2,
        noCount: 1,
        consensusReached: false,
        keyDisagreement: "Gamma's contrarian sentiment read contradicts Alpha & Beta's fundamental case. Split 2–1, proceeding to Round 2.",
      },
      {
        round: 2,
        votes: [
          {
            agent: "Alpha",
            direction: "YES",
            confidence: 74,
            argument: "Gamma's sentiment point is valid but data leads sentiment. On-chain positioning is still accumulating. Holding YES.",
          },
          {
            agent: "Beta",
            direction: "YES",
            confidence: 63,
            argument: "Reviewed Gamma's CME FedWatch argument. Even 1 cut before July is a YES outcome. Increasing conviction.",
          },
          {
            agent: "Gamma",
            direction: "YES",
            confidence: 55,
            argument: "Conceding — if even 1 cut counts, the bar is lower than I thought. Switching to YES with low conviction. The crowd might be right this time.",
          },
        ],
        yesCount: 3,
        noCount: 0,
        consensusReached: true,
        summary: "Unanimous YES after Gamma updated its reading of the resolution criteria. Moderate confidence — 64% aggregate.",
      },
    ],
    finalVerdict: {
      direction: "YES",
      confidence: 64,
      summary: "Consensus reached in Round 2. Macro and on-chain data both support a cut; Gamma's contrarian view dissolved once resolution criteria were clarified.",
    },
  },
  "btc-200k-2026": {
    marketId: "btc-200k-2026",
    rounds: [
      {
        round: 1,
        votes: [
          {
            agent: "Alpha",
            direction: "NO",
            confidence: 68,
            argument: "LTH distribution accelerating above $120k. Exchange inflows spiked 45%. Classic distribution — supply side is bearish.",
          },
          {
            agent: "Beta",
            direction: "NO",
            confidence: 55,
            argument: "$200k requires $4T market cap. ETF inflows plateauing, global liquidity tightening. Possible but requires a perfect macro storm.",
          },
          {
            agent: "Gamma",
            direction: "YES",
            confidence: 74,
            argument: "Retail sentiment is bearish — contrarian buy. Halving supply shock still in early innings. Every cycle, bears underestimate the blow-off top.",
          },
        ],
        yesCount: 1,
        noCount: 2,
        consensusReached: false,
        keyDisagreement: "Gamma alone is bullish. Alpha & Beta see structural headwinds. Split 2–1 NO: proceeding to Round 2.",
      },
      {
        round: 2,
        votes: [
          {
            agent: "Alpha",
            direction: "NO",
            confidence: 70,
            argument: "Gamma's cycle thesis is compelling but the on-chain distribution data is hard to ignore. Staying NO — the supply data hasn't changed.",
          },
          {
            agent: "Beta",
            direction: "NO",
            confidence: 57,
            argument: "Gamma raises valid cycle points, but $4T market cap is a hard constraint. Even with halving tailwinds, macro headwinds are real.",
          },
          {
            agent: "Gamma",
            direction: "YES",
            confidence: 76,
            argument: "Both agents are anchoring on current supply. But cycle tops happen precisely when distribution is happening. Not changing my view.",
          },
        ],
        yesCount: 1,
        noCount: 2,
        consensusReached: true,
        summary: "Majority NO (2–1) maintained after debate. Gamma's cycle thesis acknowledged but not enough to shift consensus. Low conviction call.",
      },
    ],
    finalVerdict: {
      direction: "NO",
      confidence: 56,
      summary: "Persistent 2–1 split. Majority NO after 2 rounds. Gamma's contrarian view is a minority signal worth monitoring — low conviction outcome.",
    },
  },
  "custom-prediction": {
    marketId: "custom-prediction",
    rounds: [
      {
        round: 1,
        votes: [
          {
            agent: "Alpha",
            direction: "YES",
            confidence: 62,
            argument: "Data patterns show early-stage trend formation. Smart money positioning is net long on this outcome.",
          },
          {
            agent: "Beta",
            direction: "NO",
            confidence: 54,
            argument: "Macro headwinds create uncertainty. The fundamental case has merit but the timing is premature.",
          },
          {
            agent: "Gamma",
            direction: "YES",
            confidence: 67,
            argument: "Public skepticism is a contrarian buy signal. Technical breakout pattern forming. This is an opportunity.",
          },
        ],
        yesCount: 2,
        noCount: 1,
        consensusReached: true,
        summary: "2–1 majority YES. Alpha and Gamma see positive signals; Beta urges caution but is outvoted. Moderate confidence.",
      },
    ],
    finalVerdict: {
      direction: "YES",
      confidence: 61,
      summary: "Consensus reached in Round 1 (2–1). Positive signals outweigh macro concerns. Proceed with defined risk.",
    },
  },
};

export const categoryLabels: Record<Market["category"], string> = {
  crypto: "Crypto",
  politics: "Politics",
  sports: "Sports",
  ai: "AI & Tech",
  economics: "Economics",
};

export const categoryEmojis: Record<Market["category"], string> = {
  crypto: "🪙",
  politics: "🏛️",
  sports: "⚽",
  ai: "🤖",
  economics: "📊",
};

// ── Chat Message Types ───────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "system" | "agent-alpha" | "agent-beta" | "agent-gamma" | "consensus";
  content: string;
  timestamp: string;
  agentMeta?: {
    direction?: "YES" | "NO";
    confidence?: number;
  };
}

// ── Related Markets ──────────────────────────────────────────

export interface RelatedMarket {
  id: string;
  question: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  endDate: string;
  emoji: string;
}

export const relatedMarketsMap: Record<string, RelatedMarket[]> = {
  "fed-rate-cut-july-2026": [
    { id: "fed-25bps", question: "Will the first cut be 25bps (not 50)?", yesPrice: 0.72, noPrice: 0.28, volume: 1_200_000, endDate: "2026-07-01T00:00:00Z", emoji: "📉" },
    { id: "fed-2-cuts", question: "Will there be 2+ rate cuts in 2026?", yesPrice: 0.38, noPrice: 0.62, volume: 980_000, endDate: "2026-12-31T00:00:00Z", emoji: "✂️" },
    { id: "sp500-5500", question: "Will S&P 500 exceed 6,500 by end of 2026?", yesPrice: 0.44, noPrice: 0.56, volume: 2_100_000, endDate: "2026-12-31T00:00:00Z", emoji: "📈" },
    { id: "us-recession", question: "Will US enter recession in 2026?", yesPrice: 0.19, noPrice: 0.81, volume: 3_400_000, endDate: "2026-12-31T00:00:00Z", emoji: "🔻" },
  ],
  "btc-200k-2026": [
    { id: "btc-150k", question: "Will Bitcoin exceed $150k by end of 2026?", yesPrice: 0.55, noPrice: 0.45, volume: 5_600_000, endDate: "2026-12-31T00:00:00Z", emoji: "📊" },
    { id: "btc-100k-floor", question: "Will BTC stay above $100k for all of H2 2026?", yesPrice: 0.61, noPrice: 0.39, volume: 3_200_000, endDate: "2026-12-31T00:00:00Z", emoji: "🛡️" },
    { id: "btc-dominance-60", question: "Will BTC dominance exceed 60% in 2026?", yesPrice: 0.35, noPrice: 0.65, volume: 1_800_000, endDate: "2026-12-31T00:00:00Z", emoji: "👑" },
    { id: "btc-etf-100b", question: "Will BTC ETF AUM exceed $100B?", yesPrice: 0.68, noPrice: 0.32, volume: 2_900_000, endDate: "2026-12-31T00:00:00Z", emoji: "🏦" },
  ],
  "eth-etf-staking": [
    { id: "eth-5k", question: "Will ETH exceed $5,000 in 2026?", yesPrice: 0.47, noPrice: 0.53, volume: 4_100_000, endDate: "2026-12-31T00:00:00Z", emoji: "💎" },
    { id: "eth-btc-ratio", question: "Will ETH/BTC ratio recover above 0.05?", yesPrice: 0.42, noPrice: 0.58, volume: 2_300_000, endDate: "2026-12-31T00:00:00Z", emoji: "⚖️" },
    { id: "eth-staking-yield", question: "Will ETH staking yield exceed 5% APR?", yesPrice: 0.29, noPrice: 0.71, volume: 890_000, endDate: "2026-12-31T00:00:00Z", emoji: "💰" },
  ],
  "custom-prediction": [
    { id: "generic-1", question: "Will this trend continue for 30 days?", yesPrice: 0.55, noPrice: 0.45, volume: 450_000, endDate: "2026-12-31T00:00:00Z", emoji: "📈" },
    { id: "generic-2", question: "Will market sentiment shift this quarter?", yesPrice: 0.48, noPrice: 0.52, volume: 320_000, endDate: "2026-09-30T00:00:00Z", emoji: "🔄" },
  ],
};

// ── Preset Quick Instructions ────────────────────────────────

export const quickInstructions = [
  { label: "On-chain focus", prompt: "Focus on on-chain data and whale movements for this analysis." },
  { label: "Macro focus", prompt: "Prioritize macroeconomic factors and policy implications." },
  { label: "Sentiment analysis", prompt: "Weight social media sentiment and crowd behavior heavily." },
  { label: "Risk assessment", prompt: "Provide a detailed risk assessment with downside scenarios." },
  { label: "Short-term outlook", prompt: "Focus on short-term (1-2 week) price action and catalysts." },
];

export function getRelatedMarkets(id: string): RelatedMarket[] {
  return relatedMarketsMap[id] || relatedMarketsMap["custom-prediction"] || [];
}
