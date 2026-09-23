import type { IconName } from "@/components/ui/icon";
import type { BracketCardData, BracketSchedule, RadarMatch } from "@/modules/tournaments/mobile.types";
import type { GameId, Tone } from "@/modules/tournaments/types";
import type { MatchRow, TournamentRow } from "./tournaments.repository";

const DAY = 24 * 60 * 60 * 1000;
const GAME_TITLE: Record<string, string> = { dota2: "Dota 2", cs2: "CS2" };

/** Each game's crest stack from the design; the count beside it is everyone else signed up. */
const CREST: Record<string, BracketCardData["crest"]> = {
  dota2: [
    { icon: "shield", tone: "primary" },
    { icon: "bolt", tone: "amber" },
    { icon: "military_tech", tone: "cyan" },
  ],
  cs2: [
    { icon: "gps_fixed", tone: "amber" },
    { icon: "star", tone: "strong" },
  ],
};

/** Relicto reward points paid per prize dollar — the rate the design's "45k PTS" on $15,000 implies. */
const POINTS_PER_USD = 3;

/** Under a day out it counts down; further out it names the day and time (UTC). */
function schedule(startsAt: Date | null, now: Date): BracketSchedule {
  if (!startsAt) return { kind: "date", label: "Date TBA" };
  const ms = startsAt.getTime() - now.getTime();
  if (ms > 0 && ms < DAY) return { kind: "countdown", seconds: Math.round(ms / 1000) };

  const time = startsAt.toISOString().slice(11, 16);
  const tomorrow = new Date(now.getTime() + DAY).toISOString().slice(0, 10) === startsAt.toISOString().slice(0, 10);
  const day = tomorrow ? "Tomorrow" : startsAt.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return { kind: "date", label: `${day} ${time}` };
}

export function toBracketCard(row: TournamentRow, now: Date): BracketCardData | null {
  const card = row.presentation?.card;
  if (!card) return null;

  const crest = CREST[row.gameId] ?? CREST.cs2;
  const prizeUsd = (row.prizePoolCents ?? 0) / 100;

  return {
    id: row.slug,
    game: row.gameId as GameId,
    tag: [card.gameLabel, row.format].filter(Boolean).join(" • "),
    schedule: schedule(row.startsAt, now),
    title: row.name,
    subtitle: { label: card.perk.label, tone: card.perk.tone as Tone },
    reward: { label: "Prize Bounty", usd: prizeUsd, points: `${Math.round((prizeUsd * POINTS_PER_USD) / 1000)}k PTS` },
    slots: {
      label: "Slots Registered",
      capacity: { filled: row.entrantCount, total: row.capacity ?? row.entrantCount, unit: row.capacityUnit ?? "Teams" },
    },
    crest,
    extraTeams: Math.max(0, row.entrantCount - crest.length),
    action: { label: card.action.label, icon: card.action.icon as IconName, emphasis: card.action.emphasis as "primary" | "secondary" },
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
  };
}

/** A live match on the radar: the same teams, score and state the desktop feed shows. */
export function toRadarMatch({ match, gameId, teamA, teamB }: MatchRow): RadarMatch {
  const p = match.presentation;
  const cs2 = gameId === "cs2";
  const score = (n: number) => (cs2 ? String(n).padStart(2, "0") : String(n));
  const tones = (p?.scoreTones ?? ["strong", "secondary"]) as [Tone, Tone];

  return {
    id: match.id,
    label: [GAME_TITLE[gameId] ?? gameId, match.round].filter(Boolean).join(" • "),
    labelIcon: cs2 ? "military_tech" : "sports_kabaddi",
    labelTone: (p?.labelTone ?? "muted") as Tone,
    clock: { label: p?.state.label ?? "LIVE", tone: (p?.state.tone ?? "live") as Tone },
    home: { tag: teamA?.tag ?? "TBD", name: teamA?.name ?? "TBD", meta: p?.meta[0] ?? "", metaTone: tones[0] },
    away: { tag: teamB?.tag ?? "TBD", name: teamB?.name ?? "TBD", meta: p?.meta[1] ?? "", metaTone: tones[1] },
    score: [score(match.scoreA), score(match.scoreB)],
    scoreTones: tones,
    separator: cs2 ? ":" : "-",
  };
}
