import "server-only";

import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, listings } from "@/lib/db/schema";
import type { DashboardCatalogItem } from "../types";

export async function getAdminCatalog(): Promise<DashboardCatalogItem[]> {
  try {
    const rows = await db
      .select({
        id: items.id,
        slug: items.slug,
        name: items.name,
        gameId: items.gameId,
        rarity: items.rarity,
        slot: items.slot,
        imageUrl: items.imageUrl,
        collection: items.collection,
        minFloat: items.minFloat,
        maxFloat: items.maxFloat,
        updatedAt: items.updatedAt,
        activeListingsCount: sql<number>`cast(count(${listings.id}) filter (where ${listings.status} = 'active') as integer)`,
        floorPriceCents: sql<number | null>`min(${listings.priceCents}) filter (where ${listings.status} = 'active')`,
      })
      .from(items)
      .leftJoin(listings, eq(listings.itemId, items.id))
      .groupBy(items.id)
      .orderBy(asc(items.name))
      .limit(100);

    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      gameId: r.gameId,
      rarity: r.rarity,
      slot: r.slot,
      imageUrl: r.imageUrl,
      collection: r.collection,
      minFloat: r.minFloat,
      maxFloat: r.maxFloat,
      activeListingsCount: r.activeListingsCount ?? 0,
      floorPriceCents: r.floorPriceCents ?? null,
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.error("[getAdminCatalog] Failed to load catalog items:", err);
    return [];
  }
}
