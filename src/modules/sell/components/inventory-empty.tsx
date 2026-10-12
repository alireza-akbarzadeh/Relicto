import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import type { SteamSync } from "../types";

/** What the inventory rail says when there's nothing in it to list — and why. */
export function InventoryEmpty({ steam }: { steam: SteamSync }) {
  const notLinked = !steam.linked;
  const privateInventory = steam.status === "private";

  if (notLinked) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-subtle bg-surface-container-lowest px-space-md py-space-lg text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-tertiary/30 bg-tertiary/10 text-tertiary">
          <Icon name="sports_esports" className="text-[26px]" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-headline-sm text-sm font-semibold text-text-primary">
            No Steam Account Linked Yet
          </span>
          <span className="max-w-sm font-body-sm text-xs text-text-secondary">
            Connect your Steam account via Valve OpenID to import and liquidate your CS2, Dota 2, and TF2 inventory with zero bot lock latency.
          </span>
        </div>
        <LinkButton
          href="/api/auth/steam/sign-in?callbackURL=/sell"
          className="mt-1 h-auto gap-2 rounded-lg border-0 bg-primary px-4 py-2.5 font-headline-sm text-xs font-bold tracking-wider text-on-primary uppercase shadow-md hover:bg-primary/90"
        >
          <Icon name="vpn_key" className="text-[16px]" />
          <span>Connect Steam via OpenID</span>
        </LinkButton>
      </div>
    );
  }

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
