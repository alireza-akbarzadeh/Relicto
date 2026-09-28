import type { MetadataRoute } from "next";
import { absoluteUrl, INDEXABLE } from "@/lib/site";
import { getItemSitemapIds } from "@/modules/items/data/get-item-sitemaps";

/** Re-read hourly, as the item sitemap count can grow. */
export const revalidate = 3600;

/**
 * Crawl the public catalog; skip what is one trader's own (it redirects to
 * sign-in anyway) and the API. Robots only steers crawling — pages that must
 * stay out of the index also say `noindex`. Previews block everything.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };

  const itemSitemaps = await getItemSitemapIds();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/alerts", "/checkout", "/orders", "/profile", "/sell", "/tracker", "/wallet", "/verify", "/reset-password"],
    },
    sitemap: [absoluteUrl("/sitemap.xml"), ...itemSitemaps.map(({ id }) => absoluteUrl(`/items/sitemap/${id}.xml`))],
  };
}
