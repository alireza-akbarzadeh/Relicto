"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { BAND_LABEL, LOW_FLOAT, SORT_LABEL } from "../../lib/mobile-filters";
import { MOBILE_SORTS, PRICE_BANDS } from "../../mobile.types";
import { useMobileMarket } from "../../state/mobile-market-provider";
import { CHIP, ChipMenu } from "./chip-menu";

const VIEWS = [
  { id: "grid", icon: "grid_view", label: "Dense view" },
  { id: "list", icon: "view_agenda", label: "List view" },
] as const;

/** Sort menu, float toggle, price band menu and the grid/list switch. */
export function MarketFilterChips() {
  const { criteria, set, view } = useMobileMarket();

  return (
    <section className="flex items-center justify-between gap-space-xs">
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
        <ChipMenu
          label="Sort listings"
          value={criteria.msort}
          options={MOBILE_SORTS}
          labels={SORT_LABEL}
          onChange={(msort) => set({ msort })}
          className={cn(CHIP, "text-text-primary")}
        >
          <span className="text-tertiary">{SORT_LABEL[criteria.msort]}</span>
          <Icon name="arrow_drop_down" className="text-[14px] text-text-secondary" />
        </ChipMenu>
        <Button
          variant={null}
          size={null}
          aria-pressed={criteria.lowFloat}
          onClick={() => set({ lowFloat: !criteria.lowFloat })}
          className={cn(CHIP, "h-auto border-0 font-semibold", criteria.lowFloat ? "bg-primary/10 text-primary" : "text-text-secondary")}
        >
          <span>Float &lt; {LOW_FLOAT}</span>
          <Icon name="filter_alt" className="text-[13px] text-primary" />
        </Button>
        <ChipMenu
          label="Price band"
          value={criteria.band}
          options={PRICE_BANDS}
          labels={BAND_LABEL}
          onChange={(band) => set({ band })}
          className={cn(CHIP, "text-text-secondary")}
        >
          <span>{BAND_LABEL[criteria.band]}</span>
        </ChipMenu>
      </div>

      <div className="flex shrink-0 items-center gap-1 rounded-lg bg-surface-container-lowest p-0.5">
        {VIEWS.map((option) => (
          <Button
            key={option.id}
            variant={null}
            size={null}
            aria-label={option.label}
            aria-pressed={view === option.id}
            onClick={() => set({ view: option.id })}
            className={cn(
              "h-7 w-7 rounded border-0",
              view === option.id ? "bg-surface-container text-text-primary" : "text-text-secondary",
            )}
          >
            <Icon name={option.icon} className="text-[16px]" />
          </Button>
        ))}
      </div>
    </section>
  );
}
