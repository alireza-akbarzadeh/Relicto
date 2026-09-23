import "server-only";

import { and, asc, count, desc, eq, gte, isNull, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryItems, items, listings, offers, profiles } from "@/lib/db/schema";
import type { SellMobile } from "@/modules/sell/mobile.types";
import { toSellMobile } from "./sell-mobile.presenter";
import { delist, listItem } from "./sell.commands";
import type { ActiveListing, InventoryItem, SellData, SellGame, SellTone } from "@/modules/sell/types";
import { ago } from "@/server/modules/shared/ago";
import { notCommitted } from "@/server/modules/trade-ups/trade-ups.repository";

const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Offer ceilings are quoted as round dollars: "Max $1,580". */
const roundMoney = (cents: number) => `$${Math.round(cents / 100).toLocaleString("en-US")}`;

/**
 * The studio quotes moves to one decimal and truncates, so a listing $30 over a
 * $1,620 floor reads "+1.8%" rather than rounding up to "+1.9%".
 */
const truncPct = (value: number) => (Math.trunc(value * 10) / 10).toFixed(1);

/** The inventory rail quotes the same move to two decimals, rounded. */
const roundPct = (value: number) => (Math.round(value * 100) / 100).toFixed(2);

/** Which game tab the studio opens on. */
const DEFAULT_GAME: SellGame = "cs2";
const ACTIVE_SHOWN = 3;

/**
 * The studio's active panel is about listings a seller needs to act on, so it
 * only carries the ones buyers have actually reached. A listing nobody has
 * opened yet has nothing to decide about, and lives on the profile storefront —
 * which shows the same listings, unfiltered and newest-first.
 */
const MIN_VIEWS_FOR_STUDIO = 1;

function toInventoryItem(row: typeof inventoryItems.$inferSelect): InventoryItem {
  const deltaCents = row.priceCents - row.floorCents;
  const pct = row.floorCents === 0 ? 0 : (deltaCents / row.floorCents) * 100;

  return {
    id: row.id,
    game: row.gameId as SellGame,
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
    marker: row.marker ?? "",
    name: row.name,
    rarity: row.rarityLabel ?? "",
    wear: row.wearLabel ?? "",
    float: row.floatLabel ?? "",
    ...(row.rankLabel ? { rank: row.rankLabel } : {}),
    price: row.priceCents / 100,
    floor: row.floorCents / 100,
    delta: `${deltaCents >= 0 ? "+" : "-"} ${money(Math.abs(deltaCents))} (${pct >= 0 ? "+" : ""}${roundPct(pct)}%)`,
    deltaTone: deltaCents >= 0 ? "cyan" : "primary",
    wearPct: row.wearPct,
    tone: row.tone as SellTone,
  };
}

type ActiveRow = {
  listing: typeof listings.$inferSelect;
  name: string;
  imageUrl: string | null;
  imageAlt: string | null;
  offerCount: number;
  maxOfferCents: number | null;
};

/** Interest drives the row's accent: three or more offers is a hot listing. */
function offerTone(offerCount: number): SellTone {
  if (offerCount >= 3) return "primary";
  if (offerCount >= 1) return "cyan";
  return "muted";
}

function toActiveListing(row: ActiveRow, now: Date): ActiveListing {
  const { listing } = row;
  const floorCents = listing.floorCents ?? listing.priceCents;
  const deltaCents = listing.priceCents - floorCents;
  const pct = floorCents === 0 ? 0 : (deltaCents / floorCents) * 100;

  return {
    id: listing.id,
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
    name: row.name,
    price: money(listing.priceCents),
    floorDelta:
      deltaCents === 0
        ? "Exact Floor Match"
        : `${deltaCents > 0 ? "+" : "-"}${money(Math.abs(deltaCents))} (${deltaCents > 0 ? "+" : "-"}${truncPct(Math.abs(pct))}%)`,
    buyerViews: `${listing.viewCount} Views`,
    offers:
      row.offerCount === 0
        ? "0 Offers"
        : `${row.offerCount} Offer${row.offerCount === 1 ? "" : "s"} (Max ${roundMoney(row.maxOfferCents ?? 0)})`,
    age: ago(listing.listedAt, now),
    tone: offerTone(row.offerCount),
  };
}

export const sellService = {
  list: listItem,
  delist,

  /** Seller studio: unlisted inventory plus the trader's newest live listings. */
  async studio(userId: string): Promise<SellData> {
    const now = new Date();

    const [inventory, active, profile] = await Promise.all([
      db
        .select()
        .from(inventoryItems)
        .where(and(eq(inventoryItems.userId, userId), isNull(inventoryItems.listingId), notCommitted()))
        .orderBy(asc(inventoryItems.sortOrder)),
      db
        .select({
          listing: listings,
          name: items.name,
          imageUrl: items.imageUrl,
          imageAlt: items.imageAlt,
          offerCount: count(offers.id),
          maxOfferCents: max(offers.priceCents),
        })
        .from(listings)
        .innerJoin(items, eq(listings.itemId, items.id))
        .leftJoin(offers, and(eq(offers.listingId, listings.id), eq(offers.status, "pending")))
        .where(
          and(
            eq(listings.sellerId, userId),
            eq(listings.status, "active"),
            gte(listings.viewCount, MIN_VIEWS_FOR_STUDIO),
          ),
        )
        .groupBy(listings.id, items.name, items.imageUrl, items.imageAlt)
        .orderBy(desc(listings.listedAt))
        .limit(ACTIVE_SHOWN),
      db.select({ counts: profiles.inventoryCounts }).from(profiles).where(eq(profiles.userId, userId)).limit(1),
    ]);

    const counts = (profile[0]?.counts ?? {}) as Partial<Record<SellGame, number>>;

    return {
      inventory: inventory.map(toInventoryItem),
      activeListings: active.map((row) => toActiveListing(row as ActiveRow, now)),
      gameCounts: { cs2: counts.cs2 ?? 0, dota2: counts.dota2 ?? 0, tf2: counts.tf2 ?? 0 },
      totalInventory: counts[DEFAULT_GAME] ?? 0,
      readyToList: inventory.length,
    };
  },

  /** Mobile studio: portfolio totals and the unlisted inventory as the cashout tray. */
  async mobile(userId: string, authored: SellMobile): Promise<SellMobile | null> {
    const [inventory, [profile]] = await Promise.all([
      db
        .select()
        .from(inventoryItems)
        .where(and(eq(inventoryItems.userId, userId), isNull(inventoryItems.listingId), notCommitted()))
        .orderBy(asc(inventoryItems.sortOrder)),
      db
        .select({ units: profiles.inventoryCount, valueCents: profiles.portfolioCents })
        .from(profiles)
        .where(eq(profiles.userId, userId))
        .limit(1),
    ]);
    if (inventory.length === 0 && !profile) return null;
    return toSellMobile(authored, inventory, profile ?? null);
  },
};
