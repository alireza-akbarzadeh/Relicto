import "server-only";

import { and, eq, gt, sql } from "drizzle-orm";
import { escrowEvents, ledgerEntries, orderItems, orders, walletAccounts } from "@/lib/db/schema";
import type { Executor } from "../notifications/notifications.repository";

const bare = (code: string) => code.replace(/^#/, "").toUpperCase();

/** The order and its line, locked so two bot events for one order apply in turn. */
export async function lockOrder(tx: Executor, code: string) {
  const [row] = await tx
    .select({ order: orders, line: orderItems })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(eq(orders.code, bare(code)))
    .limit(1)
    .for("update", { of: orders });

  return row ?? null;
}

export type LockedOrder = NonNullable<Awaited<ReturnType<typeof lockOrder>>>;

/** Rewrites one step of the tracker timeline. */
export async function setStep(
  tx: Executor,
  orderId: string,
  step: number,
  patch: Partial<Pick<typeof escrowEvents.$inferInsert, "state" | "title" | "body" | "occurredAt">>,
) {
  await tx.update(escrowEvents).set(patch).where(and(eq(escrowEvents.orderId, orderId), eq(escrowEvents.step, step)));
}

/** Every step after `step` goes back to waiting. */
export async function queueAfter(tx: Executor, orderId: string, step: number) {
  await tx
    .update(escrowEvents)
    .set({ state: "queued" })
    .where(and(eq(escrowEvents.orderId, orderId), gt(escrowEvents.step, step)));
}

/** A trader's wallet, created on first credit — sellers may never have deposited. */
export async function ensureWallet(tx: Executor, userId: string) {
  const [existing] = await tx.select().from(walletAccounts).where(eq(walletAccounts.userId, userId)).limit(1).for("update");
  if (existing) return existing;

  const [created] = await tx.insert(walletAccounts).values({ id: `wallet-${userId}`, userId }).returning();
  return created;
}

/** Moves a balance and records why, keeping `balanceAfterCents` replayable. */
export async function post(
  tx: Executor,
  entry: Omit<typeof ledgerEntries.$inferInsert, "balanceAfterCents" | "walletId"> & { userId: string },
) {
  const { userId, ...rest } = entry;
  const wallet = await ensureWallet(tx, userId);
  const delta = rest.direction === "credit" ? rest.amountCents : -rest.amountCents;

  const [account] = await tx
    .update(walletAccounts)
    .set({ balanceCents: sql`${walletAccounts.balanceCents} + ${delta}` })
    .where(eq(walletAccounts.id, wallet.id))
    .returning();

  await tx.insert(ledgerEntries).values({ ...rest, walletId: wallet.id, balanceAfterCents: account.balanceCents });
}

/** The buyer's vault debit for an order stops being "processing" once escrow resolves. */
export async function settleDebit(tx: Executor, orderId: string) {
  await tx
    .update(ledgerEntries)
    .set({ status: "settled" })
    .where(and(eq(ledgerEntries.orderId, orderId), eq(ledgerEntries.kind, "purchase"), eq(ledgerEntries.status, "pending")));
}
