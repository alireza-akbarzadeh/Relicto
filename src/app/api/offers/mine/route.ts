import { getUserId } from "@/modules/relicto/data/get-session";
import { offerService } from "@/server/modules/offers/offers.service";

/**
 * `GET /api/offers/mine`
 * Returns the signed-in user's active bids across the marketplace.
 */
export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const bids = await offerService.outgoing(userId);
  return Response.json({ bids }, { headers: { "Cache-Control": "no-store" } });
}
