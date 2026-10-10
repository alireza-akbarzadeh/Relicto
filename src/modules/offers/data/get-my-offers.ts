import "server-only";

import { getUserId } from "@/modules/relicto/data/get-session";
import { offerService } from "@/server/modules/offers/offers.service";
import type { BuyerBid } from "../types";

/**
 * Returns all active bids placed by the current signed-in user across the marketplace.
 */
export async function getMyBids(): Promise<BuyerBid[]> {
  const userId = await getUserId();
  if (!userId) return [];
  return offerService.outgoing(userId);
}
