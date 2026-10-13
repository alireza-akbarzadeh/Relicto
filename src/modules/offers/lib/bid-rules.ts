/**
 * What a bid must satisfy. The offer dialog and the server both read these, so
 * the form never accepts a bid the server would refuse.
 */

/** Bids under half the ask are noise to a seller, so they never reach them. */
export const MIN_BID_RATIO = 0.5;

/** An open bid lapses after three days if the seller hasn't answered. */
export const OFFER_TTL_HOURS = 72;

export type BidCheck = "ok" | "too-low" | "at-price" | "below-min-offer" | "offers-disabled";

export const minBidCents = (askCents: number, minOfferCents?: number | null) => {
  const globalFloor = Math.ceil(askCents * MIN_BID_RATIO);
  return minOfferCents && minOfferCents > 0 ? Math.max(globalFloor, minOfferCents) : globalFloor;
};

/** A bid at or above the ask is just a purchase, so it's refused in favour of Buy Now. */
export function checkBid(
  bidCents: number,
  askCents: number,
  allowOffers = true,
  minOfferCents?: number | null,
): BidCheck {
  if (!allowOffers) return "offers-disabled";
  if (bidCents >= askCents) return "at-price";
  const required = minBidCents(askCents, minOfferCents);
  if (bidCents < required) {
    return minOfferCents && minOfferCents > Math.ceil(askCents * MIN_BID_RATIO) ? "below-min-offer" : "too-low";
  }
  return "ok";
}

/** "-4.2%" — how far under the ask a bid sits. */
export function bidDiscount(bidCents: number, askCents: number) {
  if (askCents <= 0) return "0.0%";
  return `-${(((askCents - bidCents) / askCents) * 100).toFixed(1)}%`;
}

export const toCents = (usd: number) => Math.round(usd * 100);
