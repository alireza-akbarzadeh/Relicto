import type { PriceIntelligence, ItemDetail } from "../types";

const DAY = 86_400_000;
const DAY_ZERO = Date.UTC(2025, 10, 28);

export const manifoldIntelligence: PriceIntelligence = {
  ranges: ["24H", "7D", "30D", "90D", "1Y", "ALL"],
  activeRange: "30D",
  modes: ["LINE", "CANDLE"],
  activeMode: "LINE",
  points: [
    { at: DAY_ZERO - 30 * DAY, price: 108.2 },
    { at: DAY_ZERO - 25 * DAY, price: 111.4 },
    { at: DAY_ZERO - 20 * DAY, price: 110.1 },
    { at: DAY_ZERO - 15 * DAY, price: 114.2, marker: "patch" },
    { at: DAY_ZERO - 10 * DAY, price: 139.0 },
    { at: DAY_ZERO - 7 * DAY, price: 124.5, marker: "event" },
    { at: DAY_ZERO - 3 * DAY, price: 121.3 },
    { at: DAY_ZERO, price: 118.5, marker: "now" },
  ],
  annotations: [
    {
      id: "patch",
      at: DAY_ZERO - 15 * DAY,
      label: "PATCH 7.38c",
      tone: "crimson",
      title: "Stifling Dagger Buff",
      detail: "+12% Hero Pickrate • +6.4% Surge",
      detailTone: "emerald",
    },
    {
      id: "crownfall",
      at: DAY_ZERO - 7 * DAY,
      label: "CROWNFALL ACT IV",
      tone: "cyan",
      title: "Assassin Token Synergy",
      detail: "Demand spikes 240+ volume units",
      detailTone: "amber",
    },
  ],
  stats: [
    { label: "30-Day Peak High", value: "$139.00 USD", note: "Recorded on Nov 18", tone: "primary" },
    { label: "30-Day Floor Low", value: "$108.20 USD", note: "Recorded on Oct 29", tone: "primary" },
    { label: "Volatility Index", value: "4.2%", note: "Stable esports blue-chip", tone: "emerald", badge: "LOW" },
    { label: "Market Cap Standing", value: "#14 Overall", note: "Across Dota 2 cosmetic assets", tone: "amber" },
  ],
};

export const manifoldMods: ItemDetail["mods"] = {
  eyebrow: "HERO ATTRIBUTES & CUSTOM METRICS",
  title: "Dota 2 Engine Modifications",
  items: [
    {
      id: "coup",
      icon: "swords",
      tone: "live",
      title: "Coup de Grâce Decapitation",
      body: "Replaces standard red blood splatter with an explosion of shattered spectral timeline shards and a bloody etched rune mark.",
    },
    {
      id: "tombstones",
      icon: "qr_code_2",
      tone: "amber",
      title: "Memorial Blade Tombstones",
      body: "Killed heroes leave a persistent paradox blade gravestone etched into the battlefield turf for the remainder of the match.",
    },
    {
      id: "vignette",
      icon: "blur_on",
      tone: "cyan",
      title: "Custom Blur Vignette",
      body: "Hero transparency active state casts an eerie chromatic aberration across the caster's HUD and surrounding units.",
    },
    {
      id: "voice",
      icon: "record_voice_over",
      tone: "indigo",
      title: "Over 300 Custom Voice Lines",
      body: "Dual-layered demonic and melancholic voice processing recorded by Ellen McLain with unique hero interaction callouts.",
    },
  ],
  lore: {
    quote:
      "With a rasping laugh, the senior smith of the Clandestine Crafters Guild struck the anvil with his hammer. He had forged the blade in darkness, cooling it in blood, and tempered it with the cold breath of the Nether. Mortred tested the edge against her fingertips; where her blood touched the steel, the steel glowed cyan. The sisters of the Veil had found their retribution.",
    source: "Valve Archive Entry #PA-412 • The Nemesis Assassin Event",
    verified: "Verified Canonical Lore",
  },
};

export const manifoldReplay: ItemDetail["replay"] = {
  eyebrow: "VFX TELEMETRY REPLAY",
  quality: "1080P · 60FPS",
  title: "Memorial Blade Decapitation Kill",
  image: "/images/lootora/item-detail-03.jpg",
  imageAlt: "Phantom Assassin landing a critical strike in game",
  caption: "Coup de Grâce [R] Crit Effect",
  damage: "450% Burst Damage Frame",
  alertPrice: "110.00",
};

export const manifoldRelated: ItemDetail["related"] = {
  eyebrow: "HERO LOADOUT COMBINATIONS",
  title: "Frequently Paired with Manifold Paradox",
  items: [
    {
      id: "asan",
      slug: "asan-exile-unveiled",
      badge: { label: "HERO PERSONA", variant: "persona" },
      kicker: "Base Model Transformation",
      name: "Asan — Exile Unveiled",
      blurb: "Male assassin persona with custom animations, voice pack, and lore progression.",
      floorUsd: 78.2,
      image: "/images/lootora/item-detail-04.jpg",
      imageAlt: "Asan, the male Phantom Assassin persona",
    },
    {
      id: "codicil",
      slug: "codicil-of-the-veiled-ones",
      badge: { label: "IMMORTAL HELM", variant: "helm" },
      kicker: "Head Slot Synergy",
      name: "Codicil of the Veiled Ones",
      blurb: "Custom Stifling Dagger effect, golden shadow trail, and dual paradox color matching.",
      floorUsd: 34.9,
      image: "/images/lootora/item-detail-05.jpg",
      imageAlt: "Codicil of the Veiled Ones immortal helm",
    },
    {
      id: "gothic-whisper",
      slug: "gothic-whisper-bundle",
      badge: { label: "COLLECTOR'S CACHE", variant: "cache" },
      kicker: "Ultra Rare Armor Set",
      name: "Gothic Whisper Bundle",
      blurb: "TI9 Collector cache exclusive. Extreme rarity with perfect armor geometry for Arcana blades.",
      floorUsd: 165,
      image: "/images/lootora/item-detail-06.jpg",
      imageAlt: "Gothic Whisper collector's cache armor set",
    },
  ],
};
