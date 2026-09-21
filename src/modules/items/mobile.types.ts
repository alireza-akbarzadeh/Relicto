/** Data contracts of the mobile item inspector (Stitch: "Lootora Mobile — Item Detail: PA Manifold Paradox"). */

export type MobileStyle = {
  /** Same ids as the desktop style progression, so `?style=` works on both. */
  id: string;
  requirement: string;
  name: string;
  /** Full label shown above the matrix, e.g. "STYLE 3 · BLOOD RAVEN". */
  label: string;
};

export type SellerTagTone = "plain" | "amber" | "indigo" | "crimson";

export type MobileSeller = {
  id: string;
  initials: string;
  name: string;
  badge?: "check_circle" | "verified";
  trust: string;
  /** Trust score used for sorting, e.g. 99.8. */
  trustScore: number;
  priceUsd: number;
  tags: { label: string; tone: SellerTagTone }[];
  delivery: string;
  /** Automated bot delivery (vs. direct P2P). */
  instant: boolean;
};

export type SynergyItem = {
  id: string;
  image: string;
  imageAlt: string;
  tag: string;
  tagTone: "muted" | "crimson" | "amber";
  name: string;
  /** Price in USD, or a note for items that aren't sold separately. */
  priceUsd?: number;
  note?: string;
  cta: "view" | "add";
};

export type MetaStat = { label: string; value: string; note: string; valueTone: "primary" | "plain"; noteTone: "muted" | "amber" };

export type ItemMobile = {
  slug: string;
  /** Basket line id (the checkout mock keys the Manifold Paradox as "manifold"). */
  cartId: string;
  game: string;
  breadcrumb: { game: string; section: string; hero: string };
  rarity: string;
  tier: string;
  image: string;
  imageAlt: string;
  gem: { label: string; value: string; level: string };
  eyebrow: string;
  name: string;
  description: string;
  styles: MobileStyle[];
  defaultStyle: string;
  price: { floorUsd: number; steamUsd: number; deltaPct: number; sparkline: [number, number][] };
  protection: { label: string; dispatch: string };
  meta: { title: string; patch: string; stats: MetaStat[]; endorsement: { initials: string; label: string; value: string } };
  sellers: MobileSeller[];
  synergy: { eyebrow: string; title: string; cta: string; discountPct: number; items: SynergyItem[] };
};
