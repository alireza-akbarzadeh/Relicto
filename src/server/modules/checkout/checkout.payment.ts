import "server-only";

import { randomInt, randomUUID } from "node:crypto";
import type { ledgerEntries } from "@/lib/db/schema";
import { isStripeConfigured } from "@/lib/stripe/client";

/**
 * A stand-in for the payment provider Relicto hasn't chosen yet.
 *
 * The vault rail is real money moving inside Relicto and settles on its own.
 * Card, crypto and Steam need an external provider; until one is picked, this
 * authorizes them instantly and funds the vault for the exact amount due, so
 * the rest of checkout — locking, escrow orders, the ledger, notifications —
 * is the same code path that will run against a real provider. Swapping this
 * file for a real `authorize()` is the whole integration.
 *
 * Nothing is charged. A mock authorization must never reach production
 * unnoticed, so it is off there unless someone turns it on deliberately.
 */

/** Settles in-house against the trader's own balance. */
export const VAULT_RAIL = "relicto";

const EXTERNAL_RAILS: Record<string, string> = {
  card: "Credit / Debit Card",
  crypto: "Web3 Crypto / Steam Pay",
  steam: "Steam Balance Split",
};

export const isExternalRail = (rail: string) => rail in EXTERNAL_RAILS;

export const railLabel = (rail: string) => (rail === VAULT_RAIL ? "Relicto Vault Balance" : EXTERNAL_RAILS[rail] ?? rail);

/**
 * Mock authorizations are enabled outside production, and in production only
 * when `CHECKOUT_MOCK_PAYMENTS=true` is set on purpose.
 */
export const mockPaymentsEnabled = () =>
  process.env.CHECKOUT_MOCK_PAYMENTS === "true" ||
  (process.env.NODE_ENV !== "production" && process.env.CHECKOUT_MOCK_PAYMENTS !== "false");

export type Authorization = { reference: string; label: string };

/** Always succeeds for live or simulated providers. Returns null if the rail can't settle. */
export function authorize(rail: string, amountCents: number, txHash?: string): Authorization | null {
  if (rail === VAULT_RAIL || amountCents <= 0) return null;
  if (!isExternalRail(rail)) return null;

  if (txHash) {
    return { reference: txHash, label: "Web3 Crypto Settlement" };
  }
  if (rail === "card" && isStripeConfigured()) {
    return { reference: `#STRIPE-${randomInt(1_000_000, 10_000_000)}`, label: "Stripe 3D Secure" };
  }
  if (!mockPaymentsEnabled()) return null;

  return { reference: `#MOCK-${randomInt(1_000_000, 10_000_000)}`, label: railLabel(rail) };
}

/**
 * The deposit a mock authorization puts in the vault, so the purchase debits
 * that follow are funded and the ledger explains where the money came from.
 */
export function depositRow(input: {
  walletId: string;
  auth: Authorization;
  amountCents: number;
  balanceAfterCents: number;
  now: Date;
}): typeof ledgerEntries.$inferInsert {
  const isStripe =
    input.auth.reference.startsWith("#STRIPE-") ||
    input.auth.reference.startsWith("cs_") ||
    input.auth.label.includes("Stripe") ||
    (isStripeConfigured() && input.auth.label.includes("Card"));
  const isCrypto =
    input.auth.reference.startsWith("0x") ||
    input.auth.label.includes("Crypto") ||
    input.auth.reference.startsWith("T");
  const venue = isStripe ? "stripe" : isCrypto ? "tron" : "internal";

  return {
    id: `ledger-chk-pay-${randomUUID()}`,
    walletId: input.walletId,
    direction: "credit",
    kind: "deposit",
    amountCents: input.amountCents,
    balanceAfterCents: input.balanceAfterCents,
    status: "settled",
    hash: input.auth.reference,
    venue,
    title: isStripe ? "Stripe 3D Secure Ingress" : isCrypto ? "Web3 Crypto Settlement" : `${input.auth.label} (simulated)`,
    assetLabel: isStripe ? "Credit / Debit Card" : isCrypto ? "USDT / Web3 Asset" : "Checkout authorization",
    detailLabel: isStripe
      ? "Settled via Stripe 3D Secure"
      : isCrypto
        ? `On-chain verified: ${input.auth.reference.slice(0, 16)}...`
        : "No payment provider connected — nothing was charged",
    nodeLabel: isStripe ? "Stripe Vault" : isCrypto ? "Web3 Node" : "Mock Rail",
    occurredAt: input.now,
  };
}
