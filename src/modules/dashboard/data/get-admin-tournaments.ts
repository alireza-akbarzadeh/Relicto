import "server-only";

import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/lib/db";
import { matches, teams, tournaments } from "@/lib/db/schema";
import type { DashboardMatch, DashboardTournament } from "../types";

export async function getAdminTournaments(): Promise<{
  tournamentsList: DashboardTournament[];
  matchesList: DashboardMatch[];
}> {
  try {
    const rawTournaments = await db
      .select()
      .from(tournaments)
      .orderBy(desc(tournaments.createdAt))
      .limit(50);

    const teamA = alias(teams, "team_a");
    const teamB = alias(teams, "team_b");

    const rawMatches = await db
      .select({
        match: matches,
        tournamentName: tournaments.name,
        teamAName: teamA.name,
        teamBName: teamB.name,
      })
      .from(matches)
      .innerJoin(tournaments, eq(matches.tournamentId, tournaments.id))
      .leftJoin(teamA, eq(matches.teamAId, teamA.id))
      .leftJoin(teamB, eq(matches.teamBId, teamB.id))
      .orderBy(desc(matches.createdAt))
      .limit(50);

    const tournamentsList: DashboardTournament[] = rawTournaments.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      gameId: t.gameId,
      prizePoolCents: t.prizePoolCents ?? 0,
      status: t.status,
      format: t.format,
      entrantCount: t.entrantCount ?? 0,
      featured: t.featured,
      startsAt: t.startsAt ? t.startsAt.toISOString() : null,
    }));

    const matchesList: DashboardMatch[] = rawMatches.map((r) => ({
      id: r.match.id,
      tournamentId: r.match.tournamentId,
      tournamentName: r.tournamentName,
      teamAName: r.teamAName ?? "Team Alpha",
      teamBName: r.teamBName ?? "Team Omega",
      scoreA: r.match.scoreA,
      scoreB: r.match.scoreB,
      status: r.match.status,
      round: r.match.round,
      startsAt: r.match.startsAt ? r.match.startsAt.toISOString() : null,
    }));

    return { tournamentsList, matchesList };
  } catch (err) {
    console.error("[getAdminTournaments] Failed to fetch tournament telemetry:", err);
    return { tournamentsList: [], matchesList: [] };
  }
}
