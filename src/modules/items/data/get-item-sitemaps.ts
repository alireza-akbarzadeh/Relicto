import "server-only";
import { countSitemapItems, findSitemapItems } from "@/server/modules/items/items.seo";

/** Google reads at most 50,000 URLs per sitemap; stay well under. */
const ITEMS_PER_SITEMAP = 40_000;

/** Ids of the item sitemap files (`/items/sitemap/[id].xml`): one per 40k indexable items, at least one. */
export async function getItemSitemapIds() {
  const pages = Math.max(1, Math.ceil((await countSitemapItems()) / ITEMS_PER_SITEMAP));
  return Array.from({ length: pages }, (_, id) => ({ id }));
}

/** The indexable items in sitemap file `id`. */
export async function getItemSitemapPage(id: number) {
  return findSitemapItems(id * ITEMS_PER_SITEMAP, ITEMS_PER_SITEMAP);
}
