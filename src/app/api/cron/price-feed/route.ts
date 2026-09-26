import type { NextRequest } from "next/server";
import { priceFeedService } from "@/server/modules/price-feed/price-feed.service";
import { bearerMatches } from "@/server/modules/shared/bearer";

/** Pulls three large JSON feeds and upserts a few hundred rows. */
export const maxDuration = 60;

/**
 * Daily market snapshot: today's lowest Skinport ask for every catalog item.
 * Vercel Cron calls it with `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: NextRequest) {
  if (!bearerMatches(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.json({ games: await priceFeedService.snapshot() });
}
