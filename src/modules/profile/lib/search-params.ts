import { createLoader, parseAsStringLiteral } from "nuqs/server";

export const PROFILE_TABS = [
  "showcase",
  "purchases",
  "transactions",
  "listings",
  "watchlist",
  "bids",
  "reviews",
  "linked",
  "safeguards",
] as const;

/** Profile URL contract: which section of the trader profile is open. */
export const profileSearchParams = {
  tab: parseAsStringLiteral(PROFILE_TABS).withDefault("showcase"),
};

export const loadProfileSearchParams = createLoader(profileSearchParams);
