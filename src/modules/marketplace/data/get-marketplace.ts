import "server-only";

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

/** Mobile trading feed (trending rank, spike alert, engine ticker). */
export async function getMarketplaceMobile() {
  return marketMobile;
}
