/**
 * Arena hub, seeded from the tournament mocks. Prize, capacity, entrants and
 * times become columns; badge wording, accents and calls to action stay in
 * `presentation`. Times are relative to the seed run so the page reads as live.
 */
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";
import { arenaCards } from "../../modules/tournaments/data/desktop/arenas.mock";
import { heroEvents } from "../../modules/tournaments/data/desktop/hero.mock";
import { broadcast, feedMatches } from "../../modules/tournaments/data/desktop/live.mock";
import type { FeedTeam } from "../../modules/tournaments/types";

type Db = NodePgDatabase<typeof schema>;
type Tournament = typeof schema.tournaments.$inferInsert;

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** When each card's event starts, matching the badge it was designed with. */
const STARTS_IN: Record<string, number> = {
  "aegis-cup-invitational-2025": 2 * HOUR,
  "cs2-dust2-showdown": 26 * HOUR,
  "mirage-aim-challenge": 45 * MINUTE,
  "mid-only-sf-invoker": 6 * HOUR,
};

/** The hero's featured event per game hosts that game's matches. */
const HOST: Record<string, string> = {};

function heroRows(now: number): Tournament[] {
  return heroEvents.map((event, index) => {
    const slug = slugify(event.title);
    HOST[event.game] = `tournament-${slug}`;

    return {
      id: `tournament-${slug}`,
      gameId: event.game,
      slug,
      name: event.title,
      description: event.description,
      prizePoolCents: event.prizeUsd * 100,
      status: event.status.label.includes("LIVE") ? "live" : "upcoming",
      capacity: event.capacity.total,
      capacityUnit: event.capacity.unit,
      entrantCount: event.capacity.filled,
      registrationClosesAt: new Date(now + event.closesInSeconds * 1000),
      imageUrl: event.image,
      imageAlt: event.imageAlt,
      featured: true,
      sortOrder: index,
      presentation: {
        roster: event.teams.initials,
        hero: {
          tab: event.tab,
          status: event.status,
          qualifier: event.qualifier,
          kicker: event.kicker,
          primaryAction: event.primaryAction,
          secondaryAction: event.secondaryAction,
        },
      },
    };
  });
}

function cardRows(now: number): Tournament[] {
  return arenaCards.map((card, index) => ({
    id: `tournament-${card.id}`,
    gameId: card.game,
    slug: card.id,
    name: card.title,
    description: card.description,
    prizePoolCents: card.prizeUsd * 100,
    status: "upcoming",
    startsAt: new Date(now + (STARTS_IN[card.id] ?? HOUR)),
    format: card.format,
    capacity: card.capacity.total,
    capacityUnit: card.capacity.unit,
    entrantCount: card.capacity.filled,
    imageUrl: card.image,
    imageAlt: card.imageAlt,
    featured: false,
    sortOrder: heroEvents.length + index,
    presentation: {
      roster: card.teams.initials,
      card: {
        gameLabel: card.gameLabel,
        accent: card.accent,
        status: card.status,
        prizeEmphasis: card.prizeEmphasis,
        perk: card.perk,
        action: card.action,
      },
    },
  }));
}

async function upsertTeam(db: Db, tag: string, name: string) {
  const row = { id: `team-${slugify(name)}`, slug: slugify(name), name, tag };
  await db.insert(schema.teams).values(row).onConflictDoUpdate({ target: schema.teams.id, set: row });
  return row.id;
}

const gameOf = (label: string) => (label.startsWith("CS2") ? "cs2" : "dota2");

export async function seedTournaments(db: Db) {
  const now = Date.now();
  const events = [...heroRows(now), ...cardRows(now)];

  for (const row of events) {
    await db.insert(schema.tournaments).values(row).onConflictDoUpdate({ target: schema.tournaments.id, set: row });
  }

  for (const [index, feed] of feedMatches.entries()) {
    const [a, b] = feed.teams as [FeedTeam, FeedTeam];
    const row = {
      id: feed.id,
      tournamentId: HOST[gameOf(feed.label)],
      teamAId: await upsertTeam(db, a.tag, a.name),
      teamBId: await upsertTeam(db, b.tag, b.name),
      scoreA: a.score ?? 0,
      scoreB: b.score ?? 0,
      status: feed.pending ? ("scheduled" as const) : ("live" as const),
      round: feed.label.split(" • ")[1] ?? null,
      featured: false,
      sortOrder: index,
      presentation: {
        labelTone: feed.labelTone,
        state: feed.state,
        meta: [a.meta, b.meta] as [string, string],
        ...(a.scoreTone && b.scoreTone ? { scoreTones: [a.scoreTone, b.scoreTone] as [string, string] } : {}),
      },
    };
    await db.insert(schema.matches).values(row).onConflictDoUpdate({ target: schema.matches.id, set: row });
  }

  const { quality, viewers, badge, casters, goldAdvantage, image, imageAlt } = broadcast;
  const live = {
    id: "grand-final-liquid-spirit",
    tournamentId: HOST.dota2,
    teamAId: await upsertTeam(db, "LIQUID", "Team Liquid"),
    teamBId: await upsertTeam(db, "SPIRIT", "Team Spirit"),
    scoreA: broadcast.score[0],
    scoreB: broadcast.score[1],
    status: "live" as const,
    round: "GRAND FINAL",
    featured: true,
    sortOrder: 0,
    presentation: {
      labelTone: "crimson",
      state: { label: badge, tone: "live" },
      meta: ["Radiant", "Dire"] as [string, string],
      broadcast: { quality, viewers, badge, casters, goldAdvantage, image, imageAlt },
    },
  };
  await db.insert(schema.matches).values(live).onConflictDoUpdate({ target: schema.matches.id, set: live });

  return { tournaments: events.length, matches: feedMatches.length + 1 };
}
