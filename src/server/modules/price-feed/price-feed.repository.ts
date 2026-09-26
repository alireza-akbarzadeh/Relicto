import "server-only";

import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, pricePoints } from "@/lib/db/schema";

type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

const CHUNK = 500;

/** One game's catalog, each item with the exterior of its cheapest live copy (null when unlisted or not CS2). */
export async function findCatalog(gameId: string) {
  return db
    .select({
      id: items.id,
      name: items.name,
      gameId: items.gameId,
      wear: sql<string | null>`(
        select l.wear from listings l
        where l.item_id = "items"."id" and l.status = 'active'
        order by l.price_cents asc limit 1
      )`,
    })
    .from(items)
    .where(eq(items.gameId, gameId));
}

export type PointRow = typeof pricePoints.$inferInsert & { id: string };

/** Upserts daily observations by id, so a second run the same day refreshes rather than duplicates. */
export async function upsertPoints(rows: PointRow[]) {
  for (let at = 0; at < rows.length; at += CHUNK) {
    await db
      .insert(pricePoints)
      .values(rows.slice(at, at + CHUNK))
      .onConflictDoUpdate({
        target: pricePoints.id,
        set: {
          priceCents: sql.raw(`excluded."price_cents"`),
          volume: sql.raw(`excluded."volume"`),
          recordedAt: sql.raw(`excluded."recorded_at"`),
        },
      });
  }
}

/** A completed Relicto trade, recorded with the settlement it came from. */
export async function insertSalePoint(executor: Executor, row: PointRow) {
  await executor
    .insert(pricePoints)
    .values(row)
    .onConflictDoNothing({ target: pricePoints.id });
}
