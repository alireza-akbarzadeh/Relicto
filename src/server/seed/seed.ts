/**
 * Seeds the catalog + marketplace from the existing mock files, so the UI
 * renders identical data against Postgres. Idempotent: every row uses a
 * deterministic id derived from the mock, and re-running upserts in place.
 *
 *   npm run db:seed
 */
import { config } from "dotenv";
import { and, eq, notLike } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { LISTINGS } from "../../modules/marketplace/data/listings.mock";
import * as schema from "../../lib/db/schema";
import { buildPriceSeries } from "./price-series";
import { linkAlertItems, seedAlerts } from "./seed-alerts";
import { seedCatalogDepth } from "./seed-catalog";
import { seedCheckout } from "./seed-checkout";
import { clearOfferWrites } from "./seed-offers";
import { seedContent } from "./seed-content";
import { seedOrders } from "./seed-orders";
import { linkShowcaseItems, seedProfile } from "./seed-profile";
import { linkInventoryItems, seedSell } from "./seed-sell";
import { seedTradeUps } from "./seed-trade-ups";
import { seedTrader, targetEmail } from "./seed-trader";
import { seedTournaments } from "./seed-tournaments";
import { seedTracker } from "./seed-tracker";
import { seedWallet } from "./seed-wallet";
import { KNOWN_ITEM_COLLECTIONS } from "../modules/trade-ups/trade-ups.collections";

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

const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const toCents = (usd: number) => Math.round(usd * 100);

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL_UNPOOLED or DATABASE_URL");

  const pool = new Pool({ connectionString: url });
  const db = drizzle(pool, { schema });

  await db.insert(schema.user).values(SELLER).onConflictDoNothing();
  await clearOfferWrites(db);

  await db.insert(schema.games).values(GAMES).onConflictDoUpdate({ target: schema.games.id, set: { name: schema.games.name } });

  const heroNames = [...new Set(LISTINGS.map((l) => l.hero).filter((h): h is string => Boolean(h)))];
  const heroRows = heroNames.map((name) => ({ id: `hero-${slugify(name)}`, gameId: "dota2", slug: slugify(name), name }));
  if (heroRows.length) await db.insert(schema.heroes).values(heroRows).onConflictDoNothing();
  const heroIdByName = new Map(heroNames.map((name) => [name, `hero-${slugify(name)}`]));

  for (const listing of LISTINGS) {
    const itemId = `item-${listing.id}`;
    const rarity = (listing.rarity ?? listing.badge.style) as (typeof schema.itemRarity.enumValues)[number];

    await db
      .insert(schema.items)
      .values({
        id: itemId,
        gameId: listing.game,
        heroId: listing.hero ? heroIdByName.get(listing.hero) : null,
        slug: listing.id,
        name: listing.name,
        collection: KNOWN_ITEM_COLLECTIONS[listing.name] ?? null,
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
          collection: KNOWN_ITEM_COLLECTIONS[listing.name] ?? null,
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
        set: {
          priceCents,
          offerCount: listing.offers,
          changePercent: listing.change.percent,
          changeWindow: listing.change.window ?? null,
          updatedAt: new Date(),
        },
      });

    const series = buildPriceSeries(priceCents, listing.change.percent, listing.id);
    await db.delete(schema.pricePoints).where(and(eq(schema.pricePoints.itemId, itemId), eq(schema.pricePoints.venue, "relicto"), notLike(schema.pricePoints.id, "pp-%")));
    await db.insert(schema.pricePoints).values(
      series.map((point) => ({
        itemId,
        venue: "relicto" as const,
        priceCents: point.priceCents,
        recordedAt: point.recordedAt,
      })),
    );
  }

  const depth = await seedCatalogDepth(db, SELLER.id);
  const { traderId, vendorId, handle } = await seedTrader(db, targetEmail(process.argv));
  await seedOrders(db, traderId, SELLER.id, vendorId);
  const entries = await seedWallet(db, traderId);
  const content = await seedContent(db);
  const profile = await seedProfile(db, traderId, targetEmail(process.argv) ? handle : undefined);
  const alerts = await seedAlerts(db, traderId);
  const board = await seedTracker(db, traderId);
  const studio = await seedSell(db, traderId, vendorId);
  const forge = await seedTradeUps(db, traderId);
  const basket = await seedCheckout(db, traderId, SELLER.id);
  const arena = await seedTournaments(db);

  await linkShowcaseItems(db);
  await linkAlertItems(db);
  await linkInventoryItems(db, traderId);

  console.log(`seeded catalog: games=${GAMES.length} heroes=${heroRows.length} items=${LISTINGS.length} depth=${depth.items}`);
  console.log(`attached to ${handle}: orders=6 ledger=${entries} posts=${content.posts} guides=${content.guides} showcase=${profile.showcase} alerts=${alerts}`);
  console.log(`market entities: board=${board.assets} studio=${studio.active} forge=${forge.skins} arena=${arena.tournaments} basket=${basket}`);
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
