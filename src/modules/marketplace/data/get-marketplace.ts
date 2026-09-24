import "server-only";

import { requireUserId } from "@/modules/relicto/data/get-session";
import { listingService } from "@/server/modules/listings/listings.service";
import { searchListings } from "../lib/filters";
import type { Filters } from "../types";
import { LISTINGS } from "./listings.mock";
import { marketMobile } from "./market-mobile.mock";

/**
 * Marketplace catalog, from Postgres. Falls back to the mock if the catalog
 * hasn't been seeded yet (`npm run db:seed`) so the screen never renders empty.
 */
export async function getMarketplaceCatalog() {
  const listings = await listingService.catalog({ sort: "recent" });
  return listings.length > 0 ? listings : LISTINGS;
}

/**
 * One page of the grid, filtered and counted by Postgres. The client no longer
 * filters a catalog it was handed — it drives the URL, and this runs again.
 *
 * On an unseeded database it falls back to searching the mock in memory, so the
 * screen still renders its designed state.
 */
export async function getMarketplaceResults(filters: Filters) {
  const results = await listingService.search(filters);
  if (results.facets.total > 0) return results;

  const fallback = searchListings(LISTINGS, filters);
  return { ...fallback, facets: { games: {}, rarities: {}, slots: {}, heroes: {}, total: 0 } };
}

const usd = (value: number) =>
  `${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

/**
 * Mobile trading feed: the live catalog, one card per item ranked by move, and
 * the same liquidity the hub quotes in the engine ticker. Search copy, category
 * pills and the meta-spike banner stay authored.
 */
export async function getMarketplaceMobile() {
  const feed = await listingService.mobileFeed(await requireUserId());
  if (feed.listings.length === 0) return marketMobile;
  return { ...marketMobile, listings: feed.listings, ticker: { ...marketMobile.ticker, pool: usd(feed.liquidityUsd) } };
}
