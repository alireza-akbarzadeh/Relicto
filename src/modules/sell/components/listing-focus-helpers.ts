import type { IconName } from "@/components/ui/icon";
import type { InventoryItem } from "../types";

export const MODES = ["Market P2P", "Instant Bot", "24H Auction"] as const;
export type LiquidityMode = (typeof MODES)[number];

export function getWearBadge(item: InventoryItem): string {
  if (item.marker) return item.marker;
  const w = item.wear.toLowerCase();
  if (w.includes("factory new")) return "FN";
  if (w.includes("minimal wear")) return "MW";
  if (w.includes("field-tested")) return "FT";
  if (w.includes("well-worn")) return "WW";
  if (w.includes("battle-scarred")) return "BS";
  return item.wear.slice(0, 3).toUpperCase() || "STD";
}

export function formatToken(id: string): string {
  return `#L00T-${id.replace(/[^a-zA-Z0-9]/g, "").slice(-5).toUpperCase()}`;
}

export function getActionDetails(
  mode: LiquidityMode,
  liquidating: boolean,
  pending: boolean,
  proceeds: number,
  numPrice: number,
): { icon: IconName; label: string; notice: string } {
  if (mode === "Instant Bot") {
    return {
      icon: "bolt",
      label: liquidating ? "Liquidating to Vault..." : `Instant Liquidate to Vault ($${proceeds.toFixed(2)})`,
      notice: "Instant Automated Steam Bot Settlement",
    };
  }
  if (mode === "24H Auction") {
    return {
      icon: "timer",
      label: pending ? "Launching Auction..." : `Launch 24H Auction ($${numPrice.toFixed(2)})`,
      notice: "Encrypted Steam P2P Escrow Bot Verification System",
    };
  }
  return {
    icon: "lock",
    label: pending ? "Listing on Relicto..." : `List Item on Relicto ($${numPrice.toFixed(2)})`,
    notice: "Encrypted Steam P2P Escrow Bot Verification System",
  };
}

