import type { ProfileMobile } from "../mobile.types";

const img = (n: number) => `/images/lootora/profile-mobile-0${n}.jpg`;

/** Mobile profile payload. Handle, avatar, level and wallet come from the session. */
export const profileMobile: ProfileMobile = {
  tier: "TIER 1",
  role: "PRO TRADER",
  ping: "0s ping",
  botId: "Bot ID #9042",
  trust: [
    { label: "Trust Score", value: "99.8%", tone: "plain", suffix: { text: "ELITE", chip: true }, note: "1,420 Completed Trades", noteTone: "secondary", truncate: true },
    { label: "Feedback Rating", value: "4.9", tone: "amber", rating: 4.9, note: "620 Verified Reviews", noteTone: "secondary", truncate: true },
    { label: "Dispute Rate", value: "0.00%", tone: "cyan", note: "Clean Arbitration Record", noteTone: "secondary" },
    { label: "Avg Dispatch", value: "42s", tone: "plain", suffix: { text: "p2p", chip: false }, note: "Instant Auto-Accept", noteTone: "cyan", live: true },
  ],
  escrow: { heldUsd: 640, pending: "2 pending sign-offs" },
  security: {
    checks: [
      { icon: "phonelink_lock", tone: "cyan", title: "Steam Mobile 2FA Authenticator", note: "Active unbroken synchronization (>180 days)", status: "check_circle" },
      { icon: "radar", tone: "crimson", title: "API Key Anti-Hijack Watchdog", note: "Autonomous domain phishing interceptor armed", status: "lock" },
    ],
    tradeUrl: "https://steamcommunity.com/tradeoffer/new/?partner=8923019&token=9xKLm2",
  },
  showcase: {
    total: 14,
    items: [
      {
        id: "bfk", slug: "butterfly-doppler", image: img(2), imageAlt: "Butterfly Knife Doppler Phase 4", tag: "CS2 • COVERT", tagTone: "cyan", priceUsd: 2140,
        name: "★ Butterfly Knife | Doppler", detail: "Phase 4 • Factory New", stat: { label: "FLOAT", value: "0.008412", tone: "cyan" }, available: true,
      },
      {
        id: "awp", slug: "awp-dragon-lore", image: img(3), imageAlt: "AWP Dragon Lore", tag: "CS2 • SOUVENIR", tagTone: "amber", priceUsd: 8950,
        name: "AWP | Dragon Lore", detail: "Field-Tested • Crown Foil", stat: { label: "FLOAT", value: "0.184109", tone: "amber" }, available: false,
      },
      {
        id: "pa", slug: "manifold-paradox", image: img(4), imageAlt: "Manifold Paradox arcana", tag: "DOTA 2 • ARCANA", tagTone: "indigo", priceUsd: 38.5,
        name: "PA | Manifold Paradox", detail: "Exalted • Style 3 Unlocked", stat: { label: "WINS", value: "142 SCORE", tone: "indigo" }, available: true,
      },
    ],
  },
  links: [
    { id: "dispatches", href: "/orders?tab=escrow", icon: "sync_alt", tone: "cyan", title: "Active Escrow Dispatches", note: "Awaiting Steam confirmation token", badge: { text: "2 ONGOING", style: "cyan-pill" } },
    { id: "ledger", href: "/orders", icon: "receipt_long", tone: "amber", title: "Trade History & Tax Ledger", note: "Downloadable CSV / Audit trail" },
    { id: "listed", href: "/sell", icon: "inventory_2", tone: "indigo", title: "My Listed Inventory", note: "Active marketplace public listings", badge: { text: "14 SKINS", style: "plain" } },
    { id: "webhooks", href: "/alerts", icon: "notifications_active", tone: "crimson", title: "Price Drop Webhooks", note: "Instant push trigger thresholds", badge: { text: "8 ARMED", style: "crimson-pill" } },
    { id: "bots", href: "/verify", icon: "smart_toy", tone: "plain", title: "API Security & Authorized Bots", note: "OAuth token whitelist management" },
  ],
  savedAccounts: 2,
  node: "Relicto INTEL NODE #412 • ENGINE V3.8.2-PRO",
};
