import "server-only";

import { and, count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { heroes, items, listings } from "@/lib/db/schema";

const toMap = (rows: { key: string | null; n: number }[]) =>
  Object.fromEntries(rows.filter((row) => row.key !== null).map((row) => [row.key as string, row.n]));

/**
 * How many active listings sit behind each sidebar facet. Scoped to the
 * selected ecosystem only — a facet's tally shouldn't collapse to zero because
 * of a box the user is about to untick. Narrowing each tally by its sibling
 * facets would need one query per facet.
 */
export async function countFacets(gameId?: string) {
  const active = eq(listings.status, "active");
  const scope = gameId ? and(active, eq(items.gameId, gameId)) : active;

  const [byGame, byRarity, bySlot, byHero] = await Promise.all([
    db
      .select({ key: items.gameId, n: count() })
      .from(listings)
      .innerJoin(items, eq(listings.itemId, items.id))
      .where(active)
      .groupBy(items.gameId),
    db
      .select({ key: items.rarity, n: count() })
      .from(listings)
      .innerJoin(items, eq(listings.itemId, items.id))
      .where(scope)
      .groupBy(items.rarity),
    db
      .select({ key: items.slot, n: count() })
      .from(listings)
      .innerJoin(items, eq(listings.itemId, items.id))
      .where(scope)
      .groupBy(items.slot),
    db
      .select({ key: heroes.name, n: count() })
      .from(listings)
      .innerJoin(items, eq(listings.itemId, items.id))
      .innerJoin(heroes, eq(items.heroId, heroes.id))
      .where(scope)
      .groupBy(heroes.name),
  ]);

  const games = toMap(byGame);

  return {
    games,
    rarities: toMap(byRarity),
    slots: toMap(bySlot),
    heroes: toMap(byHero),
    total: Object.values(games).reduce((sum, n) => sum + n, 0),
  };
}
