import type { TrackerMobileData } from "../mobile.types";

const img = (n: number) => `/images/lootora/tracker-mobile-0${n}.jpg`;

/** Mobile terminal payload, as drawn in the Stitch mobile price tracker. */
export const trackerMobile: TrackerMobileData = {
  feed: [
    { id: "bfk", label: "★ BFK Doppler P4", tone: "primary", priceUsd: 3150, changePct: 4.8 },
    { id: "pa", label: "PA Arcana", tone: "secondary", priceUsd: 118.5, changePct: 12.4 },
    { id: "ak", label: "AK Case Hardened", tone: "muted", priceUsd: 420, changePct: -1.2 },
    { id: "awp", label: "AWP Dragon Lore", tone: "amber", priceUsd: 5200, changePct: 0.6 },
  ],
  telemetry: { latency: "12ms", escrow: "99.99%", bots: "2 Bots Active" },
  asset: {
    slug: "butterfly-doppler",
    rarity: "Covert CS2",
    rank: "#18 Rank",
    name: "★ Butterfly Knife",
    wear: "Factory New",
    image: img(1),
    imageAlt: "Butterfly Knife Doppler Phase 4",
    float: "0.01124801",
    meterPct: 11,
    wearBands: ["FN 0.00-0.07", "MW", "FT", "WW", "BS"],
    changePct: 4.82,
  },
  chart: {
    high: 3220,
    ema: "$3,090",
    low: 2980,
    emaPath: "M 0,85 C 50,80 80,72 130,55 C 180,42 240,48 320,28",
    candles: [
      { x: 20, wick: [65, 95], body: [70, 18], tone: "down" },
      { x: 50, wick: [60, 88], body: [65, 15], tone: "rise" },
      { x: 80, wick: [50, 78], body: [55, 16], tone: "up" },
      { x: 110, wick: [52, 82], body: [58, 14], tone: "down" },
      { x: 140, wick: [35, 70], body: [40, 24], tone: "up" },
      { x: 170, wick: [30, 60], body: [34, 18], tone: "up" },
      { x: 200, wick: [32, 55], body: [38, 10], tone: "down" },
      { x: 230, wick: [18, 48], body: [24, 18], tone: "up" },
      { x: 260, wick: [22, 44], body: [26, 12], tone: "down" },
      { x: 290, wick: [10, 38], body: [14, 18], tone: "now" },
    ],
    volume: [
      { height: 6, tone: "down", opacity: 0.4 },
      { height: 8, tone: "up", opacity: 0.5 },
      { height: 10, tone: "up", opacity: 0.6 },
      { height: 4, tone: "down", opacity: 0.5 },
      { height: 16, tone: "up", opacity: 1 },
      { height: 12, tone: "up", opacity: 0.7 },
      { height: 6, tone: "down", opacity: 0.4 },
      { height: 14, tone: "up", opacity: 0.8 },
      { height: 8, tone: "down", opacity: 0.6 },
      { height: 16, tone: "now", opacity: 1 },
    ],
  },
  phases: [
    { id: "p1", label: "Phase 1", tone: "muted", priceUsd: 2850 },
    { id: "p2", label: "Phase 2", tone: "muted", priceUsd: 3320 },
    { id: "p3", label: "Phase 3", tone: "muted", priceUsd: 2790 },
    { id: "p4", label: "Phase 4", tone: "muted", priceUsd: 3150 },
    { id: "ruby", label: "Ruby Gem", tone: "live", priceUsd: 9400 },
    { id: "sapphire", label: "Sapphire Gem", tone: "indigo", priceUsd: 12800 },
  ],
  defaultPhase: "p4",
  depth: {
    bids: [
      { venue: "Relicto Bot", priceUsd: 3140 },
      { venue: "DMarket", priceUsd: 3125 },
      { venue: "CSFloat", priceUsd: 3110 },
    ],
    asks: [
      { venue: "Floor (Relicto)", priceUsd: 3150 },
      { venue: "Buff163", priceUsd: 3158 },
      { venue: "Skinport", priceUsd: 3175 },
    ],
  },
  arbitrage: {
    title: "Arbitrage Alpha Matrix",
    cards: [
      {
        kind: "execute", id: "pa-arb", image: img(2), imageAlt: "Manifold Paradox arcana blades", name: "PA Manifold Paradox", badge: "HOT ALPHA",
        detail: "Exalted Arcana • Dota 2", net: "+$12.15 Net Flip", buy: { venue: "Relicto", priceUsd: 118.5 }, sell: { venue: "Skinport", priceUsd: 132 },
      },
      {
        kind: "route", id: "bfk-loop", image: img(3), imageAlt: "Butterfly Knife Doppler", name: "★ BFK Doppler P4", detail: "Relicto → Buff163 Loop",
        net: "+$114.40 Net", buy: { venue: "Relicto", priceUsd: 3150 }, sell: { venue: "Buff163", priceUsd: 3280 },
      },
      { kind: "compact", id: "ak-serpent", icon: "local_fire_department", name: "AK-47 | Fire Serpent", detail: "Field-Tested • Steam Liquidity", spread: "+6.1% Spread", net: "+$38.25 Net" },
    ],
  },
  relay: { title: "Telegram & Discord Relays", latency: "Push latency: 18ms", status: "ARMED" },
};
