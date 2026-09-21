import { parseAsStringLiteral } from "nuqs/server";
import { ACTIVITY_FILTERS, type Tone } from "../mobile.types";

/** Mobile ledger filter (`?activity=`); the desktop audit ledger keeps its own `type`. */
export const activitySearchParam = parseAsStringLiteral(ACTIVITY_FILTERS).withDefault("all");

export const ACTIVITY_LABEL = { all: "All", deposits: "Deposits", escrow: "Escrow Payouts", trades: "Trades" } as const;

export const TONE_TEXT: Record<Tone, string> = {
  crimson: "text-primary-container",
  rose: "text-primary",
  amber: "text-tertiary",
  indigo: "text-secondary",
  cyan: "text-status-upcoming",
  plain: "text-text-primary",
  muted: "text-text-muted",
  error: "text-error",
};
