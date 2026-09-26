/**
 * Catalog items → Steam market hash names. CS2 prices by exterior, and the
 * catalog stores a CS2 skin once without its wear, so the feed quotes the wear
 * Relicto actually sells (the cheapest listing's), then falls back through the
 * exteriors. Dota 2 and TF2 names are used as they are.
 */

export const FEED_GAMES = [
  { appId: 730, gameId: "cs2" },
  { appId: 570, gameId: "dota2" },
  { appId: 440, gameId: "tf2" },
] as const;

const EXTERIOR: Record<string, string> = {
  fn: "Factory New",
  mw: "Minimal Wear",
  ft: "Field-Tested",
  ww: "Well-Worn",
  bs: "Battle-Scarred",
};
const ALL_EXTERIORS = ["fn", "mw", "ft", "ww", "bs"];

/** Market names to try for one catalog item, best match first. */
export function marketNames(
  item: { name: string; gameId: string },
  wear: string | null,
): string[] {
  if (item.gameId !== "cs2") return [item.name];
  const wears = wear
    ? [wear, ...ALL_EXTERIORS.filter((w) => w !== wear)]
    : ALL_EXTERIORS;
  // Vanilla knives and most stickers/cases have no exterior at all.
  return [...wears.map((w) => `${item.name} (${EXTERIOR[w]})`), item.name];
}

/** One observation a day per item and venue: re-running the feed the same day refreshes it. */
export const dailyPointId = (venue: string, itemId: string, at: Date) =>
  `pp-${venue}-${itemId}-${at.toISOString().slice(0, 10)}`;

/** A Relicto sale's point, keyed by its order so a replayed delivery can't record it twice. */
export const salePointId = (orderCode: string) =>
  `pp-sale-${orderCode.toLowerCase()}`;
