import "server-only";

import { randomInt } from "node:crypto";
import type { ledgerEntries } from "@/lib/db/schema";

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

/** Always succeeds — there is no provider to decline. Returns null if the rail can't settle. */
export function authorize(rail: string, amountCents: number): Authorization | null {
  if (rail === VAULT_RAIL) return null;
  if (!isExternalRail(rail) || !mockPaymentsEnabled() || amountCents <= 0) return null;
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
  return {
    id: `ledger-chk-pay-${input.auth.reference.slice(6).toLowerCase()}`,
    walletId: input.walletId,
    direction: "credit",
    kind: "deposit",
    amountCents: input.amountCents,
    balanceAfterCents: input.balanceAfterCents,
    status: "settled",
    hash: input.auth.reference,
    /** No external venue exists yet; the credit is booked in-house. */
    venue: "internal",
    title: `${input.auth.label} (simulated)`,
    assetLabel: "Checkout authorization",
    detailLabel: "No payment provider connected — nothing was charged",
    nodeLabel: "Mock Rail",
    occurredAt: input.now,
  };
}
