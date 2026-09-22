/**
 * Seeds the catalog + marketplace from the existing mock files, so the UI
 * renders identical data against Postgres. Idempotent: every row uses a
 * deterministic id derived from the mock, and re-running upserts in place.
 *
 *   npm run db:seed
 */
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { LISTINGS } from "../../modules/marketplace/data/listings.mock";
import * as schema from "../../lib/db/schema";
import { buildPriceSeries } from "./price-series";
import { seedContent } from "./seed-content";
import { seedOrders } from "./seed-orders";
import { seedTrader, targetEmail } from "./seed-trader";
import { seedWallet } from "./seed-wallet";

config({ path: ".env.local" });
config();

const GAMES = [
  { id: "dota2", name: "Dota 2", steamAppId: 570 },
  { id: "cs2", name: "Counter-Strike 2", steamAppId: 730 },
  { id: "tf2", name: "Team Fortress 2", steamAppId: 440 },
];

/** Listings need an owner; Better Auth just reads this table. */
const SELLER = {
  id: "seed-seller-relicto",
  name: "Relicto_Vault",
  email: "vault@relicto.seed",
  emailVerified: true,
  image: "/images/lootora/avatar.jpg",
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const toCents = (usd: number) => Math.round(usd * 100);

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL_UNPOOLED or DATABASE_URL");

  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool, { schema });

  await db.insert(schema.user).values(SELLER).onConflictDoNothing();

  await db
    .insert(schema.games)
    .values(GAMES)
    .onConflictDoUpdate({ target: schema.games.id, set: { name: schema.games.name } });

  // Heroes are implied by the Dota listings.
  const heroNames = [...new Set(LISTINGS.map((l) => l.hero).filter((h): h is string => Boolean(h)))];
  const heroRows = heroNames.map((name) => ({
    id: `hero-${slugify(name)}`,
    gameId: "dota2",
    slug: slugify(name),
    name,
  }));
  if (heroRows.length) {
    await db.insert(schema.heroes).values(heroRows).onConflictDoNothing();
  }
  const heroIdByName = new Map(heroNames.map((name) => [name, `hero-${slugify(name)}`]));

  for (const listing of LISTINGS) {
    const itemId = `item-${listing.id}`;
    // CS2 entries carry no rarity; their badge style is the equivalent grade.
    const rarity = (listing.rarity ?? listing.badge.style) as (typeof schema.itemRarity.enumValues)[number];

    await db
      .insert(schema.items)
      .values({
        id: itemId,
        gameId: listing.game,
        heroId: listing.hero ? heroIdByName.get(listing.hero) : null,
        slug: listing.id,
        name: listing.name,
        rarity,
        slot: listing.slot ?? null,
        imageUrl: listing.image,
        imageAlt: listing.imageAlt,
        presentation: {
          badge: listing.badge,
          tag: listing.tag,
          subtitle: listing.subtitle,
          detail: listing.detail,
          glow: listing.glow,
          mediaBadge: listing.mediaBadge,
          safeguards: listing.safeguards,
          meta: listing.meta,
        },
      })
      .onConflictDoUpdate({
        target: schema.items.id,
        set: {
          name: listing.name,
          imageUrl: listing.image,
          imageAlt: listing.imageAlt,
          slot: listing.slot ?? null,
          presentation: {
            badge: listing.badge,
            tag: listing.tag,
            subtitle: listing.subtitle,
            detail: listing.detail,
            glow: listing.glow,
            mediaBadge: listing.mediaBadge,
            safeguards: listing.safeguards,
            meta: listing.meta,
          },
          updatedAt: new Date(),
        },
      });

    const priceCents = toCents(listing.priceUsd);

    await db
      .insert(schema.listings)
      .values({
        id: `listing-${listing.id}`,
        itemId,
        sellerId: SELLER.id,
        priceCents,
        status: "active",
        wear: listing.cs2?.wear ?? null,
        float: listing.cs2?.float ?? null,
        paintSeed: listing.cs2?.pattern ?? null,
        stattrak: listing.cs2?.stattrak ?? false,
        listedAt: new Date(listing.listedAt),
        offerCount: listing.offers,
        changePercent: listing.change.percent,
        changeWindow: listing.change.window ?? null,
      })
      .onConflictDoUpdate({
        target: schema.listings.id,
        set: { priceCents, offerCount: listing.offers, updatedAt: new Date() },
      });

    // Price history behind the detail chart, ending at today's price.
    const series = buildPriceSeries(priceCents, listing.change.percent, listing.id);
    await db.delete(schema.pricePoints).where(eq(schema.pricePoints.itemId, itemId));
    await db.insert(schema.pricePoints).values(
      series.map((point) => ({
        itemId,
        venue: "relicto" as const,
        priceCents: point.priceCents,
        recordedAt: point.recordedAt,
      })),
    );
  }

  const { traderId, vendorId, handle } = await seedTrader(db, targetEmail(process.argv));
  await seedOrders(db, traderId, SELLER.id, vendorId);
  const entries = await seedWallet(db, traderId);
  const content = await seedContent(db);

  console.log(
    `seeded games=${GAMES.length} heroes=${heroRows.length} items=${LISTINGS.length} listings=${LISTINGS.length}`,
  );
  console.log(`ledger + treasury attached to ${handle} (orders=6 entries=${entries})`);
  console.log(`content posts=${content.posts} guides=${content.guides}`);
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
