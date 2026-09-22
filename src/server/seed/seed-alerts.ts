/**
 * Price rules, seeded from `alerts.mock`. Two of the three watch items Relicto
 * carries, so their "current" column comes from the live floor; the third
 * watches an item outside the catalog and keeps a cached price.
 */
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";
import { alerts } from "../../modules/alerts/data/alerts.mock";

type Db = NodePgDatabase<typeof schema>;

const MINUTE = 60 * 1000;

/** Which catalog item each rule watches, and how stale its row is. */
const RULES: Record<string, { itemSlug: string | null; agoMinutes: number }> = {
  a1: { itemSlug: "butterfly-doppler", agoMinutes: 2 },
  a2: { itemSlug: "manifold-paradox", agoMinutes: 14 },
  a3: { itemSlug: null, agoMinutes: 60 },
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
      itemId: meta?.itemSlug ? `item-${meta.itemSlug}` : null,
      kind: "snipe" as const,
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
