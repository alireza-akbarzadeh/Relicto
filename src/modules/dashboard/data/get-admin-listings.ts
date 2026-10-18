import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, listings, profiles } from "@/lib/db/schema";
import type { DashboardListing } from "../types";

export async function getAdminListings(): Promise<DashboardListing[]> {
  try {
    const rows = await db
      .select({
        listing: listings,
        item: items,
        profile: profiles,
      })
      .from(listings)
      .leftJoin(items, eq(listings.itemId, items.id))
      .leftJoin(profiles, eq(listings.sellerId, profiles.userId))
      .orderBy(desc(listings.listedAt))
      .limit(60);

    return rows.map((r) => ({
      id: r.listing.id,
      itemName: r.item?.name ?? "Field Combat Asset",
      category: r.item?.category ?? "Weapon Skin",
      gameId: r.item?.gameId ?? "cs2",
      sellerId: r.listing.sellerId,
      sellerHandle: r.profile?.handle ?? "Seller",
      priceCents: r.listing.priceCents,
      status: r.listing.status,
      wear: r.listing.wear,
      float: r.listing.float,
      paintSeed: r.listing.paintSeed,
      stattrak: r.listing.stattrak,
      listedAt: r.listing.listedAt.toISOString(),
      floorCents: r.listing.floorCents,
    }));
  } catch (error) {
    console.error("Failed to query admin listings:", error);
    return [];
  }
}
