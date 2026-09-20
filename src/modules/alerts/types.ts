import type { IconName } from "@/components/ui/icon";

export type AlertStatus = "armed" | "triggered" | "paused";
export type PriceAlert = { id: string; icon: IconName; item: string; detail: string; target: string; current: string; direction: "below" | "above"; status: AlertStatus; updated: string };
