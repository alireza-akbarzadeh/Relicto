import type { IconName } from "@/components/ui/icon";

/** Accent tones used across the profile; mapped to classes in `lib/tones.ts`. */
export type Tone = "crimson" | "amber" | "indigo" | "cyan" | "white" | "muted" | "live";

export type RankChip = {
  label: string;
  value: string;
  tone: Tone;
  /** Leading dot instead of an icon. */
  dot?: boolean;
  icon?: IconName;
};

export type TraderIdentity = {
  handle: string;
  realName: string;
  alias: string;
  role: string;
  tier: string;
  steamId: string;
  openId: string;
  avatar: string;
  avatarAlt: string;
  banner: string;
  bannerAlt: string;
  telemetry: { label: string; tone?: Tone; pulse?: boolean }[];
  ranks: RankChip[];
  trust: { score: string; trades: string };
  tradeUrl: string;
  handshake: string;
};

export type ProfileStat = {
  label: string;
  icon: IconName;
  tone: Tone;
  value: string;
  unit: { label: string; tone: Tone; mono?: boolean; bold?: boolean };
  foot: { left: string; right: string; tone: Tone; icon?: IconName };
};

export type ShowcaseItem = {
  id: string;
  kicker: string;
  name: string;
  subtitle: string;
  priceUsd: number;
  tone: Tone;
  image: string;
  imageAlt: string;
  badge: { icon: IconName; label: string };
  meter: { label: string; value: string; pct: number; gradient?: boolean };
  foot: { left: string; right: string };
};

export type ListingBadge = "indigo" | "crimson" | "amber";

export type Listing = {
  id: string;
  image: string;
  imageAlt: string;
  badge: { label: string; variant: ListingBadge };
  meta: string;
  name: string;
  detail: string;
  priceUsd: number;
  priceTone: Tone;
  note: string;
  noteTone: Tone;
};

export type StatusRow = {
  id: string;
  icon: IconName;
  iconTone: Tone;
  title: string;
  detail: string;
  status: string;
  statusTone: Tone;
};

export type Endorsement = { label: string; value: string; pct: number; tone: Tone };

export type Review = { id: string; author: string; age: string; quote: string };

export type ProfileTab = "showcase" | "listings" | "watchlist" | "reviews" | "linked" | "safeguards";

/**
 * One item on the trader's watchlist. Private to them — this is buying intent,
 * not a public collection. The floor is the cheapest copy on sale right now, so
 * `floorUsd` is null when nobody is selling.
 */
export type WatchedItem = {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  gameLabel: string;
  rarityLabel: string;
  tone: Tone;
  floorUsd: number | null;
  changePercent: number | null;
  /** The copy "Add to basket" would reserve; null when none is on sale. */
  listingId: string | null;
  sellerCount: number;
  watchedAgo: string;
};

export type ProfileData = {
  identity: TraderIdentity;
  stats: ProfileStat[];
  showcase: ShowcaseItem[];
  listings: Listing[];
  /** Listings visible on the default tab. */
  listingsShown: number;
  watchlist: WatchedItem[];
  security: StatusRow[];
  lastHandshake: string;
  endorsements: Endorsement[];
  reviews: Review[];
  linked: StatusRow[];
  safeguards: StatusRow[];
  inventoryCount: number;
  reviewCount: number;
};
