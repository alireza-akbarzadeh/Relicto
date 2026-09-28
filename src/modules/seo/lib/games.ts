/**
 * How each game is named where people search for it ("CS2", not
 * "Counter-Strike 2"), and the marketplace landing each one gets. Only games
 * listed here get an indexable landing; add one when its catalog is stocked.
 */
export const GAME_SEO = {
  cs2: {
    label: "CS2",
    title: "CS2 Skins Marketplace — Buy & Sell CS2 Skins",
    description:
      "Browse live CS2 skin listings: knives, gloves and rifles with wear, float and StatTrak filters. Compare prices and buy with escrow protection.",
  },
  dota2: {
    label: "Dota 2",
    title: "Dota 2 Items Marketplace — Buy & Sell Dota 2 Cosmetics",
    description:
      "Browse live Dota 2 item listings: arcanas, immortals and hero sets filtered by hero, rarity and slot. Compare prices and buy with escrow protection.",
  },
} as const;

export type SeoGameId = keyof typeof GAME_SEO;

export const isSeoGame = (id: string): id is SeoGameId => id in GAME_SEO;

/** "cs2" → "CS2"; unknown ids fall back to the catalog's own name. */
export const gameLabel = (id: string, fallback: string) => (isSeoGame(id) ? GAME_SEO[id].label : fallback);

/** The marketplace landing for a game — the breadcrumb and footer target until game hubs ship. */
export const gameMarketPath = (id: string) => `/marketplace?game=${id}`;
