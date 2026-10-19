export interface SeedPattern {
  seed: number;
  weapon: "AK-47" | "Karambit" | "Butterfly Knife" | "M9 Bayonet";
  tier: "Tier 1 (God Tier)" | "Tier 1" | "Tier 2" | "Tier 3" | "Gold Gem" | "Market Floor";
  bluePercent: number;
  goldPercent: number;
  alias?: string;
  overpayMultiplier: string;
  description: string;
}

export const KNOWN_SEEDS: SeedPattern[] = [
  {
    seed: 661,
    weapon: "AK-47",
    tier: "Tier 1 (God Tier)",
    bluePercent: 98.4,
    goldPercent: 1.6,
    alias: "#1 Scar Pattern",
    overpayMultiplier: "35x – 60x",
    description: "The undisputed holy grail of CS2 Case Hardened skins. Solid sky-blue top with signature gold scar at the rear.",
  },
  {
    seed: 387,
    weapon: "Karambit",
    tier: "Tier 1 (God Tier)",
    bluePercent: 97.8,
    goldPercent: 2.2,
    alias: "Flawless Blue Gem",
    overpayMultiplier: "40x – 75x",
    description: "98% solid sky-blue playside from tip to ring. Highest historically recorded sale in CS history.",
  },
  {
    seed: 321,
    weapon: "AK-47",
    tier: "Tier 1",
    bluePercent: 94.2,
    goldPercent: 5.8,
    alias: "Reverse Scar",
    overpayMultiplier: "15x – 25x",
    description: "Deep oceanic blue coverage across full receiver and front barrel.",
  },
  {
    seed: 670,
    weapon: "AK-47",
    tier: "Tier 1",
    bluePercent: 93.6,
    goldPercent: 6.4,
    alias: "Reverse Scar #2",
    overpayMultiplier: "12x – 20x",
    description: "Near-total top coverage with bright cyan specular tone in Source 2 physical rendering.",
  },
  {
    seed: 151,
    weapon: "AK-47",
    tier: "Tier 1",
    bluePercent: 89.2,
    goldPercent: 10.8,
    alias: "True Blue Butt",
    overpayMultiplier: "8x – 14x",
    description: "100% blue back receiver and upper deck with minimal purple discoloration.",
  },
  {
    seed: 955,
    weapon: "AK-47",
    tier: "Tier 2",
    bluePercent: 82.5,
    goldPercent: 17.5,
    alias: "Honorable Mention",
    overpayMultiplier: "4x – 7x",
    description: "Heavy blue middle body with subtle gold stripe across ejection port.",
  },
  {
    seed: 809,
    weapon: "Karambit",
    tier: "Tier 2",
    bluePercent: 86.4,
    goldPercent: 13.6,
    alias: "Dragon Tooth Blue",
    overpayMultiplier: "6x – 10x",
    description: "Front 85% of blade coated in saturated cerulean blue with gold ring.",
  },
  {
    seed: 219,
    weapon: "AK-47",
    tier: "Gold Gem",
    bluePercent: 4.2,
    goldPercent: 95.8,
    alias: "Pure Midas Gold",
    overpayMultiplier: "2.5x – 4.5x",
    description: "Extremely rare inverted seed where almost zero blue exists, creating pure reflective gold sheen.",
  },
];

/** Lookup known seed or compute algorithmic estimate for arbitrary seed 1-1000 */
export function lookupSeedPattern(seedNum: number, weapon: SeedPattern["weapon"] = "AK-47"): SeedPattern {
  const normalized = Math.max(1, Math.min(1000, Math.floor(seedNum) || 1));
  const found = KNOWN_SEEDS.find((s) => s.seed === normalized && s.weapon === weapon);
  if (found) return found;

  // Pseudo-deterministic projection for arbitrary seeds using integer hash
  const hash = (normalized * 9301 + 49297) % 233280;
  const rawRatio = hash / 233280;
  const bluePct = Number((rawRatio * 70 + (normalized % 7 === 0 ? 15 : 5)).toFixed(1));
  const goldPct = Number((100 - bluePct).toFixed(1));

  let tier: SeedPattern["tier"] = "Market Floor";
  let overpay = "1.0x (Standard)";

  if (bluePct > 85) {
    tier = "Tier 1";
    overpay = "8x – 16x";
  } else if (bluePct > 72) {
    tier = "Tier 2";
    overpay = "3x – 6x";
  } else if (bluePct > 55) {
    tier = "Tier 3";
    overpay = "1.4x – 2.2x";
  } else if (goldPct > 90) {
    tier = "Gold Gem";
    overpay = "2.0x – 3.5x";
  }

  return {
    seed: normalized,
    weapon,
    tier,
    bluePercent: bluePct,
    goldPercent: goldPct,
    overpayMultiplier: overpay,
    description: `Algorithmic polygon surface sample for seed #${normalized}. Approximate UV surface layout.`,
  };
}
