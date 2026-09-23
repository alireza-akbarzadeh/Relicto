import "server-only";

import { and, eq, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import { alertRules, items } from "@/lib/db/schema";
import type { z } from "zod";
import type { createRuleInput } from "./alerts.schema";

/**
 * The catalog item a typed name means: an exact match, or the only item that
 * contains it. Ambiguous names ("AK") stay a custom watch rather than guess.
 */
async function resolveItem(name: string) {
  const [exact] = await db.select({ id: items.id, name: items.name }).from(items).where(ilike(items.name, name)).limit(1);
  if (exact) return exact;
  const partial = await db.select({ id: items.id, name: items.name }).from(items).where(ilike(items.name, `%${name}%`)).limit(2);
  return partial.length === 1 ? partial[0] : null;
}

export async function createRule(userId: string, input: z.infer<typeof createRuleInput>) {
  const item = await resolveItem(input.name);
  const [rule] = await db
    .insert(alertRules)
    .values({
      userId,
      itemId: item?.id ?? null,
      kind: "snipe",
      name: item?.name ?? input.name,
      detail: input.maxFloat !== null ? `Float ≤ ${input.maxFloat}` : null,
      icon: "target",
      direction: "below",
      targetCents: Math.round(input.targetUsd * 100),
      autoBuy: input.autoBuy,
      maxFloat: input.maxFloat,
      status: "armed",
    })
    .returning();
  return { rule, matched: Boolean(item) };
}

/** Arms or pauses one of the trader's own rules. False when it isn't theirs. */
export async function setArmed(userId: string, id: string, armed: boolean) {
  const updated = await db
    .update(alertRules)
    .set({ status: armed ? "armed" : "paused" })
    .where(and(eq(alertRules.id, id), eq(alertRules.userId, userId)))
    .returning({ id: alertRules.id });
  return updated.length > 0;
}
