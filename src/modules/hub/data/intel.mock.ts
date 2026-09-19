import type { DeltaRow, Loadout, SellerIncentive, Thread } from "../types";

export const patchDelta: DeltaRow[] = [
  {
    id: "7.38c-coup",
    patch: "Patch 7.38c: Coup de Grace",
    change: "+15% Critical scale multiplier",
    asset: "Manifold Paradox (Exalted)",
    tone: "crimson",
    preFloorUsd: 105.4,
    floorUsd: 118.5,
    deltaPct: 12.4,
    volume24h: 142,
    status: "PRICE SPIKE",
  },
  {
    id: "7.38c-hook",
    patch: "Patch 7.38c: Meat Hook Velocity",
    change: "+100 Hook Speed & cast radius",
    asset: "Feast of Abscession Arcana",
    tone: "cyan",
    preFloorUsd: 42.8,
    floorUsd: 46.7,
    deltaPct: 9.1,
    volume24h: 89,
    status: "BUFFED META",
  },
  {
    id: "cs2-june-m4a4",
    patch: "CS2 June 11 Update: M4A4 Falloff",
    change: "Lethal headshot range increased by 400u",
    asset: "M4A4 Howl & Eye of Horus",
    tone: "amber",
    preFloorUsd: 3850,
    floorUsd: 4420,
    deltaPct: 14.8,
    volume24h: 37,
    status: "HIGH LIQUIDITY",
  },
];

export const scrapedMarkets = 14;

export const loadouts: Loadout[] = [
  {
    id: "yatoro",
    initials: "TS",
    player: "Yatoro",
    tag: { label: "TI CHAMPION", tone: "amber" },
    role: "Role: Hard Carry // Team Spirit",
    appraisalTone: "crimson",
    items: [
      { slot: "Weapon Arcana", tone: "crimson", name: "Manifold Paradox", priceUsd: 118.5 },
      { slot: "Immortal Mace", tone: "indigo", name: "Voidhammer", priceUsd: 142 },
      { slot: "Dual Blades", tone: "amber", name: "Golden Basher", priceUsd: 174.5 },
    ],
    guarantee: { label: "Instant 1-Click Vault Sync Guarantee", tone: "amber" },
    cta: { label: "Equip & Buy Bundle (-10%)", variant: "buy" },
  },
  {
    id: "m0nesy",
    initials: "G2",
    player: "m0NESY",
    tag: { label: "AWP PRODIGY", tone: "cyan" },
    role: "Role: Primary Sniper // G2 Esports",
    appraisalTone: "amber",
    items: [
      { slot: "Covert Sniper", tone: "amber", name: "AWP Dragon Lore FN", priceUsd: 5200 },
      { slot: "★ Knife", tone: "cyan", name: "Butterfly Doppler P4", priceUsd: 3800 },
      { slot: "★ Specialist Gloves", tone: "crimson", name: "Crimson Kimono", priceUsd: 3800 },
    ],
    guarantee: { label: "Official PGL Copenhagen Verified Float", tone: "cyan" },
    cta: { label: "Inspect Steam Inventory", variant: "inspect" },
  },
];

export const threads: Thread[] = [
  {
    id: "titan-kato-slate",
    votes: 382,
    title: "4x Titan Katowice 2014 Holo on AK-47 Slate vs Case Hardened",
    excerpt: "Discussion on whether dark modern CS2 lighting favors jet black finishes for high-tier legacy stickers.",
    author: "@CHROMA_CRAFTER",
    age: "18m",
    channel: { label: "CS2 TACTICAL", tone: "amber" },
  },
  {
    id: "valve-739-cleave",
    votes: 219,
    title: "Valve 7.39 Speculation: Sven & Magnus Cleave overhaul cosmetic impact",
    excerpt: "Evaluating pre-emptive buy orders for Vigil Triumph and Shock of the Anvil before TI Qualifiers conclude.",
    author: "@AEGIS_BROKER",
    age: "1h",
    channel: { label: "DOTA 2 SPECULATION", tone: "crimson" },
  },
];

export const newThreads = 42;

/** 18:42:10 left on the zero-fee listing window. */
export const incentive: SellerIncentive = { patch: "7.38c", endsInSeconds: 18 * 3600 + 42 * 60 + 10 };
