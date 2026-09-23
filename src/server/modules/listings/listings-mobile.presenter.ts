import type { Listing } from "@/modules/marketplace/types";
import type { ListingTagTone, MobileCategory, MobileListing } from "@/modules/marketplace/mobile.types";

/** Desktop tag accents in the mobile card's narrower palette. */
const TAG_TONE: Record<string, ListingTagTone> = {
  crimson: "hot", pink: "hot", amber: "gold", gold: "gold", indigo: "indigo", cyan: "plain",
};

function categories(listing: Listing): MobileCategory[] {
  const found: MobileCategory[] = [];
  if (listing.rarity === "arcana") found.push("arcana");
  if (listing.badge.style === "melee") found.push("knives");
  if (listing.badge.style === "gloves") found.push("gloves");
  if (/souvenir/i.test(`${listing.subtitle} ${listing.tag.label}`)) found.push("souvenirs");
  return found;
}

function toMobileListing(listing: Listing, saved: Set<string>): MobileListing {
  const cs2 = listing.cs2;

  return {
    slug: listing.id,
    game: listing.game === "cs2" ? "cs2" : "dota2",
    categories: categories(listing),
    tag: listing.tag.label,
    tagTone: TAG_TONE[listing.tag.accent] ?? "muted",
    image: listing.image,
    imageAlt: listing.imageAlt,
    // A CS2 copy is known by its wear and float; a Dota item by its style or slot.
    chip: cs2 ? `${cs2.wear.toUpperCase()} ${cs2.float.toFixed(3)}` : listing.detail.label,
    chipTone: cs2 ? "muted" : "amber",
    name: listing.name,
    subtitle: listing.subtitle,
    priceUsd: listing.priceUsd,
    changePct: listing.change.percent,
    ...(cs2 ? { float: cs2.float } : {}),
    // CS2 settles through bot escrow; Dota cosmetics trade peer to peer.
    action: listing.game === "cs2" ? "escrow" : "trade",
    ...(saved.has(listing.id) ? { saved: true } : {}),
  };
}

/**
 * The mobile trading feed: one card per item at its floor, ranked by how hard
 * it is moving, with the hottest mover featured. Same catalog as desktop.
 */
export function toMobileFeed(catalog: Listing[], watched: string[]): MobileListing[] {
  const saved = new Set(watched);
  const floor = new Map<string, Listing>();
  for (const listing of catalog) {
    if (listing.game === "tf2") continue;
    const best = floor.get(listing.id);
    if (!best || listing.priceUsd < best.priceUsd) floor.set(listing.id, listing);
  }

  const ranked = [...floor.values()].sort((a, b) => b.change.percent - a.change.percent);
  return ranked.map((listing, index) => ({
    ...toMobileListing(listing, saved),
    ...(index === 0 ? { featured: true } : {}),
  }));
}
