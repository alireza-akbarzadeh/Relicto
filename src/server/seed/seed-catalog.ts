/**
 * Catalog depth behind the eighteen designed items.
 *
 * The designed rows are the screens' pixel reference and are seeded elsewhere;
 * these exist so the marketplace's facets, pagination and totals count real
 * rows. Ids are prefixed `item-cat-` / `listing-cat-`, so depth is always
 * distinguishable from the designed catalog and `db:seed` stays idempotent.
 *
 * Everything is written in bulk: 145 items over a remote branch is minutes of
 * round trips row by row, and a seed nobody wants to re-run stops being run.
 */
import { inArray, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";
import { artworkFor, hash, presentationFor } from "./catalog/catalog-presentation";
import type { CatalogSeedItem } from "./catalog/catalog.types";
import { CS2_ITEMS } from "./catalog/cs2-items";
import { DOTA_ITEMS } from "./catalog/dota-items";
import { TF2_ITEMS } from "./catalog/tf2-items";
import { buildPriceSeries } from "./price-series";

type Db = NodePgDatabase<typeof schema>;

const ITEMS: CatalogSeedItem[] = [...DOTA_ITEMS, ...CS2_ITEMS, ...TF2_ITEMS];

const HOUR = 60 * 60 * 1000;
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Keeps each bulk insert well under Postgres' 65535 bound parameters. */
const chunk = <T>(rows: T[], size: number) =>
  Array.from({ length: Math.ceil(rows.length / size) }, (_, i) => rows.slice(i * size, (i + 1) * size));

/** 24h move, offer count and age — derived from the slug so re-seeds don't drift. */
function marketFacts(item: CatalogSeedItem) {
  const h = hash(item.slug);
  return {
    /** −8.0% … +12.0%, two decimals. */
    changePercent: Math.round(((h % 2001) / 100 - 8) * 100) / 100,
    offers: h % 180,
    /** Spread over the last 30 days so "Recently Listed" orders meaningfully. */
    listedAt: new Date(Date.now() - (h % 720) * HOUR),
  };
}

export async function seedCatalogDepth(db: Db, sellerId: string) {
  /* Heroes first — the marketplace hero facet joins through them. */
  const heroNames = [...new Set(ITEMS.map((i) => i.hero).filter((h): h is string => Boolean(h)))];
  const heroRows = heroNames.map((name) => ({ id: `hero-${slugify(name)}`, gameId: "dota2", slug: slugify(name), name }));
  if (heroRows.length) await db.insert(schema.heroes).values(heroRows).onConflictDoNothing();

  const itemRows: (typeof schema.items.$inferInsert)[] = [];
  const listingRows: (typeof schema.listings.$inferInsert)[] = [];
  const pricePoints: (typeof schema.pricePoints.$inferInsert)[] = [];

  for (const item of ITEMS) {
    const itemId = `item-cat-${item.slug}`;
    const { changePercent, offers, listedAt } = marketFacts(item);
    const art = artworkFor(item);
    const priceCents = Math.round(item.priceUsd * 100);

    itemRows.push({
      id: itemId,
      gameId: item.gameId,
      heroId: item.hero ? `hero-${slugify(item.hero)}` : null,
      slug: item.slug,
      name: item.name,
      rarity: item.rarity,
      slot: item.slot,
      imageUrl: art.url,
      imageAlt: art.alt,
      presentation: presentationFor(item, offers),
    });

    listingRows.push({
      id: `listing-cat-${item.slug}`,
      itemId,
      sellerId,
      priceCents,
      status: "active",
      wear: item.wear ?? null,
      float: item.float ?? null,
      /** Gloves carry no pattern index; the tuple stores 0 for "not applicable". */
      paintSeed: item.pattern ? item.pattern : null,
      stattrak: item.stattrak ?? false,
      listedAt,
      offerCount: offers,
      changePercent,
      changeWindow: null,
    });

    for (const point of buildPriceSeries(priceCents, changePercent, item.slug)) {
      pricePoints.push({ itemId, venue: "relicto", priceCents: point.priceCents, recordedAt: point.recordedAt });
    }
  }

  for (const rows of chunk(itemRows, 200)) {
    await db
      .insert(schema.items)
      .values(rows)
      .onConflictDoUpdate({
        target: schema.items.id,
        set: {
          name: sql`excluded.name`,
          heroId: sql`excluded.hero_id`,
          rarity: sql`excluded.rarity`,
          slot: sql`excluded.slot`,
          imageUrl: sql`excluded.image_url`,
          imageAlt: sql`excluded.image_alt`,
          presentation: sql`excluded.presentation`,
          updatedAt: new Date(),
        },
      });
  }

  for (const rows of chunk(listingRows, 200)) {
    await db
      .insert(schema.listings)
      .values(rows)
      .onConflictDoUpdate({
        target: schema.listings.id,
        set: {
          priceCents: sql`excluded.price_cents`,
          status: sql`excluded.status`,
          wear: sql`excluded.wear`,
          float: sql`excluded.float`,
          paintSeed: sql`excluded.paint_seed`,
          stattrak: sql`excluded.stattrak`,
          listedAt: sql`excluded.listed_at`,
          offerCount: sql`excluded.offer_count`,
          changePercent: sql`excluded.change_percent`,
          updatedAt: new Date(),
        },
      });
  }

  /* The detail page's chart reads this series. Replaced, not appended. */
  await db.delete(schema.pricePoints).where(
    inArray(
      schema.pricePoints.itemId,
      itemRows.map((row) => row.id!),
    ),
  );
  for (const rows of chunk(pricePoints, 2000)) {
    await db.insert(schema.pricePoints).values(rows);
  }

  return { items: ITEMS.length, heroes: heroRows.length };
}
