import { Icon } from "@/components/ui/icon";
import type { SteamSync } from "../types";

/** What the inventory rail says when there's nothing in it to list — and why. */
export function InventoryEmpty({ steam }: { steam: SteamSync }) {
  const privateInventory = steam.status === "private";
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border-subtle bg-surface-container-lowest px-space-md py-space-lg text-center">
      <Icon name={privateInventory ? "lock" : "inventory_2"} className="text-[28px] text-text-muted" />
      <span className="font-headline-sm text-sm font-semibold text-text-primary">
        {privateInventory ? "Your Steam inventory is private" : "Nothing here to list for this game"}
      </span>
      <span className="max-w-sm font-body-sm text-xs text-text-secondary">
        {privateInventory
          ? "Set Inventory to Public in Steam › Edit Profile › Privacy Settings, then press Steam Sync above."
          : "Only marketable CS2, Dota 2 and TF2 items appear. Items already listed live under Active Listings below."}
      </span>
    </div>
  );
}
