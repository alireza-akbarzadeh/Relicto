import "server-only";

import type { WalletMobile } from "@/modules/wallet/mobile.types";
import type { WalletData, WalletRail } from "@/modules/wallet/types";
import { toWalletMobile } from "./wallet-mobile.presenter";
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

type Account = NonNullable<Awaited<ReturnType<typeof repository.findWallet>>>;

/** Every balance both wallet screens show, from one read of the ledger. */
async function loadTotals(account: Account, userId: string) {
  const [pending, escrow, dayNetCents] = await Promise.all([
    repository.sumPending(account.id),
    repository.sumEscrowHolds(userId),
    repository.sumLastDay(account.id),
  ]);

  const totals = { liquidCents: account.balanceCents, ...escrow, ...pending };
  const equityCents = totals.liquidCents + totals.escrowCents + totals.clearingCents + totals.rebateCents;
  return { totals, equityCents, dayNetCents, changePct: pct(dayNetCents, equityCents - dayNetCents) };
}

export const walletService = {
  /** Spendable balance in cents — the header chip on every page. */
  async liquidCents(userId: string) {
    return (await repository.findWallet(userId))?.balanceCents ?? 0;
  },

  /** Treasury snapshot for one trader, or null when they have no wallet yet. */
  async treasury(userId: string): Promise<WalletData | null> {
    const account = await repository.findWallet(userId);
    if (!account) return null;

    const [entries, { totals, equityCents, dayNetCents, changePct }] = await Promise.all([
      repository.findEntries(account.id),
      loadTotals(account, userId),
    ]);

    return {
      netEquity: usd(equityCents),
      equityChange: `${dayNetCents >= 0 ? "+" : ""}${changePct}%`,
      equityNote: `${dayNetCents >= 0 ? "+" : "-"}${usd(Math.abs(dayNetCents))} USD (Past 24h market & trade-ups)`,
      metrics: toWalletMetrics(totals),
      depositRails: DEPOSIT_RAILS,
      cashoutRails: CASHOUT_RAILS,
      transactions: entries.map(toWalletTransaction),
    };
  },

  /** The same balances and ledger in the mobile wallet's shape; `chrome` is its authored furniture. */
  async treasuryMobile(userId: string, chrome: Parameters<typeof toWalletMobile>[0]): Promise<WalletMobile | null> {
    const account = await repository.findWallet(userId);
    if (!account) return null;

    const [rows, total, { totals, dayNetCents, changePct }] = await Promise.all([
      repository.findEntriesWithItems(account.id),
      repository.countEntries(account.id),
      loadTotals(account, userId),
    ]);

    return toWalletMobile(chrome, { ...totals, dayNetCents, changePct }, rows, total);
  },
};
