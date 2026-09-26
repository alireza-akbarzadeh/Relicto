/**
 * Seller studio, seeded from `sell.mock`: the unlisted inventory rail, plus the
 * three live listings with the buyer interest that drives their accents.
 */
import { and, eq, notLike } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";
import { sell } from "../../modules/sell/data/sell.mock";
import { offerRows, seedBidders } from "./seed-offers";

type Db = NodePgDatabase<typeof schema>;
type Rarity = (typeof schema.itemRarity.enumValues)[number];

const HOUR = 60 * 60 * 1000;
const cents = (usd: number) => Math.round(usd * 100);

/** Catalog entries behind the three live studio listings. */
const ACTIVE: {
  slug: string;
  gameId: string;
  name: string;
  rarity: Rarity;
  priceCents: number;
  floorCents: number;
  views: number;
  /** Pending offers, highest first. */
  offers: number[];
  ageHours: number;
  mockId: string;
}[] = [
  {
    slug: "talon-fade", gameId: "cs2", name: "★ Talon Knife | Fade", rarity: "melee",
    priceCents: 165000, floorCents: 162000, views: 142, offers: [158000, 151000], ageHours: 12.75, mockId: "talon",
  },
  {
    slug: "deagle-fennec", gameId: "cs2", name: "Desert Eagle | Fennec Fox", rarity: "rare",
    priceCents: 62000, floorCents: 62000, views: 88, offers: [], ageHours: 30, mockId: "desert",
  },
  {
    slug: "specialist-crimson-web", gameId: "cs2", name: "★ Specialist Gloves | Crimson Web", rarity: "gloves",
    priceCents: 57000, floorCents: 56000, views: 312, offers: [55000, 52000, 49000], ageHours: 59, mockId: "specialist",
  },
];

/**
 * Listings and inventory rows made through the studio (list / delist) have
 * generated ids; seeded ones don't. Undo the former so a re-seed starts clean.
 */
async function clearStudioWrites(db: Db, traderId: string) {
  await db
    .delete(schema.listings)
    .where(and(eq(schema.listings.sellerId, traderId), notLike(schema.listings.id, "listing-%")));
  await db
    .delete(schema.inventoryItems)
    .where(and(eq(schema.inventoryItems.userId, traderId), notLike(schema.inventoryItems.id, "inv-%")));
  await db.update(schema.inventoryItems).set({ listingId: null }).where(eq(schema.inventoryItems.userId, traderId));
}

/** The catalog item each seeded inventory row is a copy of, keyed by the mock's id. */
const INVENTORY_ITEMS: Record<string, string> = {
  butterfly: "butterfly-doppler",
  "dragon-lore": "awp-dragon-lore",
  vice: "sport-gloves-vice",
  "case-hardened": "ak-case-hardened",
  manifold: "manifold-paradox",
  printstream: "m4a1s-printstream",
};

/**
 * Links inventory rows to their catalog items, so they can be listed. Runs in
 * the final pass, after every seed that adds catalog items.
 */
export async function linkInventoryItems(db: Db, traderId: string) {
  for (const [id, slug] of Object.entries(INVENTORY_ITEMS)) {
    const [item] = await db.select({ id: schema.items.id }).from(schema.items).where(eq(schema.items.slug, slug));
    await db
      .update(schema.inventoryItems)
      .set({ itemId: item?.id ?? null })
      .where(eq(schema.inventoryItems.id, `inv-${traderId}-${id}`));
  }
}

export async function seedSell(db: Db, traderId: string, vendorId: string) {
  await clearStudioWrites(db, traderId);
  await seedInventory(db, traderId);
  await seedActiveListings(db, traderId, vendorId);

  await db
    .update(schema.profiles)
    .set({ inventoryCounts: sell.gameCounts })
    .where(eq(schema.profiles.userId, traderId));

  return { inventory: sell.inventory.length, active: ACTIVE.length };
}

async function seedInventory(db: Db, traderId: string) {
  for (const [order, item] of sell.inventory.entries()) {
    const row = {
      id: `inv-${traderId}-${item.id}`,
      userId: traderId,
      gameId: item.game,
      assetId: `steam-${item.id}`,
      name: item.name,
      marker: item.marker,
      rarityLabel: item.rarity,
      wearLabel: item.wear,
      floatLabel: item.float,
      rankLabel: item.rank ?? null,
      imageUrl: item.image,
      imageAlt: item.imageAlt,
      priceCents: cents(item.price),
      floorCents: cents(item.floor),
      wearPct: item.wearPct,
      tone: item.tone,
      sortOrder: order,
    } satisfies typeof schema.inventoryItems.$inferInsert;

    await db
      .insert(schema.inventoryItems)
      .values(row)
      .onConflictDoUpdate({ target: schema.inventoryItems.id, set: row });
  }
}

/** These three must be the trader's newest listings so the studio shows them. */
async function seedActiveListings(db: Db, traderId: string, vendorId: string) {
  const bidders = await seedBidders(db, vendorId);
  const now = Date.now();

  for (const entry of ACTIVE) {
    const mock = sell.activeListings.find((l) => l.id === entry.mockId);
    const itemId = `item-${entry.slug}`;

    const item = {
      id: itemId,
      gameId: entry.gameId,
      slug: entry.slug,
      name: entry.name,
      rarity: entry.rarity,
      slot: "Weapon",
      imageUrl: mock?.image ?? null,
      imageAlt: mock?.imageAlt ?? null,
    } satisfies typeof schema.items.$inferInsert;

    await db.insert(schema.items).values(item).onConflictDoUpdate({ target: schema.items.id, set: item });

    const listing = {
      id: `listing-${entry.slug}`,
      itemId,
      sellerId: traderId,
      priceCents: entry.priceCents,
      floorCents: entry.floorCents,
      status: "active" as const,
      viewCount: entry.views,
      offerCount: entry.offers.length,
      listedAt: new Date(now - entry.ageHours * HOUR),
    } satisfies typeof schema.listings.$inferInsert;

    await db.insert(schema.listings).values(listing).onConflictDoUpdate({ target: schema.listings.id, set: listing });

    await db.delete(schema.offers).where(eq(schema.offers.listingId, listing.id));
    if (entry.offers.length) {
      await db.insert(schema.offers).values(offerRows(listing.id, entry.slug, entry.offers, bidders, now));
    }
  }
}
