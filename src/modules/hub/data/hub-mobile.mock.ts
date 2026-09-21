import type { HubMobileData } from "../mobile.types";

const img = (n: number) => `/images/lootora/hub-mobile-0${n}.jpg`;

/** Mobile hub payload. The PGL match is the one drawn in the Stitch screen. */
export const hubMobile: HubMobileData = {
  events: [
    { id: "pgl", label: "PGL COPENHAGEN", icon: "sports_esports" },
    { id: "ti", label: "TI 2025 QUALIFIERS", icon: "military_tech" },
    { id: "esl", label: "ESL PRO LEAGUE", icon: "bolt" },
  ],
  matches: [
    {
      event: "pgl", badge: "DOTA 2 • BO3", clock: "MAP 3 • 42:19", viewers: "482K WATCHING", score: [1, 1], stage: "DECIDER",
      teams: [
        { name: "SPIRIT", fullName: "TEAM SPIRIT", icon: "shield", odds: "1.82x", side: "Radiant • Net +4.2k" },
        { name: "GLADIATORS", fullName: "GAIMIN GLAD.", icon: "swords", odds: "2.04x", side: "Dire • 14 Kills" },
      ],
      winPct: 58, shortNames: ["Spirit", "GG"], reward: "Reward Pool: Arcana Phantom Advent & 2,400 Relicto Tokens",
    },
    {
      event: "ti", badge: "DOTA 2 • BO3", clock: "MAP 1 • 18:04", viewers: "211K WATCHING", score: [0, 0], stage: "OPENER",
      teams: [
        { name: "TUNDRA", fullName: "TUNDRA ESPORTS", icon: "shield", odds: "1.64x", side: "Radiant • Net +1.1k" },
        { name: "BETBOOM", fullName: "BETBOOM TEAM", icon: "swords", odds: "2.31x", side: "Dire • 6 Kills" },
      ],
      winPct: 61, shortNames: ["Tundra", "BB"], reward: "Reward Pool: Immortal Treasure III & 1,200 Relicto Tokens",
    },
    {
      event: "esl", badge: "CS2 • BO3", clock: "MAP 2 • R14", viewers: "356K WATCHING", score: [1, 0], stage: "MATCH POINT",
      teams: [
        { name: "VITALITY", fullName: "TEAM VITALITY", icon: "shield", odds: "1.48x", side: "CT • 9 Rounds" },
        { name: "MOUZ", fullName: "MOUZ", icon: "swords", odds: "2.62x", side: "T • 5 Rounds" },
      ],
      winPct: 67, shortNames: ["Vitality", "MOUZ"], reward: "Reward Pool: Karambit | Fade & 1,800 Relicto Tokens",
    },
  ],
  battles: {
    live: "4 LIVE NOW",
    cards: [
      {
        id: "falcons-liquid", badge: "CS2 • BO3", badgeTone: "cyan", status: "LIVE • OT 17-16", live: true,
        teams: [
          { name: "FALCONS", odds: "1.65", score: "1" },
          { name: "LIQUID", odds: "2.30", score: "0" },
        ],
        action: { kind: "vote", label: "Quick Vote (150 pts)" },
      },
      {
        id: "vitality-navi", badge: "CS2 • GRAND FINAL", badgeTone: "amber", status: "IN 35 MIN", live: false,
        teams: [
          { name: "VITALITY", odds: "1.90", score: "-" },
          { name: "NAVI", odds: "1.90", score: "-" },
        ],
        action: { kind: "alert", label: "Drop Alert Setup" },
      },
    ],
  },
  surge: {
    patch: "PATCH 7.37d & CS2",
    items: [
      { slug: "manifold-paradox", tag: "ARCANA", tagTone: "rose", changePct: 14.2, image: img(1), imageAlt: "Manifold Paradox blades", name: "Manifold Paradox", price: "$38.45", note: "PA Meta Surge" },
      { slug: "awp-dragon-lore", tag: "COVERT", tagTone: "amber", changePct: 11.5, image: img(2), imageAlt: "AWP Dragon Lore", name: "AWP Dragon Lore", price: "$5,120", note: "Major Hype" },
    ],
  },
  heroes: [
    {
      id: "bounty-hunter", role: "support", name: "Bounty Hunter", chip: "TIER S", chipTone: "amber", note: "Track & Shuriken facet dominant",
      winRate: "53.4%", winTone: "emerald", sample: "1.2K Pro Matches", image: img(3), icon: "visibility", iconTone: "crimson",
      builds: [
        { name: "Solar Crest", dot: "emerald" },
        { name: "Aghanim's", dot: "cyan" },
        { name: "Phylactery", dot: "amber" },
      ],
      buildsNote: "Cr1t- & Save- Favorite",
    },
    {
      id: "phantom-assassin", role: "core", name: "Phantom Assassin", chip: "CARRY", chipTone: "crimson", note: "Methodical facet pick-rate +38%",
      winRate: "52.1%", winTone: "emerald", sample: "Yatoro 74% WR", icon: "visibility", iconTone: "crimson",
      builds: [
        { name: "Battle Fury", dot: "emerald" },
        { name: "Desolator", dot: "cyan" },
        { name: "BKB", dot: "amber" },
      ],
      buildsNote: "Yatoro & Nightfall Favorite",
    },
    {
      id: "invoker", role: "core", name: "Invoker", chip: "MID", chipTone: "muted", note: "Quas-Wex counter-meta vs Spirit",
      winRate: "50.8%", winTone: "plain", sample: "Topson Spammed", icon: "auto_fix_high", iconTone: "indigo",
      builds: [
        { name: "Hand of Midas", dot: "amber" },
        { name: "Blink", dot: "cyan" },
        { name: "Octarine", dot: "emerald" },
      ],
      buildsNote: "Topson & Quinn Favorite",
    },
  ],
};
