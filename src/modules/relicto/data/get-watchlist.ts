import "server-only";
import { cache } from "react";
import { watchlistService } from "@/server/modules/watchlist/watchlist.service";
import { requireUserId } from "./get-session";

/** Item slugs the signed-in trader watches — request-memoized so layout and pages share one read. */
export const getWatchedSlugs = cache(async (): Promise<string[]> => {
  return watchlistService.slugs(await requireUserId());
});
