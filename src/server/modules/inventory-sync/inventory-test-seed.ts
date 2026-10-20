import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryItems, inventorySyncs, items, profiles } from "@/lib/db/schema";

const SAMPLE_ITEMS = [
  { name: "AWP | Dragon Lore", gameId: "cs2", price: 520000, wear: "Field-Tested", float: "0.2241", rarity: "Covert", tone: "amber", marker: "SV" },
  { name: "★ Butterfly Knife | Doppler", gameId: "cs2", price: 315000, wear: "Factory New", float: "0.0142", rarity: "Covert", tone: "amber", marker: "★" },
  { name: "Sport Gloves | Vice", gameId: "cs2", price: 142000, wear: "Field-Tested", float: "0.2845", rarity: "Extraordinary", tone: "amber", marker: "★" },
  { name: "M4A4 | The Emperor", gameId: "cs2", price: 5840, wear: "Field-Tested", float: "0.1982", rarity: "Covert", tone: "indigo", marker: null },
  { name: "Desert Eagle | Printstream", gameId: "cs2", price: 5410, wear: "Field-Tested", float: "0.2110", rarity: "Classified", tone: "indigo", marker: null },
  { name: "AK-47 | Redline", gameId: "cs2", price: 4680, wear: "Field-Tested", float: "0.1840", rarity: "Classified", tone: "indigo", marker: "ST" },
  { name: "AWP | Asiimov", gameId: "cs2", price: 5230, wear: "Field-Tested", float: "0.2514", rarity: "Covert", tone: "indigo", marker: null },
  { name: "M4A1-S | Hyper Beast", gameId: "cs2", price: 6800, wear: "Minimal Wear", float: "0.0945", rarity: "Covert", tone: "indigo", marker: null },
  { name: "USP-S | Kill Confirmed", gameId: "cs2", price: 7100, wear: "Field-Tested", float: "0.2201", rarity: "Covert", tone: "indigo", marker: null },
  { name: "Glock-18 | Water Elemental", gameId: "cs2", price: 2200, wear: "Factory New", float: "0.0341", rarity: "Restricted", tone: "cyan", marker: null },
  { name: "AWP | Wildfire", gameId: "cs2", price: 6420, wear: "Field-Tested", float: "0.2015", rarity: "Covert", tone: "indigo", marker: null },
  { name: "Manifold Paradox Arcana", gameId: "dota2", price: 11950, wear: "Exalted", float: "0.0000", rarity: "Arcana", tone: "amber", marker: null },
];

/** Seeds a ready-to-test backpack for the trader with verified catalog items. */
export async function seedTestBackpack(userId: string) {
  return db.transaction(async (tx) => {
    // Delete previous unlisted test items for this user to avoid duplicate bloat
    await tx
      .delete(inventoryItems)
      .where(and(eq(inventoryItems.userId, userId), sql`${inventoryItems.assetId} LIKE 'test-asset-%'`));

    let totalCents = 0;
    const byGame: Record<string, number> = { cs2: 0, dota2: 0, tf2: 0 };

    for (const [idx, skin] of SAMPLE_ITEMS.entries()) {
      const [matched] = await tx
        .select({ id: items.id, imageUrl: items.imageUrl, imageAlt: items.imageAlt })
        .from(items)
        .where(eq(items.name, skin.name))
        .limit(1);

      totalCents += skin.price;
      byGame[skin.gameId] = (byGame[skin.gameId] ?? 0) + 1;

      await tx.insert(inventoryItems).values({
        userId,
        gameId: skin.gameId,
        itemId: matched?.id ?? null,
        assetId: `test-asset-${userId}-${idx}`,
        name: skin.name,
        marker: skin.marker,
        rarityLabel: skin.rarity,
        wearLabel: skin.wear,
        floatLabel: skin.float,
        imageUrl: matched?.imageUrl ?? "/images/lootora/item-placeholder.jpg",
        imageAlt: matched?.imageAlt ?? skin.name,
        priceCents: skin.price,
        floorCents: Math.round(skin.price * 0.95),
        wearPct: Math.round(Number(skin.float) * 100),
        tone: skin.tone,
        sortOrder: idx,
      });
    }

    await tx
      .update(profiles)
      .set({
        inventoryCounts: byGame,
        inventoryCount: SAMPLE_ITEMS.length,
        portfolioCents: totalCents,
      })
      .where(eq(profiles.userId, userId));

    const syncRecord = {
      userId,
      steamId: "76561198000000000",
      status: "ok" as const,
      itemCount: SAMPLE_ITEMS.length,
      syncedAt: new Date(),
    };

    await tx
      .insert(inventorySyncs)
      .values(syncRecord)
      .onConflictDoUpdate({ target: inventorySyncs.userId, set: syncRecord });

    return { count: SAMPLE_ITEMS.length, totalValueUsd: totalCents / 100 };
  });
}
