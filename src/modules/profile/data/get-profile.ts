import "server-only";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { profileService } from "@/server/modules/profile/profile.service";
import { watchlistService } from "@/server/modules/watchlist/watchlist.service";
import type { ProfileData } from "../types";
import { identity, stats } from "./identity.mock";
import { listings, showcase } from "./inventory.mock";
import { endorsements, lastHandshake, linked, reviews, safeguards, security } from "./reputation.mock";

/** Shown until the signed-in trader has a profile row of their own. */
const SAMPLE: ProfileData = {
  identity,
  stats,
  showcase,
  listings,
  listingsShown: 3,
  /** The sample profile has no watched items; the tab shows its empty state. */
  watchlist: [],
  security,
  lastHandshake,
  endorsements,
  reviews,
  linked,
  safeguards,
  inventoryCount: 142,
  reviewCount: 412,
};

/**
 * Trader profile for the signed-in account, from Postgres. Falls back to the
 * sample profile so the screen never renders empty.
 *
 * The watchlist is always the caller's own. It lives in its own table keyed on
 * the user, so an account with no `profiles` row yet — every fresh sign-up —
 * still sees what it actually watches rather than the sample's empty list.
 */
export async function getProfile(): Promise<ProfileData> {
  const userId = await requireUserId();
  const [profile, watchlist] = await Promise.all([profileService.detail(userId), watchlistService.watched(userId)]);

  return { ...(profile ?? SAMPLE), watchlist };
}
