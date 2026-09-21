import type { IconName } from "@/components/ui/icon";

/** Data contracts of the mobile hub (Stitch: "Lootora Mobile — Esports & Meta Intel Hub"). */

export const HUB_EVENTS = ["pgl", "ti", "esl"] as const;
export type HubEvent = (typeof HUB_EVENTS)[number];

export const META_ROLES = ["support", "core"] as const;
export type MetaRole = (typeof META_ROLES)[number];

export type EventPill = { id: HubEvent; label: string; icon: IconName };

export type ArenaTeam = { name: string; fullName: string; icon: IconName; odds: string; side: string };

export type ArenaMatch = {
  event: HubEvent;
  badge: string;
  clock: string;
  viewers: string;
  score: [number, number];
  stage: string;
  teams: [ArenaTeam, ArenaTeam];
  /** Win probability of the first team, in percent. */
  winPct: number;
  shortNames: [string, string];
  reward: string;
};

export type BattleCard = {
  id: string;
  badge: string;
  badgeTone: "cyan" | "amber";
  status: string;
  live: boolean;
  teams: { name: string; odds: string; score: string }[];
  action: { kind: "vote" | "alert"; label: string };
};

export type SurgeItem = { slug: string; tag: string; tagTone: "rose" | "amber"; changePct: number; image: string; imageAlt: string; name: string; price: string; note: string };

export type MetaHero = {
  id: string;
  role: MetaRole;
  name: string;
  chip: string;
  chipTone: "amber" | "crimson" | "muted";
  note: string;
  winRate: string;
  winTone: "emerald" | "plain";
  sample: string;
  image?: string;
  icon: IconName;
  iconTone: "crimson" | "indigo";
  builds: { name: string; dot: "emerald" | "cyan" | "amber" }[];
  buildsNote: string;
};

export type HubMobileData = {
  events: EventPill[];
  matches: ArenaMatch[];
  battles: { live: string; cards: BattleCard[] };
  surge: { patch: string; items: SurgeItem[] };
  heroes: MetaHero[];
};
