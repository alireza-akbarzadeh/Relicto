import type { ContractItem, Outcome } from "../mobile.types";

/** CS2 contracts take ten inputs. */
export const CONTRACT_SLOTS = 10;

/** Grades a CS2 contract accepts. Knives, gloves (★) and Contraband never trade up. */
const TRADABLE_GRADES = new Set(["Consumer Grade", "Industrial Grade", "Mil-Spec", "Restricted", "Classified", "Covert"]);

/** Whether a skin may enter a contract at all, before the rarity lock. */
export function tradeUpEligible(item: { name: string; rarity: string | null }) {
  return !item.name.startsWith("★") && TRADABLE_GRADES.has(item.rarity ?? "");
}

/** The grade every input must share: the first committed skin's, or none while the chamber is empty. */
export function rarityLock(slots: (ContractItem | null)[]) {
  return slots.find(Boolean)?.rarity ?? null;
}

/** Sum of the committed skins. */
export function inputValue(slots: (ContractItem | null)[]) {
  return slots.reduce((sum, item) => sum + (item?.priceUsd ?? 0), 0);
}

/** Probability-weighted value of the pool: Σ chance × value. */
export function expectedValue(outcomes: Pick<Outcome, "chance" | "valueUsd">[]) {
  const total = outcomes.reduce((sum, outcome) => sum + outcome.chance, 0);
  return total ? outcomes.reduce((sum, outcome) => sum + outcome.chance * outcome.valueUsd, 0) / total : 0;
}

/** ROI of the expected value against the input: { pct: 20.18, delta: 77.6 }. An empty chamber returns nothing. */
export function expectedReturn(evUsd: number, input: number) {
  if (!input) return { pct: 0, delta: 0 };
  const delta = evUsd - input;
  return { pct: (delta / input) * 100, delta };
}

/** Gain or loss of an outcome against the input, rounded like the terminal shows it ("+131%"). */
export function outcomeGain(outcome: Outcome, input: number) {
  const pct = input ? Math.round(((outcome.valueUsd - input) / input) * 100) : 0;
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

const WEAR_BANDS: [number, string][] = [[0.07, "FN"], [0.15, "MW"], [0.38, "FT"], [0.45, "WW"], [1.01, "BS"]];

/** Average input float with its exterior band ("0.1412 MW"), which steers the outcome's wear. */
export function floatAverage(slots: (ContractItem | null)[]) {
  const floats = slots.flatMap((item) => (item?.float == null ? [] : [item.float]));
  if (!floats.length) return "—";
  const avg = floats.reduce((sum, value) => sum + value, 0) / floats.length;
  return `${avg.toFixed(4)} ${WEAR_BANDS.find(([max]) => avg < max)![1]}`;
}

/** Weighted draw over the outcome odds; `roll` is uniform in [0, 1). */
export function drawOutcome<T extends { chance: number }>(outcomes: T[], roll: number) {
  const total = outcomes.reduce((sum, outcome) => sum + outcome.chance, 0);
  let cursor = 0;
  for (const outcome of outcomes) {
    cursor += outcome.chance;
    if (roll * total < cursor) return outcome;
  }
  return outcomes[outcomes.length - 1];
}

/** Always `total` slots: the committed skins by slot, then empty (null) slots. */
export function initialSlots(committed: (ContractItem | null)[], total: number): (ContractItem | null)[] {
  return Array.from({ length: total }, (_, index) => committed[index] ?? null);
}
