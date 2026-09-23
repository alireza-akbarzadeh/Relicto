import "server-only";
import { watchlistService } from "@/server/modules/watchlist/watchlist.service";
import { requireUserId } from "./get-session";

/** Item slugs the signed-in trader watches — every heart on every page starts from these. */
export async function getWatchedSlugs(): Promise<string[]> {
  return watchlistService.slugs(await requireUserId());
}
