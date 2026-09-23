import "server-only";

import { and, asc, desc, eq, gte, inArray, min } from "drizzle-orm";
import { db } from "@/lib/db";
import { alertRules, items, listings, pricePoints, pushSubscriptions } from "@/lib/db/schema";
import type { IconName } from "@/components/ui/icon";
import type { AlertsMobile } from "@/modules/alerts/mobile.types";
import type { PriceAlert } from "@/modules/alerts/types";
import { findWalletBalance } from "../checkout/checkout.repository";
import { toAlertsMobile } from "./alerts-mobile.presenter";
import { createRule, setArmed } from "./alerts.commands";
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
  create: createRule,
  setArmed,

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
      .orderBy(desc(alertRules.createdAt));

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

  /**
   * The same rules in the mobile sniper terminal: each with its item's art,
   * live floor and recent price line, plus the trader's buying power and
   * whether any device takes push. `authored` keeps the header telemetry and
   * the chat relays, which aren't wired yet.
   */
  async mobile(userId: string, authored: AlertsMobile): Promise<AlertsMobile | null> {
    const rules = await db
      .select({ rule: alertRules, gameId: items.gameId, imageUrl: items.imageUrl, imageAlt: items.imageAlt, presentation: items.presentation })
      .from(alertRules)
      .leftJoin(items, eq(alertRules.itemId, items.id))
      .where(eq(alertRules.userId, userId))
      .orderBy(desc(alertRules.createdAt));
    if (rules.length === 0) return null;

    const itemIds = rules.flatMap(({ rule }) => (rule.itemId ? [rule.itemId] : []));
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [floors, points, [push], vaultCents] = await Promise.all([
      itemIds.length
        ? db.select({ itemId: listings.itemId, floorCents: min(listings.priceCents) }).from(listings)
            .where(and(eq(listings.status, "active"), inArray(listings.itemId, itemIds))).groupBy(listings.itemId)
        : [],
      itemIds.length
        ? db.select({ itemId: pricePoints.itemId, priceCents: pricePoints.priceCents }).from(pricePoints)
            .where(and(inArray(pricePoints.itemId, itemIds), gte(pricePoints.recordedAt, since))).orderBy(asc(pricePoints.recordedAt))
        : [],
      db.select({ id: pushSubscriptions.id }).from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId)).limit(1),
      findWalletBalance(userId),
    ]);

    const floorByItem = new Map(floors.map((f) => [f.itemId, Number(f.floorCents ?? 0)]));
    const rows = rules.map((row) => ({
      ...row,
      floorCents: row.rule.itemId ? floorByItem.get(row.rule.itemId) : undefined,
      series: points.filter((p) => p.itemId === row.rule.itemId).map((p) => p.priceCents),
    }));

    return toAlertsMobile(authored, rows, vaultCents, Boolean(push));
  },
};
