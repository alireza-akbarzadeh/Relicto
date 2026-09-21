import type { AlertsMobile } from "../mobile.types";

const img = (n: number) => `/images/lootora/alerts-mobile-0${n}.jpg`;

/** Mobile sniper terminal payload, as drawn in the Stitch mobile alerts screen. */
export const alertsMobile: AlertsMobile = {
  latency: "6ms LATENCY",
  activeRules: 18,
  rulesCapacityPct: 78,
  vaultUsd: 64800,
  poll: "0.42s interval",
  rules: [
    {
      id: "bfk-snipe", kind: "snipe", game: { label: "CS2", tone: "crimson" }, category: { label: "Covert Knife", tone: "amber" },
      name: "★ Butterfly | Doppler P4", image: img(1), imageAlt: "Butterfly Knife Doppler Phase 4", armed: true,
      target: { label: "Target Snipe Threshold", value: "< $3,080.00", tone: "emerald" },
      current: { label: "Current Market", value: "$3,095.00", tone: "plain", delta: "(+$15.00)" },
      monitor: { icon: "smart_toy", iconTone: "crimson", label: "Auto-Buy Armed", labelTone: "rose", spark: "M0 8 L20 12 L40 6 L60 14 L75 10 L85 18 L100 13", sparkTone: "crimson", stat: "24H VOL: 42" },
      tags: [
        { label: "Discord", tone: "lilac", icon: "chat" },
        { label: "Auto-Exec", tone: "emerald" },
      ],
      ping: "Butterfly Doppler ping sent",
    },
    {
      id: "ak-seed", kind: "snipe", game: { label: "CS2", tone: "crimson" }, category: { label: "Seed Hunter", tone: "cyan" },
      name: "AK-47 | Case Hardened", image: img(2), imageAlt: "AK-47 Case Hardened blue gem", armed: true,
      target: { label: "Pattern Target", value: "Scar #661 / #387", tone: "amber" },
      current: { label: "Scan Mode", value: "Mempool Sniff", tone: "cyan", live: true },
      monitor: { icon: "radar", iconTone: "amber", label: "Steam Trade Escrow Guard", labelTone: "plain", spark: "M0 16 L25 14 L45 15 L65 7 L80 9 L100 4", sparkTone: "cyan", stat: "FLOAT < 0.18" },
      tags: [
        { label: "SMS Rush", tone: "amber", icon: "sms" },
        { label: "Push Alert", tone: "muted" },
      ],
      ping: "Mempool sniffer ping OK (4ms)",
    },
    {
      id: "pa-dca", kind: "dca", game: { label: "DOTA 2", tone: "cyan" }, category: { label: "Batch DCA", tone: "muted" },
      name: "PA: Manifold Paradox", image: img(3), imageAlt: "Manifold Paradox arcana", armed: true,
      target: { label: "Execution Ceiling", value: "< $112.00 / unit", tone: "emerald" },
      current: { label: "Progress", value: "8 / 10 Filled", tone: "amber", bold: true },
      progress: { label: "Batch Accumulation", value: "80% Total", pct: 80 },
      tags: [{ label: "DCA Bot Active", tone: "lilac" }],
      ping: "Batch DCA bot response: online",
    },
    {
      id: "awp-arb", kind: "arb", game: { label: "CS2", tone: "crimson" }, category: { label: "Cross-Market Arb", tone: "amber" },
      name: "AWP | Dragon Lore", image: img(4), imageAlt: "AWP Dragon Lore", armed: true,
      target: { label: "Buff163 vs Steam Spread", value: "> +12.0% Spread", tone: "emerald" },
      current: { label: "Current Spread", value: "+9.4% (Hold)", tone: "plain" },
      monitor: { icon: "sync_alt", iconTone: "cyan", label: "Auto-Arbitrage Polling", labelTone: "plain", spark: "M0 20 L20 18 L35 15 L55 16 L70 9 L85 10 L100 2", sparkTone: "emerald", stat: "POLL: 1.2s" },
      tags: [
        { label: "Telegram Alert", tone: "muted" },
        { label: "Ready", tone: "emerald" },
      ],
      ping: "Buff163 vs Steam spread synced (9.4%)",
    },
  ],
  channels: [
    { id: "telegram", icon: "send", tone: "cyan", title: "Telegram Instant Bot", handle: "@Relicto_SnipeBot_Auth", status: "LINKED" },
    { id: "discord", icon: "forum", tone: "indigo", title: "Discord Webhook Alpha", handle: "#sniper-executions (Priv)", status: "VERIFIED" },
    { id: "push", icon: "notifications_active", tone: "amber", title: "High-Priority Web Push", handle: "Direct Mobile ServiceWorker", status: "ENABLED" },
  ],
};
