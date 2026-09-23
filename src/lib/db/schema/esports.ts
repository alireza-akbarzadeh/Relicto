import { boolean, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { primaryId, timestamps } from "./_shared";
import { user } from "./auth";
import { games } from "./catalog";

export const tournamentStatus = pgEnum("tournament_status", ["upcoming", "live", "completed"]);
export const matchStatus = pgEnum("match_status", ["scheduled", "live", "completed"]);
export const predictionStatus = pgEnum("prediction_status", ["open", "won", "lost", "void"]);

type Action = { label: string; icon: string };

/**
 * How a tournament is merchandised — badge wording, accents, perk chip, calls to
 * action and the roster initials on its card. Authored, so it stays a blob; the
 * facts (prize, capacity, times) are columns.
 */
export type TournamentPresentation = {
  roster: string[];
  card?: {
    gameLabel: string;
    accent: string;
    status: { label: string; kind: string; indicator?: string };
    prizeEmphasis: string;
    perk: { icon: string; label: string; tone: string };
    action: Action & { emphasis: string };
  };
  /** Present on the events the hero banner rotates through. */
  hero?: {
    tab: Action;
    status: { label: string; tone: string };
    qualifier: string;
    kicker: Action;
    primaryAction: Action;
    secondaryAction: Action;
  };
};

/** A match's broadcast chrome and per-side captions — authored, not scored. */
export type MatchPresentation = {
  labelTone: string;
  state: { label: string; tone: string; indicator?: string };
  meta: [string, string];
  scoreTones?: [string, string];
  /** Present on the one match the live player is showing. */
  broadcast?: {
    quality: string;
    viewers: number;
    badge: string;
    casters: string;
    goldAdvantage: string;
    image: string;
    imageAlt: string;
  };
};

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
    description: text("description"),
    /** "5v5 CAPTAINS MODE", "1V1 AIM LADDER". */
    format: text("format"),
    /** Seats and what they are ("SQUADS", "TEAMS", "PLAYERS"). */
    capacity: integer("capacity"),
    capacityUnit: text("capacity_unit"),
    /** Cached from registrations, which will recompute it once sign-ups are written. */
    entrantCount: integer("entrant_count").notNull().default(0),
    registrationClosesAt: timestamp("registration_closes_at"),
    imageUrl: text("image_url"),
    imageAlt: text("image_alt"),
    /** Headlines the hero banner. */
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    presentation: jsonb("presentation").$type<TournamentPresentation>(),
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
    /** Where in the bracket ("UPPER BRACKET R2", "SWISS ROUND 4"). */
    round: text("round"),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    presentation: jsonb("presentation").$type<MatchPresentation>(),
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
