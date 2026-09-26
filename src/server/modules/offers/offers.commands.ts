import "server-only";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { z } from "zod";
import { db } from "@/lib/db";
import { items, listings, offers, walletAccounts } from "@/lib/db/schema";
import { checkBid, OFFER_TTL_HOURS, toCents } from "@/modules/offers/lib/bid-rules";
import { draft } from "../notifications/notifications.catalog";
import type { NotificationRow } from "../notifications/notifications.repository";
import { notificationService } from "../notifications/notifications.service";
import type { makeOfferInput } from "./offers.schema";
import { recount } from "./offers.repository";

const HOUR = 60 * 60 * 1000;

export type MakeResult =
  | { status: "placed" | "revised"; offerId: string; notices: NotificationRow[] }
  | { status: "not-listed" | "own-listing" | "too-low" | "at-price" | "insufficient-funds" | "vault-frozen" };

/**
 * Places a bid on one copy, or revises the buyer's open bid on it. Nothing is
 * held yet: the vault only has to cover the bid now, and is debited when the
 * seller accepts. Offer-made ids carry a `bid` prefix so the seed can undo them.
 */
export async function makeOffer(buyerId: string, input: z.infer<typeof makeOfferInput>): Promise<MakeResult> {
  return db.transaction(async (tx): Promise<MakeResult> => {
    // Locking the copy serialises a bid against the seller accepting another.
    const [row] = await tx
      .select({ listing: listings, name: items.name })
      .from(listings)
      .innerJoin(items, eq(listings.itemId, items.id))
      .where(and(eq(listings.id, input.listingId), eq(listings.status, "active")))
      .for("update", { of: [listings] });
    if (!row) return { status: "not-listed" };
    if (row.listing.sellerId === buyerId) return { status: "own-listing" };

    const bidCents = toCents(input.amountUsd);
    const check = checkBid(bidCents, row.listing.priceCents);
    if (check !== "ok") return { status: check };

    const [wallet] = await tx.select().from(walletAccounts).where(eq(walletAccounts.userId, buyerId)).limit(1);
    if (wallet?.frozenAt) return { status: "vault-frozen" };
    if (!wallet || wallet.balanceCents < bidCents) return { status: "insufficient-funds" };

    const now = new Date();
    const fields = { priceCents: bidCents, note: input.note || null, expiresAt: new Date(now.getTime() + OFFER_TTL_HOURS * HOUR) };
    const [open] = await tx
      .select({ id: offers.id })
      .from(offers)
      .where(and(eq(offers.listingId, row.listing.id), eq(offers.buyerId, buyerId), eq(offers.status, "pending")))
      .for("update");

    const offerId = open?.id ?? `offer-bid-${randomUUID()}`;
    if (open) await tx.update(offers).set(fields).where(eq(offers.id, offerId));
    else await tx.insert(offers).values({ id: offerId, listingId: row.listing.id, buyerId, ...fields });
    await recount(tx, row.listing.id, now);

    const notices = await notificationService.record(tx, [
      draft.offerReceived({ offerId, item: row.name, bidCents, sellerId: row.listing.sellerId, askCents: row.listing.priceCents }),
    ]);
    return { status: open ? "revised" : "placed", offerId, notices };
  });
}

/** The buyer pulls their own open bid. */
export async function withdrawOffer(buyerId: string, offerId: string) {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(offers)
      .set({ status: "withdrawn" })
      .where(and(eq(offers.id, offerId), eq(offers.buyerId, buyerId), eq(offers.status, "pending")))
      .returning({ listingId: offers.listingId });
    if (row) await recount(tx, row.listingId);
    return Boolean(row);
  });
}

export type DeclineResult = { status: "declined"; notices: NotificationRow[] } | { status: "not-found" };

/** The seller turns a bid down; the buyer hears about it. */
export async function declineOffer(sellerId: string, offerId: string): Promise<DeclineResult> {
  return db.transaction(async (tx): Promise<DeclineResult> => {
    const [row] = await tx
      .select({ offer: offers, sellerId: listings.sellerId, name: items.name, slug: items.slug })
      .from(offers)
      .innerJoin(listings, eq(offers.listingId, listings.id))
      .innerJoin(items, eq(listings.itemId, items.id))
      .where(and(eq(offers.id, offerId), eq(offers.status, "pending")))
      .for("update", { of: [offers] });
    if (!row || row.sellerId !== sellerId) return { status: "not-found" };

    await tx.update(offers).set({ status: "declined" }).where(eq(offers.id, offerId));
    await recount(tx, row.offer.listingId);

    const notices = await notificationService.record(tx, [
      draft.offerDeclined({
        offerId, item: row.name, bidCents: row.offer.priceCents, buyerId: row.offer.buyerId, slug: row.slug, reason: "declined",
      }),
    ]);
    return { status: "declined", notices };
  });
}
