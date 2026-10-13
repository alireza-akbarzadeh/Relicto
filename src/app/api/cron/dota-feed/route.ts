import type { NextRequest } from "next/server";
import { dotaFeedService } from "@/server/modules/dota-feed/dota-feed.service";
import { bearerMatches } from "@/server/modules/shared/bearer";

export const maxDuration = 60;

/**
 * Daily Dota 2 datafeed sync: updates heroes and aligns catalog items.
 * Called by Vercel Cron with `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: NextRequest) {
  if (!bearerMatches(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await dotaFeedService.sync();
  return Response.json(result);
}
