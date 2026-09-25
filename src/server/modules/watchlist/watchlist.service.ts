import "server-only";

import { and, eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, watchlist } from "@/lib/db/schema";
import { toWatchedItem } from "./watchlist.presenter";
import { countWatchersBySlug, findWatchedItems } from "./watchlist.repository";

/**
 * A trader's watched items. The same rows are the tracker board, so watching
 * from any screen puts the item on the board, and unwatching takes it off.
 */
export const watchlistService = {
  async slugs(userId: string): Promise<string[]> {
    const rows = await db
      .select({ slug: items.slug })
      .from(watchlist)
      .innerJoin(items, eq(watchlist.itemId, items.id))
      .where(eq(watchlist.userId, userId));
    return rows.map((row) => row.slug);
  },

  /** The watched items as cards, newest board position last. */
  async watched(userId: string) {
    const rows = await findWatchedItems(userId);
    return rows.map(toWatchedItem);
  },

  /** How many traders watch each slug. */
  watchers: (slugs: string[]) => countWatchersBySlug(slugs),

  /** Idempotent either way. Returns false when the slug isn't a catalog item. */
  async set(userId: string, slug: string, watched: boolean): Promise<boolean> {
    const [item] = await db.select({ id: items.id }).from(items).where(eq(items.slug, slug)).limit(1);
    if (!item) return false;

    if (!watched) {
      await db.delete(watchlist).where(and(eq(watchlist.userId, userId), eq(watchlist.itemId, item.id)));
      return true;
    }

    // New items join the end of the board.
    const [last] = await db.select({ order: max(watchlist.sortOrder) }).from(watchlist).where(eq(watchlist.userId, userId));
    await db
      .insert(watchlist)
      .values({ userId, itemId: item.id, sortOrder: (last?.order ?? -1) + 1 })
      .onConflictDoNothing();
    return true;
  },
};
