import "server-only";

import { and, count, desc, eq, gt, gte, isNull, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, ledgerEntries, offers, orderItems, orders, walletAccounts } from "@/lib/db/schema";

export async function findWallet(userId: string) {
  const [row] = await db.select().from(walletAccounts).where(eq(walletAccounts.userId, userId)).limit(1);
  return row ?? null;
}

export async function findEntries(walletId: string, limit = 6) {
  return db
    .select()
    .from(ledgerEntries)
    .where(eq(ledgerEntries.walletId, walletId))
    .orderBy(desc(ledgerEntries.occurredAt))
    .limit(limit);
}

/** Money that has left the liquid balance but hasn't finished moving. */
export async function sumPending(walletId: string) {
  const [row] = await db
    .select({
      clearingCents: sql<number>`coalesce(sum(${ledgerEntries.amountCents}) filter (where ${ledgerEntries.status} = 'pending' and ${ledgerEntries.direction} = 'credit'), 0)::int`,
      clearingCount: sql<number>`count(*) filter (where ${ledgerEntries.status} = 'pending' and ${ledgerEntries.direction} = 'credit')::int`,
      rebateCents: sql<number>`coalesce(sum(${ledgerEntries.amountCents}) filter (where ${ledgerEntries.kind} = 'promo'), 0)::int`,
    })
    .from(ledgerEntries)
    .where(eq(ledgerEntries.walletId, walletId));

  return { clearingCents: row?.clearingCents ?? 0, clearingCount: row?.clearingCount ?? 0, rebateCents: row?.rebateCents ?? 0 };
}

/** Funds locked in escrow are the buyer's open orders, not a ledger balance. */
export async function sumEscrowHolds(userId: string) {
  const [row] = await db
    .select({
      cents: sql<number>`coalesce(sum(${orders.totalCents}), 0)::int`,
      holds: sql<number>`count(*)::int`,
    })
    .from(orders)
    .where(and(eq(orders.buyerId, userId), eq(orders.state, "escrow")));

  return { escrowCents: row?.cents ?? 0, escrowHolds: row?.holds ?? 0 };
}

/** Funds committed to active purchase bids that haven't been accepted or expired yet. */
export async function sumBidHolds(userId: string, now = new Date()) {
  const [row] = await db
    .select({
      cents: sql<number>`coalesce(sum(${offers.priceCents}), 0)::int`,
      holds: sql<number>`count(*)::int`,
    })
    .from(offers)
    .where(and(eq(offers.buyerId, userId), eq(offers.status, "pending"), or(isNull(offers.expiresAt), gt(offers.expiresAt, now))));

  return { bidHoldsCents: row?.cents ?? 0, bidHolds: row?.holds ?? 0 };
}

/** Net movement over the trailing day, for the equity delta line. */
export async function sumLastDay(walletId: string, now = new Date()) {
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [row] = await db
    .select({
      netCents: sql<number>`coalesce(sum(case when ${ledgerEntries.direction} = 'credit' then ${ledgerEntries.amountCents} else -${ledgerEntries.amountCents} end), 0)::int`,
    })
    .from(ledgerEntries)
    .where(and(eq(ledgerEntries.walletId, walletId), gte(ledgerEntries.occurredAt, since)));

  return row?.netCents ?? 0;
}

/** Ledger rows with the traded item's shot and game, for the mobile activity list. */
export async function findEntriesWithItems(walletId: string, limit = 10) {
  return db
    .select({ entry: ledgerEntries, thumbnailUrl: orders.thumbnailUrl, thumbnailAlt: orders.thumbnailAlt, gameId: items.gameId })
    .from(ledgerEntries)
    .leftJoin(orders, eq(ledgerEntries.orderId, orders.id))
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .leftJoin(items, eq(orderItems.itemId, items.id))
    .where(eq(ledgerEntries.walletId, walletId))
    .orderBy(desc(ledgerEntries.occurredAt))
    .limit(limit);
}

export async function countEntries(walletId: string) {
  const [row] = await db.select({ value: count() }).from(ledgerEntries).where(eq(ledgerEntries.walletId, walletId));
  return row?.value ?? 0;
}
