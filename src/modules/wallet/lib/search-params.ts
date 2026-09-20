import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const LEDGER_TYPES = [
  "All Transactions",
  "Deposits Only",
  "Withdrawals Only",
  "Marketplace Sales",
  "Marketplace Purchases",
] as const;
export const LEDGER_RANGES = ["Last 30 Days", "This Quarter", "Year to Date", "All-Time Archive"] as const;

/** Treasury audit ledger URL contract. */
export const walletSearchParams = {
  q: parseAsString.withDefault(""),
  type: parseAsStringLiteral(LEDGER_TYPES).withDefault("All Transactions"),
  range: parseAsStringLiteral(LEDGER_RANGES).withDefault("Last 30 Days"),
};

export const loadWalletSearchParams = createLoader(walletSearchParams);
