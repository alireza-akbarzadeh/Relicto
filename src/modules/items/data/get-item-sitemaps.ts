import "server-only";
import { countSitemapItems, findSitemapItems } from "@/server/modules/items/items.seo";

/** Google reads at most 50,000 URLs per sitemap; stay well under. */
const ITEMS_PER_SITEMAP = 40_000;

/** Ids of the item sitemap files (`/items/sitemap/[id].xml`): one per 40k indexable items, at least one. */
export async function getItemSitemapIds() {
  try {
    const total = await countSitemapItems();
    const pages = Math.max(1, Math.ceil(total / ITEMS_PER_SITEMAP));
    return Array.from({ length: pages }, (_, id) => ({ id }));
  } catch (error) {
    console.warn("[sitemaps] countSitemapItems query timed out or failed; falling back to 1 sitemap page", error);
    return [{ id: 0 }];
  }
}

/** The indexable items in sitemap file `id`. */
export async function getItemSitemapPage(id: number) {
  try {
    return await findSitemapItems(id * ITEMS_PER_SITEMAP, ITEMS_PER_SITEMAP);
  } catch (error) {
    console.warn(`[sitemaps] findSitemapItems page ${id} failed; falling back to empty list`, error);
    return [];
  }
}
