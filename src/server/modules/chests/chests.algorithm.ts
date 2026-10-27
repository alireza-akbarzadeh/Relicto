import * as crypto from "node:crypto";
import type { ChestSkinItem, EscalatingTier, UnboxResult } from "@/modules/chests/types";

/**
 * Dota 2 authentic escalating odds calculation.
 * Each consecutive chest opening that yields no bonus item increases
 * the probability for that specific bonus tier on the next draw.
 */
export function calculateEscalatingOdds(
  baseOddsPct: number,
  streak: number,
  tier: EscalatingTier = "rare"
): number {
  if (streak <= 0) return baseOddsPct;

  // Multiplier curve tailored to Valve's disclosed Dota 2 escalating mechanics
  const tierFactors: Record<EscalatingTier, { slope: number; maxPct: number }> = {
    rare: { slope: 1.65, maxPct: 85 },
    very_rare: { slope: 0.85, maxPct: 65 },
    ultra_rare: { slope: 0.35, maxPct: 40 },
    cosmic: { slope: 0.08, maxPct: 20 },
  };

  const factor = tierFactors[tier] || tierFactors.rare;
  // Non-linear escalation after threshold
  const boost = Math.pow(streak, 1.25) * factor.slope;
  return Math.min(factor.maxPct, Number((baseOddsPct + boost).toFixed(2)));
}

/**
 * Executes a Dota 2 style chest roll:
 * 1. Draws a guaranteed standard item from the normalized base pool.
 * 2. Checks independent escalating rolls for any bonus items (Rare, Very Rare, Ultra Rare).
 */
export function executeChestRoll(
  chestId: string,
  items: ChestSkinItem[],
  currentStreak: number = 0,
  clientSeed?: string
): {
  wonItem: ChestSkinItem;
  bonusItem: ChestSkinItem | null;
  newStreak: number;
  rollSeed: string;
  rollHash: string;
  reelItems: ChestSkinItem[];
  winningIndex: number;
} {
  const serverSeed = crypto.randomBytes(16).toString("hex");
  const seed = clientSeed || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const rollHash = crypto.createHash("sha256").update(`${serverSeed}:${seed}`).digest("hex");

  // Separate regular items from escalating bonus items
  const regularItems = items.filter((item) => !item.isEscalatingBonus);
  const bonusItems = items.filter((item) => item.isEscalatingBonus);

  // Normalize regular item weights
  const totalWeight = regularItems.reduce((acc, it) => acc + (it.baseOddsPct || 1), 0);
  const randomVal = Math.random() * totalWeight;

  let cumulative = 0;
  let wonItem = regularItems[0] || items[0];
  for (const item of regularItems) {
    cumulative += item.baseOddsPct || 1;
    if (randomVal <= cumulative) {
      wonItem = item;
      break;
    }
  }

  // Check bonus escalating drops
  let bonusWon: ChestSkinItem | null = null;
  let newStreak = currentStreak + 1;

  for (const bonus of bonusItems) {
    const tier = bonus.escalatingTier || "rare";
    const currentOddsPct = calculateEscalatingOdds(bonus.baseOddsPct, currentStreak, tier);
    const roll = Math.random() * 100;

    if (roll <= currentOddsPct) {
      bonusWon = bonus;
      newStreak = 0; // Reset streak on bonus win
      break;
    }
  }

  // Construct a 55-item horizontal roulette reel
  const reelLength = 55;
  const winningIndex = 44; // Center card at stopping point
  const reelItems: ChestSkinItem[] = [];

  for (let i = 0; i < reelLength; i++) {
    if (i === winningIndex) {
      reelItems.push(wonItem);
    } else {
      // Pick random items for reel visual suspense
      const randomIdx = Math.floor(Math.random() * items.length);
      reelItems.push(items[randomIdx]);
    }
  }

  return {
    wonItem,
    bonusItem: bonusWon,
    newStreak,
    rollSeed: seed,
    rollHash,
    reelItems,
    winningIndex,
  };
}
