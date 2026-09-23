/**
 * Price rules, seeded from `alerts.mock`. Each watches a catalog item, so its
 * "current" column comes from the live floor. Strategy kinds follow the mobile
 * sniper terminal, the only screen that shows them.
 */
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";
import { alerts } from "../../modules/alerts/data/alerts.mock";

type Db = NodePgDatabase<typeof schema>;

const MINUTE = 60 * 1000;

type Kind = (typeof schema.alertKind.enumValues)[number];

/** Which catalog item each rule watches, its strategy, and how stale its row is. */
const RULES: Record<string, { itemSlug: string; kind: Kind; agoMinutes: number }> = {
  a1: { itemSlug: "butterfly-doppler", kind: "snipe", agoMinutes: 2 },
  a2: { itemSlug: "manifold-paradox", kind: "dca", agoMinutes: 14 },
  // Added to the catalog by the tracker seed, so `linkAlertItems` attaches it at the end.
  a3: { itemSlug: "awp-dragon-lore", kind: "arb", agoMinutes: 60 },
};

const cents = (label: string) => Math.round(Number(label.replace(/[^0-9.]/g, "")) * 100);

export async function seedAlerts(db: Db, traderId: string) {
  const now = Date.now();

  for (const alert of alerts) {
    const meta = RULES[alert.id];
    const stamp = new Date(now - (meta?.agoMinutes ?? 30) * MINUTE);

    const row = {
      id: `alert-${alert.id}`,
      userId: traderId,
      kind: meta?.kind ?? "snipe",
      name: alert.item,
      detail: alert.detail,
      icon: alert.icon,
      direction: alert.direction,
      targetCents: cents(alert.target),
      currentCents: cents(alert.current),
      status: alert.status,
      lastTriggeredAt: stamp,
      createdAt: stamp,
      updatedAt: stamp,
    } satisfies typeof schema.alertRules.$inferInsert;

    await db.insert(schema.alertRules).values(row).onConflictDoUpdate({ target: schema.alertRules.id, set: row });
  }

  return alerts.length;
}

/** Points each rule at its catalog item once every seed that adds items has run. */
export async function linkAlertItems(db: Db) {
  for (const [id, meta] of Object.entries(RULES)) {
    const [item] = await db.select({ id: schema.items.id }).from(schema.items).where(eq(schema.items.slug, meta.itemSlug));
    await db.update(schema.alertRules).set({ itemId: item?.id ?? null }).where(eq(schema.alertRules.id, `alert-${id}`));
  }
}
