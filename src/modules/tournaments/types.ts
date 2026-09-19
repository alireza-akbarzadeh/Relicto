import type { IconName } from "@/components/ui/icon";

export type GameId = "dota2" | "cs2";
export type GameFilter = "all" | GameId;

/** Accent families from the design: crimson (primary), amber (tertiary), indigo (secondary). */
export type Accent = "crimson" | "amber" | "indigo";
/** Semantic tones for text and dots. */
export type Tone =
  | "crimson"
  | "amber"
  | "indigo"
  | "cyan"
  | "live"
  | "primary"
  | "strong"
  | "muted"
  | "secondary";

export type Capacity = { filled: number; total: number; unit: string };
export type TeamRoster = { initials: string[]; extra: number };
export type Action = { label: string; icon: IconName };
export type Brand = { name: string; accent: string; tagline?: string };

export type StatusBadge = {
  label: string;
  kind: "live" | "registering" | "neutral" | "today";
  indicator?: "ping" | "pulse";
};

export type HeroEvent = {
  game: GameId;
  tab: { label: string; icon: IconName };
  status: { label: string; tone: "live" | "upcoming" };
  qualifier: string;
  closesInSeconds: number;
  kicker: { label: string; icon: IconName };
  title: string;
  description: string;
  prizeUsd: number;
  capacity: Capacity;
  teams: TeamRoster;
  primaryAction: Action;
  secondaryAction: Action;
  image: string;
  imageAlt: string;
};

export type PlatformStat = { icon: IconName; value: string; label: string; tone: Tone; pulse?: boolean };

export type ArenaCard = {
  id: string;
  game: GameId;
  gameLabel: string;
  accent: Accent;
  status: StatusBadge;
  prizeUsd: number;
  prizeEmphasis: "solid" | "subtle";
  format: string;
  capacity: Capacity;
  title: string;
  description: string;
  teams: TeamRoster;
  perk: { icon: IconName; label: string; tone: Tone };
  action: Action & { emphasis: "primary" | "secondary" };
  image: string;
  imageAlt: string;
};

export type FilterChip = { icon: IconName; label: string; value: string };

export type Broadcast = {
  quality: string;
  viewers: number;
  home: string;
  away: string;
  score: [number, number];
  badge: string;
  casters: string;
  goldAdvantage: string;
  image: string;
  imageAlt: string;
};

export type FeedTeam = { tag: string; name: string; meta: string; score?: number; scoreTone?: Tone };

export type FeedMatch = {
  id: string;
  label: string;
  labelTone: Tone;
  state: { label: string; tone: Tone; indicator?: "ping" | "dot" };
  teams: [FeedTeam, FeedTeam];
  pending?: boolean;
};

export type InfraFeature = { label: string; tone: Tone };
export type DiagnosticRow = { label: string; value: string; tone: Tone };

export type Infrastructure = {
  kicker: { icon: IconName; label: string };
  title: string;
  description: string;
  features: InfraFeature[];
  diagnostics: {
    title: string;
    status: string;
    rows: DiagnosticRow[];
    action: Action;
  };
};
