import "server-only";
import { rethrowNextSignals } from "@/lib/next-signals";
import { getUserId } from "@/modules/relicto/data/get-session";
import { communityService } from "@/server/modules/community/community.service";
import type { CommunityData } from "../types";
import { community } from "./community.mock";

/**
 * The trader feed, from Postgres. Falls back to the sample feed until the
 * community tables are seeded, so the screen never renders empty.
 */
export async function getCommunity(): Promise<CommunityData> {
  try {
    const userId = await getUserId();
    const live = await communityService.feed(25, userId);
    return live.posts.length > 0 ? live : community;
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getCommunity] Fallback to mock:", err);
    return community;
  }
}
