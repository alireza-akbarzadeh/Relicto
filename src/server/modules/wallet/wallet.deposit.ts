import "server-only";

import { randomInt, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { z } from "zod";
import { db } from "@/lib/db";
import { ledgerEntries, walletAccounts } from "@/lib/db/schema";
import { mockPaymentsEnabled } from "../checkout/checkout.payment";
import type { depositInput } from "./wallet.schema";

type Rail = z.infer<typeof depositInput>["rail"];

const RAIL: Record<Rail, string> = { crypto: "Web3 Crypto", cards: "Card / Apple Pay", bank: "SEPA / Wire" };

export type DepositResult =
  | { status: "credited"; balanceCents: number }
  | { status: "rail-unavailable" | "vault-frozen" };

/** Whether this environment may credit the vault without a payment provider — the same switch checkout uses. */
export const testDepositsEnabled = mockPaymentsEnabled;

/**
 * Tops up the vault. No payment provider is connected yet, so outside
 * production (or with `CHECKOUT_MOCK_PAYMENTS=true`) the deposit is simulated:
 * the vault is credited at once and the ledger row says nothing was charged.
 * In production without that switch it refuses — balance is never minted there.
 * Ids carry a `dep` prefix so the seed can undo test deposits.
 */
export async function deposit(userId: string, input: z.infer<typeof depositInput>): Promise<DepositResult> {
  if (!testDepositsEnabled()) return { status: "rail-unavailable" };

  return db.transaction(async (tx): Promise<DepositResult> => {
    // A brand-new trader has no vault yet; the first deposit opens it.
    await tx.insert(walletAccounts).values({ id: `wallet-${userId}`, userId }).onConflictDoNothing({ target: walletAccounts.userId });
    const [wallet] = await tx.select().from(walletAccounts).where(eq(walletAccounts.userId, userId)).for("update");
    if (wallet.frozenAt) return { status: "vault-frozen" };

    const amountCents = Math.round(input.amountUsd * 100);
    const balanceCents = wallet.balanceCents + amountCents;
    await tx.update(walletAccounts).set({ balanceCents }).where(eq(walletAccounts.id, wallet.id));
    await tx.insert(ledgerEntries).values({
      id: `ledger-dep-${randomUUID()}`,
      walletId: wallet.id,
      direction: "credit",
      kind: "deposit",
      amountCents,
      balanceAfterCents: balanceCents,
      status: "settled",
      hash: `#MOCK-${randomInt(1_000_000, 10_000_000)}`,
      venue: "internal",
      title: `${RAIL[input.rail]} Deposit (simulated)`,
      assetLabel: RAIL[input.rail],
      detailLabel: "Test mode — no payment provider connected, nothing was charged",
      nodeLabel: "Mock Rail",
    });

    return { status: "credited", balanceCents };
  });
}
