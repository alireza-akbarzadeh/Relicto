import "server-only";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { offerService } from "@/server/modules/offers/offers.service";
import type { IncomingOffer } from "../types";

/**
 * Open bids on the signed-in seller's live listings. No mock fallback: an
 * empty inbox is real state, and sample bids would invite clicks on Accept
 * that settle nothing.
 */
export async function getIncomingOffers(): Promise<IncomingOffer[]> {
  return offerService.incoming(await requireUserId());
}
