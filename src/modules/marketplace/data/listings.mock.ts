import type { Listing } from "../types";

const img = (name: string) => `/images/lootora/items/${name}.jpg`;
const DAY = 86_400_000;
const NOW = Date.UTC(2025, 8, 19);

/** The eight listings on the Stitch marketplace screen, in design order. */
export const LISTINGS: Listing[] = [
  {
    id: "manifold-paradox", name: "Manifold Paradox", game: "dota2", rarity: "arcana", hero: "Phantom Assassin", slot: "Weapon",
    badge: { label: "Arcana", style: "arcana" }, tag: { label: "Exalted", accent: "neutral" },
    subtitle: "Phantom Assassin", detail: { label: "Style 3 Molten", accent: "amber" },
    image: img("manifold-paradox"), imageAlt: "Phantom Assassin's Manifold Paradox blades on a dark pedestal",
    glow: { blob: "primary", shadow: "crimson-30" }, mediaBadge: { kind: "escrow", label: "Instant Escrow" },
    priceUsd: 118.5, change: { percent: 1.8 }, meta: ["Floor: $118.50", "Median: $122.00"], offers: 124,
    safeguards: ["instantEscrow", "verifiedSellers"], listedAt: NOW - 2 * DAY,
  },
  {
    id: "dragonclaw-hook", name: "Dragonclaw Hook", game: "dota2", rarity: "immortal", hero: "Pudge", slot: "Weapon",
    badge: { label: "Immortal", style: "immortal" }, tag: { label: "Corrupted", accent: "indigo" },
    subtitle: "Pudge", detail: { label: "Clean Vintage", accent: "indigo" },
    image: img("dragonclaw-hook"), imageAlt: "Pudge's Dragonclaw Hook on an obsidian surface",
    glow: { blob: "secondary", shadow: "amber-20" }, mediaBadge: { kind: "escrow", label: "Instant Escrow" },
    priceUsd: 164, change: { percent: 3.4 }, meta: ["Floor: $162.50", "Vol: 41 trades/24h"], offers: 41,
    safeguards: ["instantEscrow"], listedAt: NOW - 5 * DAY,
  },
  {
    id: "awp-fade", name: "AWP | Fade", game: "cs2", rarity: null, slot: "Weapon",
    badge: { label: "Covert", style: "covert" }, tag: { label: "CS2", accent: "amber", bold: true },
    subtitle: "Factory New", detail: { label: "99.4% Fade", accent: "amber" },
    image: img("awp-fade"), imageAlt: "AWP with a 99.4% Fade finish",
    glow: { blob: "primary", shadow: "crimson-20" }, mediaBadge: { kind: "float", value: "0.014" },
    priceUsd: 1280, change: { percent: 5.6, window: "7d" }, meta: ["Direct Trade", "19 active offers"], offers: 19,
    safeguards: ["verifiedSellers"], listedAt: NOW - 1 * DAY,
    cs2: { wear: "fn", float: 0.014, stattrak: false, pattern: 909 },
  },
  {
    id: "bladeform-legacy", name: "Bladeform Legacy", game: "dota2", rarity: "arcana", hero: "Juggernaut", slot: "Head",
    badge: { label: "Arcana", style: "arcana" }, tag: { label: "Origins", accent: "neutral" },
    subtitle: "Juggernaut", detail: { label: "Mask Slot", accent: "amber" },
    image: img("bladeform-legacy"), imageAlt: "Juggernaut's Bladeform Legacy mask with teal spirit energy",
    glow: { blob: "primary", shadow: "cyan-20" }, mediaBadge: { kind: "escrow", label: "Style 2 Unlocked" },
    priceUsd: 34.5, change: { percent: -1.2 }, meta: ["Floor: $34.50", "High Volume"], offers: 210,
    safeguards: ["instantEscrow", "verifiedSellers", "allStyles"], listedAt: NOW - 9 * DAY,
  },
  {
    id: "butterfly-doppler", name: "Butterfly Knife | Doppler", game: "cs2", rarity: null, slot: "Weapon",
    badge: { label: "★ Melee", style: "melee" }, tag: { label: "Covert", accent: "neutral" },
    subtitle: "Phase 4", detail: { label: "Sapphire Blue", accent: "indigo" },
    image: img("butterfly-doppler"), imageAlt: "Butterfly Knife with a Doppler Phase 4 blade",
    glow: { blob: "secondary", shadow: "indigo-30" }, mediaBadge: { kind: "escrow", label: "Instant Steam Trade" },
    priceUsd: 3150, change: { percent: 11.2, window: "30d" }, meta: ["Verified Escrow", "8 offers"], offers: 8,
    safeguards: ["instantEscrow", "verifiedSellers"], listedAt: NOW - 3 * DAY,
    cs2: { wear: "fn", float: 0.0112, stattrak: true, pattern: 412 },
  },
  {
    id: "codicil-veiled", name: "Codicil of the Veiled Ones", game: "dota2", rarity: "immortal", hero: "Phantom Assassin", slot: "Head",
    badge: { label: "Immortal", style: "immortal" }, tag: { label: "Golden", accent: "amber", bold: true },
    subtitle: "Phantom Assassin", detail: { label: "Head Slot", accent: "amber" },
    image: img("codicil-veiled"), imageAlt: "Phantom Assassin's golden Codicil of the Veiled Ones cowl",
    glow: { blob: "amber", shadow: "amber-25" }, mediaBadge: { kind: "fx", label: "Custom Stifling FX", icon: "auto_awesome", accent: "amber" },
    priceUsd: 34.9, change: { percent: 4.1 }, meta: ["Floor: $34.90", "76 active offers"], offers: 76,
    safeguards: ["verifiedSellers", "gems"], listedAt: NOW - 6 * DAY,
  },
  {
    id: "dark-artistry-cape", name: "Dark Artistry Cape", game: "dota2", rarity: "immortal", hero: "Invoker", slot: "Back",
    badge: { label: "Immortal", style: "immortal" }, tag: { label: "Exalted", accent: "indigo" },
    subtitle: "Invoker", detail: { label: "Back / Collar", accent: "indigo" },
    image: img("dark-artistry-cape"), imageAlt: "Invoker's Dark Artistry cape with cosmic runes",
    glow: { blob: "indigo", shadow: "indigo-25" }, mediaBadge: { kind: "fx", label: "Custom Sunstrike", icon: "flare", accent: "indigo" },
    priceUsd: 89, change: { percent: -0.5 }, meta: ["Floor: $89.00", "52 active offers"], offers: 52,
    safeguards: ["gems"], listedAt: NOW - 12 * DAY,
  },
  {
    id: "sport-gloves-vice", name: "Sport Gloves | Vice", game: "cs2", rarity: null, slot: "Armor",
    badge: { label: "★ Gloves", style: "gloves" }, tag: { label: "CS2", accent: "amber", bold: true },
    subtitle: "Field-Tested", detail: { label: "Neon Vice Tier", accent: "pink" },
    image: img("sport-gloves-vice"), imageAlt: "Sport Gloves in the neon pink and cyan Vice finish",
    glow: { blob: "primary", shadow: "crimson-30" }, mediaBadge: { kind: "float", value: "0.18" },
    priceUsd: 1420, change: { percent: 2.9, window: "7d" }, meta: ["Instant Bot", "14 active offers"], offers: 14,
    safeguards: ["instantEscrow"], listedAt: NOW - 4 * DAY,
    cs2: { wear: "ft", float: 0.1804, stattrak: false, pattern: 571 },
  },
];

export const RECENTLY_VIEWED = [
  { id: "manifold-paradox", name: "Manifold Paradox", image: img("thumb-manifold-paradox"), price: "$118.50", accent: "amber" },
  { id: "asan-exile", name: "Asan - Exile Unveiled", image: img("thumb-asan-exile"), price: "Unmarketable (Gift)", accent: "indigo" },
  { id: "butterfly-doppler", name: "Butterfly Knife | Doppler", image: img("thumb-butterfly-doppler"), price: "$3,150.00", accent: "amber" },
  { id: "awp-fade", name: "AWP | Fade", image: img("thumb-awp-fade"), price: "$1,280.00", accent: "amber" },
] as const;
