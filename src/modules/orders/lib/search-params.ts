import { createLoader, parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const LEDGER_TABS = ["all", "purchases", "sales", "escrow", "disputed"] as const;
export const LEDGER_GAMES = ["ALL", "CS2", "DOTA 2"] as const;
export const LEDGER_RANGES = ["30d", "90d", "2025", "all"] as const;

/** Trade ledger URL contract: status tab, game, range, search and page. */
export const ledgerSearchParams = {
  tab: parseAsStringLiteral(LEDGER_TABS).withDefault("all"),
  game: parseAsStringLiteral(LEDGER_GAMES).withDefault("ALL"),
  range: parseAsStringLiteral(LEDGER_RANGES).withDefault("30d"),
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

export const loadLedgerSearchParams = createLoader(ledgerSearchParams);
