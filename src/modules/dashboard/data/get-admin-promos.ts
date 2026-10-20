import "server-only";

import type { DashboardPromoCode } from "../types";

export const SEED_PROMO_CODES: DashboardPromoCode[] = [
  {
    id: "prm_relicto_2026",
    code: "RELICTO2026",
    discountBps: 100, // 1% off escrow fee
    gameId: "all",
    maxUses: 1000,
    usedCount: 342,
    active: true,
    expiresAt: "2026-12-31T23:59:59.000Z",
  },
  {
    id: "prm_cs2_zero_fee",
    code: "CS2ZERO",
    discountBps: 250, // 100% off standard fee
    gameId: "cs2",
    maxUses: 200,
    usedCount: 189,
    active: true,
    expiresAt: "2026-11-15T23:59:59.000Z",
  },
  {
    id: "prm_major_boost",
    code: "MAJORVIP",
    discountBps: 150,
    gameId: "cs2",
    maxUses: 500,
    usedCount: 88,
    active: false,
    expiresAt: "2026-10-30T23:59:59.000Z",
  },
];

const runtimePromos: DashboardPromoCode[] = [...SEED_PROMO_CODES];

export async function getAdminPromos(): Promise<DashboardPromoCode[]> {
  return [...runtimePromos];
}

export function updateRuntimePromo(id: string, updates: Partial<DashboardPromoCode>): boolean {
  const idx = runtimePromos.findIndex((p) => p.id === id);
  if (idx !== -1) {
    runtimePromos[idx] = { ...runtimePromos[idx], ...updates };
    return true;
  }
  return false;
}

export function addRuntimePromo(promo: DashboardPromoCode): void {
  runtimePromos.unshift(promo);
}
