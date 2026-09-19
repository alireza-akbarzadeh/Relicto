import "server-only";

import { LISTINGS } from "./listings.mock";

/** Marketplace catalog. Mock today; replace with a listings query of the same shape. */
export async function getMarketplaceCatalog() {
  return LISTINGS;
}
