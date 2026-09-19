import type { Broadcast, FeedMatch } from "../../types";

export const broadcast: Broadcast = {
  quality: "1080P 60FPS",
  viewers: 48_200,
  home: "TEAM LIQUID",
  away: "TEAM SPIRIT",
  score: [1, 1],
  badge: "GAME 3 DECIDER",
  casters: "ODPixel & Fogged",
  goldAdvantage: "+4.8k Radiant (Liquid)",
  image: "/images/arena/broadcast.jpg",
  imageAlt: "Live broadcast of Team Spirit versus Team Liquid in a Dota 2 grand final base fight.",
};

export const feedMatches: FeedMatch[] = [
  {
    id: "dota-ub-r2",
    label: "DOTA 2 • UPPER BRACKET R2",
    labelTone: "crimson",
    state: { label: "BO3 • MAP 2 (38:14)", tone: "live", indicator: "ping" },
    teams: [
      { tag: "GL", name: "Gaimin Gladiators", meta: "Seed #2", score: 1, scoreTone: "crimson" },
      { tag: "BB", name: "BetBoom Team", meta: "Seed #7", score: 0, scoreTone: "muted" },
    ],
  },
  {
    id: "cs2-swiss-r4",
    label: "CS2 • SWISS ROUND 4",
    labelTone: "amber",
    state: { label: "BO1 • OVERTIME (14-14)", tone: "cyan", indicator: "dot" },
    teams: [
      { tag: "MOUZ", name: "MOUZ NXT", meta: "Nuke (CT)", score: 14, scoreTone: "amber" },
      { tag: "ASTRAL", name: "Astralis Talent", meta: "Nuke (T)", score: 14, scoreTone: "strong" },
    ],
  },
  {
    id: "dota-lb-final",
    label: "DOTA 2 • LOWER BRACKET FINAL",
    labelTone: "indigo",
    state: { label: "STARTS 20:30 UTC", tone: "muted" },
    pending: true,
    teams: [
      { tag: "TUNDRA", name: "Tundra Esports", meta: "Ready in Lobby" },
      { tag: "XG", name: "Xtreme Gaming", meta: "Awaiting Veto" },
    ],
  },
];
