import type { Mover, MoverWindow } from "../types";

const BASE: Mover[] = [
  {
    id: "manifold-paradox", badge: { label: "DOTA 2 ARCANA", accent: "pink" }, change: 8.6,
    name: "Manifold Paradox", subtitle: "Phantom Assassin", detail: { label: "Style 3 Molten", accent: "amber" },
    floorUsd: 118.5, note: ["Patch 7.38c Surge", "124 Offers"], glow: "pink", hover: "pink",
  },
  {
    id: "ak47-case-hardened", badge: { label: "CS2 COVERT", accent: "amber" }, change: 14.2,
    name: "AK-47 | Case Hardened", subtitle: "Tier 1 Blue Gem", detail: { label: "#661 Scar", accent: "indigo" },
    floorUsd: 2450, note: ["Rare Pattern", "6 Offers"], glow: "amber", hover: "amber",
  },
  {
    id: "m4a1s-printstream", badge: { label: "CS2 COVERT", accent: "neutral", muted: true }, change: -2.1,
    name: "M4A1-S | Printstream", subtitle: "Factory New", detail: { label: "Pearlescent", accent: "neutral" },
    floorUsd: 412, note: ["High Liquidity", "88 Offers"], glow: "cyan", hover: "pink",
  },
  {
    id: "dragonclaw-hook", badge: { label: "DOTA 2 IMMORTAL", accent: "amber" }, change: 3.4,
    name: "Dragonclaw Hook", subtitle: "Pudge Weapon", detail: { label: "Clean Vintage", accent: "indigo" },
    floorUsd: 164, note: ["Blue Chip", "41 Offers"], glow: "indigo", hover: "pink",
  },
];

/** Price deltas per time window; 24H is the designed default. */
const CHANGES: Record<MoverWindow, number[]> = {
  "1h": [1.2, 3.8, -0.4, 0.6],
  "24h": [8.6, 14.2, -2.1, 3.4],
  "7d": [21.4, 32.7, -6.8, 9.1],
};

export function getMovers(window: MoverWindow): Mover[] {
  return BASE.map((mover, i) => ({ ...mover, change: CHANGES[window][i] }));
}

export const MOVER_WINDOWS: { value: MoverWindow; label: string }[] = [
  { value: "1h", label: "1H" },
  { value: "24h", label: "24H" },
  { value: "7d", label: "7D" },
];
