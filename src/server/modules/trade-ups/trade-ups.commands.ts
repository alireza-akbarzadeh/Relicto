import "server-only";

import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryItems, profiles, tradeUpContracts, tradeUpItems } from "@/lib/db/schema";
import { CONTRACT_SLOTS, drawOutcome, tradeUpEligible } from "@/modules/sell/lib/trade-up";
import * as repo from "./trade-ups.repository";

export type SaveResult = { status: "saved" | "stale" | "ineligible" | "mixed-rarity" };
export type IgniteResult =
  | { status: "settled"; outcome: repo.OutcomeRow; inputCents: number }
  | { status: "stale" | "incomplete" | "unavailable" };

/** Why a set of copies can't share a chamber, or null when they can. */
function refusal(rows: repo.InventoryRow[]): SaveResult["status"] | null {
  if (rows.some((row) => !tradeUpEligible({ name: row.name, rarity: row.rarityLabel }))) return "ineligible";
  if (new Set(rows.map((row) => row.rarityLabel)).size > 1) return "mixed-rarity";
  return null;
}

/**
 * Replaces the draft's slots with what the trader now has in the chamber.
 * Every copy must be theirs, unlisted, tradable, and of one grade.
 */
export async function saveSlots(userId: string, slots: (string | null)[]): Promise<SaveResult> {
  return db.transaction(async (tx): Promise<SaveResult> => {
    const draft = await repo.draftFor(tx, userId);
    const ids = slots.filter((id): id is string => id !== null);
    if (new Set(ids).size !== ids.length) return { status: "stale" };

    const rows = await repo.lockOwned(tx, userId, ids);
    if (rows.length !== ids.length) return { status: "stale" };
    const refused = refusal(rows);
    if (refused) return { status: refused };

    const byId = new Map(rows.map((row) => [row.id, row]));
    await tx.delete(tradeUpItems).where(eq(tradeUpItems.contractId, draft.id));
    const values = slots.flatMap((id, slot) => {
      const row = id ? byId.get(id) : undefined;
      return row ? [{ contractId: draft.id, inventoryItemId: row.id, itemId: row.itemId, slot, valueCents: row.priceCents }] : [];
    });
    if (values.length) await tx.insert(tradeUpItems).values(values);
    await tx
      .update(tradeUpContracts)
      .set({ inputValueCents: rows.reduce((sum, row) => sum + row.priceCents, 0) })
      .where(eq(tradeUpContracts.id, draft.id));
    return { status: "saved" };
  });
}

const SELL_TONE = { jackpot: "primary", mid: "cyan", risk: "muted" } as Record<string, string>;
const WEAR = [[0.07, "Factory New"], [0.15, "Minimal Wear"], [0.38, "Field-Tested"], [0.45, "Well-Worn"], [1.01, "Battle-Scarred"]] as const;

/** Uniform in [0, 1) from the platform CSPRNG; the draw never runs in the browser. */
const roll = () => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;

import { calculateCollectionOutcomes, calculateOutcomeFloat } from "./trade-ups.collections";

/**
 * Burns the ten committed copies and forges one outcome into the trader's
 * inventory, in one transaction. The draw happens here, after every input is
 * locked, and the settled contract records what was drawn and at what odds.
 * A fresh draft (new seed) opens for the next contract.
 */
export async function ignite(userId: string, expected: (string | null)[]): Promise<IgniteResult> {
  return db.transaction(async (tx): Promise<IgniteResult> => {
    const draft = await repo.findDraft(tx, userId, true);
    if (!draft) return { status: "stale" };

    const committed = await repo.committed(tx, draft.id);
    const held = Array<string | null>(CONTRACT_SLOTS).fill(null);
    for (const row of committed) held[row.slot] = row.inventory.id;
    if (held.some((id, slot) => id !== expected[slot])) return { status: "stale" };
    if (committed.length !== CONTRACT_SLOTS) return { status: "incomplete" };

    const inputs = await repo.lockOwned(tx, userId, held as string[]);
    if (inputs.length !== CONTRACT_SLOTS || refusal(inputs)) return { status: "stale" };

    const dynamicPool = calculateCollectionOutcomes(inputs);
    const fallbackPool = await repo.outcomes(tx);
    const pool = dynamicPool.length > 0 ? dynamicPool : fallbackPool;
    if (!pool.length) return { status: "unavailable" };

    const drawn = drawOutcome(pool.map((row) => ({ ...row, chance: row.chancePct })), roll());
    const totalChance = pool.reduce((sum, row) => sum + row.chancePct, 0);
    const inputCents = inputs.reduce((sum, row) => sum + row.priceCents, 0);
    const won = "id" in drawn && drawn.id ? (drawn as repo.OutcomeRow) : await repo.findOrCreateOutcome(tx, drawn);

    // The outcome's wear follows the inputs' average float with CS2 boundary scaling.
    const floats = inputs.map((row) => Number(row.floatLabel)).filter(Number.isFinite);
    const avg = floats.length ? floats.reduce((sum, value) => sum + value, 0) / floats.length : null;
    const finalFloat = avg !== null
      ? calculateOutcomeFloat(avg, "minFloat" in drawn ? drawn.minFloat : 0, "maxFloat" in drawn ? drawn.maxFloat : 1)
      : null;

    await tx.insert(inventoryItems).values({
      userId,
      gameId: won.gameId,
      itemId: won.itemId,
      name: won.name,
      wearLabel: finalFloat === null ? null : WEAR.find(([max]) => finalFloat < max)![1],
      floatLabel: finalFloat === null ? null : finalFloat.toFixed(4),
      wearPct: finalFloat === null ? 0 : Math.round(finalFloat * 100),
      imageUrl: won.imageUrl,
      imageAlt: won.imageAlt,
      priceCents: won.valueCents,
      floorCents: won.valueCents,
      collection: won.collection ?? null,
      tone: SELL_TONE[won.tone] ?? "muted",
    });

    await tx
      .update(tradeUpContracts)
      .set({
        status: "settled",
        inputValueCents: inputCents,
        outcomeId: won.id,
        outcomeItemId: won.itemId,
        outcomeValueCents: won.valueCents,
        oddsPct: (won.chancePct / totalChance) * 100,
        settledAt: new Date(),
      })
      .where(eq(tradeUpContracts.id, draft.id));

    // Burned: the slot rows keep their item and value snapshot, the copies are gone.
    await tx.delete(inventoryItems).where(inArray(inventoryItems.id, held as string[]));
    await tx.insert(tradeUpContracts).values({ userId, seed: repo.newSeed() });

    await tx
      .update(profiles)
      .set({
        inventoryCount: sql`greatest(${profiles.inventoryCount} - ${CONTRACT_SLOTS - 1}, 0)`,
        portfolioCents: sql`${profiles.portfolioCents} + ${won.valueCents - inputCents}`,
      })
      .where(eq(profiles.userId, userId));

    return { status: "settled", outcome: won, inputCents };
  });
}
