import { parseAsStringLiteral } from "nuqs/server";
import { RULE_FILTERS, type AlertRule, type RuleFilter, type Tone } from "../mobile.types";

/** Trigger list filter (`?kind=`). */
export const ruleFilterParam = parseAsStringLiteral(RULE_FILTERS).withDefault("all");

export const FILTER_LABEL: Record<RuleFilter, string> = { all: "All Triggers", snipe: "Snipe", arb: "Arb Polling" };

export const TONE_TEXT: Record<Tone, string> = {
  crimson: "text-primary-container",
  rose: "text-primary-fixed",
  amber: "text-tertiary",
  cyan: "text-status-upcoming",
  indigo: "text-secondary",
  emerald: "text-emerald-400",
  plain: "text-text-primary",
  muted: "text-text-secondary",
  lilac: "text-on-secondary-container",
};

export const TONE_STROKE: Partial<Record<Tone, string>> = {
  crimson: "text-primary-container",
  cyan: "text-status-upcoming",
  emerald: "text-emerald-400",
};

export function matchesFilter(rule: AlertRule, filter: RuleFilter) {
  return filter === "all" || rule.kind === filter;
}

export function countFor(rules: AlertRule[], filter: RuleFilter) {
  return rules.filter((rule) => matchesFilter(rule, filter)).length;
}
