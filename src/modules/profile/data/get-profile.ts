import "server-only";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { profileService } from "@/server/modules/profile/profile.service";
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
 */
export async function getProfile(): Promise<ProfileData> {
  return (await profileService.detail(await requireUserId())) ?? SAMPLE;
}
