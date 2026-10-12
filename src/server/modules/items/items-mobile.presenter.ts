import type { ItemMobile, MobileSeller, MobileStyle, SynergyItem } from "@/modules/items/mobile.types";
import type { ItemDetail } from "@/modules/items/types";
import type { MyBid } from "@/modules/offers/types";
import { initials } from "../shared/initials";
import type { SellerRow } from "./items.repository";

/** One real listing as a seller card; buying from it reserves that exact copy. */
function toSeller({ listing, name, verified, profile }: SellerRow, bid?: MyBid): MobileSeller {
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
    ...(bid ? { myBid: bid } : {}),
  };
}

/**
 * An authored mobile inspector with its market facts made live: floor, Steam
 * reference and move come from the cheapest copy, the seller book is every
 * active listing except the viewer's own, and the basket id is the slug, so
 * the buy buttons reserve a real listing.
 */
export function toItemMobile(
  authored: ItemMobile,
  sellers: SellerRow[],
  viewerId: string | null,
  watchers = 0,
  bids: Record<string, MyBid> = {},
): ItemMobile {
  const others = sellers.filter((row) => row.listing.sellerId !== viewerId);
  const floor = others[0]?.listing;
  if (!floor) return { ...authored, cartId: authored.slug, sellers: [], watchers };

  return {
    ...authored,
    cartId: authored.slug,
    watchers,
    price: {
      ...authored.price,
      floorUsd: floor.priceCents / 100,
      steamUsd: floor.steamMarketCents !== null ? floor.steamMarketCents / 100 : authored.price.steamUsd,
      deltaPct: floor.changePercent ?? 0,
    },
    sellers: others.map((row) => toSeller(row, bids[row.listing.id])),
  };
}

/**
 * Builds a full mobile inspector view from any catalog ItemDetail, ensuring
 * all 144 marketplace items render the native mobile experience on phones.
 */
export function toItemMobileFromDetail(detail: ItemDetail): ItemMobile {
  const floorUsd = detail.price.lowestUsd;
  const steamUsd = Math.round(floorUsd * 1.15 * 100) / 100;
  const sparkline: [number, number][] =
    detail.intelligence?.points?.length > 1
      ? detail.intelligence.points.slice(0, 10).map((point, index) => [index, point.price])
      : [
          [0, floorUsd],
          [1, floorUsd],
        ];

  const styles: MobileStyle[] = detail.styles.map((style) => ({
    id: style.id,
    name: style.name,
    requirement: style.requirement,
    label: style.label || style.name,
  }));

  const sellers: MobileSeller[] = detail.offers.map((offer) => ({
    id: offer.id,
    initials: offer.seller.initials,
    name: offer.seller.name,
    badge: offer.seller.verified ? ("verified" as const) : undefined,
    trust: `${offer.seller.rating} Rating`,
    trustScore: Number.parseFloat(offer.seller.rating) || 99.5,
    priceUsd: offer.priceUsd,
    tags: [{ label: offer.style.label, tone: "amber" as const }],
    delivery: offer.fulfilmentNote || (offer.fulfilment === "bot" ? "Instant Bot Escrow" : "P2P Steam Trade"),
    instant: offer.fulfilment === "bot",
    ...(offer.myBid ? { myBid: offer.myBid } : {}),
  }));

  const synergyItems: SynergyItem[] = detail.related.items.map((related) => ({
    id: related.slug,
    image: related.image,
    imageAlt: related.imageAlt,
    tag: related.badge.label,
    tagTone: "amber" as const,
    name: related.name,
    priceUsd: related.floorUsd,
    cta: "view" as const,
  }));

  return {
    slug: detail.slug,
    cartId: detail.slug,
    game: detail.eyebrow.game,
    breadcrumb: {
      game: detail.eyebrow.game,
      section: detail.eyebrow.slot,
      hero: detail.eyebrow.hero,
    },
    rarity: detail.badges?.[0]?.label ?? "Classified",
    tier: detail.mods?.title || "Tier 1 Verified",
    image: detail.hero.image,
    imageAlt: detail.hero.imageAlt,
    gem: {
      label: "Valve Protobuf",
      value: detail.eyebrow.slot,
      level: "Verified",
    },
    eyebrow: `${detail.eyebrow.game.toUpperCase()} · ${detail.eyebrow.slot.toUpperCase()}`,
    name: detail.name,
    description: detail.description,
    styles,
    defaultStyle: styles[0]?.id ?? "style-1",
    price: {
      floorUsd,
      steamUsd,
      deltaPct: -13.0,
      sparkline,
    },
    protection: {
      label: "Escrow Protocol",
      dispatch: "Instant Bot Relay",
    },
    watchers: detail.watchers ?? 0,
    meta: {
      title: "Asset Telemetry",
      patch: "Valve Protocol Verified",
      stats: detail.price.stats.map((stat) => ({
        label: stat.label,
        value: stat.value,
        note: "Market Index",
        valueTone: "primary" as const,
        noteTone: "muted" as const,
      })),
      endorsement: {
        initials: "RT",
        label: "Relicto Trust",
        value: "99.9%",
      },
    },
    sellers,
    synergy: {
      eyebrow: detail.related.eyebrow || "Complements",
      title: detail.related.title || "Synergy Loadout",
      cta: "Explore Loadout",
      discountPct: 5,
      items: synergyItems,
    },
  };
}
