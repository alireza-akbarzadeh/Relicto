import type { TrackerData } from "../types";

export const tracker: TrackerData = {
  chart: [22, 32, 28, 45, 40, 54, 48, 66, 61, 75, 70, 86],
  assets: [
    { id: "butterfly", name: "★ Butterfly Knife | Doppler P4", detail: "CS2 / Covert · Pattern #412", image: "/images/lootora/sell-items-01.jpg", price: "$3,150.00", change: "+11.2%", tone: "primary", icon: "diamond" },
    { id: "manifold", name: "PA Manifold Paradox", detail: "Dota 2 / Arcana · Style 3", image: "/images/lootora/item-detail-01.jpg", price: "$118.50", change: "+2.1%", tone: "cyan", icon: "swords" },
    { id: "case", name: "AK-47 | Case Hardened T2", detail: "CS2 / Rifle · Pattern #571", image: "/images/lootora/sell-items-04.jpg", price: "$420.00", change: "-1.2%", tone: "primary", icon: "target" },
    { id: "awp", name: "AWP | Dragon Lore FN", detail: "CS2 / Covert · Float 0.014", image: "/images/lootora/sell-items-02.jpg", price: "$5,200.00", change: "+6.4%", tone: "cyan", icon: "bolt" },
  ],
  orderBook: [
    { price: "$3,190.00", source: "Steam Market", total: "$9,570.00", side: "sell" },
    { price: "$3,175.00", source: "Skinport", total: "$3,175.00", side: "sell" },
    { price: "$3,158.00", source: "Buff163", total: "$6,316.00", side: "sell" },
    { price: "$3,150.00", source: "Relicto Floor", total: "$3,150.00", side: "sell" },
    { price: "$3,140.00", source: "Relicto Bot", total: "$6,280.00", side: "buy" },
    { price: "$3,125.00", source: "DMarket", total: "$12,400.00", side: "buy" },
    { price: "$3,110.00", source: "CSFloat", total: "$3,110.00", side: "buy" },
  ],
  spreads: [
    { id: "bfk", asset: "★ Butterfly Knife | Doppler", detail: "Phase 4 · Factory New", floor: "$3,150.00", steam: "$3,043.00", secondary: "$3,280.00", spread: "+$130.00 (+4.1%)", yield: "+$114.40 USD", tone: "cyan" },
    { id: "pa", asset: "Phantom Assassin — Manifold Paradox", detail: "Exalted Style 3 · 1,420 Kills", floor: "$118.50", steam: "$125.80", secondary: "$132.00", spread: "+$13.50 (+11.4%)", yield: "+$12.15 USD", tone: "cyan" },
    { id: "ak", asset: "AK-47 | Fire Serpent", detail: "Field-Tested · Crown Foil", floor: "$740.00", steam: "$748.00", secondary: "$795.00", spread: "+$45.00 (+6.1%)", yield: "+$38.25 USD", tone: "amber" },
    { id: "awp", asset: "AWP | Fade", detail: "Factory New · 99.4% Fade", floor: "$1,420.00", steam: "$1,482.50", secondary: "$1,495.00", spread: "+$75.00 (+5.3%)", yield: "+$64.10 USD", tone: "cyan" },
  ],
};
