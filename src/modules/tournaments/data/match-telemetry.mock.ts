export type MatchTelemetryEvent = {
  id: string;
  timestamp: string;
  type: "objective" | "kill" | "clutch" | "economy";
  teamTag?: string;
  headline: string;
  detail: string;
};

export const MATCH_TELEMETRY: Record<string, MatchTelemetryEvent[]> = {
  "dota-grand-final": [
    {
      id: "ev-1",
      timestamp: "38:45",
      type: "objective",
      teamTag: "SPIRIT",
      headline: "Roshan Slain • Aegis Claimed",
      detail: "Yatoro secures Aegis and Cheese after 4-man smoke wrap near pit.",
    },
    {
      id: "ev-2",
      timestamp: "34:10",
      type: "kill",
      teamTag: "LIQUID",
      headline: "Teamfight Victory (3 for 1)",
      detail: "Nisha Ravage catches three heroes on Radiant mid high ground.",
    },
    {
      id: "ev-3",
      timestamp: "27:50",
      type: "objective",
      teamTag: "LIQUID",
      headline: "Tier 3 Tower Breached",
      detail: "Liquid pushes bottom barracks and forces 2 defensive buybacks.",
    },
    {
      id: "ev-4",
      timestamp: "18:20",
      type: "economy",
      teamTag: "LIQUID",
      headline: "+4.8k Radiant Gold Advantage",
      detail: "Net worth lead peaks following successful courier snipe in Dire jungle.",
    },
  ],
  "dota-ub-r2": [
    {
      id: "ev-5",
      timestamp: "38:14",
      type: "objective",
      teamTag: "GL",
      headline: "High Ground Siege in Progress",
      detail: "Gladiators siege Dire Tier 4 towers with active Siege Creeps.",
    },
    {
      id: "ev-6",
      timestamp: "29:30",
      type: "kill",
      teamTag: "GL",
      headline: "Double Kill by Quinn",
      detail: "Invoker Sun Strike & Cataclysm catches BetBoom support rotation.",
    },
  ],
  "cs2-swiss-r4": [
    {
      id: "ev-7",
      timestamp: "Round 28",
      type: "clutch",
      teamTag: "MOUZ",
      headline: "1v2 Clutch Defuse (0.4s Left)",
      detail: "siuhy holds A site rafters and secures overtime with ninja kit.",
    },
    {
      id: "ev-8",
      timestamp: "Round 26",
      type: "kill",
      teamTag: "AST",
      headline: "Triple Entry by device",
      detail: "Opening AWP collateral through smoke into ramp.",
    },
    {
      id: "ev-9",
      timestamp: "Round 24",
      type: "economy",
      headline: "Overtime Reset (14 - 14)",
      detail: "Both squads receive $10,000 maximum overtime starting balance.",
    },
  ],
  "cs2-quarter-navi": [
    {
      id: "ev-10",
      timestamp: "Round 20",
      type: "clutch",
      teamTag: "NV",
      headline: "4K Spraydown by jL",
      detail: "Mirage B Apartments retake defended flawlessly with AK-47.",
    },
    {
      id: "ev-11",
      timestamp: "Round 16",
      type: "objective",
      teamTag: "FZ",
      headline: "Pistol Round Won by FaZe",
      detail: "clean USP-S headshots on A Palace push.",
    },
  ],
};

export function getTelemetryForMatch(matchId: string, game = "dota2"): MatchTelemetryEvent[] {
  if (MATCH_TELEMETRY[matchId]) {
    return MATCH_TELEMETRY[matchId];
  }

  // Generative fallback based on game
  if (game === "cs2" || matchId.includes("cs2")) {
    return [
      {
        id: `ev-cs-${matchId}-1`,
        timestamp: "Live Round",
        type: "clutch",
        headline: "Competitive Tactical Veto Complete",
        detail: "Picks: Mirage, Nuke. Decider: Inferno. Anti-cheat hash verified.",
      },
      {
        id: `ev-cs-${matchId}-2`,
        timestamp: "Pre-Match",
        type: "economy",
        headline: "Lobby Handshake Confirmed",
        detail: "128-tick Stockholm dedicated relay server assigned.",
      },
    ];
  }

  return [
    {
      id: `ev-dota-${matchId}-1`,
      timestamp: "Lobby Sync",
      type: "objective",
      headline: "Captains Mode Draft Initialized",
      detail: "Standard tournament ban phase active on Frankfurt coordinator.",
    },
    {
      id: `ev-dota-${matchId}-2`,
      timestamp: "Pre-Game",
      type: "economy",
      headline: "Neutral Creep Spawn Calibrated",
      detail: "Steam Game Coordinator verified nominal 14ms latency.",
    },
  ];
}
