import type { ProfileStat, TraderIdentity } from "../types";

export const identity: TraderIdentity = {
  handle: "S1mple_CS",
  realName: "Alexey ‘V0RT3X’ Volkov",
  alias: "@vort3x_pro",
  role: "PRO VENDOR",
  tier: "TIER-1 PRO",
  steamId: "7656119808234",
  openId: "STEAM OPENID 2.0 SYNCED",
  avatar: "/images/lootora/user-profile-02.jpg",
  avatarAlt: "Portrait of an esports athlete wearing a glowing cybernetic visor",
  banner: "/images/lootora/user-profile-01.jpg",
  bannerAlt: "Neon esports lattice with Dota 2 runes and Counter-Strike smoke trails",
  telemetry: [
    { label: "BOT NODE: EU-CENTRAL-04", pulse: true },
    { label: "STEAM SESSION AUTH: VERIFIED 2048-BIT" },
    { label: "TIER-1 POWER SELLER", tone: "amber" },
  ],
  ranks: [
    { label: "STEAM LVL", value: "94", tone: "cyan", dot: true },
    { label: "CS2 PREMIER:", value: "21,450", tone: "indigo", icon: "military_tech" },
    { label: "DOTA 2:", value: "DIVINE V", tone: "amber", icon: "shield" },
  ],
  trust: { score: "99.8% TRUST SCORE", trades: "(1,482 TRADES)" },
  tradeUrl: "https://steamcommunity.com/tradeoffer/new/?partner=122046892&token=V8xQ9KzP",
  handshake: "12ms Handshake",
};

export const stats: ProfileStat[] = [
  {
    label: "Portfolio Appraisal",
    icon: "account_balance_wallet",
    tone: "amber",
    value: "$18,450.20",
    unit: { label: "USD", tone: "amber", bold: true },
    foot: { left: "142 Steam items tracked", right: "+8.4% 30d", tone: "amber", icon: "trending_up" },
  },
  {
    label: "30-Day Sales Volume",
    icon: "bar_chart",
    tone: "crimson",
    value: "$4,892.40",
    unit: { label: "USD", tone: "crimson", bold: true },
    foot: { left: "38 peer-to-peer trades", right: "100% completed", tone: "crimson" },
  },
  {
    label: "Avg Escrow Dispatch",
    icon: "speed",
    tone: "cyan",
    value: "38",
    unit: { label: "SECONDS", tone: "cyan", mono: true, bold: true },
    foot: { left: "Bot auto-confirmation", right: "Instant Escrow", tone: "cyan" },
  },
  {
    label: "Reputation Rating",
    icon: "star",
    tone: "indigo",
    value: "4.98",
    unit: { label: "/ 5.0", tone: "muted" },
    foot: { left: "Based on 412 reviews", right: "Tier-1 Elite", tone: "indigo" },
  },
];
