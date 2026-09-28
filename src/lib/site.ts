/**
 * The public origin every canonical URL, sitemap entry and social card points
 * at. `NEXT_PUBLIC_SITE_URL` wins; otherwise Vercel's production domain, which
 * follows whichever domain is primary (so moving to a `.com` needs no change
 * here); otherwise the current deployment.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;
  return "https://relicto.vercel.app";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "Relicto";

export const SITE_TAGLINE = "Dota 2 & CS2 Item Marketplace";

export const SITE_DESCRIPTION =
  "Buy, sell and price-check Dota 2 and CS2 items. Live listings from verified sellers, real price history and escrow-protected Steam trades.";

/**
 * Only the production deployment may be indexed. Previews and local builds
 * serve the same pages on other hosts, and indexing them would duplicate the site.
 */
export const INDEXABLE = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production";

/** "/items/foo" → "https://relicto.vercel.app/items/foo" */
export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}
