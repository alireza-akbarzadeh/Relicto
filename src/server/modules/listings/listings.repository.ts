import "server-only";

import { and, asc, count, desc, eq, gte, ilike, inArray, lte, min, sum, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { heroes, items, listings, watchlist } from "@/lib/db/schema";
import type { CreateListingInput, ListListingsInput } from "./listings.schema";

/** Only rows a buyer can actually act on, narrowed by the marketplace facets. */
function buildFilters(input: ListListingsInput): SQL[] {
  const filters: SQL[] = [eq(listings.status, "active")];

  if (input.query) filters.push(ilike(items.name, `%${input.query}%`));
  if (input.gameId) filters.push(eq(items.gameId, input.gameId));
  if (input.heroSlugs?.length) filters.push(inArray(heroes.slug, input.heroSlugs));
  if (input.rarities?.length) filters.push(inArray(items.rarity, input.rarities));
  if (input.slots?.length) filters.push(inArray(items.slot, input.slots));
  if (input.minCents !== undefined) filters.push(gte(listings.priceCents, input.minCents));
  if (input.maxCents !== undefined) filters.push(lte(listings.priceCents, input.maxCents));
  if (input.wear?.length) filters.push(inArray(listings.wear, input.wear));
  if (input.maxFloat !== undefined) filters.push(lte(listings.float, input.maxFloat));
  if (input.stattrak) filters.push(eq(listings.stattrak, true));

  return filters;
}

function orderBy(sort: ListListingsInput["sort"]) {
  if (sort === "price-asc") return asc(listings.priceCents);
  if (sort === "price-desc") return desc(listings.priceCents);
  return desc(listings.listedAt);
}

export async function findListings(input: ListListingsInput) {
  const where = and(...buildFilters(input));
  const offset = (input.page - 1) * input.perPage;

  const rows = await db
    .select({
      id: listings.id,
      priceCents: listings.priceCents,
      wear: listings.wear,
      float: listings.float,
      paintSeed: listings.paintSeed,
      stattrak: listings.stattrak,
      listedAt: listings.listedAt,
      sellerId: listings.sellerId,
      offerCount: listings.offerCount,
      changePercent: listings.changePercent,
      changeWindow: listings.changeWindow,
      item: {
        id: items.id,
        slug: items.slug,
        name: items.name,
        gameId: items.gameId,
        rarity: items.rarity,
        slot: items.slot,
        imageUrl: items.imageUrl,
        imageAlt: items.imageAlt,
        presentation: items.presentation,
      },
      heroName: heroes.name,
    })
    .from(listings)
    .innerJoin(items, eq(listings.itemId, items.id))
    .leftJoin(heroes, eq(items.heroId, heroes.id))
    .where(where)
    .orderBy(orderBy(input.sort))
    .limit(input.perPage)
    .offset(offset);

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(listings)
    .innerJoin(items, eq(listings.itemId, items.id))
    .leftJoin(heroes, eq(items.heroId, heroes.id))
    .where(where);

  return { rows, total };
}

/** Total value of everything currently listed — the hub's liquidity figure. */
export async function sumActiveLiquidityCents() {
  const [row] = await db
    .select({ total: sum(listings.priceCents) })
    .from(listings)
    .where(eq(listings.status, "active"));

  return Number(row?.total ?? 0);
}

/** Cheapest active listing per item slug, for headline "floor" copy. */
export async function findFloorCentsBySlug(slugs: string[]) {
  if (!slugs.length) return new Map<string, number>();

  const rows = await db
    .select({ slug: items.slug, floorCents: min(listings.priceCents) })
    .from(listings)
    .innerJoin(items, eq(listings.itemId, items.id))
    .where(and(eq(listings.status, "active"), inArray(items.slug, slugs)))
    .groupBy(items.slug);

  return new Map(rows.map((row) => [row.slug, Number(row.floorCents ?? 0)]));
}

export async function findListingById(id: string) {
  const [row] = await db
    .select()
    .from(listings)
    .innerJoin(items, eq(listings.itemId, items.id))
    .where(eq(listings.id, id))
    .limit(1);

  return row ?? null;
}

export async function insertListing(sellerId: string, input: CreateListingInput) {
  const [row] = await db
    .insert(listings)
    .values({ ...input, sellerId })
    .returning();

  return row;
}

export async function markListingSold(id: string) {
  const [row] = await db
    .update(listings)
    .set({ status: "sold", soldAt: new Date() })
    .where(and(eq(listings.id, id), eq(listings.status, "active")))
    .returning();

  return row ?? null;
}

/** Item slugs on a trader's watchlist — the hearts already filled in on mobile. */
export async function findWatchedSlugs(userId: string) {
  const rows = await db
    .select({ slug: items.slug })
    .from(watchlist)
    .innerJoin(items, eq(watchlist.itemId, items.id))
    .where(eq(watchlist.userId, userId));
  return rows.map((row) => row.slug);
}
