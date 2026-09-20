import { createLoader, parseAsString } from "nuqs/server";

/** Community URL contract: which channel is open. */
export const communitySearchParams = {
  channel: parseAsString.withDefault("All Discussions"),
};

export const loadCommunitySearchParams = createLoader(communitySearchParams);
