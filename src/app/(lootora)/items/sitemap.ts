import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getItemSitemapIds, getItemSitemapPage } from "@/modules/items/data/get-item-sitemaps";
import { itemPath } from "@/modules/items/lib/item-seo";

/** Rendered per request: listings change all day, and a build shouldn't need the database. */
export const dynamic = "force-dynamic";

export const generateSitemaps = getItemSitemapIds;

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const rows = await getItemSitemapPage(Number(await id));
  return rows.map((row) => ({
    url: absoluteUrl(itemPath(row.slug)),
    lastModified: row.updatedAt,
    ...(row.imageUrl ? { images: [absoluteUrl(row.imageUrl)] } : {}),
  }));
}
