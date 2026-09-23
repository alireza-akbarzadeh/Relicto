import "server-only";

import { randomInt, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ledgerEntries, payouts, walletAccounts } from "@/lib/db/schema";
import type { z } from "zod";
import type { cashoutInput } from "./wallet.schema";

type Rail = z.infer<typeof cashoutInput>["rail"];

/** Where each rail settles, what the audit row calls it, and the network fee it carries. */
const RAIL: Record<Rail, { venue: "tron" | "sepa" | "internal" | "stripe"; label: string; feeCents: number }> = {
  usdt: { venue: "tron", label: "USDT (TRC20)", feeCents: 100 },
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
export async function requestCashout(userId: string, input: z.infer<typeof cashoutInput>): Promise<CashoutResult> {
  return db.transaction(async (tx): Promise<CashoutResult> => {
    const [wallet] = await tx.select().from(walletAccounts).where(eq(walletAccounts.userId, userId)).for("update");
    if (!wallet) return { status: "no-wallet" };
    if (wallet.frozenAt) return { status: "vault-frozen" };

    const amountCents = Math.round(input.amountUsd * 100);
    if (amountCents > wallet.balanceCents) return { status: "insufficient-funds" };

    const rail = RAIL[input.rail];
    const balanceAfterCents = wallet.balanceCents - amountCents;
    await tx.update(walletAccounts).set({ balanceCents: balanceAfterCents }).where(eq(walletAccounts.id, wallet.id));

    const [payout] = await tx
      .insert(payouts)
      .values({ walletId: wallet.id, amountCents, feeCents: rail.feeCents, status: "requested" })
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
      venue: rail.venue,
      title: `Cashout Request (${rail.label})`,
      assetLabel: rail.label,
      detailLabel: rail.feeCents ? `Network fee $${(rail.feeCents / 100).toFixed(2)}` : "No network fee",
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
