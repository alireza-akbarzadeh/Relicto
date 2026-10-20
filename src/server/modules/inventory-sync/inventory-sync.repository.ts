import "server-only";

import { and, eq, inArray, min, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  account,
  inventoryItems,
  inventorySyncs,
  items,
  listings,
  profiles,
} from "@/lib/db/schema";
import { SYNCED_ASSET, type CatalogMatch } from "./inventory-sync.mapper";

type Row = Omit<typeof inventoryItems.$inferInsert, "userId">;
type Status = (typeof inventorySyncs.$inferSelect)["status"];

const CHUNK = 200;
const excluded = (column: { name: string }) => sql.raw(`excluded."${column.name}"`);

const REFRESH = {
  itemId: excluded(inventoryItems.itemId),
  name: excluded(inventoryItems.name),
  marker: excluded(inventoryItems.marker),
  rarityLabel: excluded(inventoryItems.rarityLabel),
  wearLabel: excluded(inventoryItems.wearLabel),
  imageUrl: excluded(inventoryItems.imageUrl),
  imageAlt: excluded(inventoryItems.imageAlt),
  priceCents: excluded(inventoryItems.priceCents),
  floorCents: excluded(inventoryItems.floorCents),
  wearPct: excluded(inventoryItems.wearPct),
  tone: excluded(inventoryItems.tone),
  updatedAt: sql`now()`,
};

export async function findSteamId(userId: string) {
  const [row] = await db
    .select({ steamId: account.accountId })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "steam")))
    .limit(1);
  return row?.steamId ?? null;
}

export async function findSync(userId: string) {
  const [row] = await db
    .select()
    .from(inventorySyncs)
    .where(eq(inventorySyncs.userId, userId))
    .limit(1);
  return row ?? null;
}

export async function matchCatalog(gameId: string, names: string[]) {
  if (names.length === 0) return new Map<string, CatalogMatch>();
  const rows = await db
    .select({
      itemId: items.id,
      name: items.name,
      floorCents: min(listings.priceCents),
    })
    .from(items)
    .leftJoin(listings, and(eq(listings.itemId, items.id), eq(listings.status, "active")))
    .where(and(eq(items.gameId, gameId), inArray(items.name, names)))
    .groupBy(items.id);
  return new Map(rows.map((row) => [row.name, { itemId: row.itemId, floorCents: row.floorCents }]));
}

export async function applySync(
  userId: string,
  steamId: string,
  games: string[],
  rows: Row[],
  status: Status,
) {
  return db.transaction(async (tx) => {
    for (let at = 0; at < rows.length; at += CHUNK) {
      await tx
        .insert(inventoryItems)
        .values(rows.slice(at, at + CHUNK).map((row) => ({ ...row, userId })))
        .onConflictDoUpdate({
          target: [inventoryItems.userId, inventoryItems.assetId],
          set: REFRESH,
        });
    }

    const kept = new Set(rows.map((row) => row.assetId));
    const owned = games.length
      ? await tx
          .select({
            id: inventoryItems.id,
            assetId: inventoryItems.assetId,
            listingId: inventoryItems.listingId,
            listingStatus: listings.status,
          })
          .from(inventoryItems)
          .leftJoin(listings, eq(inventoryItems.listingId, listings.id))
          .where(and(eq(inventoryItems.userId, userId), inArray(inventoryItems.gameId, games)))
      : [];
    const gone = owned.filter(
      (row) =>
        row.assetId &&
        SYNCED_ASSET.test(row.assetId) &&
        !kept.has(row.assetId) &&
        row.listingStatus !== "reserved",
    );

    const cancel = gone.flatMap((row) =>
      row.listingId && row.listingStatus === "active" ? [row.listingId] : [],
    );
    if (cancel.length) {
      await tx.update(listings).set({ status: "cancelled" }).where(inArray(listings.id, cancel));
    }
    if (gone.length) {
      await tx.delete(inventoryItems).where(inArray(inventoryItems.id, gone.map((r) => r.id)));
    }

    const counts = await tx
      .select({
        gameId: inventoryItems.gameId,
        units: sql<number>`count(*)::int`,
        valuationCents: sql<number>`coalesce(sum(coalesce(${inventoryItems.floorCents}, ${inventoryItems.priceCents}, 0)), 0)::int`,
      })
      .from(inventoryItems)
      .where(eq(inventoryItems.userId, userId))
      .groupBy(inventoryItems.gameId);

    const byGame = Object.fromEntries(counts.map((row) => [row.gameId, row.units]));
    const totalValuation = counts.reduce((sum, row) => sum + (row.valuationCents ?? 0), 0);

    await tx
      .update(profiles)
      .set({
        inventoryCounts: byGame,
        inventoryCount: counts.reduce((total, row) => total + row.units, 0),
        portfolioCents: totalValuation,
      })
      .where(eq(profiles.userId, userId));

    const sync = {
      userId,
      steamId,
      status,
      itemCount: rows.length,
      syncedAt: new Date(),
    };
    await tx
      .insert(inventorySyncs)
      .values(sync)
      .onConflictDoUpdate({ target: inventorySyncs.userId, set: sync });

    return { removed: gone.length, cancelled: cancel.length, totalValuationCents: totalValuation };
  });
}

export async function recordAttempt(userId: string, steamId: string, status: Status) {
  const sync = { userId, steamId, status, syncedAt: new Date() };
  await db
    .insert(inventorySyncs)
    .values(sync)
    .onConflictDoUpdate({ target: inventorySyncs.userId, set: sync });
}
