import type { MarketMobileData } from "../mobile.types";

const img = (n: number) => `/images/lootora/market-mobile-0${n}.jpg`;

/** Mobile marketplace feed, in the order the Stitch screen shows it (the engine's trending rank). */
export const marketMobile: MarketMobileData = {
  searchPlaceholder: "Search skins, weapons, heroes...",
  categories: [
    { id: "all", label: "All Items" },
    { id: "dota2", label: "Dota 2" },
    { id: "cs2", label: "CS2" },
    { id: "arcana", label: "Arcanas", icon: "local_fire_department" },
    { id: "knives", label: "Knives" },
    { id: "gloves", label: "Gloves" },
    { id: "souvenirs", label: "Souvenirs" },
  ],
  spike: {
    kicker: "Patch 7.38c Meta Spike",
    surge: "+12.4% Surge",
    headline: "Mortred & PA cosmetic volume breakout",
    cta: "Alpha",
    href: "/tracker",
  },
  listings: [
    {
      slug: "butterfly-doppler", game: "cs2", categories: ["knives"], tag: "CS2 • Knife", tagTone: "plain",
      image: img(1), imageAlt: "Butterfly Knife with a Doppler Phase 4 finish", chip: "FN 0.014", chipTone: "muted",
      name: "★ Butterfly Knife", subtitle: "Doppler Phase 4", priceUsd: 3150, changePct: 4.8, float: 0.014, action: "escrow",
    },
    {
      slug: "manifold-paradox", game: "dota2", categories: ["arcana"], tag: "Hot Alpha", tagTone: "hot",
      image: img(2), imageAlt: "Phantom Assassin Manifold Paradox arcana blades", chip: "Style 3 Unlocked", chipTone: "amber",
      name: "Manifold Paradox", subtitle: "Exalted Arcana", priceUsd: 118.5, changePct: 12.4, action: "trade", featured: true, saved: true,
    },
    {
      slug: "awp-dragon-lore", game: "cs2", categories: ["souvenirs"], tag: "Gold Major", tagTone: "gold",
      image: img(3), imageAlt: "AWP Dragon Lore with gold tournament stickers", chip: "FT 0.218", chipTone: "muted",
      name: "AWP | Dragon Lore", subtitle: "Souvenir Cobblestone", priceUsd: 5200, changePct: 0.6, float: 0.218, action: "inspect",
    },
    {
      slug: "ak-fire-serpent", game: "cs2", categories: [], tag: "NiKo Signature", tagTone: "muted",
      image: img(4), imageAlt: "AK-47 Fire Serpent rifle", chip: "FT 0.165", chipTone: "muted",
      name: "AK-47 | Serpent", subtitle: "Bravo Collection", priceUsd: 740, changePct: 6.1, float: 0.165, action: "escrow",
    },
    {
      slug: "dark-artistry-cape", game: "dota2", categories: [], tag: "OG • bzm Spec", tagTone: "indigo",
      image: img(5), imageAlt: "Invoker Dark Artistry Cape", chip: "Immortal", chipTone: "muted",
      name: "Dark Artistry Cape", subtitle: "Invoker Persona", priceUsd: 210, changePct: 5.2, action: "trade",
    },
    {
      slug: "m4a4-howl", game: "cs2", categories: [], tag: "Contraband", tagTone: "contraband",
      image: img(6), imageAlt: "M4A4 Howl rifle", chip: "MW 0.082", chipTone: "muted",
      name: "M4A4 | Howl", subtitle: "Contraband Tier", priceUsd: 4420, changePct: 14.8, float: 0.082, action: "escrow",
    },
  ],
  ticker: { label: "24h Engine Pool", pool: "$1,842,910.40 USD", latency: "9ms WS", badge: "Steam Escrow" },
};
