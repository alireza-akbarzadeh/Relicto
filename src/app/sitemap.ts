import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { GAME_SEO, gameMarketPath } from "@/modules/seo/lib/games";

/**
 * The hand-built public pages. Items live in their own chunked sitemaps
 * (`/items/sitemap/[id].xml`), which robots.txt lists alongside this one.
 * No `lastModified`: these pages have no single edit date, and a made-up one
 * teaches crawlers to ignore the field.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/marketplace", ...Object.keys(GAME_SEO).map(gameMarketPath), "/wiki", "/community", "/tournaments"];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
