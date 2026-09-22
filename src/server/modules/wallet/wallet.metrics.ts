import type { WalletMetric } from "@/modules/wallet/types";
import { usd } from "./wallet.presenter";

export type WalletTotals = {
  liquidCents: number;
  escrowCents: number;
  escrowHolds: number;
  clearingCents: number;
  clearingCount: number;
  rebateCents: number;
};

/** The four tiles above the audit ledger, each backed by a real balance. */
export function toWalletMetrics(totals: WalletTotals): WalletMetric[] {
  return [
    {
      id: "liquid",
      label: "Available Liquid Balance",
      icon: "account_balance_wallet",
      value: usd(totals.liquidCents),
      description: "Immediately withdrawable via instant SEPA / Crypto rail.",
      foot: "UNRESTRICTED · Tier: Whitelisted",
      tone: "muted",
      live: true,
    },
    {
      id: "escrow",
      label: "Active Escrow Lock",
      icon: "lock_clock",
      value: usd(totals.escrowCents),
      description: `Held across ${totals.escrowHolds} pending Steam bot trade confirmation${
        totals.escrowHolds === 1 ? "" : "s"
      }.`,
      foot: totals.escrowHolds > 0 ? "BOT MULTI-SIG HOLD · Releases on acceptance" : "NO ACTIVE HOLDS",
      tone: "amber",
    },
    {
      id: "settlement",
      label: "Trade-Up Settlements",
      icon: "hourglass_top",
      value: usd(totals.clearingCents),
      description: `Clearing from ${totals.clearingCount} completed contract liquidation${
        totals.clearingCount === 1 ? "" : "s"
      }.`,
      foot: totals.clearingCount > 0 ? "FINAL AUDIT STAGE" : "NOTHING CLEARING",
      tone: "cyan",
    },
    {
      id: "rebates",
      label: "Rebates & Rewards",
      icon: "military_tech",
      value: usd(totals.rebateCents),
      description: "Gold Tier 0.5% fee discount credit applied automatically.",
      foot: "GOLD REBATE ACTIVE · Next Tier at $10k Vol",
      tone: "primary",
    },
  ];
}
