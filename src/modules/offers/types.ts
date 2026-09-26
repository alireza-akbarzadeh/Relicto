/** The viewer's own open bid on one listing, shown in that listing's row. */
export type MyBid = {
  id: string;
  priceUsd: number;
  /** "2d 23h left" */
  expires: string;
};

/** A bid on one of the seller's listings, awaiting their answer in the studio. */
export type IncomingOffer = {
  id: string;
  listingId: string;
  item: { name: string; slug: string; image: string; imageAlt: string };
  bidder: { name: string; initials: string; trust: string };
  bidUsd: number;
  askUsd: number;
  /** "-4.2%" under the ask. */
  discount: string;
  note: string | null;
  placed: string;
  expires: string;
  /** Highest open bid on its listing — accepting any other leaves money behind. */
  top: boolean;
};
