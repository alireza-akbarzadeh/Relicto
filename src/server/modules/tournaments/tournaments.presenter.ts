import type { IconName } from "@/components/ui/icon";
import type {
  Accent, ArenaCard, Broadcast, FeedMatch, FeedTeam, GameId, HeroEvent, StatusBadge, Tone,
} from "@/modules/tournaments/types";
import type { MatchRow, TournamentRow } from "./tournaments.repository";

const GAME_LABEL: Record<string, string> = { dota2: "DOTA 2", cs2: "CS2" };

const capacityOf = (row: TournamentRow) => ({
  filled: row.entrantCount,
  total: row.capacity ?? row.entrantCount,
  unit: row.capacityUnit ?? "TEAMS",
});

/** The card names a few entrants; the rest is a count derived from sign-ups. */
const rosterOf = (row: TournamentRow) => {
  const initials = row.presentation?.roster ?? [];
  return { initials, extra: Math.max(0, row.entrantCount - initials.length) };
};

const action = (a: { label: string; icon: string }) => ({ label: a.label, icon: a.icon as IconName });

export function toHeroEvent(row: TournamentRow, now: Date): HeroEvent | null {
  const hero = row.presentation?.hero;
  if (!hero) return null;

  const closesAt = row.registrationClosesAt?.getTime() ?? now.getTime();

  return {
    game: row.gameId as GameId,
    tab: action(hero.tab),
    status: hero.status as HeroEvent["status"],
    qualifier: hero.qualifier,
    // A live countdown, so it is derived from the close time on every render.
    closesInSeconds: Math.max(0, Math.round((closesAt - now.getTime()) / 1000)),
    kicker: action(hero.kicker),
    title: row.name,
    description: row.description ?? "",
    prizeUsd: (row.prizePoolCents ?? 0) / 100,
    capacity: capacityOf(row),
    teams: rosterOf(row),
    primaryAction: action(hero.primaryAction),
    secondaryAction: action(hero.secondaryAction),
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
  };
}

export function toArenaCard(row: TournamentRow): ArenaCard | null {
  const card = row.presentation?.card;
  if (!card) return null;

  return {
    id: row.slug,
    game: row.gameId as GameId,
    gameLabel: card.gameLabel,
    accent: card.accent as Accent,
    status: card.status as StatusBadge,
    prizeUsd: (row.prizePoolCents ?? 0) / 100,
    prizeEmphasis: card.prizeEmphasis as ArenaCard["prizeEmphasis"],
    format: row.format ?? "",
    capacity: capacityOf(row),
    title: row.name,
    description: row.description ?? "",
    teams: rosterOf(row),
    perk: { icon: card.perk.icon as IconName, label: card.perk.label, tone: card.perk.tone as Tone },
    action: { ...action(card.action), emphasis: card.action.emphasis as ArenaCard["action"]["emphasis"] },
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
  };
}

function side(team: MatchRow["teamA"], meta: string, score: number, tone: string | undefined, scored: boolean): FeedTeam {
  return {
    tag: team?.tag ?? "TBD",
    name: team?.name ?? "To be decided",
    meta,
    ...(scored ? { score, ...(tone ? { scoreTone: tone as Tone } : {}) } : {}),
  };
}

export function toFeedMatch({ match, gameId, teamA, teamB }: MatchRow): FeedMatch {
  const p = match.presentation;
  // Nothing has been scored until the match starts.
  const scored = match.status !== "scheduled";

  return {
    id: match.id,
    label: [GAME_LABEL[gameId] ?? gameId.toUpperCase(), match.round].filter(Boolean).join(" • "),
    labelTone: (p?.labelTone ?? "muted") as Tone,
    state: (p?.state ?? { label: match.status.toUpperCase(), tone: "muted" }) as FeedMatch["state"],
    teams: [
      side(teamA, p?.meta[0] ?? "", match.scoreA, p?.scoreTones?.[0], scored),
      side(teamB, p?.meta[1] ?? "", match.scoreB, p?.scoreTones?.[1], scored),
    ],
    ...(scored ? {} : { pending: true }),
  };
}

export function toBroadcast({ match, teamA, teamB }: MatchRow): Broadcast | null {
  const b = match.presentation?.broadcast;
  if (!b) return null;

  return {
    quality: b.quality,
    viewers: b.viewers,
    home: (teamA?.name ?? "TBD").toUpperCase(),
    away: (teamB?.name ?? "TBD").toUpperCase(),
    score: [match.scoreA, match.scoreB],
    badge: b.badge,
    casters: b.casters,
    goldAdvantage: b.goldAdvantage,
    image: b.image,
    imageAlt: b.imageAlt,
  };
}
