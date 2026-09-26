import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { searchInput } from "@/server/modules/search/search.schema";
import { searchService } from "@/server/modules/search/search.service";

/**
 * `GET /api/search?q=doppler&game=cs2&rarity=covert&wear=fn&min=50&limit=8`
 *
 * The command palette's endpoint: items with a live copy, traders,
 * tournaments and per-game counts in one answer. Signed-in only, like the
 * rest of the app; answers are per-request and never cached.
 */
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });

  const parsed = searchInput.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return Response.json({ error: "invalid-query", issues: parsed.error.issues }, { status: 400 });

  return Response.json(await searchService.search(parsed.data), { headers: { "Cache-Control": "no-store" } });
}
