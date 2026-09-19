import type { IconName } from "@/components/ui/icon";
import type { Action, Capacity, GameId, Tone } from "./types";

export type MobileStat = { label: string; value: string; tone: Tone; emphasis?: "strong" };

export type Championship = {
  badge: { icon: IconName; label: string };
  status: string;
  title: string;
  highlight: string;
  description: string;
  stats: MobileStat[];
  primaryAction: Action;
  secondaryAction: Action;
};

export type QuickChip = { icon: IconName; label: string; tone: Tone; active?: boolean };

export type BracketSchedule =
  | { kind: "countdown"; seconds: number }
  | { kind: "date"; label: string };

export type BracketCardData = {
  id: string;
  game: GameId;
  tag: string;
  schedule: BracketSchedule;
  title: string;
  subtitle: { label: string; tone: Tone };
  reward: { label: string; usd: number; points: string };
  slots: { label: string; capacity: Capacity };
  crest: { icon: IconName; tone: Tone }[];
  extraTeams: number;
  action: Action & { emphasis: "primary" | "secondary" };
  image: string;
  imageAlt: string;
};

export type QuickMatchData = {
  id: string;
  game: GameId;
  icon: IconName;
  title: string;
  subtitle: string;
  points: string;
  wait: string;
  action: Action;
};

export type RadarTeam = { tag: string; name: string; meta: string; metaTone: Tone };

export type RadarMatch = {
  id: string;
  label: string;
  labelIcon: IconName;
  labelTone: Tone;
  clock: { label: string; tone: Tone; icon?: IconName; emphasis?: boolean };
  home: RadarTeam;
  away: RadarTeam;
  /** Display strings, e.g. CS2 rounds are zero-padded ("09"). */
  score: [string, string];
  scoreTones: [Tone, Tone];
  separator: string;
  /** Radiant share of the gold lead bar, in percent. */
  goldShare?: number;
};

export type BentoItem = { icon: IconName; tone: Tone; title: string; description: string };

export type ServerStatus = { icon: IconName; title: string; description: string; ping: string };
