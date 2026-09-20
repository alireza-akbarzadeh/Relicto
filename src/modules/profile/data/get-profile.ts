import "server-only";
import type { ProfileData } from "../types";
import { identity, stats } from "./identity.mock";
import { listings, showcase } from "./inventory.mock";
import { endorsements, lastHandshake, linked, reviews, safeguards, security } from "./reputation.mock";

/** Trader profile snapshot. Mock today; swap for the profile API without touching the UI. */
export async function getProfile(): Promise<ProfileData> {
  return {
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
}
