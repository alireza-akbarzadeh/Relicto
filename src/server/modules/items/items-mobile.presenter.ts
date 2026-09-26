import type { ItemMobile, MobileSeller } from "@/modules/items/mobile.types";
import { initials } from "../shared/initials";
import type { SellerRow } from "./items.repository";

/** One real listing as a seller card; buying from it reserves that exact copy. */
function toSeller({ listing, name, verified, profile }: SellerRow): MobileSeller {
  const trustScore = profile ? profile.trustScore / 10 : 100;
  const trades = profile?.tradeCount ?? 0;
  const note = listing.intel?.[0] ?? listing.sellerNote;

  return {
    id: listing.id,
    initials: initials(profile?.handle ?? name),
    name: profile?.handle ?? name,
    ...(verified ? { badge: "check_circle" as const } : {}),
    trust: profile ? `${trustScore}% Trust Score · ${trades.toLocaleString("en-US")} trades` : "Relicto house inventory",
    trustScore,
    priceUsd: listing.priceCents / 100,
    tags: note ? [{ label: note, tone: "amber" }] : [],
    delivery: listing.botName ? `Delivery: <60s · ${listing.botName}` : "Delivery: Automated Escrow",
    instant: true,
  };
}

/**
 * An authored mobile inspector with its market facts made live: floor, Steam
 * reference and move come from the cheapest copy, the seller book is every
 * active listing except the viewer's own, and the basket id is the slug, so
 * the buy buttons reserve a real listing.
 */
export function toItemMobile(authored: ItemMobile, sellers: SellerRow[], viewerId: string): ItemMobile {
  const others = sellers.filter((row) => row.listing.sellerId !== viewerId);
  const floor = others[0]?.listing;
  if (!floor) return { ...authored, cartId: authored.slug, sellers: [] };

  return {
    ...authored,
    cartId: authored.slug,
    price: {
      ...authored.price,
      floorUsd: floor.priceCents / 100,
      steamUsd: floor.steamMarketCents !== null ? floor.steamMarketCents / 100 : authored.price.steamUsd,
      deltaPct: floor.changePercent ?? 0,
    },
    sellers: others.map(toSeller),
  };
}
