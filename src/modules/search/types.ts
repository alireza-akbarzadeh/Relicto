export type SearchGame = "all" | "dota2" | "cs2" | "tf2";

/** One catalog item with a live copy to buy — the search's main result. */
export type SearchItem = {
  slug: string;
  name: string;
  game: Exclude<SearchGame, "all">;
  image: string;
  imageAlt: string;
  /** Corner chip over the thumbnail: exterior for CS2, grade for Dota 2 ("FN", "ARCANA"). */
  corner: string | null;
  /** Chips beside the name: exterior, hero, rarity. */
  chips: string[];
  /** The cheapest copy — what "Add to Basket" reserves. */
  listingId: string;
  floorUsd: number;
  floatValue: number | null;
  paintSeed: number | null;
  /** Copies on the market; the result order ranks by it. */
  copies: number;
  /** Outside reference price and where it's from, when one is known. */
  reference: { usd: number; venue: "Steam" | "Skinport" } | null;
  /** Relicto floor against the reference: negative means cheaper here. */
  deltaPct: number | null;
};

export type SearchTrader = {
  handle: string;
  initials: string;
  avatar: string | null;
  level: number;
  role: string;
  verified: boolean;
  /** "99.8%" */
  trust: string | null;
  trades: number;
  portfolioUsd: number;
  /** Active listings — what "View listings" opens. */
  listings: number;
};

export type SearchTournament = {
  slug: string;
  name: string;
  status: "upcoming" | "live" | "completed";
  format: string | null;
  prizeUsd: number | null;
  game: Exclude<SearchGame, "all">;
};

export type SearchResults = {
  query: string;
  items: SearchItem[];
  traders: SearchTrader[];
  tournaments: SearchTournament[];
  /** Matching items per game tab, for the pills. */
  counts: Record<SearchGame, number>;
  /** Server time spent answering, shown in the footer. */
  tookMs: number;
};
