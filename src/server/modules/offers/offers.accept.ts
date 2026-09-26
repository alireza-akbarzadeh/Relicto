import "server-only";

import { and, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { escrowEvents, items, ledgerEntries, listings, offers, orderItems, orders, walletAccounts } from "@/lib/db/schema";
import { buildOrderRows, orderCode } from "../checkout/checkout.order-rows";
import { draft, type NotificationDraft } from "../notifications/notifications.catalog";
import type { NotificationRow } from "../notifications/notifications.repository";
import { notificationService } from "../notifications/notifications.service";
import { recount } from "./offers.repository";

export type AcceptResult =
  | { status: "accepted"; code: string; notices: NotificationRow[] }
  /** The buyer's vault can't cover the bid any more; the bid lapses and they're told. */
  | { status: "buyer-short"; notices: NotificationRow[] }
  | { status: "not-found" | "expired" | "listing-gone" };

const FUNDING = "Relicto Vault · Accepted Offer";

/**
 * The seller takes a bid. In one transaction the buyer's vault funds an escrow
 * order at the bid price — the same rows checkout writes, so the tracker, the
 * ledger, the escrow webhook and the payout all work unchanged — the copy is
 * reserved, and every other open bid on it is declined.
 *
 * Locks run wallet → listing → offer, the order checkout takes, so an accept
 * and a purchase of the same copy can't deadlock; one of them simply loses.
 */
export async function acceptOffer(sellerId: string, offerId: string): Promise<AcceptResult> {
  return db.transaction(async (tx): Promise<AcceptResult> => {
    const [peek] = await tx.select({ buyerId: offers.buyerId, listingId: offers.listingId }).from(offers).where(eq(offers.id, offerId));
    if (!peek) return { status: "not-found" };

    const [wallet] = await tx.select().from(walletAccounts).where(eq(walletAccounts.userId, peek.buyerId)).for("update");
    const [line] = await tx
      .select({ listing: listings, name: items.name, slug: items.slug, rarity: items.rarity, imageUrl: items.imageUrl, imageAlt: items.imageAlt })
      .from(listings)
      .innerJoin(items, eq(listings.itemId, items.id))
      .where(eq(listings.id, peek.listingId))
      .for("update", { of: [listings] });
    const [offer] = await tx.select().from(offers).where(eq(offers.id, offerId)).for("update");

    if (!line || !offer || line.listing.sellerId !== sellerId || offer.status !== "pending") return { status: "not-found" };
    if (line.listing.status !== "active") return { status: "listing-gone" };

    const now = new Date();
    const bid = { offerId, item: line.name, bidCents: offer.priceCents };
    if (offer.expiresAt && offer.expiresAt <= now) {
      await tx.update(offers).set({ status: "expired" }).where(eq(offers.id, offerId));
      await recount(tx, line.listing.id, now);
      return { status: "expired" };
    }

    if (!wallet || wallet.frozenAt || wallet.balanceCents < offer.priceCents) {
      await tx.update(offers).set({ status: "expired" }).where(eq(offers.id, offerId));
      await recount(tx, line.listing.id, now);
      const notices = await notificationService.record(tx, [
        draft.offerDeclined({ ...bid, buyerId: offer.buyerId, slug: line.slug, reason: "short" }),
      ]);
      return { status: "buyer-short", notices };
    }

    const code = orderCode();
    const balance = wallet.balanceCents - offer.priceCents;
    const rows = buildOrderRows({ cartId: offer.id, ...line }, {
      buyerId: offer.buyerId, code, totalCents: offer.priceCents, walletId: wallet.id, balanceAfterCents: balance, now,
      fundingLabel: FUNDING, agreedCents: offer.priceCents,
    });

    await tx.insert(orders).values(rows.order);
    await tx.insert(orderItems).values(rows.item);
    await tx.insert(escrowEvents).values(rows.events);
    await tx.insert(ledgerEntries).values(rows.debit);
    await tx.update(walletAccounts).set({ balanceCents: balance }).where(eq(walletAccounts.id, wallet.id));
    await tx.update(listings).set({ status: "reserved" }).where(eq(listings.id, line.listing.id));
    await tx.update(offers).set({ status: "accepted", orderId: rows.order.id }).where(eq(offers.id, offerId));

    // The copy is spoken for: every other open bid on it is off the table.
    const outbid = await tx
      .update(offers)
      .set({ status: "declined" })
      .where(and(eq(offers.listingId, line.listing.id), eq(offers.status, "pending"), ne(offers.id, offerId)))
      .returning({ id: offers.id, buyerId: offers.buyerId, priceCents: offers.priceCents });
    await recount(tx, line.listing.id, now);

    const drafts: NotificationDraft[] = [
      draft.offerAccepted({ ...bid, buyerId: offer.buyerId, code }),
      // The seller accepted here, but the "send the trade offer" to-do belongs in their bell with a link.
      draft.orderReceived({ code, item: line.name, sellerId, totalCents: offer.priceCents }),
      ...outbid.map((other) =>
        draft.offerDeclined({ offerId: other.id, item: line.name, bidCents: other.priceCents, buyerId: other.buyerId, slug: line.slug, reason: "sold" }),
      ),
    ];
    const notices = await notificationService.record(tx, drafts);
    return { status: "accepted", code, notices };
  });
}
