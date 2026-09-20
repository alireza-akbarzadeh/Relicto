import { createLoader, parseAsBoolean, parseAsString, parseAsStringLiteral } from "nuqs/server";
import type { ChartMode, ChartRange } from "../types";

export const INSPECT_VALUES = ["spatial", "animations", "sound", "equipped"] as const;
export const CHART_RANGES = ["24H", "7D", "30D", "90D", "1Y", "ALL"] as const satisfies readonly ChartRange[];
export const CHART_MODES = ["LINE", "CANDLE"] as const satisfies readonly ChartMode[];

/**
 * Item page URL contract. Everything a buyer might want to link to — which
 * style and inspect mode is shown, and how the offer book is filtered.
 */
export const itemSearchParams = {
  view: parseAsStringLiteral(INSPECT_VALUES).withDefault("spatial"),
  style: parseAsString.withDefault(""),
  offers: parseAsString.withDefault("ALL"),
  bot: parseAsBoolean.withDefault(true),
  verified: parseAsBoolean.withDefault(true),
  range: parseAsStringLiteral(CHART_RANGES).withDefault("30D"),
  chart: parseAsStringLiteral(CHART_MODES).withDefault("LINE"),
};

export const loadItemSearchParams = createLoader(itemSearchParams);
