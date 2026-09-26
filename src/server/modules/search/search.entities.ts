import "server-only";

import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, tournaments, user } from "@/lib/db/schema";
import { contains } from "./search.repository";
import type { SearchInput } from "./search.schema";

/** Traders by handle, busiest first. */
export async function findTraders(q: string, limit = 2) {
  return db
    .select({
      handle: profiles.handle,
      avatar: profiles.avatar,
      level: profiles.level,
      role: profiles.role,
      trustScore: profiles.trustScore,
      tradeCount: profiles.tradeCount,
      portfolioCents: profiles.portfolioCents,
      verified: user.emailVerified,
      listings: sql<number>`(select count(*)::int from listings l where l.seller_id = ${profiles.userId} and l.status = 'active')`,
    })
    .from(profiles)
    .innerJoin(user, eq(profiles.userId, user.id))
    .where(ilike(profiles.handle, contains(q)))
    .orderBy(desc(profiles.tradeCount))
    .limit(limit);
}

/** Tournaments by name, live ones first. */
export async function findTournaments(input: SearchInput, limit = 2) {
  return db
    .select({
      slug: tournaments.slug,
      name: tournaments.name,
      status: tournaments.status,
      format: tournaments.format,
      prizePoolCents: tournaments.prizePoolCents,
      gameId: tournaments.gameId,
    })
    .from(tournaments)
    .where(
      and(
        ilike(tournaments.name, contains(input.q)),
        input.game !== "all" ? eq(tournaments.gameId, input.game) : undefined,
      ),
    )
    .orderBy(
      desc(sql`(${tournaments.status} = 'live')`),
      asc(tournaments.sortOrder),
    )
    .limit(limit);
}
