import type { Endorsement, Review, StatusRow } from "../types";

export const security: StatusRow[] = [
  {
    id: "steam-guard",
    icon: "smartphone",
    iconTone: "amber",
    title: "Steam Guard Mobile",
    detail: "2FA Authenticator active > 120 days",
    status: "ACTIVE",
    statusTone: "amber",
  },
  {
    id: "api-watchdog",
    icon: "key",
    iconTone: "indigo",
    title: "API Revocation Watchdog",
    detail: "Phishing redirection interception",
    status: "PROTECTED",
    statusTone: "indigo",
  },
  {
    id: "trade-hold",
    icon: "timer_off",
    iconTone: "cyan",
    title: "Trade Hold Cooldown",
    detail: "No penalty or escrow lock",
    status: "0 DAYS",
    statusTone: "cyan",
  },
];

export const lastHandshake = "Last verified handshake with Valve Steam API: 4 mins ago";

export const endorsements: Endorsement[] = [
  { label: "Instant Escrow Delivery Speed", value: "99.9%", pct: 99.9, tone: "amber" },
  { label: "Accurate Float & Pattern Details", value: "100.0%", pct: 100, tone: "crimson" },
  { label: "Buyer In-App Communication", value: "99.2%", pct: 99.2, tone: "indigo" },
];

export const reviews: Review[] = [
  {
    id: "shroud-fanatic",
    author: "shroud_fanatic",
    age: "2 hours ago",
    quote: "Instant bot dispatch, got the Arcana in 30 seconds! Safest trade yet.",
  },
  {
    id: "kennys-clutch",
    author: "kennys_clutch",
    age: "Yesterday",
    quote: "Legit seller, item matches exact float. Smooth P2P transfer.",
  },
  {
    id: "vortex-trader",
    author: "vortex_trader",
    age: "2 days ago",
    quote: "Float and pattern index matched the listing exactly. Escrow released instantly.",
  },
  {
    id: "dota-broker",
    author: "dota_broker",
    age: "4 days ago",
    quote: "Bought two immortals in one bundle, both delivered before I closed the tab.",
  },
];

/** "Linked Steam & API" tab. */
export const linked: StatusRow[] = [
  {
    id: "steam-openid",
    icon: "verified_user",
    iconTone: "amber",
    title: "Steam OpenID 2.0",
    detail: "Signed in as 7656119808234 • Session renewed 4 mins ago",
    status: "LINKED",
    statusTone: "amber",
  },
  {
    id: "web-api-key",
    icon: "key",
    iconTone: "indigo",
    title: "Steam Web API Key",
    detail: "Scoped to inventory reads and trade offer dispatch",
    status: "SCOPED",
    statusTone: "indigo",
  },
  {
    id: "trade-url",
    icon: "swap_horiz",
    iconTone: "cyan",
    title: "Trade Offer URL",
    detail: "Partner 122046892 • Token rotated 6 days ago",
    status: "VALID",
    statusTone: "cyan",
  },
  {
    id: "webhooks",
    icon: "account_tree",
    iconTone: "crimson",
    title: "Price Alert Webhooks",
    detail: "2 endpoints receiving floor movement events",
    status: "2 ACTIVE",
    statusTone: "crimson",
  },
];

/** "Escrow Safeguards" tab. */
export const safeguards: StatusRow[] = [
  {
    id: "bot-escrow",
    icon: "smart_toy",
    iconTone: "cyan",
    title: "Bot Escrow Custody",
    detail: "Items held by node EU-CENTRAL-04 until payment clears",
    status: "ENABLED",
    statusTone: "cyan",
  },
  {
    id: "float-lock",
    icon: "lock",
    iconTone: "amber",
    title: "Float & Pattern Lock",
    detail: "Delivered asset must match the listed float exactly",
    status: "ENFORCED",
    statusTone: "amber",
  },
  {
    id: "payout-hold",
    icon: "shield",
    iconTone: "indigo",
    title: "Payout Fraud Hold",
    detail: "Manual review over $2,500 per single settlement",
    status: "$2,500",
    statusTone: "indigo",
  },
  {
    id: "dispute",
    icon: "gavel",
    iconTone: "crimson",
    title: "Dispute Window",
    detail: "Buyer claims accepted for 24h after escrow release",
    status: "24 HOURS",
    statusTone: "crimson",
  },
];
