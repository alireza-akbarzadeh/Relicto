import { createLoader, parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const SELL_GAMES = ["cs2", "dota2", "tf2"] as const;
export const SELL_FILTERS = ["tradable", "hold"] as const;
export const SELL_SORTS = ["highest", "lowest", "recent"] as const;

/** Sell studio URL contract: inventory game, search, trade filter, sort and picks. */
export const sellSearchParams = {
  game: parseAsStringLiteral(SELL_GAMES).withDefault("cs2"),
  q: parseAsString.withDefault(""),
  filter: parseAsStringLiteral(SELL_FILTERS).withDefault("tradable"),
  sort: parseAsStringLiteral(SELL_SORTS).withDefault("highest"),
  picks: parseAsArrayOf(parseAsString, ",").withDefault(["butterfly"]),
};

export const loadSellSearchParams = createLoader(sellSearchParams);
