"use client";

import { Icon } from "@/components/ui/icon";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import { CATALOG_META, SORT_OPTIONS } from "../../data/facets.mock";
import { useMarketplace } from "../../state/marketplace-provider";
import type { ViewMode } from "../../types";
import { CriteriaChips } from "./criteria-chips";

const VIEWS: { value: ViewMode; icon: "grid_view" | "view_list"; title: string }[] = [
  { value: "grid", icon: "grid_view", title: "Grid View" },
  { value: "list", icon: "view_list", title: "Compact Table View" },
];

export function ResultsToolbar() {
  const { filters, results, patch } = useMarketplace();

  return (
    <div className="mb-space-md flex w-full flex-col gap-space-sm rounded-xl bg-surface-card p-space-md shadow-xs">
      <div className="flex flex-col justify-between gap-space-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-headline-md text-headline-md tracking-tight text-text-primary uppercase">Active Marketplace Listings</h3>
            <span className="rounded bg-surface-container px-2 py-0.5 font-label-badge text-label-badge font-bold text-tertiary">
              {formatCount(results.total)} Items
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-text-muted">{CATALOG_META.telemetry}</p>
        </div>
        <div className="flex items-center gap-space-sm">
          <div role="radiogroup" aria-label="Layout" className="flex items-center rounded bg-surface-container-lowest p-1">
            {VIEWS.map((view) => (
              <button
                key={view.value}
                type="button"
                role="radio"
                aria-checked={filters.view === view.value}
                title={view.title}
                onClick={() => patch({ view: view.value, page: filters.page })}
                className={cn(
                  "rounded p-1.5 transition-colors",
                  filters.view === view.value ? "bg-surface-container text-text-primary hover:text-primary" : "text-text-muted hover:text-text-primary",
                )}
              >
                <Icon name={view.icon} className="text-[18px]" />
              </button>
            ))}
          </div>
          <Select
            label="Sort listings"
            value={filters.sort}
            onValueChange={(sort) => patch({ sort })}
            options={SORT_OPTIONS}
            triggerClassName="appearance-none bg-surface-container-lowest text-text-primary font-headline-sm text-[13px] px-space-md py-2 pr-8 rounded focus:outline-hidden cursor-pointer"
            iconClassName="absolute right-2 top-2.5 text-[16px] text-text-muted"
          />
        </div>
      </div>
      <CriteriaChips />
    </div>
  );
}
