import "server-only";

import { db } from "@/lib/db";
import type { Outcome, TradeUpContract } from "@/modules/sell/mobile.types";
import { calculateCollectionOutcomes } from "./trade-ups.collections";
import { ignite, saveSlots } from "./trade-ups.commands";
import { toContract, toOutcome } from "./trade-ups.presenter";
import * as repo from "./trade-ups.repository";

export type IgniteView =
  | { status: "settled"; outcome: Outcome; inputUsd: number; contract: TradeUpContract }
  | { status: "stale" | "incomplete" | "unavailable"; contract: TradeUpContract | null };

export const tradeUpService = {
  /**
   * The trader's chamber: their open draft, the copies they could add, and the
   * pool's odds. Derived from the committed skins' authentic CS2 collections,
   * falling back to the curated preview pool while the chamber is empty.
   */
  async contract(userId: string, bot: string): Promise<TradeUpContract | null> {
    const [draft, available, baseOutcomes] = await Promise.all([
      repo.findDraft(db, userId),
      repo.uncommitted(userId),
      repo.outcomes(),
    ]);
    if (!baseOutcomes.length) return null;
    const committed = draft ? await repo.committed(db, draft.id) : [];

    const committedInputs = committed.map((c) => c.inventory);
    const dynamicPool = calculateCollectionOutcomes(committedInputs);
    const outcomes = dynamicPool.length > 0
      ? dynamicPool.map((d, index) => ({
          id: `dyn-${index}-${d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          gameId: "cs2",
          itemId: null,
          name: d.name,
          imageUrl: d.imageUrl ?? null,
          imageAlt: d.name,
          valueCents: d.valueCents,
          chancePct: d.chancePct,
          tone: d.tone,
          collection: d.collection,
          sortOrder: index,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      : baseOutcomes;

    return toContract({ draft, committed, available, outcomes, bot });
  },

  /** Saves the chamber, then answers with it as the server now holds it. */
  async save(userId: string, slots: (string | null)[], bot: string) {
    const { status } = await saveSlots(userId, slots);
    return { status, contract: await this.contract(userId, bot) };
  },

  async ignite(userId: string, slots: (string | null)[], bot: string): Promise<IgniteView> {
    const result = await ignite(userId, slots);
    const contract = await this.contract(userId, bot);
    if (result.status !== "settled") return { status: result.status, contract };

    const pool = await repo.outcomes();
    const index = Math.max(0, pool.findIndex((row) => row.id === result.outcome.id));
    return {
      status: "settled",
      outcome: toOutcome(result.outcome, index),
      inputUsd: result.inputCents / 100,
      contract: contract!,
    };
  },
};
