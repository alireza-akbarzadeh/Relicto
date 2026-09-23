import type { ItemPresentation } from "@/lib/db/schema";
import type { Accent, BlobTone, Ecosystem, Listing, MediaBadge, RarityKey, ShadowTone, WearKey } from "@/modules/marketplace/types";

/** Grades that exist as `RarityKey` in the UI; CS2 grades render as `null`. */
const UI_RARITIES = new Set<string>(["arcana", "immortal", "ancient", "mythical", "rare"]);

export type ListingRow = {
  id: string;
  priceCents: number;
  wear: string | null;
  float: number | null;
  paintSeed: number | null;
  stattrak: boolean;
  listedAt: Date;
  offerCount: number;
  changePercent: number | null;
  changeWindow: string | null;
  item: {
    slug: string;
    name: string;
    gameId: string;
    rarity: string | null;
    slot: string | null;
    imageUrl: string | null;
    imageAlt: string | null;
    presentation: ItemPresentation | null;
  };
  heroName: string | null;
};

/**
 * Rebuilds the marketplace card contract from stored facts plus the item's
 * authored art direction, so components keep their existing `Listing` type.
 */
export function toListingView(row: ListingRow): Listing {
  const p = row.item.presentation;

  return {
    id: row.item.slug,
    listingId: row.id,
    name: row.item.name,
    game: row.item.gameId as Ecosystem,
    rarity: row.item.rarity && UI_RARITIES.has(row.item.rarity) ? (row.item.rarity as RarityKey) : null,
    hero: row.heroName ?? undefined,
    slot: row.item.slot ?? undefined,
    badge: (p?.badge ?? { label: row.item.name, style: "arcana" }) as Listing["badge"],
    tag: (p?.tag ?? { label: row.item.gameId.toUpperCase(), accent: "neutral" }) as Listing["tag"],
    subtitle: p?.subtitle ?? row.heroName ?? "",
    detail: (p?.detail ?? { label: row.item.slot ?? "", accent: "neutral" }) as { label: string; accent: Accent },
    image: row.item.imageUrl ?? "",
    imageAlt: row.item.imageAlt ?? row.item.name,
    glow: (p?.glow ?? { blob: "primary", shadow: "crimson-20" }) as { blob: BlobTone; shadow: ShadowTone },
    mediaBadge: (p?.mediaBadge ?? { kind: "escrow", label: "Instant Escrow" }) as MediaBadge,
    priceUsd: row.priceCents / 100,
    change: { percent: row.changePercent ?? 0, window: row.changeWindow ?? undefined },
    meta: p?.meta ?? ["", ""],
    offers: row.offerCount,
    safeguards: (p?.safeguards ?? []) as Listing["safeguards"],
    listedAt: row.listedAt.getTime(),
    ...(row.wear
      ? {
          cs2: {
            wear: row.wear as WearKey,
            float: row.float ?? 0,
            stattrak: row.stattrak,
            pattern: row.paintSeed ?? 0,
          },
        }
      : {}),
  };
}
