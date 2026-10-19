import "server-only";

import { randomInt, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ledgerEntries, payouts, walletAccounts } from "@/lib/db/schema";
import type { CashoutInput, CashoutRail } from "./wallet.schema";
import { CRYPTO_NETWORK_CONFIGS, TF2_KEY_RATE_USD, calculateKeysFromUsd } from "./wallet.schema";
import { sumCommittedBids } from "../offers/offers.repository";

type Rail = CashoutRail;

/** Where each rail settles, what the audit row calls it, and the default network fee it carries. */
const RAIL: Record<Rail, { venue: "tron" | "sepa" | "internal" | "stripe"; label: string; feeCents: number }> = {
  usdt: { venue: "tron", label: "USDT (TRC-20)", feeCents: 100 },
  sepa: { venue: "sepa", label: "SEPA Instant", feeCents: 0 },
  keys: { venue: "internal", label: "Steam Keys", feeCents: 0 },
  visa: { venue: "stripe", label: "Visa Direct", feeCents: 0 },
};

export type CashoutResult =
  | { status: "requested"; payoutId: string }
  | { status: "no-wallet" | "vault-frozen" | "insufficient-funds" };

/**
 * Takes the amount out of the vault now and records a payout request plus a
 * pending ledger debit. Paying it out needs a payment provider (backend-plan,
 * Phase 4), so the request stays "requested" until one exists. Checkout-made
 * and cashout ledger rows use generated ids the seed can undo.
 */
export async function requestCashout(userId: string, input: CashoutInput): Promise<CashoutResult> {
  return db.transaction(async (tx): Promise<CashoutResult> => {
    const [wallet] = await tx.select().from(walletAccounts).where(eq(walletAccounts.userId, userId)).for("update");
    if (!wallet) return { status: "no-wallet" };
    if (wallet.frozenAt) return { status: "vault-frozen" };

    const amountCents = Math.round(input.amountUsd * 100);
    const committedBids = await sumCommittedBids(tx, userId);
    if (amountCents > wallet.balanceCents - committedBids) return { status: "insufficient-funds" };

    const baseRail = RAIL[input.rail];
    let label = baseRail.label;
    let feeCents = baseRail.feeCents;
    let venue = baseRail.venue;

    if (input.rail === "usdt" && input.network) {
      const netConfig = CRYPTO_NETWORK_CONFIGS[input.network];
      if (netConfig) {
        label = `USDT (${netConfig.name})`;
        feeCents = Math.round(netConfig.feeUsd * 100);
        venue = input.network === "trc20" ? "tron" : "internal";
      }
    }

    const balanceAfterCents = wallet.balanceCents - amountCents;
    await tx.update(walletAccounts).set({ balanceCents: balanceAfterCents }).where(eq(walletAccounts.id, wallet.id));

    const [payout] = await tx
      .insert(payouts)
      .values({ walletId: wallet.id, amountCents, feeCents, status: "requested" })
      .returning({ id: payouts.id });

    await tx.insert(ledgerEntries).values({
      id: `ledger-out-${randomUUID()}`,
      walletId: wallet.id,
      direction: "debit",
      kind: "withdrawal",
      amountCents,
      balanceAfterCents,
      status: "pending",
      hash: `#TX-${randomInt(1_000_000, 10_000_000)}`,
      venue,
      title: `Cashout Request (${label})`,
      assetLabel: label,
      detailLabel: [
        input.rail === "keys" ? `${calculateKeysFromUsd(input.amountUsd)} Keys (@ $${TF2_KEY_RATE_USD.toFixed(2)})` : null,
        feeCents ? `Network fee $${(feeCents / 100).toFixed(2)}` : "Zero network fee",
        input.destinationAddress ? `To: ${input.destinationAddress.slice(0, 16)}...` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      nodeLabel: "Relicto Treasury",
    });

    return { status: "requested", payoutId: payout.id };
  });
}

/** Sets or lifts the emergency lock. */
export async function setFrozen(userId: string, frozen: boolean) {
  const updated = await db
    .update(walletAccounts)
    .set({ frozenAt: frozen ? new Date() : null })
    .where(eq(walletAccounts.userId, userId))
    .returning({ id: walletAccounts.id });
  return updated.length > 0;
}
