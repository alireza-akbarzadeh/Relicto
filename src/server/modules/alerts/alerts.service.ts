import "server-only";

import { and, asc, eq, inArray, min } from "drizzle-orm";
import { db } from "@/lib/db";
import { alertRules, items, listings } from "@/lib/db/schema";
import type { IconName } from "@/components/ui/icon";
import type { PriceAlert } from "@/modules/alerts/types";
import { ago } from "@/server/modules/shared/ago";

const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Rule = typeof alertRules.$inferSelect;

function toAlert(rule: Rule, floorCents: number | undefined, now: Date): PriceAlert {
  const current = floorCents ?? rule.currentCents ?? 0;

  return {
    id: rule.id,
    icon: rule.icon as IconName,
    item: rule.name,
    detail: rule.detail ?? "",
    target: money(rule.targetCents),
    current: money(current),
    direction: rule.direction,
    status: rule.status,
    updated: ago(rule.lastTriggeredAt ?? rule.updatedAt, now),
  };
}

export const alertService = {
  /**
   * A trader's price rules. The "current" column prefers the live floor of the
   * watched item and falls back to the last observed price for items Relicto
   * doesn't carry.
   */
  async list(userId: string): Promise<PriceAlert[]> {
    const rules = await db
      .select()
      .from(alertRules)
      .where(eq(alertRules.userId, userId))
      .orderBy(asc(alertRules.createdAt));

    if (rules.length === 0) return [];

    const itemIds = rules.map((r) => r.itemId).filter((id): id is string => Boolean(id));
    const floors = itemIds.length
      ? await db
          .select({ itemId: items.id, floorCents: min(listings.priceCents) })
          .from(listings)
          .innerJoin(items, eq(listings.itemId, items.id))
          .where(and(eq(listings.status, "active"), inArray(items.id, itemIds)))
          .groupBy(items.id)
      : [];

    const floorByItem = new Map(floors.map((f) => [f.itemId, Number(f.floorCents ?? 0)]));
    const now = new Date();

    return rules.map((rule) => toAlert(rule, rule.itemId ? floorByItem.get(rule.itemId) : undefined, now));
  },
};
