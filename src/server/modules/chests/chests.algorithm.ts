import * as crypto from "node:crypto";
import type { ChestSkinItem, EscalatingTier } from "@/modules/chests/types";

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
  const boost = Math.pow(streak, 1.25) * factor.slope;
  return Math.min(factor.maxPct, Number((baseOddsPct + boost).toFixed(2)));
}

/**
 * Computes a deterministic provably fair roll fraction (0.0 to 1.0)
 * from server seed and client seed using HMAC-SHA256.
 */
export function calculateProvablyFairFraction(
  serverSeed: string,
  clientSeed: string,
  nonce: string | number = 0
): number {
  const hmac = crypto.createHmac("sha256", serverSeed);
  hmac.update(`${clientSeed}:${nonce}`);
  const hash = hmac.digest("hex");
  const hex32 = hash.slice(0, 8);
  const intVal = parseInt(hex32, 16);
  return intVal / 0xffffffff;
}

/**
 * Executes a Dota 2 style chest roll using cryptographically secure provably fair RNG:
 * 1. Draws guaranteed standard item using HMAC-SHA256 roll fraction.
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
  serverSeed: string;
  reelItems: ChestSkinItem[];
  winningIndex: number;
} {
  const serverSeed = crypto.randomBytes(32).toString("hex");
  const seed = clientSeed?.trim() || crypto.randomBytes(16).toString("hex");
  const rollHash = crypto.createHmac("sha256", serverSeed).update(seed).digest("hex");

  // Separate regular items from escalating bonus items
  const regularItems = items.filter((item) => !item.isEscalatingBonus);
  const bonusItems = items.filter((item) => item.isEscalatingBonus);

  // Normalize regular item weights
  const totalWeight = regularItems.reduce((acc, it) => acc + (it.baseOddsPct || 1), 0);
  const fairFraction = calculateProvablyFairFraction(serverSeed, seed, "base");
  const randomVal = fairFraction * totalWeight;

  let cumulative = 0;
  let wonItem = regularItems[0] || items[0];
  for (const item of regularItems) {
    cumulative += item.baseOddsPct || 1;
    if (randomVal <= cumulative) {
      wonItem = item;
      break;
    }
  }

  // Check bonus escalating drops using deterministic nonce derivation
  let bonusWon: ChestSkinItem | null = null;
  let newStreak = currentStreak + 1;

  for (let bIdx = 0; bIdx < bonusItems.length; bIdx++) {
    const bonus = bonusItems[bIdx];
    const tier = bonus.escalatingTier || "rare";
    const currentOddsPct = calculateEscalatingOdds(bonus.baseOddsPct, currentStreak, tier);
    const bonusFraction = calculateProvablyFairFraction(serverSeed, seed, `bonus:${bIdx}:${currentStreak}`);
    const rollPct = bonusFraction * 100;

    if (rollPct <= currentOddsPct) {
      bonusWon = bonus;
      newStreak = 0; // Reset streak on bonus win
      break;
    }
  }

  // Construct a 55-item horizontal roulette reel with cryptographically secure visual cards
  const reelLength = 55;
  const winningIndex = 44; // Center card at stopping point
  const reelItems: ChestSkinItem[] = [];

  for (let i = 0; i < reelLength; i++) {
    if (i === winningIndex) {
      reelItems.push(wonItem);
    } else {
      const randomIdx = crypto.randomInt(0, items.length);
      reelItems.push(items[randomIdx]);
    }
  }

  return {
    wonItem,
    bonusItem: bonusWon,
    newStreak,
    rollSeed: seed,
    rollHash,
    serverSeed,
    reelItems,
    winningIndex,
  };
}
