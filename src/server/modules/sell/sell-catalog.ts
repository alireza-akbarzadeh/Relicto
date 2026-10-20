import "server-only";

import { and, eq, ilike } from "drizzle-orm";
import type { db } from "@/lib/db";
import { inventoryItems, items } from "@/lib/db/schema";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Generates fuzzy candidates from Steam / backpack market names. */
function nameCandidates(name: string): string[] {
  const withoutStar = name.replace(/^★\s*/, "").trim();
  const withoutPrefix = withoutStar.replace(/^(StatTrak™|Souvenir)\s*/, "").trim();
  const withoutWear = withoutPrefix.replace(
    /\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)$/i,
    "",
  ).trim();

  return Array.from(new Set([name, withoutStar, withoutPrefix, withoutWear].filter(Boolean)));
}

/**
 * Ensures an inventory row is attached to a Relicto catalog item before listing.
 * If not already linked, resolves by candidate names or registers on the fly.
 */
export async function ensureCatalogItemId(
  tx: Tx,
  row: typeof inventoryItems.$inferSelect,
): Promise<string> {
  if (row.itemId) return row.itemId;

  const candidates = nameCandidates(row.name);
  for (const cand of candidates) {
    const [found] = await tx
      .select({ id: items.id })
      .from(items)
      .where(and(eq(items.gameId, row.gameId), ilike(items.name, cand)))
      .limit(1);

    if (found) {
      await tx.update(inventoryItems).set({ itemId: found.id }).where(eq(inventoryItems.id, row.id));
      return found.id;
    }
  }

  const cleanName = candidates[candidates.length - 1] || row.name;
  const safeSlug = `item-${row.gameId}-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`.slice(0, 50);
  const uniqueSlug = `${safeSlug}-${Math.random().toString(36).slice(2, 7)}`;

  const [created] = await tx
    .insert(items)
    .values({
      gameId: row.gameId,
      slug: uniqueSlug,
      name: cleanName,
      imageUrl: row.imageUrl,
      imageAlt: row.imageAlt ?? row.name,
      rarity: "covert",
    })
    .returning({ id: items.id });

  await tx.update(inventoryItems).set({ itemId: created.id }).where(eq(inventoryItems.id, row.id));
  return created.id;
}
