import "server-only";

import { requireUserId } from "@/modules/relicto/data/get-session";
import { listingService } from "@/server/modules/listings/listings.service";
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
