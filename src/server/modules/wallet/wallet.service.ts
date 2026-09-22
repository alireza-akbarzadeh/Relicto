import "server-only";

import type { WalletData, WalletRail } from "@/modules/wallet/types";
import { toWalletMetrics } from "./wallet.metrics";
import { toWalletTransaction, usd } from "./wallet.presenter";
import * as repository from "./wallet.repository";

/** Rails Relicto supports platform-wide, not per-account. */
const DEPOSIT_RAILS: WalletRail[] = [
  { id: "crypto", label: "Web3 Crypto", icon: "currency_bitcoin" },
  { id: "skins", label: "Steam Skins", icon: "backpack" },
  { id: "cards", label: "Cards / Apple", icon: "credit_card" },
  { id: "bank", label: "SEPA / Wire", icon: "account_balance" },
];

const CASHOUT_RAILS: WalletRail[] = [
  { id: "usdt", label: "USDT (TRC20)", icon: "toll" },
  { id: "sepa", label: "SEPA Instant", icon: "account_balance" },
  { id: "keys", label: "Steam Keys", icon: "confirmation_number" },
  { id: "visa", label: "Visa Direct", icon: "credit_card" },
];

const pct = (part: number, whole: number) =>
  whole === 0 ? 0 : Math.round((part / whole) * 1000) / 10;

export const walletService = {
  /** Treasury snapshot for one trader, or null when they have no wallet yet. */
  async treasury(userId: string): Promise<WalletData | null> {
    const account = await repository.findWallet(userId);
    if (!account) return null;

    const [entries, pending, escrow, dayNetCents] = await Promise.all([
      repository.findEntries(account.id),
      repository.sumPending(account.id),
      repository.sumEscrowHolds(userId),
      repository.sumLastDay(account.id),
    ]);

    const totals = { liquidCents: account.balanceCents, ...escrow, ...pending };
    const equityCents = totals.liquidCents + totals.escrowCents + totals.clearingCents + totals.rebateCents;
    const openingCents = equityCents - dayNetCents;

    return {
      netEquity: usd(equityCents),
      equityChange: `${dayNetCents >= 0 ? "+" : ""}${pct(dayNetCents, openingCents)}%`,
      equityNote: `${dayNetCents >= 0 ? "+" : "-"}${usd(Math.abs(dayNetCents))} USD (Past 24h market & trade-ups)`,
      metrics: toWalletMetrics(totals),
      depositRails: DEPOSIT_RAILS,
      cashoutRails: CASHOUT_RAILS,
      transactions: entries.map(toWalletTransaction),
    };
  },
};
