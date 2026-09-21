import type { ContractItem, Outcome } from "../mobile.types";

/** Sum of the committed skins. */
export function inputValue(slots: (ContractItem | null)[]) {
  return slots.reduce((sum, item) => sum + (item?.priceUsd ?? 0), 0);
}

/** ROI of the expected value against the input: { pct: 20.18, delta: 77.6 }. */
export function expectedReturn(evUsd: number, input: number) {
  const delta = evUsd - input;
  return { pct: input ? (delta / input) * 100 : 0, delta };
}

/** Gain or loss of an outcome against the input, rounded like the terminal shows it ("+131%"). */
export function outcomeGain(outcome: Outcome, input: number) {
  const pct = input ? Math.round(((outcome.valueUsd - input) / input) * 100) : 0;
  return `${pct >= 0 ? "+" : ""}${pct}%`;
}

/** Weighted draw over the outcome odds (they sum to 100). */
export function drawOutcome(outcomes: Outcome[], roll = Math.random() * 100) {
  let cursor = 0;
  for (const outcome of outcomes) {
    cursor += outcome.chance;
    if (roll < cursor) return outcome;
  }
  return outcomes[outcomes.length - 1];
}

/** 10 slots: committed skins first, then empty (null) slots. */
export function initialSlots(committed: ContractItem[], total: number): (ContractItem | null)[] {
  return Array.from({ length: total }, (_, index) => committed[index] ?? null);
}
