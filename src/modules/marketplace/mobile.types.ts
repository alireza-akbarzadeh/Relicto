import type { IconName } from "@/components/ui/icon";

/** Data contracts of the mobile marketplace (Stitch: "Lootora Mobile — Marketplace Trading Hub"). */

export const MOBILE_CATEGORIES = ["all", "dota2", "cs2", "arcana", "knives", "gloves", "souvenirs"] as const;
export type MobileCategory = (typeof MOBILE_CATEGORIES)[number];

export const MOBILE_SORTS = ["spikes", "movers", "price-desc", "price-asc"] as const;
export type MobileSort = (typeof MOBILE_SORTS)[number];

export const PRICE_BANDS = ["any", "under50", "50to6k", "over6k"] as const;
export type PriceBand = (typeof PRICE_BANDS)[number];

export type CategoryPill = {
  id: MobileCategory;
  label: string;
  /** Leading glyph, e.g. the flame on Arcanas. */
  icon?: IconName;
};

export type ListingTagTone = "plain" | "hot" | "gold" | "muted" | "indigo" | "contraband";

/** What the card's action button does. */
export type ListingAction = "escrow" | "trade" | "inspect";

export type MobileListing = {
  slug: string;
  game: "dota2" | "cs2";
  /** Category pills (besides All and the game) this listing belongs to. */
  categories: MobileCategory[];
  tag: string;
  tagTone: ListingTagTone;
  image: string;
  imageAlt: string;
  /** Wear/float or style chip over the image. */
  chip: string;
  chipTone: "muted" | "amber";
  name: string;
  subtitle: string;
  priceUsd: number;
  changePct: number;
  /** CS2 float value, when the item has one. */
  float?: number;
  action: ListingAction;
  /** Hot listing: filled action button. */
  featured?: boolean;
  saved?: boolean;
};

export type MetaSpike = { kicker: string; surge: string; headline: string; cta: string; href: string };

export type EngineTicker = { label: string; pool: string; latency: string; badge: string };

export type MarketMobileData = {
  searchPlaceholder: string;
  categories: CategoryPill[];
  spike: MetaSpike;
  listings: MobileListing[];
  ticker: EngineTicker;
};
