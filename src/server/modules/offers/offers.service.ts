import "server-only";

import { db } from "@/lib/db";
import type { BuyerBid, IncomingOffer, MyBid } from "@/modules/offers/types";
import { acceptOffer } from "./offers.accept";
import { counterOffer, declineOffer, makeOffer, withdrawOffer } from "./offers.commands";
import { toBuyerBids, toIncomingOffers, toMyBid } from "./offers.presenter";
import * as repo from "./offers.repository";

export const offerService = {
  /** Bids waiting on the seller's answer, newest first. */
  async incoming(sellerId: string): Promise<IncomingOffer[]> {
    return toIncomingOffers(await repo.findIncoming(sellerId));
  },

  /** Open bids placed by the buyer across the market. */
  async outgoing(buyerId: string): Promise<BuyerBid[]> {
    return toBuyerBids(await repo.findOutgoing(buyerId));
  },

  /** The buyer's open bids on these copies, keyed by listing id. */
  async bids(buyerId: string, listingIds: string[]): Promise<Record<string, MyBid>> {
    const rows = await repo.findBids(buyerId, listingIds);
    return Object.fromEntries(rows.map((row) => [row.listingId, toMyBid(row)]));
  },

  make: makeOffer,
  withdraw: withdrawOffer,
  decline: declineOffer,
  counter: counterOffer,
  accept: acceptOffer,

  /**
   * Retires bids whose window closed. Reads already ignore them; this keeps the
   * rows and the cached "Open Offers" counts honest for everyone else.
   */
  async expireLapsed(now = new Date()) {
    const lapsed = await repo.findLapsed(now);
    if (lapsed.length === 0) return 0;
    await repo.expire(lapsed.map((row) => row.id));
    for (const listingId of new Set(lapsed.map((row) => row.listingId))) await repo.recount(db, listingId, now);
    return lapsed.length;
  },
};
