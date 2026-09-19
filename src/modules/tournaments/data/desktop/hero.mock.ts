import type { HeroEvent, PlatformStat } from "../../types";

export const heroEvents: HeroEvent[] = [
  {
    game: "dota2",
    tab: { label: "Dota 2 : Road to Aegis", icon: "shield" },
    status: { label: "REGISTRATION OPEN", tone: "live" },
    qualifier: "VALVE VERIFIED TI QUALIFIER #4",
    closesInSeconds: 4 * 3600 + 12 * 60 + 35,
    kicker: { label: "OFFICIAL DPC REGIONAL CHAMPIONSHIP", icon: "military_tech" },
    title: "TI QUALIFIERS: WESTERN EUROPE & SEA",
    description:
      "Captains Mode 5v5 single-elimination open bracket into double-elimination main stage. Winning squad advances straight to The International 2025 Group Stage in Copenhagen.",
    prizeUsd: 1_500_000,
    capacity: { filled: 58, total: 64, unit: "SQUADS" },
    teams: { initials: ["OG", "TS", "TL", "BB"], extra: 54 },
    primaryAction: { label: "REGISTER SQUAD", icon: "person_add" },
    secondaryAction: { label: "LIVE FEED", icon: "live_tv" },
    image: "/images/arena/hero-dota.jpg",
    imageAlt:
      "A glowing red Aegis of Champions floating above an ancient ruined battlefield, crimson light trails clashing with indigo mist.",
  },
  {
    game: "cs2",
    tab: { label: "CS2 : Major Circuit", icon: "swords" },
    status: { label: "MATCHMAKING LIVE", tone: "upcoming" },
    qualifier: "PGL CS2 MAJOR QUALIFIER SEASON 21",
    closesInSeconds: 1 * 3600 + 45 * 60 + 10,
    kicker: { label: "MR12 TACTICAL COMPETITIVE CIRCUIT", icon: "shield_with_heart" },
    title: "CS2 PRO LEAGUE: SEASON 21 SHOWDOWN",
    description:
      "Valve Anti-Cheat verified custom 128-tick tournament nodes. MR12 overtime sudden death mode. Top 4 teams secure invites to the Major Main Event.",
    prizeUsd: 750_000,
    capacity: { filled: 30, total: 32, unit: "TEAMS" },
    teams: { initials: ["FAZE", "NAVI", "G2", "VIT"], extra: 26 },
    primaryAction: { label: "INSTANT QUEUE", icon: "bolt" },
    secondaryAction: { label: "STATISTICS", icon: "equalizer" },
    image: "/images/arena/hero-cs2.jpg",
    imageAlt:
      "A tactical Counter-Strike 2 major visual: defusal kit, smoke trails and amber grid lines under arena spotlights.",
  },
];

export const heroTelemetry = {
  api: { label: "VALVE MATCHMAKING API:", value: "SYNCED" },
  tick: { label: "SERVER TICK:", value: "128 SUB-TICK" },
};

export const platformStats: PlatformStat[] = [
  { icon: "groups", value: "142,580", label: "Active Competitors", tone: "crimson" },
  { icon: "sports_esports", value: "4,820", label: "Matches Finished", tone: "amber" },
  { icon: "monetization_on", value: "$3,240,000+", label: "Distributed Winnings", tone: "cyan" },
  { icon: "radar", value: "128", label: "Live Tournament Lobbies", tone: "live", pulse: true },
];
