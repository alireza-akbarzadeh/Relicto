export type NextGrade = "Industrial Grade" | "Mil-Spec" | "Restricted" | "Classified" | "Covert";

export const GRADE_UP_MAP: Record<string, NextGrade> = {
  "Consumer Grade": "Industrial Grade",
  "Industrial Grade": "Mil-Spec",
  "Mil-Spec": "Restricted",
  "Restricted": "Classified",
  "Classified": "Covert",
};

export type CollectionWeapon = {
  name: string;
  collection: string;
  grade: string;
  valueCents: number;
  imageUrl?: string;
  minFloat: number;
  maxFloat: number;
  tone: "jackpot" | "mid" | "risk";
};

/**
 * Authentic CS2 Weapon Collection Pools for Trade-Up outcomes.
 * Each entry models items of Classified & Covert tiers with their min/max float boundaries.
 */
export const CS2_COLLECTION_POOLS: Record<string, CollectionWeapon[]> = {
  "The Phoenix Collection": [
    { name: "AWP | Asiimov", collection: "The Phoenix Collection", grade: "Covert", valueCents: 11_280, minFloat: 0.18, maxFloat: 1.0, tone: "jackpot" },
    { name: "AUG | Chameleon", collection: "The Phoenix Collection", grade: "Covert", valueCents: 4_200, minFloat: 0.0, maxFloat: 0.5, tone: "risk" },
  ],
  "The Breakout Collection": [
    { name: "★ Butterfly Knife | Fade", collection: "The Breakout Collection", grade: "Covert", valueCents: 88_900, minFloat: 0.0, maxFloat: 0.08, tone: "jackpot" },
    { name: "P90 | Asiimov", collection: "The Breakout Collection", grade: "Covert", valueCents: 5_800, minFloat: 0.0, maxFloat: 0.92, tone: "mid" },
  ],
  "The CS20 Collection": [
    { name: "AWP | Wildfire", collection: "The CS20 Collection", grade: "Covert", valueCents: 20_430, minFloat: 0.01, maxFloat: 0.7, tone: "jackpot" },
    { name: "FAMAS | Commemoration", collection: "The CS20 Collection", grade: "Covert", valueCents: 3_800, minFloat: 0.0, maxFloat: 0.5, tone: "risk" },
  ],
  "The Prisma Collection": [
    { name: "M4A4 | The Emperor", collection: "The Prisma Collection", grade: "Covert", valueCents: 9_610, minFloat: 0.0, maxFloat: 0.8, tone: "jackpot" },
    { name: "Five-SeveN | Angry Mob", collection: "The Prisma Collection", grade: "Covert", valueCents: 3_200, minFloat: 0.0, maxFloat: 1.0, tone: "risk" },
  ],
  "The Prisma 2 Collection": [
    { name: "M4A1-S | Player Two", collection: "The Prisma 2 Collection", grade: "Covert", valueCents: 52_400, minFloat: 0.0, maxFloat: 0.84, tone: "mid" },
    { name: "Glock-18 | Bullet Queen", collection: "The Prisma 2 Collection", grade: "Covert", valueCents: 7_100, minFloat: 0.0, maxFloat: 1.0, tone: "risk" },
  ],
  "The Fracture Collection": [
    { name: "Desert Eagle | Printstream", collection: "The Fracture Collection", grade: "Covert", valueCents: 17_260, minFloat: 0.0, maxFloat: 0.8, tone: "jackpot" },
    { name: "AK-47 | Legion of Anubis", collection: "The Fracture Collection", grade: "Covert", valueCents: 4_900, minFloat: 0.0, maxFloat: 0.7, tone: "risk" },
  ],
  "The Shadow Collection": [
    { name: "USP-S | Kill Confirmed", collection: "The Shadow Collection", grade: "Covert", valueCents: 11_890, minFloat: 0.0, maxFloat: 1.0, tone: "jackpot" },
    { name: "M4A1-S | Golden Coil", collection: "The Shadow Collection", grade: "Covert", valueCents: 4_160, minFloat: 0.0, maxFloat: 1.0, tone: "risk" },
  ],
  "The Chroma 2 Collection": [
    { name: "M4A1-S | Hyper Beast", collection: "The Chroma 2 Collection", grade: "Covert", valueCents: 5_890, minFloat: 0.0, maxFloat: 1.0, tone: "mid" },
    { name: "MAC-10 | Neon Rider", collection: "The Chroma 2 Collection", grade: "Covert", valueCents: 1_720, minFloat: 0.0, maxFloat: 0.45, tone: "risk" },
  ],
  "The 2018 Inferno Collection": [
    { name: "Glock-18 | High Beam", collection: "The 2018 Inferno Collection", grade: "Covert", valueCents: 22_300, minFloat: 0.0, maxFloat: 0.08, tone: "risk" },
  ],
  "The Cobblestone Collection": [
    { name: "AWP | Dragon Lore", collection: "The Cobblestone Collection", grade: "Covert", valueCents: 520_000, minFloat: 0.0, maxFloat: 0.7, tone: "jackpot" },
  ],
};

/** Default collection assignment for known skin names */
export const KNOWN_ITEM_COLLECTIONS: Record<string, string> = {
  "AK-47 | Redline": "The Phoenix Collection",
  "AWP | Asiimov": "The Phoenix Collection",
  "AWP | Wildfire": "The CS20 Collection",
  "M4A4 | The Emperor": "The Prisma Collection",
  "Desert Eagle | Printstream": "The Fracture Collection",
  "USP-S | Kill Confirmed": "The Shadow Collection",
  "Glock-18 | Water Elemental": "The Breakout Collection",
  "M4A1-S | Hyper Beast": "The Chroma 2 Collection",
  "Glock-18 | High Beam": "The 2018 Inferno Collection",
  "M4A1-S | Player Two": "The Prisma 2 Collection",
  "★ Butterfly Knife Fade": "The Breakout Collection",
  "★ Butterfly Knife | Fade": "The Breakout Collection",
  "AWP | Dragon Lore": "The Cobblestone Collection",
  "AK-47 | Fire Serpent": "The Bravo Collection",
  "M4A1-S | Printstream": "The Operation Broken Fang Collection",
};

export type DynamicOutcome = CollectionWeapon & {
  chancePct: number;
};

/**
 * Calculates authentic CS2 trade-up outcome probabilities based on the 10 inputs' collections.
 * Formula: P(Weapon in Collection C) = (Count of inputs from C) / (Total inputs [10] * Total outcomes in tier for C).
 */
export function calculateCollectionOutcomes(
  inputs: { name: string; collection?: string | null; rarityLabel?: string | null }[],
): DynamicOutcome[] {
  if (!inputs.length) return [];
  const inputGrade = inputs.find((i) => i.rarityLabel)?.rarityLabel ?? "Classified";
  const targetGrade = GRADE_UP_MAP[inputGrade] ?? "Covert";

  // Count items per collection
  const collectionCounts = new Map<string, number>();
  for (const input of inputs) {
    const col = input.collection || KNOWN_ITEM_COLLECTIONS[input.name] || "The Phoenix Collection";
    collectionCounts.set(col, (collectionCounts.get(col) ?? 0) + 1);
  }

  const outcomes: DynamicOutcome[] = [];
  const totalInputs = inputs.length;

  for (const [colName, inputCount] of collectionCounts.entries()) {
    const weaponsInTier = (CS2_COLLECTION_POOLS[colName] ?? []).filter((w) => w.grade === targetGrade);
    if (!weaponsInTier.length) continue;

    const probPerWeapon = (inputCount / totalInputs) * (1 / weaponsInTier.length) * 100;
    for (const weapon of weaponsInTier) {
      outcomes.push({
        ...weapon,
        chancePct: Math.round(probPerWeapon * 100) / 100,
      });
    }
  }

  return outcomes;
}

/**
 * Calculates outcome wear float according to authentic CS2 float inheritance:
 * Outcome Float = (Average Input Float * (Max Float - Min Float)) + Min Float
 */
export function calculateOutcomeFloat(avgInputFloat: number, minFloat = 0, maxFloat = 1): number {
  const boundedMin = Math.max(0, minFloat);
  const boundedMax = Math.min(1, maxFloat);
  const float = avgInputFloat * (boundedMax - boundedMin) + boundedMin;
  return Math.min(boundedMax, Math.max(boundedMin, float));
}
