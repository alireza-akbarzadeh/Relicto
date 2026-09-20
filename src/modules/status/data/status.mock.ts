import type { IconName } from "@/components/ui/icon";

export type PopularRelic = {
  slug: string;
  kicker: string;
  name: string;
  detail: string;
  floorUsd: number;
  tone: "crimson" | "indigo" | "amber" | "cyan";
};

/** Node telemetry printed across the diagnostic pages. */
export const TELEMETRY = {
  relay: "SG-04",
  ticks: "128.00",
  route: "relicto.gg/market/item/butterfly-fade-seed-999",
  cluster: "SG-04 (Singapore Edge Relay v4.2)",
  timestamp: "2025-05-18 14:32:09 UTC [EPOCH-HEX]",
};

export const POPULAR_RELICS: PopularRelic[] = [
  { slug: "butterfly-doppler", kicker: "CS2 // COVERT", name: "★ Butterfly Knife", detail: "Doppler Phase 4 • Factory New", floorUsd: 3150, tone: "crimson" },
  { slug: "manifold-paradox", kicker: "DOTA 2 // ARCANA", name: "Manifold Paradox", detail: "Phantom Assassin • Exalted LVL 3", floorUsd: 118.5, tone: "indigo" },
  { slug: "awp-fade", kicker: "CS2 // CONTRABAND", name: "AWP | Dragon Lore", detail: "Cobblestone Relic • Field-Tested", floorUsd: 5200, tone: "amber" },
  { slug: "ak-case-hardened", kicker: "TIER 1 BLUE GEM", name: "AK-47 | Case Hardened", detail: "Scar Pattern #661 • Well-Worn", floorUsd: 3250, tone: "cyan" },
];

export type LockdownRow = { icon: IconName; label: string; value: string; note?: string; tone: "code" | "primary" | "amber" | "plain" | "cyan" };

/** 403 vault lockdown copy. */
export const LOCKDOWN = {
  nodeId: "LTR-VALVE-7033",
  protocol: "PROTOCOL: AEGIS_GATEWAY_V4.8",
  hash: "HASH: #7F8B-403",
  rows: [
    { icon: "report_problem", label: "Reason Code", value: "ERR_STEAM_GUARD_COOLDOWN_ACTIVE", tone: "code" },
    { icon: "account_circle", label: "Account Identifier", value: "@s1mple_cs", note: "Pro Trader #8492", tone: "primary" },
    { icon: "military_tech", label: "Required Tier", value: "Tier 1 Verified Arbitrageur", tone: "amber" },
    { icon: "phonelink_lock", label: "Current Security Level", value: "Standard Steam OpenID (Mobile Auth < 7 Days)", tone: "plain" },
    { icon: "gavel", label: "Escrow Safeguard", value: "Multi-Sig Vault Protection Engaged", tone: "cyan" },
  ] satisfies LockdownRow[],
  cooldown: { label: "Cooldown Clearance Timeline", value: "3 of 7 Days Elapsed (57% Locked)", pct: 57 },
  steps: [
    {
      icon: "check_circle" as IconName,
      title: "Enable Steam Guard Mobile Authenticator",
      body: "Install official Steam App on iOS or Android and bind your authenticating device.",
    },
    {
      icon: "check_circle" as IconName,
      title: "Bind Trade URL & Steam API Key",
      body: "Link your Steam Trade Token to Relicto for zero-delay escrow verification.",
    },
    {
      icon: "timelapse" as IconName,
      title: "Clear 7-Day Valve New Device Hold",
      body: "Valve requires 168 hours of continuous 2FA device binding without token resets.",
    },
    {
      icon: "check_circle" as IconName,
      title: "Verify Secondary Email & SMS Dispatch",
      body: "Provide dual-channel fallback dispatch for emergency multi-sig unlocks.",
    },
  ],
  footer: ["RELICTO ENGINE: v4.2.1-RELEASE", "ENCRYPTION: AES-256-GCM", "SIGNATURE: RADIANT_AEGIS_SIG_OK"] as const,
  auditId: "SECURE AUDIT LOG ID: 0x84A09FD32",
};

/** 502 / 503 upstream outage copy. */
export const OUTAGE = {
  incident: "CRITICAL INCIDENT #VLV-8802",
  duration: "00:08:42",
  kicker: "VALVE STEAM WEB API UNRESPONSIVE (HTTP 503 GATEWAY TIMEOUT)",
  title: "Steam Community Market & Inventory API is Experiencing Upstream Outages",
  body: "Relicto automated escrow bots and price scraping relays are paused to protect your assets against phantom trades and duplicate contract executions. Your vault balance and listed skins remain",
  secure: "100% secure",
  bodyTail: "in multi-sig cold storage.",
  retryIn: "14s",
  attempt: "(Attempt 3 of 10)",
  route: "ROUTE: FRA-VALVE-EAGLE-09",
  diagnostics: [
    { label: "ERR_CONNECTION_TIMED_OUT", value: "503 UNAVAILABLE", tone: "live" as const },
    { label: "HEARTBEAT DROP: 99.4%", value: "SEVERED LINK", tone: "live" as const },
    { label: "TX: 0.00 KB/S", value: "RX: 0.00 KB/S", tone: "muted" as const },
    { label: "Valve Response Time", value: "2,480 ms", tone: "amber" as const },
  ],
  monitors: [
    { label: "Valve CS2 Inventory", status: "Degraded", detail: "Latency: 2,480ms (Steam Down)", bar: "w-2/5", tone: "tertiary" as const, ping: true },
    { label: "Dota 2 Coordinator", status: "Offline", detail: "Queue Handshake Paused", bar: "w-1/12", tone: "primary" as const, ping: true },
    { label: "Relicto Escrow Bots", status: "Armed & Paused", detail: "Zero Risk Execution Lock", bar: "w-full", tone: "cyan" as const, ping: false },
    { label: "Arbitrage WS Engine", status: "Standby", detail: "In-Memory Buffer Intact", bar: "w-4/5", tone: "cyan" as const, ping: false },
    { label: "Multi-Sig Cold Vault", status: "100% Solvent", detail: "$1,489,200 On-Chain Reserves", bar: "w-full", tone: "tertiary" as const, ping: false },
  ],
  incidentLog: [
    { time: "[14:28:10.104]", level: "WARN", levelClass: "text-tertiary", message: "Upstream Steam Community Web API returned HTTP 502 Bad Gateway" },
    { time: "[14:28:12.890]", level: "ERROR", levelClass: "text-error font-bold", message: "Connection reset by peer (api.steampowered.com:443)" },
    { time: "", level: "", levelClass: "text-text-muted", message: "at ProtocolPipeline.fetchSteamInventory (node:relicto/steam:204:12)", indent: true },
    { time: "", level: "", levelClass: "text-text-muted", message: "at async InventoryBroker.hydrateMarketBatch (node:relicto/broker:88:5)", indent: true },
    { time: "[14:28:13.002]", level: "CIRCUIT_BREAKER", levelClass: "text-status-upcoming", message: "TRIPPED -> Entering SAFEGUARD_ISOLATION state" },
    { time: "[14:28:13.004]", level: "LOCK", levelClass: "text-status-upcoming", message: "Escrow queue locked. 1,842 user items frozen in pending escrow. Zero funds lost." },
    { time: "[14:28:18.420]", level: "FAIL", levelClass: "text-primary font-bold", message: "Probe failed: Valve Steam API ping latency > 2,400ms. Aborting session handshake." },
  ],
  diagnosticImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCw_c6q2mXYPKcB75VUJkUqTEw0GtLy_hA4YhS7EJcS_s2oCu4sh9932LY7lHFeZAqqd_KMdXL_qJeU1zrc___quLDBU0LhfzQZhZcNK4jhcZgpTHfOHXxxeQ_NYxhE00Wv927WAWuwlGtSsks46tjymmSsFxYdnfh18bhGmKVaJQKTNjobOD5KMkuI4DxxPhs9csxuQyLo55ou6ljDwPZloy2LDvrh1z6reTd3JYM41IzgIX-Ylt3B9Q",
};
