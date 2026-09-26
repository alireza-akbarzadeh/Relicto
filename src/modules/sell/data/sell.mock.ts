import type { SellData } from "../types";

export const sell: SellData = {
  totalInventory: 128,
  readyToList: 6,
  /** The design's "Steam Sync: 30s ago"; the sample studio has no Steam account behind it. */
  steam: { linked: false, status: "ok", synced: "30s ago", itemCount: 0 },
  gameCounts: { cs2: 128, dota2: 46, tf2: 12 },
  inventory: [
    { id: "butterfly", game: "cs2", image: "/images/lootora/sell-items-01.jpg", imageAlt: "Butterfly Knife Doppler Phase 4", marker: "P4", name: "★ Butterfly Knife | Doppler", rarity: "Covert", wear: "Factory New", float: "0.0112", rank: "Rank #18", price: 3150, floor: 3135, delta: "+ $15.00 (+0.48%)", deltaTone: "cyan", wearPct: 11, tone: "primary" },
    { id: "dragon-lore", game: "cs2", image: "/images/lootora/sell-items-02.jpg", imageAlt: "AWP Dragon Lore", marker: "SVN", name: "AWP | Dragon Lore", rarity: "Souvenir", wear: "Field-Tested", float: "0.1824", rank: "Clean", price: 5200, floor: 5180, delta: "+ $20.00 (+0.39%)", deltaTone: "cyan", wearPct: 38, tone: "amber" },
    { id: "vice", game: "cs2", image: "/images/lootora/sell-items-03.jpg", imageAlt: "Sport Gloves Vice", marker: "EXTRA", name: "Sport Gloves | Vice", rarity: "Extraordinary", wear: "Field-Tested", float: "0.2118", price: 1420, floor: 1440, delta: "- $20.00 (-1.39%)", deltaTone: "primary", wearPct: 45, tone: "indigo" },
    { id: "case-hardened", game: "cs2", image: "/images/lootora/sell-items-04.jpg", imageAlt: "AK-47 Case Hardened", marker: "#571", name: "AK-47 | Case Hardened", rarity: "Tier 2 Gem", wear: "Well-Worn", float: "0.3860", rank: "72% Blue", price: 420, floor: 385, delta: "+ $35.00 (+9.09%)", deltaTone: "cyan", wearPct: 62, tone: "cyan" },
    { id: "manifold", game: "dota2", image: "/images/lootora/sell-items-05.jpg", imageAlt: "Manifold Paradox Arcana", marker: "ARC", name: "Manifold Paradox Arcana", rarity: "Exalted 3", wear: "Phantom Assassin", float: "1,420 Kills", price: 119.5, floor: 118, delta: "+ $1.50 (+1.27%)", deltaTone: "cyan", wearPct: 100, tone: "primary" },
    { id: "printstream", game: "cs2", image: "/images/lootora/sell-items-06.jpg", imageAlt: "M4A1-S Printstream", marker: "4x", name: "M4A1-S | Printstream", rarity: "Covert", wear: "Field-Tested", float: "0.2201", rank: "4x Holo", price: 165, floor: 162, delta: "+ $3.00 (+1.85%)", deltaTone: "cyan", wearPct: 48, tone: "indigo" },
  ],
  activeListings: [
    { id: "talon", image: "/images/lootora/sell-items-07.jpg", imageAlt: "Talon Knife Fade", name: "★ Talon Knife | Fade", price: "$1,650.00", floorDelta: "+$30.00 (+1.8%)", buyerViews: "142 Views", offers: "2 Offers (Max $1,580)", age: "12h 45m ago", tone: "cyan" },
    { id: "desert", image: "/images/lootora/sell-items-08.jpg", imageAlt: "Desert Eagle Flame", name: "Desert Eagle | Fennec Fox", price: "$620.00", floorDelta: "Exact Floor Match", buyerViews: "88 Views", offers: "0 Offers", age: "1d 6h ago", tone: "muted" },
    { id: "specialist", image: "/images/lootora/sell-items-09.jpg", imageAlt: "Specialist Gloves Crimson Web", name: "★ Specialist Gloves | Crimson Web", price: "$570.00", floorDelta: "+$10.00 (+1.7%)", buyerViews: "312 Views", offers: "3 Offers (Max $550)", age: "2d 11h ago", tone: "primary" },
  ],
};
