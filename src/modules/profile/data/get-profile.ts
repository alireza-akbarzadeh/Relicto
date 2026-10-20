import "server-only";
import { rethrowNextSignals } from "@/lib/next-signals";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { offerService } from "@/server/modules/offers/offers.service";
import { profileService } from "@/server/modules/profile/profile.service";
import { watchlistService } from "@/server/modules/watchlist/watchlist.service";
import type { ProfileData } from "../types";
import { identity, stats } from "./identity.mock";
import { listings, showcase } from "./inventory.mock";
import { endorsements, lastHandshake, linked, reviews, safeguards, security } from "./reputation.mock";

import { samplePurchases } from "./purchases.mock";
import { wallet } from "@/modules/wallet/data/wallet.mock";
import { findUserBalanceSummary, SAMPLE_USER_BALANCE } from "@/server/modules/profile/profile.balance";
import { findUserPurchasedItems, findUserTransactions } from "@/server/modules/profile/profile.purchases";

/** Shown until the signed-in trader has a profile row of their own. */
const SAMPLE: ProfileData = {
  identity,
  stats,
  showcase,
  listings,
  listingsShown: 3,
  /** The sample profile has no watched items; the tab shows its empty state. */
  watchlist: [],
  bids: [],
  purchases: samplePurchases,
  transactions: wallet.transactions,
  balance: SAMPLE_USER_BALANCE,
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
 * The watchlist, bids, purchases, transactions and balance are always the caller's own.
 */
export async function getProfile(): Promise<ProfileData> {
  const userId = await requireUserId();
  try {
    const [profile, watchlist, bids, purchases, transactions, balance] = await Promise.all([
      profileService.detail(userId),
      watchlistService.watched(userId),
      offerService.outgoing(userId),
      findUserPurchasedItems(userId),
      findUserTransactions(userId),
      findUserBalanceSummary(userId),
    ]);

    return { ...(profile ?? SAMPLE), watchlist, bids, purchases, transactions, balance };
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getProfile] Fallback to mock:", err);
    return SAMPLE;
  }
}
