import "server-only";

import { and, count, eq, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { heroes, items, listings } from "@/lib/db/schema";
import { buildFilters } from "./listings.repository";
import type { ListListingsInput } from "./listings.schema";

const toMap = (rows: { key: string | null; n: number }[]) =>
  Object.fromEntries(rows.filter((row) => row.key !== null).map((row) => [row.key as string, row.n]));

/**
 * How many active listings sit behind each sidebar facet. Each facet's tally
 * is scoped to its sibling facets (e.g. selecting a wear tier narrows the rarity counts,
 * and selecting a rarity narrows the wear tiers) while retaining other options in its own group.
 */
export async function countFacets(filterInput?: string | Partial<ListListingsInput>) {
  const baseInput: ListListingsInput = {
    sort: "recent",
    page: 1,
    perPage: 24,
    ...(typeof filterInput === "string" ? { gameId: filterInput } : filterInput ?? {}),
  };

  const whereForGame = and(...buildFilters({ ...baseInput, gameId: undefined }));
  const whereForRarity = and(...buildFilters({ ...baseInput, rarities: undefined }));
  const whereForSlot = and(...buildFilters({ ...baseInput, slots: undefined }));
  const whereForHero = and(...buildFilters({ ...baseInput, heroSlugs: undefined }));
  const whereForWear = and(...buildFilters({ ...baseInput, wear: undefined }), isNotNull(listings.wear));

  const [byGame, byRarity, bySlot, byHero, byWear] = await Promise.all([
    db
      .select({ key: items.gameId, n: count() })
      .from(listings)
      .innerJoin(items, eq(listings.itemId, items.id))
      .leftJoin(heroes, eq(items.heroId, heroes.id))
      .where(whereForGame)
      .groupBy(items.gameId),
    db
      .select({ key: items.rarity, n: count() })
      .from(listings)
      .innerJoin(items, eq(listings.itemId, items.id))
      .leftJoin(heroes, eq(items.heroId, heroes.id))
      .where(whereForRarity)
      .groupBy(items.rarity),
    db
      .select({ key: items.slot, n: count() })
      .from(listings)
      .innerJoin(items, eq(listings.itemId, items.id))
      .leftJoin(heroes, eq(items.heroId, heroes.id))
      .where(whereForSlot)
      .groupBy(items.slot),
    db
      .select({ key: heroes.name, n: count() })
      .from(listings)
      .innerJoin(items, eq(listings.itemId, items.id))
      .innerJoin(heroes, eq(items.heroId, heroes.id))
      .where(whereForHero)
      .groupBy(heroes.name),
    db
      .select({ key: listings.wear, n: count() })
      .from(listings)
      .innerJoin(items, eq(listings.itemId, items.id))
      .leftJoin(heroes, eq(items.heroId, heroes.id))
      .where(whereForWear)
      .groupBy(listings.wear),
  ]);

  const games = toMap(byGame);

  return {
    games,
    rarities: toMap(byRarity),
    slots: toMap(bySlot),
    heroes: toMap(byHero),
    wears: toMap(byWear),
    total: Object.values(games).reduce((sum, n) => sum + n, 0),
  };
}

