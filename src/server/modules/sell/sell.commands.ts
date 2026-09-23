import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryItems, items, listings } from "@/lib/db/schema";
import type { z } from "zod";
import type { listItemInput } from "./sell.schema";

type Wear = (typeof listings.$inferInsert)["wear"];
const WEAR: Record<string, NonNullable<Wear>> = {
  "factory new": "fn", "minimal wear": "mw", "field-tested": "ft", "well-worn": "ww", "battle-scarred": "bs",
};

export type ListResult = { status: "listed"; listingId: string } | { status: "not-found" | "already-listed" | "not-in-catalog" };

/**
 * Puts one of the trader's own unlisted inventory items on the market. The
 * copy's wear and float come from the inventory row, so the card, the item page
 * and the tracker all describe the exact item being sold.
 */
export async function listItem(userId: string, input: z.infer<typeof listItemInput>): Promise<ListResult> {
  return db.transaction(async (tx): Promise<ListResult> => {
    const [row] = await tx
      .select()
      .from(inventoryItems)
      .where(and(eq(inventoryItems.id, input.inventoryId), eq(inventoryItems.userId, userId)))
      .for("update");
    if (!row) return { status: "not-found" };
    if (row.listingId) return { status: "already-listed" };
    if (!row.itemId) return { status: "not-in-catalog" };

    const float = Number(row.floatLabel);
    const [listing] = await tx
      .insert(listings)
      .values({
        itemId: row.itemId,
        sellerId: userId,
        priceCents: Math.round(input.priceUsd * 100),
        status: "active",
        wear: WEAR[row.wearLabel?.toLowerCase() ?? ""] ?? null,
        float: Number.isFinite(float) && row.floatLabel ? float : null,
        sellerNote: input.note || null,
        imageUrl: row.imageUrl,
        imageAlt: row.imageAlt,
      })
      .returning({ id: listings.id });

    await tx.update(inventoryItems).set({ listingId: listing.id }).where(eq(inventoryItems.id, row.id));
    return { status: "listed", listingId: listing.id };
  });
}

const WEAR_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(WEAR).map(([label, code]) => [code, label.replace(/(^|[s-])w/g, (c) => c.toUpperCase())]),
);

/**
 * Takes one of the trader's active listings off the market and returns the item
 * to their inventory. A reserved listing is mid-escrow and can't be pulled.
 */
export async function delist(userId: string, listingId: string) {
  return db.transaction(async (tx) => {
    const [listing] = await tx
      .update(listings)
      .set({ status: "cancelled" })
      .where(and(eq(listings.id, listingId), eq(listings.sellerId, userId), eq(listings.status, "active")))
      .returning();
    if (!listing) return false;

    const returned = await tx
      .update(inventoryItems)
      .set({ listingId: null })
      .where(eq(inventoryItems.listingId, listingId))
      .returning({ id: inventoryItems.id });

    // Listed before the inventory mirror existed: give the item a row to come back to.
    if (returned.length === 0) {
      const [item] = await tx.select().from(items).where(eq(items.id, listing.itemId)).limit(1);
      if (item) {
        await tx.insert(inventoryItems).values({
          userId,
          gameId: item.gameId,
          itemId: item.id,
          name: item.name,
          wearLabel: listing.wear ? WEAR_LABEL[listing.wear] : null,
          floatLabel: listing.float !== null ? String(listing.float) : null,
          imageUrl: listing.imageUrl ?? item.imageUrl,
          imageAlt: listing.imageAlt ?? item.imageAlt,
          priceCents: listing.priceCents,
          floorCents: listing.floorCents ?? listing.priceCents,
        });
      }
    }
    return true;
  });
}
