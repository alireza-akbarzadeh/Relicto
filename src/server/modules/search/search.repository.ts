import "server-only";

import {
  and,
  asc,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  min,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { db } from "@/lib/db";
import { heroes, items, listings, pricePoints } from "@/lib/db/schema";
import type { SearchInput } from "./search.schema";

/** `%` and `_` are wildcards to ILIKE; a trader typing "50%" means the character. */
const escapeLike = (term: string) => term.replace(/[\\%_]/g, (c) => `\\${c}`);
export const contains = (term: string) => `%${escapeLike(term)}%`;

/** Every word must appear in the item's name or its hero's: "pa manifold" finds Manifold Paradox. */
function textMatch(q: string): SQL | undefined {
  const terms = q.split(/\s+/).filter(Boolean).slice(0, 6);
  if (terms.length === 0) return undefined;
  return and(
    ...terms.map((term) =>
      or(
        ilike(items.name, contains(term)),
        ilike(heroes.name, contains(term)),
        ilike(items.slug, contains(term)),
      )!,
    ),
  );
}

/** A copy counts when it's for sale and passes the wear and price chips. */
const liveCopy = (input: SearchInput) =>
  and(
    eq(listings.itemId, items.id),
    eq(listings.status, "active"),
    input.wear ? eq(listings.wear, input.wear) : undefined,
    input.min
      ? gte(listings.priceCents, Math.round(input.min * 100))
      : undefined,
  );

const itemFilters = (input: SearchInput, withGame: boolean) =>
  and(
    withGame && input.game !== "all" ? eq(items.gameId, input.game) : undefined,
    input.rarity ? eq(items.rarity, input.rarity) : undefined,
    textMatch(input.q),
  );

/**
 * Items with at least one copy to buy. A typed query ranks names that start
 * with it first, then by liquidity; an empty one shows what's moving most.
 */
export async function findItems(input: SearchInput) {
  const copies = count(listings.id);
  const order = input.q
    ? [
        desc(sql`(${items.name} ilike ${`${escapeLike(input.q)}%`})`),
        desc(copies),
        asc(items.name),
      ]
    : [
        desc(sql`max(abs(coalesce(${listings.changePercent}, 0)))`),
        desc(copies),
      ];

  return db
    .select({
      id: items.id,
      slug: items.slug,
      name: items.name,
      gameId: items.gameId,
      rarity: items.rarity,
      imageUrl: items.imageUrl,
      imageAlt: items.imageAlt,
      heroName: heroes.name,
      floorCents: min(listings.priceCents),
      copies,
    })
    .from(items)
    .innerJoin(listings, liveCopy(input))
    .leftJoin(heroes, eq(items.heroId, heroes.id))
    .where(itemFilters(input, true))
    .groupBy(items.id, heroes.name)
    .orderBy(...order)
    .limit(input.limit);
}

export type ItemMatch = Awaited<ReturnType<typeof findItems>>[number];

/** Matching items per game, ignoring the game pill itself. */
export async function countByGame(input: SearchInput) {
  return db
    .select({ gameId: items.gameId, matches: countDistinct(items.id) })
    .from(items)
    .innerJoin(listings, liveCopy(input))
    .leftJoin(heroes, eq(items.heroId, heroes.id))
    .where(itemFilters(input, false))
    .groupBy(items.gameId);
}

/** The cheapest live copy of each item — what the result's price and basket button refer to. */
export async function findCheapestCopies(
  input: SearchInput,
  itemIds: string[],
) {
  if (itemIds.length === 0) return [];
  return db
    .selectDistinctOn([listings.itemId], {
      itemId: listings.itemId,
      id: listings.id,
      priceCents: listings.priceCents,
      wear: listings.wear,
      float: listings.float,
      paintSeed: listings.paintSeed,
      steamMarketCents: listings.steamMarketCents,
    })
    .from(listings)
    .innerJoin(items, eq(listings.itemId, items.id))
    .where(and(inArray(listings.itemId, itemIds), liveCopy(input)))
    .orderBy(listings.itemId, asc(listings.priceCents), asc(listings.listedAt));
}

/** Latest Skinport ask per item, the reference when Steam's isn't scraped. */
export async function findMarketQuotes(itemIds: string[]) {
  if (itemIds.length === 0) return [];
  return db
    .selectDistinctOn([pricePoints.itemId], {
      itemId: pricePoints.itemId,
      priceCents: pricePoints.priceCents,
    })
    .from(pricePoints)
    .where(
      and(
        inArray(pricePoints.itemId, itemIds),
        eq(pricePoints.venue, "skinport"),
      ),
    )
    .orderBy(pricePoints.itemId, desc(pricePoints.recordedAt));
}
