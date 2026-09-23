import "server-only";

import { and, asc, eq, inArray, isNull, notExists, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryItems, tradeUpContracts, tradeUpItems, tradeUpOutcomes } from "@/lib/db/schema";
import type { Executor } from "../notifications/notifications.repository";

export type InventoryRow = typeof inventoryItems.$inferSelect;
export type OutcomeRow = typeof tradeUpOutcomes.$inferSelect;
export type ContractRow = typeof tradeUpContracts.$inferSelect;

/** The pool CS2 contracts draw from. */
export const TRADE_UP_GAME = "cs2";

/**
 * True for an inventory copy that no open draft has committed. The studio rail
 * and the cashout tray use it: a skin in the chamber isn't for sale.
 */
export const notCommitted = () =>
  notExists(
    db
      .select({ one: sql`1` })
      .from(tradeUpItems)
      .innerJoin(tradeUpContracts, eq(tradeUpContracts.id, tradeUpItems.contractId))
      .where(and(eq(tradeUpItems.inventoryItemId, inventoryItems.id), eq(tradeUpContracts.status, "draft"))),
  );

/** A random five-digit contract seed. */
export const newSeed = () => 1 + (crypto.getRandomValues(new Uint32Array(1))[0] % 99_999);

export async function findDraft(executor: Executor, userId: string, lock = false) {
  const query = executor
    .select()
    .from(tradeUpContracts)
    .where(and(eq(tradeUpContracts.userId, userId), eq(tradeUpContracts.status, "draft")))
    .limit(1);
  const [row] = lock ? await query.for("update") : await query;
  return row ?? null;
}

/** The trader's open draft, opened on first use. The one-draft index settles a race between two tabs. */
export async function draftFor(tx: Executor, userId: string) {
  const existing = await findDraft(tx, userId, true);
  if (existing) return existing;
  await tx.insert(tradeUpContracts).values({ userId, seed: newSeed() }).onConflictDoNothing();
  return (await findDraft(tx, userId, true))!;
}

/** The draft's committed copies, by slot. */
export async function committed(executor: Executor, contractId: string) {
  return executor
    .select({ slot: tradeUpItems.slot, inventory: inventoryItems })
    .from(tradeUpItems)
    .innerJoin(inventoryItems, eq(inventoryItems.id, tradeUpItems.inventoryItemId))
    .where(eq(tradeUpItems.contractId, contractId))
    .orderBy(asc(tradeUpItems.slot));
}

/** Unlisted, uncommitted copies the trader could still add, in rail order. */
export async function uncommitted(userId: string) {
  return db
    .select()
    .from(inventoryItems)
    .where(
      and(
        eq(inventoryItems.userId, userId),
        eq(inventoryItems.gameId, TRADE_UP_GAME),
        isNull(inventoryItems.listingId),
        notCommitted(),
      ),
    )
    .orderBy(asc(inventoryItems.sortOrder), asc(inventoryItems.createdAt));
}

/** The trader's own unlisted copies among `ids`, locked for the write. */
export async function lockOwned(tx: Executor, userId: string, ids: string[]) {
  if (!ids.length) return [];
  return tx
    .select()
    .from(inventoryItems)
    .where(and(inArray(inventoryItems.id, ids), eq(inventoryItems.userId, userId), isNull(inventoryItems.listingId)))
    .for("update");
}

export async function outcomes(executor: Executor = db) {
  return executor
    .select()
    .from(tradeUpOutcomes)
    .where(eq(tradeUpOutcomes.gameId, TRADE_UP_GAME))
    .orderBy(asc(tradeUpOutcomes.sortOrder));
}
