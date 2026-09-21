import "server-only";

import { LISTINGS } from "./listings.mock";
import { marketMobile } from "./market-mobile.mock";

/** Marketplace catalog. Mock today; replace with a listings query of the same shape. */
export async function getMarketplaceCatalog() {
  return LISTINGS;
}

/** Mobile trading feed (trending rank, spike alert, engine ticker). */
export async function getMarketplaceMobile() {
  return marketMobile;
}
