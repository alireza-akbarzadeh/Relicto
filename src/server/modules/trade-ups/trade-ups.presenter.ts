import type { ContractItem, Outcome, TradeUpContract } from "@/modules/sell/mobile.types";
import { CONTRACT_SLOTS, expectedValue, tradeUpEligible } from "@/modules/sell/lib/trade-up";
import type { ContractRow, InventoryRow, OutcomeRow } from "./trade-ups.repository";

/** A slot tile only has room for the finish: "AWP | Wildfire" reads "Wildfire". */
const finish = (name: string) => name.split("|").at(-1)!.trim();

export function toContractItem(row: InventoryRow): ContractItem {
  const float = Number(row.floatLabel);
  return {
    id: row.id,
    name: finish(row.name),
    priceUsd: row.priceCents / 100,
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
    rarity: row.rarityLabel ?? "",
    float: row.floatLabel && Number.isFinite(float) ? float : null,
  };
}

/** The tone carries the tier wording and the verdict: the jackpot is the target, the floor is the risk. */
const TIER = {
  jackpot: { label: "Target", verdict: "WIN" },
  mid: { label: "Mid", verdict: "GAIN" },
  risk: { label: "Risk", verdict: "DRAW" },
} as const;

type Tone = keyof typeof TIER;
const toneOf = (tone: string): Tone => (tone in TIER ? (tone as Tone) : "mid");

export function toOutcome(row: OutcomeRow, index: number): Outcome {
  const tone = toneOf(row.tone);
  return {
    id: row.id,
    name: row.name,
    tier: `Tier ${index + 1} ${TIER[tone].label}`,
    verdict: TIER[tone].verdict,
    tone,
    chance: row.chancePct,
    valueUsd: row.valueCents / 100,
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
  };
}

export const seedLabel = (seed: number | null) => (seed ? `Seed #${String(seed).padStart(5, "0")}` : "Seed pending");

type ContractParts = {
  draft: ContractRow | null;
  committed: { slot: number; inventory: InventoryRow }[];
  available: InventoryRow[];
  outcomes: OutcomeRow[];
  /** Chamber chrome the database doesn't model yet (the bot's name). */
  bot: string;
};

/** The chamber as the trader sees it: slots by index, what Smart Fill can add, and the pool's odds. */
export function toContract({ draft, committed, available, outcomes, bot }: ContractParts): TradeUpContract {
  const slots: (ContractItem | null)[] = Array(CONTRACT_SLOTS).fill(null);
  for (const row of committed) if (row.slot < CONTRACT_SLOTS) slots[row.slot] = toContractItem(row.inventory);

  const pool = outcomes.map(toOutcome);
  return {
    slots: CONTRACT_SLOTS,
    committed: slots,
    suggestions: available
      .filter((row) => tradeUpEligible({ name: row.name, rarity: row.rarityLabel }))
      .map(toContractItem),
    evUsd: Math.round(expectedValue(pool) * 100) / 100,
    seed: seedLabel(draft?.seed ?? null),
    bot,
    outcomes: pool,
  };
}
