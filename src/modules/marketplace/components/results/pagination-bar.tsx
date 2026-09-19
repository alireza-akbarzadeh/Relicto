"use client";

import { Icon } from "@/components/ui/icon";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import { PER_PAGE_OPTIONS } from "../../data/facets.mock";
import { pageWindow } from "../../lib/pagination";
import { useMarketplace } from "../../state/marketplace-provider";
import type { Filters } from "../../types";

const STEP = "flex items-center gap-1 rounded bg-surface-container-lowest px-3 py-1.5 font-label-badge text-label-badge text-text-muted uppercase transition-colors hover:bg-surface-container hover:text-text-primary disabled:pointer-events-none";

export function PaginationBar() {
  const { filters, results, patch } = useMarketplace();
  const goTo = (page: number) => patch({ page });

  return (
    <div className="mb-space-lg flex w-full flex-col items-center justify-between gap-space-md rounded-xl bg-surface-card p-space-md shadow-xs sm:flex-row">
      <div className="flex items-center gap-space-sm">
        <span className="font-body-sm text-body-sm text-text-muted">
          Showing {results.from} - {results.to} of {formatCount(results.total)} items
        </span>
        <span className="text-text-muted">·</span>
        <div className="flex items-center gap-1 rounded bg-surface-container-lowest px-2 py-1">
          <span className="font-label-badge text-label-badge text-text-muted uppercase">Per page:</span>
          <Select
            label="Items per page"
            value={String(filters.perPage) as (typeof PER_PAGE_OPTIONS)[number]["value"]}
            onValueChange={(v) => patch({ perPage: Number(v) as Filters["perPage"] })}
            options={PER_PAGE_OPTIONS}
            triggerClassName="flex items-center gap-0.5 bg-transparent font-data-mono-md text-[12px] text-text-primary focus:outline-hidden cursor-pointer"
            iconClassName="text-[14px]"
          />
        </div>
      </div>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button type="button" onClick={() => goTo(filters.page - 1)} disabled={filters.page <= 1} className={STEP}>
          <Icon name="chevron_left" className="text-[14px]" />
          <span>Prev</span>
        </button>
        {pageWindow(filters.page, results.pages).map((entry, i) =>
          entry === "gap" ? (
            <span key={`gap-${i}`} className="px-2 font-data-mono-md text-text-muted">...</span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => goTo(entry)}
              aria-current={entry === filters.page ? "page" : undefined}
              className={cn(
                "h-8 w-8 rounded font-data-mono-md text-data-mono-md",
                entry === filters.page
                  ? "bg-primary-container font-bold text-on-primary-container"
                  : "bg-surface-container-lowest text-text-secondary transition-colors hover:bg-surface-container hover:text-text-primary",
              )}
            >
              {entry}
            </button>
          ),
        )}
        <button type="button" onClick={() => goTo(filters.page + 1)} disabled={filters.page >= results.pages} className={STEP}>
          <span>Next</span>
          <Icon name="chevron_right" className="text-[14px]" />
        </button>
      </nav>
    </div>
  );
}
