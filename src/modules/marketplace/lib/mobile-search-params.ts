import { parseAsBoolean, parseAsStringLiteral } from "nuqs/server";
import { MOBILE_CATEGORIES, MOBILE_SORTS, PRICE_BANDS } from "../mobile.types";
import { marketplaceSearchParams } from "./search-params";

/**
 * Mobile marketplace URL contract. `q` and `view` are shared with the desktop
 * screen (same parsers), so a search survives a rotation or resize. The rest
 * are mobile-only keys, because the desktop facets mean something different.
 * Defaults mirror the Stitch screen.
 */
export const mobileMarketSearchParams = {
  q: marketplaceSearchParams.q,
  view: marketplaceSearchParams.view,
  cat: parseAsStringLiteral(MOBILE_CATEGORIES).withDefault("all"),
  msort: parseAsStringLiteral(MOBILE_SORTS).withDefault("spikes"),
  band: parseAsStringLiteral(PRICE_BANDS).withDefault("50to6k"),
  lowFloat: parseAsBoolean.withDefault(false),
};
