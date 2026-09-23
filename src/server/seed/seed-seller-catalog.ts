/**
 * The six items on the profile's listings tab are real catalog entries owned by
 * the trader, so they behave like any other listing — including showing up on
 * the marketplace. Facts the profile mock states as prose (float, offer count,
 * floor, Steam reference) become columns here.
 */
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";
import type { Listing as ProfileListing } from "../../modules/profile/types";

type Db = NodePgDatabase<typeof schema>;
type Rarity = (typeof schema.itemRarity.enumValues)[number];
type Wear = (typeof schema.itemWear.enumValues)[number];

type SellerItem = {
  slug: string;
  gameId: string;
  name: string;
  rarity: Rarity;
  slot: string;
  wear: Wear | null;
  float: number | null;
  paintSeed: number | null;
  offers: number;
  floorCents: number | null;
  steamMarketCents: number | null;
  sellerNote: string | null;
};

/** Keyed by the mock's listing id, so the two stay in step. */
const ITEMS: Record<string, SellerItem> = {
  "ak-case-hardened": {
    slug: "ak-case-hardened", gameId: "cs2", name: "AK-47 | Case Hardened", rarity: "rare", slot: "Weapon",
    wear: "mw", float: 0.0941, paintSeed: 571, offers: 2, floorCents: 39500, steamMarketCents: null, sellerNote: null,
  },
  "m4a1s-printstream": {
    slug: "m4a1s-printstream", gameId: "cs2", name: "M4A1-S | Printstream", rarity: "covert", slot: "Weapon",
    wear: "ft", float: 0.2104, paintSeed: null, offers: 0, floorCents: 16500, steamMarketCents: 17820,
    sellerNote: "4x Holographic Web Stickers",
  },
  "dark-artistry-hair": {
    slug: "dark-artistry-hair", gameId: "dota2", name: "Hair of the Dark Artistry", rarity: "immortal", slot: "Head",
    wear: null, float: null, paintSeed: null, offers: 0, floorCents: null, steamMarketCents: null,
    sellerNote: "Invoker Immortal • Sun Strike Kills: 890",
  },
  "karambit-fade": {
    slug: "karambit-fade", gameId: "cs2", name: "★ Karambit | Fade", rarity: "melee", slot: "Weapon",
    wear: "fn", float: 0.0089, paintSeed: null, offers: 0, floorCents: 184000, steamMarketCents: null,
    sellerNote: "Acid fade percentage verified",
  },
  "desert-eagle-blaze": {
    slug: "desert-eagle-blaze", gameId: "cs2", name: "Desert Eagle | Blaze", rarity: "rare", slot: "Weapon",
    wear: "fn", float: 0.0165, paintSeed: null, offers: 1, floorCents: 62000, steamMarketCents: 65840,
    sellerNote: null,
  },
  "golden-basher": {
    slug: "golden-basher", gameId: "dota2", name: "Golden Basher Blades", rarity: "immortal", slot: "Weapon",
    wear: null, float: null, paintSeed: null, offers: 0, floorCents: null, steamMarketCents: null,
    sellerNote: "Phantom Assassin • Gold variant • 1 of 12 listed",
  },
};

const GRADE: Record<string, { label: string; style: string }> = {
  rare: { label: "Classified", style: "covert" },
  covert: { label: "Covert", style: "covert" },
  melee: { label: "★ Melee", style: "melee" },
  immortal: { label: "Immortal", style: "immortal" },
};

/** These also render as marketplace cards, so they need the same art direction. */
function presentationFor(mock: ProfileListing, item: SellerItem): schema.ItemPresentation {
  return {
    badge: GRADE[item.rarity] ?? { label: item.rarity, style: item.rarity },
    tag: { label: mock.badge.label, accent: mock.badge.variant === "crimson" ? "amber" : mock.badge.variant },
    subtitle: mock.meta,
    detail: { label: item.slot, accent: "neutral" },
    glow: { blob: "primary", shadow: "crimson-20" },
    mediaBadge:
      item.float !== null
        ? { kind: "float", value: item.float.toFixed(4) }
        : { kind: "escrow", label: "Instant Escrow" },
    safeguards: ["escrow"],
    meta: [mock.note, `${item.offers} active offers`],
  };
}

const MINUTE = 60 * 1000;

export async function seedSellerCatalog(db: Db, traderId: string, mocks: ProfileListing[]) {
  const now = Date.now();

  for (const [order, mock] of mocks.entries()) {
    const item = ITEMS[mock.id];
    if (!item) continue;

    const itemRow = {
      id: `item-${item.slug}`,
      gameId: item.gameId,
      slug: item.slug,
      name: item.name,
      rarity: item.rarity,
      slot: item.slot,
      imageUrl: mock.image,
      imageAlt: mock.imageAlt,
      presentation: presentationFor(mock, item),
    } satisfies typeof schema.items.$inferInsert;

    await db.insert(schema.items).values(itemRow).onConflictDoUpdate({ target: schema.items.id, set: itemRow });

    const listingRow = {
      id: `listing-${item.slug}`,
      itemId: itemRow.id,
      sellerId: traderId,
      priceCents: Math.round(mock.priceUsd * 100),
      status: "active" as const,
      /** Staggered so the storefront's newest-first order matches the design. */
      listedAt: new Date(now - order * 30 * MINUTE),
      wear: item.wear,
      float: item.float,
      paintSeed: item.paintSeed,
      offerCount: item.offers,
      floorCents: item.floorCents,
      steamMarketCents: item.steamMarketCents,
      sellerNote: item.sellerNote,
    } satisfies typeof schema.listings.$inferInsert;

    await db.insert(schema.listings).values(listingRow).onConflictDoUpdate({ target: schema.listings.id, set: listingRow });
  }
}
