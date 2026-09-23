import "server-only";

import { alias } from "drizzle-orm/pg-core";
import { asc, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { matches, teams, tournaments } from "@/lib/db/schema";

/** Every tournament still worth showing, in the order the page lays them out. */
export async function findOpenTournaments() {
  return db
    .select()
    .from(tournaments)
    .where(ne(tournaments.status, "completed"))
    .orderBy(asc(tournaments.sortOrder));
}

export type TournamentRow = Awaited<ReturnType<typeof findOpenTournaments>>[number];

const teamA = alias(teams, "team_a");
const teamB = alias(teams, "team_b");

/** Live and upcoming matches with both sides and the game they're played in. */
export async function findActiveMatches() {
  return db
    .select({ match: matches, gameId: tournaments.gameId, teamA, teamB })
    .from(matches)
    .innerJoin(tournaments, eq(matches.tournamentId, tournaments.id))
    .leftJoin(teamA, eq(matches.teamAId, teamA.id))
    .leftJoin(teamB, eq(matches.teamBId, teamB.id))
    .where(ne(matches.status, "completed"))
    .orderBy(asc(matches.sortOrder));
}

export type MatchRow = Awaited<ReturnType<typeof findActiveMatches>>[number];
