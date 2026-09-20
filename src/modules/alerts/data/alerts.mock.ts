import type { PriceAlert } from "../types";

export const alerts: PriceAlert[] = [
  { id: "a1", icon: "diamond", item: "★ Butterfly Knife | Doppler", detail: "Phase 4 · Factory New", target: "$3,000.00", current: "$3,150.00", direction: "below", status: "armed", updated: "2m ago" },
  { id: "a2", icon: "swords", item: "Manifold Paradox", detail: "Exalted · Style 3", target: "$110.00", current: "$118.50", direction: "below", status: "triggered", updated: "14m ago" },
  { id: "a3", icon: "bolt", item: "AWP | Dragon Lore", detail: "Factory New · 0.014 Float", target: "$5,400.00", current: "$5,200.00", direction: "above", status: "paused", updated: "1h ago" },
];
