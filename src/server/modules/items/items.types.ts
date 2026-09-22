import type { ItemPresentation } from "@/lib/db/schema";

/** Row shapes the item repository returns, shared with the presenter. */

export type ItemRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  gameId: string;
  rarity: string | null;
  slot: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  steamClassId: string | null;
  presentation: ItemPresentation | null;
  heroName: string | null;
};

export type ListingRow = {
  id: string;
  priceCents: number;
  wear: string | null;
  float: number | null;
  paintSeed: number | null;
  stattrak: boolean;
  offerCount: number;
  changePercent: number | null;
  changeWindow: string | null;
  listedAt: Date;
};

export type ItemStyleRow = {
  id: string;
  label: string;
  name: string;
  requirement: string | null;
  note: string | null;
};

export type PricePointRow = { priceCents: number; recordedAt: Date };

export type RelatedRow = {
  slug: string;
  name: string;
  rarity: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  presentation: ItemPresentation | null;
  priceCents: number;
};
