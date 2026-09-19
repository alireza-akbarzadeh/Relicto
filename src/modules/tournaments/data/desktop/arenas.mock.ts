import type { ArenaCard, FilterChip } from "../../types";

export const arenaSection = {
  kicker: "TOURNAMENT BRACKETS & REGISTRATION",
  title: "Active Arenas",
  openEvents: 24,
  seeding: "AUTOMATED SEEDING",
};

export const circuitFilters = [
  { value: "all", label: "All Circuits" },
  { value: "dota2", label: "Dota 2" },
  { value: "cs2", label: "CS2" },
] as const;

export const filterChips: FilterChip[] = [
  { icon: "public", label: "REGION:", value: "EUROPE WEST" },
  { icon: "stars", label: "BRACKET:", value: "IMMORTAL / LEVEL 10" },
  { icon: "payments", label: "ENTRY:", value: "ALL TIERS" },
];

export const arenaCards: ArenaCard[] = [
  {
    id: "aegis-cup-invitational-2025",
    game: "dota2",
    gameLabel: "DOTA 2",
    accent: "crimson",
    status: { label: "LIVE IN 2H", kind: "live", indicator: "ping" },
    prizeUsd: 25_000,
    prizeEmphasis: "solid",
    format: "5v5 CAPTAINS MODE",
    capacity: { filled: 16, total: 16, unit: "SQUADS" },
    title: "Aegis Cup Invitational 2025",
    description:
      "Premier tier semi-pro showdown. Valve automated lobby dispatching with official DotaTV spectator commentary.",
    teams: { initials: ["N1", "VP", "QC"], extra: 13 },
    perk: { icon: "verified", label: "FREE ENTRY", tone: "cyan" },
    action: { label: "REGISTER SQUAD", icon: "arrow_forward", emphasis: "primary" },
    image: "/images/arena/card-aegis-cup.jpg",
    imageAlt: "A hero silhouetted against glowing red and violet ancient obelisks.",
  },
  {
    id: "cs2-dust2-showdown",
    game: "cs2",
    gameLabel: "CS2",
    accent: "amber",
    status: { label: "REGISTERING", kind: "registering", indicator: "pulse" },
    prizeUsd: 15_000,
    prizeEmphasis: "solid",
    format: "5v5 MR12 COMPETITIVE",
    capacity: { filled: 28, total: 32, unit: "TEAMS" },
    title: "CS2 Dust2 Showdown 5v5",
    description:
      "Single map tournament on Dust 2. Strict VAC Net kernel anti-cheat enforced with automated server demo recording.",
    teams: { initials: ["F1", "M8", "C9"], extra: 25 },
    perk: { icon: "shield", label: "ANTI-CHEAT ON", tone: "secondary" },
    action: { label: "INSTANT QUEUE", icon: "bolt", emphasis: "secondary" },
    image: "/images/arena/card-dust2.jpg",
    imageAlt: "Sun flare over sandstone arches on Dust 2 with tactical dust clouds.",
  },
  {
    id: "mirage-aim-challenge",
    game: "cs2",
    gameLabel: "CS2 FAST CUP",
    accent: "indigo",
    status: { label: "STARTS IN 45M", kind: "neutral" },
    prizeUsd: 5_000,
    prizeEmphasis: "subtle",
    format: "1V1 AIM LADDER",
    capacity: { filled: 118, total: 128, unit: "PLAYERS" },
    title: "Mirage 1v1 Aim Challenge",
    description:
      "Rapid elimination bracket. AK-47 & Deagle aim duels only. Instant automated Steam wallet payouts upon bracket victory.",
    teams: { initials: ["S1", "N0", "R7"], extra: 115 },
    perk: { icon: "flash_on", label: "INSTANT PAY", tone: "amber" },
    action: { label: "ENTER DUEL (500 PTS)", icon: "swords", emphasis: "secondary" },
    image: "/images/arena/card-mirage-aim.jpg",
    imageAlt: "A first-person aim duel on Mirage with cyan and violet arena highlights.",
  },
  {
    id: "mid-only-sf-invoker",
    game: "dota2",
    gameLabel: "DOTA 2",
    accent: "crimson",
    status: { label: "STARTING TODAY", kind: "today" },
    prizeUsd: 3_500,
    prizeEmphasis: "subtle",
    format: "1V1 MID ONLY",
    capacity: { filled: 60, total: 64, unit: "PLAYERS" },
    title: "Mid Only: Shadow Fiend / Invoker",
    description:
      "Classic mirror match. First blood or first 2 towers destroyed. No runes, no bottle-crowing. Skill only.",
    teams: { initials: ["D1", "M9", "T3"], extra: 57 },
    perk: { icon: "workspace_premium", label: "AEGIS POINTS", tone: "secondary" },
    action: { label: "CLAIM SPOT (4 LEFT)", icon: "login", emphasis: "secondary" },
    image: "/images/arena/card-mid-only.jpg",
    imageAlt: "The Dota 2 mid lane river with Shadow Fiend's souls against Invoker's arcane orbs.",
  },
];
