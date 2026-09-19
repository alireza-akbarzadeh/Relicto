import type { IconName } from "@/components/ui/icon";
import type { EcosystemFilter, PricePreset, RarityKey, SafeguardKey, SortKey } from "../types";

export const ECOSYSTEMS: { value: EcosystemFilter; label: string; icon: IconName; count: number; tone: string }[] = [
  { value: "all", label: "All Ecosystems", icon: "apps", count: 142_890, tone: "" },
  { value: "dota2", label: "Dota 2", icon: "shield", count: 64_210, tone: "text-primary-container" },
  { value: "cs2", label: "Counter-Strike 2", icon: "target", count: 58_420, tone: "text-tertiary" },
  { value: "tf2", label: "Team Fortress 2", icon: "military_tech", count: 20_260, tone: "text-status-upcoming" },
];

export const TRENDING_TAGS = [
  { emoji: "🔥", label: "Crownfall Arcanas", query: "Arcana", hover: "hover:text-primary" },
  { emoji: "⚡", label: "Doppler Phase 2", query: "Doppler", hover: "hover:text-tertiary" },
  { emoji: "🗡️", label: "Phantom Assassin Paradox", query: "Manifold Paradox", hover: "hover:text-text-primary" },
  { emoji: "💎", label: "Souvenir Dragon Lore", query: "Dragon Lore", hover: "hover:text-status-upcoming" },
  { emoji: "🎯", label: "Kato 2014 Holo", query: "Kato 2014", hover: "hover:text-secondary" },
];

/** A slice of the 124 heroes; the first six show as chips until the user searches. */
export const HEROES = [
  "Phantom Assassin", "Invoker", "Pudge", "Juggernaut", "Anti-Mage", "Shadow Fiend",
  "Crystal Maiden", "Faceless Void", "Lina", "Legion Commander", "Terrorblade", "Queen of Pain",
  "Spectre", "Sniper", "Windranger", "Tinker", "Rubick", "Storm Spirit", "Earthshaker", "Axe",
];

export const RARITIES: { value: RarityKey; label: string; count: number; check: string }[] = [
  { value: "arcana", label: "Arcana", count: 218, check: "bg-primary-container text-on-primary-container" },
  { value: "immortal", label: "Immortal", count: 1_842, check: "bg-tertiary text-on-tertiary" },
  { value: "ancient", label: "Ancient", count: 94, check: "bg-secondary text-on-secondary" },
  { value: "mythical", label: "Mythical", count: 6_430, check: "bg-secondary-container text-on-secondary-container" },
  { value: "rare", label: "Rare & Exalted", count: 14_102, check: "bg-status-upcoming text-canvas-base" },
];

export const SLOTS = [
  { value: "Weapon", count: 482 },
  { value: "Head", count: 312 },
  { value: "Armor", count: 240 },
  { value: "Back", count: 198 },
  { value: "Taunts", count: 64 },
  { value: "Couriers", count: 115 },
];

export const PRICE_PRESETS: { value: PricePreset; label: string; min: number; max: number }[] = [
  { value: "under25", label: "<$25", min: 0, max: 25 },
  { value: "25to100", label: "$25-$100", min: 25, max: 100 },
  { value: "100to500", label: "$100-$500", min: 100, max: 500 },
  { value: "over500", label: "$500+", min: 500, max: 100_000 },
];

export const SAFEGUARDS: { value: SafeguardKey; label: string; chip?: string }[] = [
  { value: "instantEscrow", label: "Instant Bot Escrow (<60s)", chip: "Instant Escrow Only" },
  { value: "verifiedSellers", label: "Verified Sellers (98%+)" },
  { value: "gems", label: "With Kinetic / Prismatic Gems" },
  { value: "allStyles", label: "Unlocked All Styles" },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "price-asc", label: "Sort: Lowest Price" },
  { value: "price-desc", label: "Sort: Highest Price" },
  { value: "change", label: "Sort: 24h Price Change %" },
  { value: "volume", label: "Sort: Most Active (Volume)" },
  { value: "recent", label: "Sort: Recently Listed" },
];

export const PER_PAGE_OPTIONS = [
  { value: "24", label: "24" },
  { value: "48", label: "48" },
  { value: "96", label: "96" },
] as const;

/** Server-side totals shown on the designed screen. */
export const CATALOG_META = { total: 1_248, pages: 64, telemetry: "Telemetry updated 3 seconds ago via Steam Trading Node #8" };
