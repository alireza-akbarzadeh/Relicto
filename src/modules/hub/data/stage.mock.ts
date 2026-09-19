import type { GameId, GameTab, HubPulse, Spotlight } from "../types";

export const pulse: HubPulse = {
  event: "TI 2025 QUALIFIERS // PGL COPENHAGEN",
  syncedAgo: "8m",
  liquidityUsd: 3_250_000,
  volatilityPct: 14.2,
};

export const games: GameTab[] = [
  { id: "dota", title: "Dota 2 Meta Hub", caption: "PATCH 7.38c LIVE", captionTone: "amber", live: true },
  { id: "cs2", title: "CS2 Tactical Hub", caption: "COPENHAGEN 128T", captionTone: "muted" },
  { id: "cross", title: "Cross-Game Arbitrage", caption: "SKIN CORRELATIONS", captionTone: "muted" },
];

export const spotlights: Record<GameId, Spotlight> = {
  dota: {
    badges: [
      { label: "PATCH 7.38c DOMINANCE", variant: "solid" },
      { label: "CORRELATION: R=0.88", variant: "amber" },
      { label: "TI 2025 META", variant: "cyan" },
    ],
    title: { lead: "Carry Resurgence: ", highlight: "Mortred & Anti-Mage", tail: " Floor Surge" },
    summary:
      "Following Valve’s recent +15% Coup de Grace lethal scaling and battlefury pacing buffs, tournament hard carries have witnessed an explosive +18.4% draft pick rate. This spike directly correlates with hyper-liquidity in signature cosmetics across the Relicto network.",
    metrics: [
      { label: "Pick Frequency", value: "+18.4%", valueTone: "white", note: "High contested", noteTone: "crimson", strong: true },
      { label: "Winrate Ratio", value: "53.8%", valueTone: "cyan", note: "+4.1% post-patch", noteTone: "muted" },
      { label: "Arcana Floor Delta", value: "+12.4%", valueTone: "amber", note: "30d historic high", noteTone: "amber" },
    ],
    primaryCta: { label: "Inspect Arcana Floor ($118.50)", href: "/marketplace?q=Manifold%20Paradox" },
    secondaryCta: { label: "Financial Delta Log", href: "#patch-delta" },
    chart: {
      title: "PA Winrate vs Manifold Arcana",
      window: "7-DAY LIVE",
      peak: "$118.50",
      peakLabel: "ALL-TIME HIGH V2",
      series: ["Market Floor", "Pro Winrate"],
      volume: "VOL: 3,420 TRADES/24H",
    },
  },
  cs2: {
    badges: [
      { label: "COPENHAGEN MAJOR", variant: "solid" },
      { label: "CORRELATION: R=0.81", variant: "amber" },
      { label: "128-TICK META", variant: "cyan" },
    ],
    title: { lead: "AWP Economy Shift: ", highlight: "Mirage & Dust2", tail: " Sniper Premium" },
    summary:
      "Copenhagen’s map pool rotation pushed primary AWPers to a 61% round share on Mirage and Dust2. Souvenir sniper skins dropped in those finals now clear at a sustained premium across the Relicto order book.",
    metrics: [
      { label: "AWP Round Share", value: "61.0%", valueTone: "white", note: "Major record", noteTone: "crimson", strong: true },
      { label: "Souvenir Premium", value: "+22.6%", valueTone: "cyan", note: "+6.3% post-finals", noteTone: "muted" },
      { label: "Covert Floor Delta", value: "+9.8%", valueTone: "amber", note: "90d historic high", noteTone: "amber" },
    ],
    primaryCta: { label: "Inspect Souvenir Floor ($5,200.00)", href: "/marketplace?q=Dragon%20Lore" },
    secondaryCta: { label: "Financial Delta Log", href: "#patch-delta" },
    chart: {
      title: "AWP Pick Rate vs Dragon Lore",
      window: "7-DAY LIVE",
      peak: "$5,200",
      peakLabel: "MAJOR FINALS HIGH",
      series: ["Market Floor", "Pro Pick Rate"],
      volume: "VOL: 1,180 TRADES/24H",
    },
  },
  cross: {
    badges: [
      { label: "CROSS-GAME SPREAD", variant: "solid" },
      { label: "CORRELATION: R=0.74", variant: "amber" },
      { label: "ARBITRAGE WINDOW", variant: "cyan" },
    ],
    title: { lead: "Liquidity Rotation: ", highlight: "Arcanas → Covert Rifles", tail: " Spread Opens" },
    summary:
      "Traders cashing out Dota 2 arcana gains are rotating into CS2 covert rifles within 48 hours. The lag between both floors leaves a measurable spread for escrow-backed swaps on the Relicto network.",
    metrics: [
      { label: "Rotation Volume", value: "+31.2%", valueTone: "white", note: "Week over week", noteTone: "crimson", strong: true },
      { label: "Median Lag", value: "41h", valueTone: "cyan", note: "-6h since 7.38c", noteTone: "muted" },
      { label: "Open Spread", value: "+7.4%", valueTone: "amber", note: "After escrow fees", noteTone: "amber" },
    ],
    primaryCta: { label: "Scan Arbitrage Pairs", href: "/marketplace" },
    secondaryCta: { label: "Financial Delta Log", href: "#patch-delta" },
    chart: {
      title: "Arcana Floor vs Covert Rifle Index",
      window: "7-DAY LIVE",
      peak: "+7.4%",
      peakLabel: "SPREAD PEAK",
      series: ["Arcana Index", "Covert Index"],
      volume: "VOL: 5,960 SWAPS/24H",
    },
  },
};
