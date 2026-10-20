import { calculateDeliverySla } from "@/modules/marketplace/lib/delivery-sla";
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

  const delivery = calculateDeliverySla({
    name: listing.sellerNote ?? name,
    intel: listing.intel,
    sellerNote: listing.sellerNote,
    fulfilment: index === 1 ? "p2p" : "bot",
    tradeLockDays: index === 2 ? 3 : null,
  });

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
    fulfilment: delivery.method === "p2p_trade" ? "p2p" : "bot",
    fulfilmentNote: delivery.etaTime,
    priceUsd: listing.priceCents / 100,
    priceNote: listing.float !== null ? `Float ${listing.float.toFixed(4)}` : delivery.label,
    allowOffers: listing.allowOffers ?? true,
    minOfferCents: listing.minOfferCents,
    delivery,
    ...(index === 0 ? { best: true } : {}),
    ...(bid ? { myBid: bid } : {}),
  };
}

/**
 * Every copy the viewer can buy, cheapest first. Their own listings are left
 * out — you can't buy from or bid on yourself — as on the mobile inspector.
 */
export function toSellerBook(sellers: SellerRow[], viewerId: string | null, bids: Record<string, MyBid>): SellerBook {
  const book = sellers.filter((row) => row.listing.sellerId !== viewerId);
  const offers = book.map((row, index) => toBookRow(row, index, bids[row.listing.id]));
  return {
    offers,
    offersNote: `${book.length} verified seller${book.length === 1 ? "" : "s"}`,
    // The style pills filter by label prefix, so they come from the rows themselves.
    offerStyles: ["ALL", ...new Set(offers.map((offer) => offer.style.label))],
  };
}
