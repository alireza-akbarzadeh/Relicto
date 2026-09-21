import { parseAsStringLiteral } from "nuqs/server";
import { HUB_EVENTS, META_ROLES } from "../mobile.types";

/**
 * Mobile hub URL contract: which tournament's live match is featured, and
 * which role's pick is expanded in the meta list. Defaults mirror Stitch.
 */
export const hubMobileSearchParams = {
  event: parseAsStringLiteral(HUB_EVENTS).withDefault("pgl"),
  role: parseAsStringLiteral(META_ROLES).withDefault("support"),
};
