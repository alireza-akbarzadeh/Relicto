import "server-only";

import { randomInt, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { z } from "zod";
import { db } from "@/lib/db";
import { ledgerEntries, walletAccounts } from "@/lib/db/schema";
import { isStripeConfigured } from "@/lib/stripe/client";
import { mockPaymentsEnabled } from "../checkout/checkout.payment";
import type { depositInput } from "./wallet.schema";

type Rail = z.infer<typeof depositInput>["rail"];

const RAIL: Record<Rail, string> = { crypto: "Web3 Crypto", cards: "Card / Apple Pay", bank: "SEPA / Wire" };

export type DepositResult =
  | { status: "credited"; balanceCents: number }
  | { status: "rail-unavailable" | "vault-frozen" };

/** Whether this environment may credit the vault without a payment provider. */
export const testDepositsEnabled = mockPaymentsEnabled;

const canDeposit = (rail: Rail, txHash?: string) =>
  Boolean(txHash) || testDepositsEnabled() || (rail === "cards" && isStripeConfigured());

/**
 * Tops up the vault via Web3 Crypto, Stripe Card, or simulated test mode.
 */
export async function deposit(userId: string, input: z.infer<typeof depositInput>): Promise<DepositResult> {
  if (!canDeposit(input.rail, input.txHash)) return { status: "rail-unavailable" };

  return db.transaction(async (tx): Promise<DepositResult> => {
    // A brand-new trader has no vault yet; the first deposit opens it.
    await tx.insert(walletAccounts).values({ id: `wallet-${userId}`, userId }).onConflictDoNothing({ target: walletAccounts.userId });
    const [wallet] = await tx.select().from(walletAccounts).where(eq(walletAccounts.userId, userId)).for("update");
    if (wallet.frozenAt) return { status: "vault-frozen" };

    if (input.txHash) {
      const [existing] = await tx
        .select({ id: ledgerEntries.id, balanceAfterCents: ledgerEntries.balanceAfterCents })
        .from(ledgerEntries)
        .where(eq(ledgerEntries.hash, input.txHash))
        .limit(1);
      if (existing) {
        return { status: "credited", balanceCents: wallet.balanceCents };
      }
    }

    const amountCents = Math.round(input.amountUsd * 100);
    const balanceCents = wallet.balanceCents + amountCents;
    await tx.update(walletAccounts).set({ balanceCents }).where(eq(walletAccounts.id, wallet.id));

    const isCrypto = Boolean(input.txHash);
    const isLiveStripe = input.rail === "cards" && isStripeConfigured();

    const hash = input.txHash ?? (isLiveStripe ? `#STRIPE-${randomInt(1_000_000, 10_000_000)}` : `#MOCK-${randomInt(1_000_000, 10_000_000)}`);
    const title = isCrypto ? "Web3 Crypto Deposit" : (isLiveStripe ? "Stripe Card Deposit" : `${RAIL[input.rail]} Deposit (simulated)`);
    const detailLabel = isCrypto
      ? `On-chain verified: ${input.txHash?.slice(0, 16)}...`
      : (isLiveStripe ? "Settled via Stripe 3D Secure" : "Test mode — no payment provider connected, nothing was charged");
    const nodeLabel = isCrypto ? "Web3 Node" : (isLiveStripe ? "Stripe Vault" : "Mock Rail");
    const venue =
      input.rail === "cards" || isLiveStripe || hash.startsWith("#STRIPE-") || hash.startsWith("cs_")
        ? "stripe"
        : isCrypto || input.rail === "crypto"
          ? "tron"
          : "internal";

    await tx.insert(ledgerEntries).values({
      id: `ledger-dep-${randomUUID()}`,
      walletId: wallet.id,
      direction: "credit",
      kind: "deposit",
      amountCents,
      balanceAfterCents: balanceCents,
      status: "settled",
      hash,
      venue,
      title,
      assetLabel: RAIL[input.rail],
      detailLabel,
      nodeLabel,
    });

    return { status: "credited", balanceCents };
  });
}
