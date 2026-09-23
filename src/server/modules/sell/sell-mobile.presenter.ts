import type { inventoryItems } from "@/lib/db/schema";
import type { CashoutRow, SellMobile } from "@/modules/sell/mobile.types";

type InventoryRow = typeof inventoryItems.$inferSelect;

/** An unlisted inventory item, offered for instant cashout at its quoted price. */
function toCashoutRow(row: InventoryRow): CashoutRow {
  return {
    id: row.id,
    name: row.name,
    wear: [row.wearLabel, row.floatLabel].filter(Boolean).join(" • "),
    priceUsd: row.priceCents / 100,
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
    selected: true,
  };
}

/**
 * Vault totals are the profile's cached portfolio (the figures the desktop
 * profile shows); the cashout tray is the same unlisted inventory the desktop
 * studio lists (minus skins committed to a trade-up). The contract itself comes
 * from `tradeUpService`.
 */
export function toSellMobile(
  authored: SellMobile,
  inventory: InventoryRow[],
  vault: { units: number; valueCents: number } | null,
): SellMobile {
  return {
    ...authored,
    vault: vault ? { units: vault.units, valueUsd: vault.valueCents / 100 } : authored.vault,
    cashout: { ...authored.cashout, rows: inventory.map(toCashoutRow) },
  };
}
