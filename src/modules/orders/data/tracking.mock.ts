import type { EscrowStep, LogLine, OrderTracking } from "../types";

const steps: EscrowStep[] = [
  {
    id: "funded",
    label: "Step 01",
    state: "done",
    stamp: "14:22:01 UTC",
    title: "Escrow Vault Funded",
    body: "$118.50 secured in multsig smart lock via Steam Wallet authorization token.",
    foot: { icon: "verified", label: "Ledger Locked" },
  },
  {
    id: "audit",
    label: "Step 02",
    state: "done",
    stamp: "14:22:15 UTC",
    title: "Bot Security Audit",
    body: "SHA-256 payload verified. Steam Guard API check clear. Anti-phishing seal matched.",
    foot: { icon: "security", label: "API Integrity 100%" },
  },
  {
    id: "dispatched",
    label: "Awaiting User Confirmation",
    state: "active",
    stamp: "",
    title: "Trade Offer Dispatched",
    body: "Valve Steam Trade Offer #948201 dispatched. Awaiting mobile confirmation.",
    foot: { icon: "phonelink_ring", label: "Match Code: 984-KZT" },
  },
  {
    id: "settlement",
    label: "Step 04",
    state: "queued",
    stamp: "QUEUED",
    title: "Settlement & Inventory Vault",
    body: "Asset permanently bound to your linked Steam profile and escrow payout released to vendor.",
    foot: { icon: "lock_clock", label: "Pending Acceptance" },
  },
];

const telemetry: LogLine[] = [
  {
    id: "auth",
    time: "[14:22:01.108]",
    channel: "[AUTH]",
    channelTone: "cyan",
    message: [
      { text: "Payment authorization payload for " },
      { text: "$118.50 USD", tone: "primary" },
      { text: " accepted via Steam Wallet session token auth_id#3901." },
    ],
  },
  {
    id: "vault",
    time: "[14:22:08.452]",
    channel: "[VAULT]",
    channelTone: "cyan",
    message: [{ text: "Relicto Escrow Node #04 locked funds in cryptographic multi-sig vault #LT-89410-ES." }],
  },
  {
    id: "dispatch",
    time: "[14:22:15.901]",
    channel: "[BOT_DISPATCH]",
    channelTone: "amber",
    message: [
      { text: "Sentinel Bot #42 initiated trade payload with SteamID64: " },
      { text: "76561198082340192", tone: "code" },
      { text: ". Asset asset_id: 289411082 (PA Arcana)." },
    ],
  },
  {
    id: "steam-api",
    time: "[14:22:24.319]",
    channel: "[STEAM_API]",
    channelTone: "cyan",
    message: [
      { text: "Steam Web API trade offer handshake confirmed. Valve Trade Offer ID: " },
      { text: "948201", tone: "primary" },
      { text: " successfully dispatched to client profile." },
    ],
  },
  {
    id: "wait-client",
    time: "[14:22:25.002]",
    channel: "[WAIT_CLIENT]",
    channelTone: "live",
    active: true,
    message: [
      { text: "Awaiting Steam Mobile Guard 2FA verification from client. Security Token: " },
      { text: "984-KZT", tone: "amber" },
      { text: ". Automatic fail-safe timeout running." },
    ],
  },
];

export const tracking: OrderTracking = {
  code: "#LT-89410-ES",
  protocol: "Escrow Protocol",
  version: "v4.1.8-node",
  status: "In Dispatch Escrow (Step 3 of 4)",
  placedAgo: "2 min ago",
  autoCancelSeconds: 8 * 60 + 42,
  steps,
  bot: {
    name: "Relicto Sentinel Bot #42",
    level: "Steam Lvl 150",
    memberSince: "Steam Member Since 2018",
    node: "Official Relay Node",
    offerId: "#948201",
  },
  token: {
    code: "984 - KZT",
    hint: "Verify this exact code matches your Steam Mobile Authenticator prompt.",
    caution:
      "Caution: If the trade offer inside your Steam Guard app shows a different verification token or requests your items in return, do NOT confirm. Relicto Sentinel bots will never request your existing inventory.",
    offerUrl: "https://steamcommunity.com/tradeoffer/",
    instructions: [
      { step: "01.", text: "Open official ", strong: "Steam Mobile App", tail: " on iOS or Android." },
      { step: "02.", text: "Tap ", strong: "Confirmations", tail: " menu tab in navigation." },
      { step: "03.", text: "Match security token ", strong: "984-KZT", tail: " and accept gift trade." },
    ],
    latency: "18ms",
  },
  guarantee: {
    title: "100% Escrow Guarantee",
    badge: "Zero Risk",
    amount: "$118.50 USD",
    body: "are isolated in the Relicto Escrow smart settlement contract. If the bot fails to transfer the skin within the timer deadline or if Steam trade networks experience an outage, your full payment is immediately returned to your Steam Wallet with zero cancellation penalties.",
  },
  item: {
    game: "Dota 2 Arcana",
    styleNote: "Style 3 Unlocked",
    image: "/images/lootora/live-order-01.jpg",
    imageAlt: "Phantom Assassin's Manifold Paradox blades glowing turquoise and crimson",
    killsBadge: "1,420 Arcana Kills",
    variantBadge: "Corrupted Blood",
    name: "Manifold Paradox",
    slot: "Phantom Assassin Weapon & Armor Slot",
    specs: [
      { label: "Socket Gem 01", value: "Inscribed Kills" },
      { label: "Trade Lock", value: "Tradable Instantly", highlight: true },
    ],
  },
  summary: {
    lines: [
      { label: "Item Listed Value", value: 118.5, tone: "primary" },
      { label: "Relicto Escrow Protocol Fee", value: 0, tone: "free", promo: "0% PROMO" },
      { label: "Steam Sync Routing Fee", value: 0, tone: "free" },
    ],
    totalUsd: 118.5,
    totalNote: "Steam Wallet Deducted",
  },
  vendor: {
    handle: "KuroSkins",
    tag: "PRO",
    blurb: "Dota 2 & CS2 High-Tier Trader",
    avatar: "/images/lootora/live-order-02.jpg",
    avatarAlt: "KuroSkins merchant avatar with a neon visor and tactical hood",
    stats: [
      { label: "Fulfillment Avg", value: "45 Seconds" },
      { label: "Merchant Rating", value: "99.8% (4,120)", highlight: true },
    ],
  },
  telemetry: { node: "WS://ESCROW-NODE-04.LIVE", buffer: "BUFFER: 5/5 EVT", lines: telemetry },
};
