import "server-only";

import type { ProfileData } from "@/modules/profile/types";
import { toIdentity, toStats } from "./profile.identity";
import { toEndorsement, toReview, toSellerListing, toShowcase, toStatusRow } from "./profile.presenter";
import * as repository from "./profile.repository";

/** How many listings the tab shows before "view all". */
const LISTINGS_SHOWN = 3;

export const profileService = {
  /** The signed-in trader's own profile, or null when they have none yet. */
  async detail(userId: string): Promise<ProfileData | null> {
    const profile = await repository.findProfile(userId);
    if (!profile) return null;

    const now = new Date();
    const [showcase, sellerListings, statusRows, endorsements, reviews, sales] = await Promise.all([
      repository.findShowcase(profile.id),
      repository.findSellerListings(userId),
      repository.findStatusRows(profile.id),
      repository.findEndorsements(profile.id),
      repository.findReviews(profile.id),
      repository.sumRecentSales(userId, now),
    ]);

    const byGroup = (group: (typeof statusRows)[number]["group"]) =>
      statusRows.filter((row) => row.group === group).map(toStatusRow);

    return {
      identity: toIdentity(profile),
      stats: toStats(profile, sales),
      showcase: showcase.map(toShowcase),
      listings: sellerListings.map(toSellerListing),
      listingsShown: LISTINGS_SHOWN,
      security: byGroup("security"),
      lastHandshake: profile.lastHandshake ?? "",
      endorsements: endorsements.map(toEndorsement),
      reviews: reviews.map((row) => toReview(row, now)),
      linked: byGroup("linked"),
      safeguards: byGroup("safeguards"),
      inventoryCount: profile.inventoryCount,
      reviewCount: profile.reviewCount,
    };
  },
};
