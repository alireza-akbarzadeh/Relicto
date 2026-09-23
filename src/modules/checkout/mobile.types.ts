import type { IconName } from "@/components/ui/icon";

/** Data contracts of the mobile escrow checkout (Stitch: "Lootora Mobile — Multi-Item Escrow Checkout"). */

export const RAILS = ["vault", "crypto", "card"] as const;
export type RailId = (typeof RAILS)[number];

export type MobileRail = { id: RailId; label: string; icon: IconName; tone: "rose" | "indigo" | "muted"; note?: string; feePct: number };

export type CheckoutMobile = {
  /** Relicto escrow vault balance (the header chip shows the Steam wallet). */
  vaultUsd: number;
  /** USD per ETH, for the settlement quote in the dock. */
  ethUsd: number;
  reserveSeconds: number;
  handshake: { status: string; hold: string; passphrase: string };
  rails: MobileRail[];
  dock: { ping: string; hold: string };
};
