import type { Infrastructure } from "../../types";

export const infrastructure: Infrastructure = {
  kicker: { icon: "lock", label: "AUTOMATED VALVE ENGINE PROTOCOL" },
  title: "Tournament Grade Architecture",
  description:
    "Zero referee delays. Apex Aegis connects directly to Valve's dedicated game coordinators to spin up password-protected match lobbies, enforce Captains Mode draft clocks, track live stats, and disburse payouts within 60 seconds of GG call or final defusal.",
  features: [
    { label: "Kernel Anti-Cheat", tone: "live" },
    { label: "Automated Demo Parser", tone: "amber" },
    { label: "Steam Inventory Escrow", tone: "cyan" },
  ],
  diagnostics: {
    title: "STEAM BOT CLUSTER #09",
    status: "ALL SYSTEMS NOMINAL",
    rows: [
      { label: "DOTA 2 GC HANDSHAKE:", value: "ESTABLISHED (12ms)", tone: "strong" },
      { label: "CS2 TICK POOL:", value: "128 SUB-TICK VERIFIED", tone: "strong" },
      { label: "ACTIVE MATCH BOT LOBBIES:", value: "14 / 16 DEDICATED", tone: "amber" },
      { label: "STEAM API INTEGRITY:", value: "TOKEN REVOCATION VALID", tone: "cyan" },
    ],
    action: { label: "RUN LOBBY SYNC TEST", icon: "sync" },
  },
};
