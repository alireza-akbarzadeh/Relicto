import type { ItemMobile } from "../mobile.types";

const img = (n: number) => `/images/lootora/item-mobile-0${n}.jpg`;

/** Mobile inspector payload for the Manifold Paradox, as drawn in the Stitch mobile screen. */
export const manifoldParadoxMobile: ItemMobile = {
  slug: "manifold-paradox",
  cartId: "manifold",
  game: "Dota 2",
  breadcrumb: { game: "DOTA 2", section: "HEROES", hero: "PHANTOM ASSASSIN" },
  rarity: "EXALTED ARCANA",
  tier: "TIER 1",
  image: img(1),
  imageAlt: "Phantom Assassin Manifold Paradox dual blades",
  gem: { label: "Inscribed Kinetic Gem", value: "142 Assassinations", level: "LEVEL 3" },
  eyebrow: "MORTRED · WEAPON SLOT",
  name: "Manifold Paradox",
  description: "Dual scythe blades forged by the Oracle, echoing with the screams of past timelines and rending reality with critical strikes.",
  styles: [
    { id: "style-1", requirement: "LVL 0", name: "Asan Lore", label: "STYLE 1 · ASAN VOID" },
    { id: "style-2", requirement: "40+ KILLS", name: "Paradox Cyan", label: "STYLE 2 · SEVERING CYAN" },
    { id: "style-3", requirement: "100+ KILLS", name: "Blood Raven", label: "STYLE 3 · BLOOD RAVEN" },
  ],
  defaultStyle: "style-3",
  price: {
    floorUsd: 118.5,
    steamUsd: 148,
    deltaPct: 12.4,
    sparkline: [[0, 28], [15, 22], [30, 26], [45, 18], [60, 19], [75, 9], [90, 12], [100, 3]],
  },
  protection: { label: "P2P Escrow Vault Protection", dispatch: "~60s BOT DISPATCH" },
  meta: {
    title: "Tournament & Patch Meta",
    patch: "PATCH 7.38c",
    stats: [
      { label: "Pro Pickrate Surge", value: "+18.4%", note: "Tier 1 matches", valueTone: "primary", noteTone: "muted" },
      { label: "Tournament Winrate", value: "53.8%", note: "TI13 Play-in", valueTone: "plain", noteTone: "amber" },
    ],
    endorsement: { initials: "TS", label: "Pro Player Loadout Endorsement", value: "Favored by Yatoro · Team Spirit" },
  },
  sellers: [
    {
      id: "kuro-vault", initials: "KV", name: "Kuro_Vault", badge: "check_circle", trust: "99.8% Trust Score · 412 trades", trustScore: 99.8,
      priceUsd: 118.5, delivery: "Delivery: <60s", instant: true,
      tags: [
        { label: "Float: 0.0041", tone: "plain" },
        { label: "3 Kills Gem", tone: "plain" },
        { label: "Instant Escrow Bot", tone: "indigo" },
      ],
    },
    {
      id: "resolut-fan", initials: "RS", name: "Resolut_Fan99", badge: "verified", trust: "100% Trust Score · 98 trades", trustScore: 100,
      priceUsd: 122, delivery: "Delivery: Direct P2P (5m)", instant: false,
      tags: [
        { label: "Autographed: Resolut1on", tone: "amber" },
        { label: "Unlocked Style 3", tone: "plain" },
      ],
    },
    {
      id: "aegis-drop", initials: "AE", name: "Aegis_Drop_Trader", trust: "98.9% Trust Score · 1,204 trades", trustScore: 98.9,
      priceUsd: 125, delivery: "Delivery: Automated Escrow", instant: true,
      tags: [
        { label: "First Blood Gem (289)", tone: "crimson" },
        { label: "Clean Socket", tone: "plain" },
      ],
    },
  ],
  synergy: {
    eyebrow: "Tactical Synergies",
    title: "Matching Mortred Kit",
    cta: "EQUIP COMBO",
    discountPct: 10,
    items: [
      { id: "asan-exile", image: img(2), imageAlt: "Asan, The Exile Unveiled persona", tag: "Persona", tagTone: "muted", name: "Asan The Exile", note: "Persona Core", cta: "view" },
      { id: "codicil-veiled", image: img(3), imageAlt: "Codicil of the Veiled Ones helm", tag: "Immortal", tagTone: "crimson", name: "Codicil Veiled Ones", priceUsd: 142, cta: "add" },
      { id: "gothic-whisper", image: img(4), imageAlt: "Gothic Whisper armor set", tag: "Mythical", tagTone: "amber", name: "Gothic Whisper Set", priceUsd: 89, cta: "add" },
    ],
  },
};
