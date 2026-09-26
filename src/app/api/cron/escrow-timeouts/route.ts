import { after, type NextRequest } from "next/server";
import { escrowService } from "@/server/modules/escrow/escrow.service";
import { notificationService } from "@/server/modules/notifications/notifications.service";
import { offerService } from "@/server/modules/offers/offers.service";
import { bearerMatches } from "@/server/modules/shared/bearer";

/**
 * Escrow expiry sweep. Refunds every escrow whose window lapsed with no trade
 * offer dispatched. Vercel Cron calls it with `Authorization: Bearer
 * $CRON_SECRET`; traders' own pages also expire their escrows on read, so this
 * is the safety net for everyone who isn't looking.
 */
export async function GET(request: NextRequest) {
  if (!bearerMatches(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { expired, notices } = await escrowService.expireOverdue();
  // Lapsed bids ride along: the same daily sweep, so no second cron slot.
  const lapsedOffers = await offerService.expireLapsed();
  after(() => notificationService.deliver(notices));
  return Response.json({ expired, lapsedOffers });
}
