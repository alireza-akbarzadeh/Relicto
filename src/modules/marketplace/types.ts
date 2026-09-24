import type { IconName } from "@/components/ui/icon";

export type Ecosystem = "dota2" | "cs2" | "tf2";
export type EcosystemFilter = "all" | Ecosystem;

/** Accent colors used by badges, glows and detail text. */
export type Accent = "crimson" | "pink" | "amber" | "gold" | "cyan" | "indigo" | "muted" | "neutral";

export type BlobTone = "primary" | "secondary" | "amber" | "indigo";
export type ShadowTone = "crimson-30" | "crimson-20" | "amber-20" | "amber-25" | "cyan-20" | "indigo-30" | "indigo-25";

export type RarityKey = "arcana" | "immortal" | "ancient" | "mythical" | "rare";
export type SafeguardKey = "instantEscrow" | "verifiedSellers" | "gems" | "allStyles";
export type PricePreset = "under25" | "25to100" | "100to500" | "over500";
export type SortKey = "price-asc" | "price-desc" | "change" | "volume" | "recent";
export type ViewMode = "grid" | "list";

export type MediaBadge =
  | { kind: "escrow"; label: string }
  | { kind: "float"; value: string }
  | { kind: "fx"; label: string; icon: IconName; accent: Accent };

export type Listing = {
  /** The item slug — cards link to `/items/[id]`. */
  id: string;
  /** The exact copy on offer. An item can have several, so this is the card's identity. */
  listingId?: string;
  name: string;
  game: Ecosystem;
  rarity: RarityKey | null;
  hero?: string;
  slot?: string;
  badge: { label: string; style: "arcana" | "immortal" | "covert" | "melee" | "gloves" };
  tag: { label: string; accent: Accent; bold?: boolean };
  subtitle: string;
  detail: { label: string; accent: Accent };
  image: string;
  imageAlt: string;
  /** Corner blob behind the card and the drop shadow under the artwork. */
  glow: { blob: BlobTone; shadow: ShadowTone };
  mediaBadge: MediaBadge;
  priceUsd: number;
  change: { percent: number; window?: string };
  meta: [string, string];
  offers: number;
  safeguards: SafeguardKey[];
  listedAt: number;
  cs2?: Cs2Spec;
};

export type Mover = {
  id: string;
  badge: { label: string; accent: Accent; muted?: boolean };
  change: number;
  name: string;
  subtitle: string;
  detail: { label: string; accent: Accent };
  floorUsd: number;
  note: [string, string];
  glow: Accent;
  hover: Accent;
};

export type MoverWindow = "1h" | "24h" | "7d";

export type WearKey = "fn" | "mw" | "ft" | "ww" | "bs";
export type FloatBand = "any" | "under001" | "under01" | "over01";

/** CS2 inventory metadata; absent on Dota 2 cosmetics. */
export type Cs2Spec = { wear: WearKey; float: number; stattrak: boolean; pattern: number };

/**
 * How many active listings sit behind each facet, from the same query that
 * built the page. Keys are game ids, rarity keys, slot names and hero names.
 */
export type FacetCounts = {
  games: Record<string, number>;
  rarities: Record<string, number>;
  slots: Record<string, number>;
  heroes: Record<string, number>;
  total: number;
};

/** One page of the grid plus every tally rendered around it. */
export type MarketplaceResults = {
  items: Listing[];
  total: number;
  pages: number;
  from: number;
  to: number;
  facets: FacetCounts;
};

export type Filters = {
  query: string;
  ecosystem: EcosystemFilter;
  heroes: string[];
  rarities: RarityKey[];
  slots: string[];
  price: { min: number; max: number; preset: PricePreset | null };
  safeguards: SafeguardKey[];
  sort: SortKey;
  view: ViewMode;
  page: number;
  perPage: 24 | 48 | 96;
  /* CS2 economy facets; ignored while browsing Dota 2. */
  wear: WearKey[];
  float: FloatBand;
  stattrak: boolean;
};
