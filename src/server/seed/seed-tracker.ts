/**
 * Tracker terminal, seeded from `tracker.mock`: the watch board, cross-venue
 * depth for the focused asset, and the arbitrage spread rows.
 */
import { and, eq, isNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";
import { tracker } from "../../modules/tracker/data/tracker.mock";

type Db = NodePgDatabase<typeof schema>;

const cents = (label: string) => Math.round(Number(label.replace(/[^0-9.]/g, "")) * 100);
const pct = (label: string) => Number(label.replace(/[^0-9.\-]/g, ""));

/** An asset the board watches that the catalog didn't carry yet. */
const DRAGON_LORE = {
  id: "item-awp-dragon-lore",
  gameId: "cs2",
  slug: "awp-dragon-lore",
  name: "AWP | Dragon Lore",
  rarity: "covert" as const,
  slot: "Weapon",
  imageUrl: "/images/lootora/sell-items-02.jpg",
  imageAlt: "AWP Dragon Lore with a fire-breathing dragon across a golden olive body",
  presentation: {
    badge: { label: "Covert", style: "covert" },
    tag: { label: "CS2", accent: "amber", bold: true },
    subtitle: "Souvenir Collection",
    detail: { label: "Weapon", accent: "neutral" },
    glow: { blob: "primary", shadow: "crimson-20" },
    mediaBadge: { kind: "float" as const, value: "0.0140" },
    safeguards: ["escrow"],
    meta: ["Floor: $5,200.00", "6 active offers"],
  },
} satisfies typeof schema.items.$inferInsert;

/** Which catalog item each board row follows. */
const BOARD: Record<string, string> = {
  butterfly: "butterfly-doppler",
  manifold: "manifold-paradox",
  case: "ak-case-hardened",
  awp: "awp-dragon-lore",
};

/** Which item the depth book and chart are focused on. */
const FOCUS = "item-butterfly-doppler";

export async function seedTracker(db: Db, traderId: string) {
  await db.insert(schema.items).values(DRAGON_LORE).onConflictDoUpdate({ target: schema.items.id, set: DRAGON_LORE });

  const dragonListing = {
    id: "listing-awp-dragon-lore",
    itemId: DRAGON_LORE.id,
    sellerId: traderId,
    priceCents: 520000,
    status: "active" as const,
    wear: "fn" as const,
    float: 0.014,
    offerCount: 6,
    changePercent: 6.4,
    /** Behind the seller studio's own three, which the studio screen shows. */
    listedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  } satisfies typeof schema.listings.$inferInsert;

  await db.insert(schema.listings).values(dragonListing).onConflictDoUpdate({ target: schema.listings.id, set: dragonListing });

  await seedBoard(db, traderId);
  await seedBook(db);
  await seedSpreads(db);

  return { assets: tracker.assets.length, levels: tracker.orderBook.length, spreads: tracker.spreads.length };
}

async function seedBoard(db: Db, traderId: string) {
  for (const [order, asset] of tracker.assets.entries()) {
    const slug = BOARD[asset.id];
    if (!slug) continue;

    const row = {
      id: `watch-${traderId}-${slug}`,
      userId: traderId,
      itemId: `item-${slug}`,
      label: asset.name,
      detail: asset.detail,
      thumbnailUrl: asset.image,
      icon: asset.icon,
      tone: asset.tone,
      sortOrder: order,
    } satisfies typeof schema.watchlist.$inferInsert;

    await db.insert(schema.watchlist).values(row).onConflictDoUpdate({ target: schema.watchlist.id, set: row });
  }

  /**
   * The board's 24h move is the listing's, so it is only filled in for assets
   * that arrived without one. Items the marketplace already quotes keep their
   * own figure — the two mocks disagree, and the catalog is the source of truth.
   */
  for (const asset of tracker.assets) {
    const slug = BOARD[asset.id];
    if (!slug) continue;

    await db
      .update(schema.listings)
      .set({ changePercent: pct(asset.change) })
      .where(and(eq(schema.listings.itemId, `item-${slug}`), isNull(schema.listings.changePercent)));
  }
}

async function seedBook(db: Db) {
  await db.delete(schema.orderBookLevels).where(eq(schema.orderBookLevels.itemId, FOCUS));

  await db.insert(schema.orderBookLevels).values(
    tracker.orderBook.map((level) => ({
      itemId: FOCUS,
      source: level.source,
      side: level.side,
      priceCents: cents(level.price),
      totalCents: cents(level.total),
    })),
  );
}

/**
 * Catalog item and best secondary venue behind each spread row. The venues are
 * the ones the mobile arbitrage cards name at those same prices.
 */
const SPREAD_SOURCES: Record<string, { slug?: string; venue?: string }> = {
  bfk: { slug: "butterfly-doppler", venue: "Buff163" },
  pa: { slug: "manifold-paradox", venue: "Skinport" },
  ak: {},
  awp: { slug: "awp-fade" },
};

async function seedSpreads(db: Db) {
  for (const [order, spread] of tracker.spreads.entries()) {
    const stated = cents(spread.spread.split(" ")[0]);
    const net = cents(spread.yield);

    const source = SPREAD_SOURCES[spread.id] ?? {};
    const row = {
      id: `spread-${spread.id}`,
      itemId: source.slug ? `item-${source.slug}` : null,
      secondaryVenue: source.venue ?? null,
      asset: spread.asset,
      detail: spread.detail,
      floorCents: cents(spread.floor),
      steamCents: cents(spread.steam),
      secondaryCents: cents(spread.secondary),
      /** Back out the platform take the mock's yield implies. */
      feeBps: stated === 0 ? 1200 : Math.round((1 - net / stated) * 10000),
      tone: spread.tone,
      sortOrder: order,
    } satisfies typeof schema.marketSpreads.$inferInsert;

    await db.insert(schema.marketSpreads).values(row).onConflictDoUpdate({ target: schema.marketSpreads.id, set: row });
  }
}
