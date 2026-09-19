/** Text tones used across the hub; mapped to classes in `lib/tones.ts`. */
export type Tone = "crimson" | "cyan" | "amber" | "indigo" | "white" | "muted";
/** The three signal colours used for dots, deltas and status pills. */
export type SignalTone = Extract<Tone, "crimson" | "cyan" | "amber">;
/** Card accent: tier badge, hover glow and CTA hover. */
export type Accent = Extract<Tone, "crimson" | "indigo" | "amber">;

export type GameId = "dota" | "cs2" | "cross";

export type GameTab = {
  id: GameId;
  title: string;
  caption: string;
  /** Highlights the caption (the live patch). */
  captionTone: Tone;
  /** Shows the pinging live marker. */
  live?: boolean;
};

export type HubPulse = {
  event: string;
  syncedAgo: string;
  liquidityUsd: number;
  volatilityPct: number;
};

export type SpotlightBadge = { label: string; variant: "solid" | "amber" | "cyan" };

export type SpotlightMetric = {
  label: string;
  value: string;
  valueTone: Tone;
  note: string;
  noteTone: Tone;
  /** Medium weight note (the design stresses the first one). */
  strong?: boolean;
};

export type Spotlight = {
  badges: SpotlightBadge[];
  title: { lead: string; highlight: string; tail: string };
  summary: string;
  metrics: SpotlightMetric[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  chart: { title: string; window: string; peak: string; peakLabel: string; series: [string, string]; volume: string };
};

export type MetaFilter = "all" | "carry" | "mid" | "arcana";
export type MetaSort = "spike" | "volume" | "floor";

export type MetaCard = {
  id: string;
  name: string;
  game: "DOTA 2" | "CS2";
  image: string;
  imageAlt: string;
  tier: string;
  accent: Accent;
  signal: { label: string; tone: SignalTone };
  stat: { label: string; tone: Tone };
  detail: string;
  pro: { name: string; tone: Tone };
  floorUsd: number;
  floorTone: Tone;
  cta: { label: string; href: string };
  filters: Exclude<MetaFilter, "all">[];
  /** 7-day meta spike (%), 24h volume — used for sorting. */
  spikePct: number;
  volume24h: number;
};

export type DeltaRow = {
  id: string;
  patch: string;
  change: string;
  asset: string;
  tone: SignalTone;
  preFloorUsd: number;
  floorUsd: number;
  deltaPct: number;
  volume24h: number;
  status: string;
};

export type LoadoutItem = { slot: string; tone: Tone; name: string; priceUsd: number };

export type Loadout = {
  id: string;
  initials: string;
  player: string;
  tag: { label: string; tone: SignalTone };
  role: string;
  appraisalTone: Tone;
  items: LoadoutItem[];
  guarantee: { label: string; tone: Tone };
  cta: { label: string; variant: "buy" | "inspect" };
};

export type Thread = {
  id: string;
  votes: number;
  title: string;
  excerpt: string;
  author: string;
  age: string;
  channel: { label: string; tone: Tone };
};

export type SellerIncentive = { patch: string; endsInSeconds: number };

export type HubData = {
  pulse: HubPulse;
  games: GameTab[];
  spotlights: Record<GameId, Spotlight>;
  metaCards: MetaCard[];
  patchDelta: DeltaRow[];
  /** Pro markets the correlation engine scrapes. */
  scrapedMarkets: number;
  loadouts: Loadout[];
  threads: Thread[];
  newThreads: number;
  incentive: SellerIncentive;
};
