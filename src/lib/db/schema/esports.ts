import { index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { games } from "./catalog";

export const tournamentStatus = pgEnum("tournament_status", ["upcoming", "live", "completed"]);
export const matchStatus = pgEnum("match_status", ["scheduled", "live", "completed"]);
export const predictionStatus = pgEnum("prediction_status", ["open", "won", "lost", "void"]);

export const tournaments = pgTable(
  "tournaments",
  {
    id: primaryId(),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    prizePoolCents: integer("prize_pool_cents"),
    status: tournamentStatus("status").notNull().default("upcoming"),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    ...timestamps,
  },
  (t) => [uniqueIndex("tournaments_slug_idx").on(t.slug), index("tournaments_status_idx").on(t.status)],
);

export const teams = pgTable(
  "teams",
  {
    id: primaryId(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    tag: text("tag"),
    logo: text("logo"),
    ...timestamps,
  },
  (t) => [uniqueIndex("teams_slug_idx").on(t.slug)],
);

export const matches = pgTable(
  "matches",
  {
    id: primaryId(),
    tournamentId: text("tournament_id")
      .notNull()
      .references(() => tournaments.id, { onDelete: "cascade" }),
    teamAId: text("team_a_id").references(() => teams.id, { onDelete: "set null" }),
    teamBId: text("team_b_id").references(() => teams.id, { onDelete: "set null" }),
    scoreA: integer("score_a").notNull().default(0),
    scoreB: integer("score_b").notNull().default(0),
    status: matchStatus("status").notNull().default("scheduled"),
    startsAt: timestamp("starts_at"),
    ...timestamps,
  },
  (t) => [index("matches_tournament_idx").on(t.tournamentId), index("matches_status_idx").on(t.status)],
);

export const predictions = pgTable(
  "predictions",
  {
    id: primaryId(),
    matchId: text("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    teamId: text("team_id").references(() => teams.id, { onDelete: "set null" }),
    stakeCents: integer("stake_cents").notNull().default(0),
    status: predictionStatus("status").notNull().default("open"),
    ...timestamps,
  },
  (t) => [uniqueIndex("predictions_match_user_idx").on(t.matchId, t.userId), index("predictions_user_idx").on(t.userId)],
);
