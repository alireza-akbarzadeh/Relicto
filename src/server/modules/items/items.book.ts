import type { ItemDetail, Offer } from "@/modules/items/types";
import type { MyBid } from "@/modules/offers/types";
import { initials } from "../shared/initials";
import type { SellerRow } from "./items.repository";

export type SellerBook = Pick<ItemDetail, "offers" | "offersNote" | "offerStyles">;

/**
 * One real copy in the item page's seller book. Buying from it reserves that
 * exact listing, and a bid on it is a bid on that copy.
 */
function toBookRow({ listing, name, verified, profile }: SellerRow, index: number, bid: MyBid | undefined): Offer {
  const handle = profile?.handle ?? name;
  const trades = profile?.tradeCount ?? 0;

  return {
    id: listing.id,
    listingId: listing.id,
    seller: {
      initials: initials(handle),
      name: handle,
      rating: profile ? `${profile.trustScore / 10}% · ${trades.toLocaleString("en-US")} trades` : "House inventory",
      tone: index === 0 ? "emerald" : "neutral",
      verified,
    },
    style: { label: listing.stattrak ? "StatTrak™" : "Standard", tone: listing.stattrak ? "amber" : "cyan" },
    quality: listing.wear ? listing.wear.toUpperCase() : "Standard",
    gems: listing.intel?.[0] ?? listing.sellerNote ?? (listing.paintSeed ? `Seed #${listing.paintSeed}` : "—"),
    fulfilment: "bot",
    fulfilmentNote: listing.botName ?? "Instant bot escrow",
    priceUsd: listing.priceCents / 100,
    priceNote: listing.float !== null ? `Float ${listing.float.toFixed(4)}` : "Verified escrow",
    ...(index === 0 ? { best: true } : {}),
    ...(bid ? { myBid: bid } : {}),
  };
}

/**
 * Every copy the viewer can buy, cheapest first. Their own listings are left
 * out — you can't buy from or bid on yourself — as on the mobile inspector.
 */
export function toSellerBook(sellers: SellerRow[], viewerId: string, bids: Record<string, MyBid>): SellerBook {
  const book = sellers.filter((row) => row.listing.sellerId !== viewerId);
  const offers = book.map((row, index) => toBookRow(row, index, bids[row.listing.id]));
  return {
    offers,
    offersNote: `${book.length} verified seller${book.length === 1 ? "" : "s"}`,
    // The style pills filter by label prefix, so they come from the rows themselves.
    offerStyles: ["ALL", ...new Set(offers.map((offer) => offer.style.label))],
  };
}
