"use client";

import { Icon } from "@/components/ui/icon";
import { useMarketplace } from "../../state/marketplace-provider";

/** Which economy's facets drive the catalog: Dota 2 (heroes) or CS2 (wear & pattern). */
export function GameContext() {
  const { filters, patch } = useMarketplace();
  const cs2 = filters.ecosystem === "cs2";

  return (
    <div className="mb-space-md">
      <span className="mb-1.5 block font-label-badge text-label-badge text-text-muted uppercase">Game Context Engine</span>
      <div className="flex items-center justify-between rounded bg-surface-container-lowest p-2 text-text-primary">
        <div className="flex items-center gap-2">
          <span className={cs2 ? "h-2.5 w-2.5 rounded-full bg-tertiary" : "h-2.5 w-2.5 rounded-full bg-primary-container"} />
          <span className="font-headline-sm text-[13px] font-bold">{cs2 ? "CS2 Economy" : "Dota 2 Economy"}</span>
        </div>
        <span className="font-label-badge text-label-badge text-text-muted">{cs2 ? "v1.40" : "v7.38c"}</span>
      </div>
      <button
        type="button"
        onClick={() => patch({ ecosystem: cs2 ? "dota2" : "cs2", heroes: [] })}
        className="mt-1.5 flex w-full items-center justify-between px-1 text-left font-label-badge text-label-badge text-text-muted transition-colors hover:text-tertiary"
      >
        <span>{cs2 ? "Switch to Dota 2 Hero & Style Mode" : "Switch to CS2 Wear & Pattern ID Mode"}</span>
        <Icon name="swap_horiz" className="text-[14px]" />
      </button>
    </div>
  );
}
