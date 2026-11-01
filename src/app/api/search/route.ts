import type { NextRequest } from "next/server";
import { searchInput } from "@/server/modules/search/search.schema";
import { searchService } from "@/server/modules/search/search.service";
import { applyRateLimit, searchRateLimiter } from "@/server/modules/security/rate-limiter";

/**
 * `GET /api/search?q=doppler&game=cs2&rarity=covert&wear=fn&min=50&limit=8`
 *
 * The command palette's endpoint: items with a live copy, traders,
 * tournaments and per-game counts in one answer. Public, like the catalog it
 * searches — nothing here is per-trader; answers are per-request and never cached.
 */
export async function GET(request: NextRequest) {
  const rateLimit = applyRateLimit(request, searchRateLimiter);
  if (!rateLimit.allowed) return rateLimit.response;

  const parsed = searchInput.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return Response.json({ error: "invalid-query", issues: parsed.error.issues }, { status: 400 });

  return Response.json(await searchService.search(parsed.data), {
    headers: {
      "Cache-Control": "no-store",
      ...rateLimit.headers,
    },
  });
}
