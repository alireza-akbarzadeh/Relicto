/**
 * Trader profile, seeded from the `/profile` mocks so the screen renders the
 * same identity, showcase, listings, endorsements and status tabs on Postgres.
 */
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "../../lib/db/schema";
import { identity, stats } from "../../modules/profile/data/identity.mock";
import { listings as sellerListings, showcase } from "../../modules/profile/data/inventory.mock";
import { endorsements, lastHandshake, linked, reviews, safeguards, security } from "../../modules/profile/data/reputation.mock";
import { seedSellerCatalog } from "./seed-seller-catalog";

type Db = NodePgDatabase<typeof schema>;

const HOUR = 60 * 60 * 1000;

/** The mock's review ages, back-dated so `reviewAge()` reproduces them. */
const REVIEW_HOURS = [2, 26, 50, 98];

const cents = (usd: number) => Math.round(usd * 100);

/** First number in a label: "+8.4% 30d" → 8.4, "(1,482 TRADES)" → 1482. */
const num = (text: string) => Number(text.replace(/,/g, "").match(/-?\d+(\.\d+)?/)?.[0] ?? 0);

export async function seedProfile(db: Db, traderId: string) {
  const profileId = `profile-${traderId}`;

  const row = {
    id: profileId,
    userId: traderId,
    handle: identity.handle,
    realName: identity.realName,
    alias: identity.alias,
    role: identity.role,
    roleTone: "amber",
    tier: identity.tier,
    level: num(identity.ranks[0].value),
    steamId: identity.steamId,
    openId: identity.openId,
    avatar: identity.avatar,
    avatarAlt: identity.avatarAlt,
    banner: identity.banner,
    bannerAlt: identity.bannerAlt,
    tradeUrl: identity.tradeUrl,
    telemetry: identity.telemetry,
    ranks: identity.ranks,
    handshakeLabel: identity.handshake,
    lastHandshake,
    /** Trust score is stored ×10 so 99.8% survives as an integer. */
    trustScore: Math.round(num(identity.trust.score) * 10),
    tradeCount: num(identity.trust.trades),
    fulfillmentSeconds: Number(stats[2].value),
    inventoryCount: 142,
    portfolioCents: cents(num(stats[0].value)),
    portfolioChangePercent: num(stats[0].foot.right),
    reviewCount: 412,
    ratingHundredths: Math.round(Number(stats[3].value) * 100),
  } satisfies typeof schema.profiles.$inferInsert;

  await db.insert(schema.profiles).values(row).onConflictDoUpdate({ target: schema.profiles.id, set: row });

  await seedShowcase(db, profileId);
  await seedStatusRows(db, profileId);
  await seedEndorsements(db, profileId);
  await seedReviews(db, profileId);
  await seedSellerCatalog(db, traderId, sellerListings);

  return { showcase: showcase.length, listings: sellerListings.length };
}

async function seedShowcase(db: Db, profileId: string) {
  for (const [order, card] of showcase.entries()) {
    const row = {
      id: `showcase-${card.id}`,
      profileId,
      name: card.name,
      kicker: card.kicker,
      subtitle: card.subtitle,
      valueCents: cents(card.priceUsd),
      imageUrl: card.image,
      imageAlt: card.imageAlt,
      tone: card.tone,
      presentation: { badge: card.badge, meter: card.meter, foot: card.foot },
      sortOrder: order,
    } satisfies typeof schema.showcaseItems.$inferInsert;

    await db.insert(schema.showcaseItems).values(row).onConflictDoUpdate({ target: schema.showcaseItems.id, set: row });
  }
}

async function seedStatusRows(db: Db, profileId: string) {
  const groups = [
    ["security", security],
    ["linked", linked],
    ["safeguards", safeguards],
  ] as const;

  for (const [group, rows] of groups) {
    for (const [order, item] of rows.entries()) {
      const row = {
        id: `status-${group}-${item.id}`,
        profileId,
        group,
        icon: item.icon,
        iconTone: item.iconTone,
        title: item.title,
        detail: item.detail,
        status: item.status,
        statusTone: item.statusTone,
        sortOrder: order,
      } satisfies typeof schema.profileStatusRows.$inferInsert;

      await db
        .insert(schema.profileStatusRows)
        .values(row)
        .onConflictDoUpdate({ target: schema.profileStatusRows.id, set: row });
    }
  }
}

async function seedEndorsements(db: Db, profileId: string) {
  for (const [order, item] of endorsements.entries()) {
    const row = {
      id: `endorsement-${profileId}-${order}`,
      profileId,
      label: item.label,
      pct: item.pct,
      tone: item.tone,
      sortOrder: order,
    } satisfies typeof schema.profileEndorsements.$inferInsert;

    await db
      .insert(schema.profileEndorsements)
      .values(row)
      .onConflictDoUpdate({ target: schema.profileEndorsements.id, set: row });
  }
}

async function seedReviews(db: Db, profileId: string) {
  const now = Date.now();
  await db.delete(schema.reviews).where(eq(schema.reviews.profileId, profileId));

  await db.insert(schema.reviews).values(
    reviews.map((review, index) => ({
      id: `review-${review.id}`,
      profileId,
      authorHandle: review.author,
      quote: review.quote,
      rating: 5,
      createdAt: new Date(now - (REVIEW_HOURS[index] ?? 120) * HOUR),
    })),
  );
}
