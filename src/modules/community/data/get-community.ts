import "server-only";
import { communityService } from "@/server/modules/community/community.service";
import type { CommunityData } from "../types";
import { community } from "./community.mock";

/**
 * The trader feed, from Postgres. Falls back to the sample feed until the
 * community tables are seeded, so the screen never renders empty.
 */
export async function getCommunity(): Promise<CommunityData> {
  const live = await communityService.feed();
  return live.posts.length > 0 ? live : community;
}
