import type { IconName } from "@/components/ui/icon";

/** Rarity chips over the viewer and on related cards. */
export type RarityVariant = "arcana" | "exalted" | "immortal" | "persona" | "helm" | "cache";

export type ItemBadge = { label: string; variant: RarityVariant };

export type InspectMode = "spatial" | "animations" | "sound" | "equipped";

export type ArcanaStyle = {
  id: string;
  label: string;
  requirement: string;
  requirementTone: "muted" | "cyan" | "amber";
  name: string;
  note: string;
  active?: boolean;
};

export type PriceStat = { label: string; value: string; tone: "primary" | "amber" | "cyan" };

export type EscrowBadge = { icon: IconName; tone: "emerald" | "amber" | "cyan"; title: string; note: string };

export type SectionLink = { id: string; label: string };

export type OfferFulfilment = "bot" | "p2p";

export type Offer = {
  id: string;
  seller: { initials: string; name: string; rating: string; tone: "emerald" | "indigo" | "amber" | "neutral"; verified: boolean };
  style: { label: string; tone: "amber" | "cyan" };
  quality: string;
  gems: string;
  fulfilment: OfferFulfilment;
  fulfilmentNote: string;
  priceUsd: number;
  priceNote: string;
  best?: boolean;
};

/** One observed price. `at` is epoch ms; the chart scales both axes from these. */
export type PricePoint = { at: number; price: number; marker?: "patch" | "event" | "now" };

export type ChartAnnotation = {
  id: string;
  /** When it happened — the chart puts the marker on the time axis itself. */
  at: number;
  label: string;
  tone: "crimson" | "cyan";
  title: string;
  detail: string;
  detailTone: "emerald" | "amber";
};

export type ChartRange = "24H" | "7D" | "30D" | "90D" | "1Y" | "ALL";
export type ChartMode = "LINE" | "CANDLE";

export type PriceIntelligence = {
  ranges: ChartRange[];
  activeRange: ChartRange;
  modes: ChartMode[];
  activeMode: ChartMode;
  points: PricePoint[];
  annotations: ChartAnnotation[];
  stats: { label: string; value: string; note: string; tone: "primary" | "amber" | "emerald"; badge?: string }[];
};

export type SellConversion = {
  detected: string;
  style: string;
  image: string;
  imageAlt: string;
  rows: { label: string; value: string; tone: "primary" | "crimson" | "emerald" }[];
  note: string;
};

export type EngineMod = { id: string; icon: IconName; tone: "live" | "amber" | "cyan" | "indigo"; title: string; body: string };

export type RelatedItem = {
  id: string;
  slug: string;
  badge: ItemBadge;
  kicker: string;
  name: string;
  blurb: string;
  floorUsd: number;
  image: string;
  imageAlt: string;
};

export type ItemDetail = {
  slug: string;
  appId: string;
  classId: string;
  syncedAgo: string;
  breadcrumb: { label: string; href?: string; chip?: boolean }[];
  badges: ItemBadge[];
  hero: { image: string; imageAlt: string; kills: string; spatialNote: string };
  inspectModes: { id: InspectMode; label: string }[];
  styles: ArcanaStyle[];
  stylesUnlocked: string;
  eyebrow: { game: string; slot: string; hero: string };
  name: string;
  description: string;
  price: { lowestUsd: number; moveLabel: string; moveNote: string; trendLabel: string; trendNote: string; stats: PriceStat[] };
  escrow: EscrowBadge[];
  sections: SectionLink[];
  offers: Offer[];
  offersNote: string;
  offerStyles: string[];
  intelligence: PriceIntelligence;
  sell: SellConversion;
  mods: { eyebrow: string; title: string; items: EngineMod[]; lore: { quote: string; source: string; verified: string } };
  replay: { eyebrow: string; quality: string; title: string; image: string; imageAlt: string; caption: string; damage: string; alertPrice: string };
  related: { eyebrow: string; title: string; items: RelatedItem[] };
};
