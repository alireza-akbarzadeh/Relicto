import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getItemSitemapIds, getItemSitemapPage } from "@/modules/items/data/get-item-sitemaps";
import { itemPath } from "@/modules/items/lib/item-seo";

/** Listings change prices and stock all day; an hourly refresh keeps `lastModified` honest. */
export const revalidate = 3600;

export const generateSitemaps = getItemSitemapIds;

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const rows = await getItemSitemapPage(Number(await id));
  return rows.map((row) => ({
    url: absoluteUrl(itemPath(row.slug)),
    lastModified: row.updatedAt,
    ...(row.imageUrl ? { images: [row.imageUrl] } : {}),
  }));
}
