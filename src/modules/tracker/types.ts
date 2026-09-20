import type { IconName } from "@/components/ui/icon";

export type TrackerTone = "primary" | "amber" | "cyan" | "muted";
export type TrackerAsset = { id: string; name: string; detail: string; image: string; price: string; change: string; tone: TrackerTone; icon: IconName };
export type SpreadRow = { id: string; asset: string; detail: string; floor: string; steam: string; secondary: string; spread: string; yield: string; tone: TrackerTone };
export type OrderLevel = { price: string; source: string; total: string; side: "buy" | "sell" };
export type TrackerData = { assets: TrackerAsset[]; spreads: SpreadRow[]; orderBook: OrderLevel[]; chart: number[] };
