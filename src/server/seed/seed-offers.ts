/**
 * Bids on the trader's studio listings, from three funded bidders — a buyer
 * holds one open bid per copy, so each bid on a listing needs its own bidder,
 * and each bidder needs a vault the seller's Accept can actually debit.
 */
import { like } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";

type Db = NodePgDatabase<typeof schema>;

const HOUR = 60 * 60 * 1000;
const TTL = 72 * HOUR;
const BIDDER_BALANCE_CENTS = 500_000;

/** KuroSkins is seeded by `seed-trader`; the other two only ever bid. */
const NEW_BIDDERS = [
  { id: "seed-bidder-vexmarkets", name: "VexMarkets", handle: "VexMarkets", trustScore: 972, tradeCount: 812 },
  { id: "seed-bidder-orbit", name: "OrbitTrades", handle: "OrbitTrades", trustScore: 991, tradeCount: 2304 },
];

/** Placed this long ago, with this note — one entry per bid slot, highest bid first. */
const SLOTS = [
  { hoursAgo: 2, note: "Can trade right now, Steam Guard active 2+ years." },
  { hoursAgo: 9, note: null },
  { hoursAgo: 20, note: "Collector — would take it off your hands today." },
];

/**
 * Bids and their notifications made through the app carry an `offer-bid-` id
 * and an `offer:` dedupe key. Runs first, before the catalog upserts restore
 * the listings' cached offer counts.
 */
export async function clearOfferWrites(db: Db) {
  await db.delete(schema.offers).where(like(schema.offers.id, "offer-bid-%"));
  await db.delete(schema.notifications).where(like(schema.notifications.dedupeKey, "offer:%"));
}

/** The bidders, in slot order, each with a profile and a funded vault. */
export async function seedBidders(db: Db, vendorId: string) {
  for (const bidder of NEW_BIDDERS) {
    await db
      .insert(schema.user)
      .values({ id: bidder.id, name: bidder.name, email: `${bidder.handle.toLowerCase()}@relicto.seed`, emailVerified: true })
      .onConflictDoNothing();
    const profile = { id: `profile-${bidder.id}`, userId: bidder.id, handle: bidder.handle, trustScore: bidder.trustScore, tradeCount: bidder.tradeCount };
    await db.insert(schema.profiles).values(profile).onConflictDoUpdate({ target: schema.profiles.id, set: profile });
  }

  const ids = [vendorId, ...NEW_BIDDERS.map((bidder) => bidder.id)];
  for (const userId of ids) {
    await db
      .insert(schema.walletAccounts)
      .values({ id: `wallet-${userId}`, userId, balanceCents: BIDDER_BALANCE_CENTS })
      .onConflictDoUpdate({ target: schema.walletAccounts.userId, set: { balanceCents: BIDDER_BALANCE_CENTS, frozenAt: null } });
  }
  return ids;
}

/** One listing's bids, highest first, each from the next bidder. */
export function offerRows(listingId: string, slug: string, prices: number[], bidders: string[], now: number) {
  return prices.map((priceCents, index) => {
    const placed = new Date(now - SLOTS[index].hoursAgo * HOUR);
    return {
      id: `offer-seed-${slug}-${index}`,
      listingId,
      buyerId: bidders[index],
      priceCents,
      status: "pending" as const,
      note: SLOTS[index].note,
      expiresAt: new Date(placed.getTime() + TTL),
      createdAt: placed,
      updatedAt: placed,
    } satisfies typeof schema.offers.$inferInsert;
  });
}
