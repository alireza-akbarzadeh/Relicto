import type { BracketCardData, QuickMatchData } from "../../mobile.types";

export const bracketsSection = { title: "Premier Brackets", meta: "32 Live Events" };

export const bracketCards: BracketCardData[] = [
  {
    id: "aegis-battleground-s7",
    game: "dota2",
    tag: "Dota 2 • 5v5 CM",
    schedule: { kind: "countdown", seconds: 4 * 3600 + 12 * 60 + 30 },
    title: "Aegis Battleground",
    subtitle: { label: "S7", tone: "muted" },
    reward: { label: "Prize Bounty", usd: 15_000, points: "45k PTS" },
    slots: { label: "Slots Registered", capacity: { filled: 28, total: 32, unit: "Teams" } },
    crest: [
      { icon: "shield", tone: "primary" },
      { icon: "bolt", tone: "amber" },
      { icon: "military_tech", tone: "cyan" },
    ],
    extraTeams: 25,
    action: { label: "Register Team", icon: "arrow_forward", emphasis: "primary" },
    image: "/images/arena/bracket-aegis.jpg",
    imageAlt: "A dark fantasy battlefield with glowing crimson towers and floating arcane runes.",
  },
  {
    id: "mirage-masters",
    game: "cs2",
    tag: "CS2 • MR12 Defusal",
    schedule: { kind: "date", label: "Tomorrow 18:00" },
    title: "Mirage Masters",
    subtitle: { label: "Tier 1", tone: "amber" },
    reward: { label: "Grand Reward", usd: 25_000, points: "60k PTS" },
    slots: { label: "Pro Slots", capacity: { filled: 14, total: 16, unit: "Teams" } },
    crest: [
      { icon: "gps_fixed", tone: "amber" },
      { icon: "star", tone: "strong" },
    ],
    extraTeams: 12,
    action: { label: "View Bracket", icon: "account_tree", emphasis: "secondary" },
    image: "/images/arena/bracket-mirage.jpg",
    imageAlt: "Bomb site A on Mirage with a smoke plume under amber stadium spotlights.",
  },
];

export const quickMatch: QuickMatchData = {
  id: "turbo-mid-1v1",
  game: "dota2",
  icon: "local_fire_department",
  title: "Turbo Mid 1v1",
  subtitle: "Instant Matchmaking • Shadow Fiend Only",
  points: "10,000 PTS",
  wait: "Avg Wait: 42s",
  action: { label: "Find Match", icon: "play_arrow" },
};
