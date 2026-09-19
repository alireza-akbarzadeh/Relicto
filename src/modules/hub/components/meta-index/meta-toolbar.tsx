"use client";

import { ChevronDown } from "lucide-react";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { Select } from "@/components/ui/select";
import { META_FILTERS, META_SORTS } from "../../lib/meta-index";
import type { MetaFilter, MetaSort } from "../../types";

type MetaToolbarProps = {
  filter: MetaFilter;
  onFilter: (filter: MetaFilter) => void;
  sort: MetaSort;
  onSort: (sort: MetaSort) => void;
};

const FILTER_TABS = META_FILTERS.map((filter) => ({ value: filter.value, content: filter.label }));

/** Tier segment control and metric sort for the meta index. */
export function MetaToolbar({ filter, onFilter, sort, onSort }: MetaToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SegmentedTabs
        label="Filter by tier"
        value={filter}
        onChange={onFilter}
        tabs={FILTER_TABS}
        listClassName="flex w-auto rounded-md border border-border-dark bg-surface-card p-1"
        tabClassName="flex-none rounded border-0 px-3 py-1 text-[11px] font-normal text-text-muted uppercase transition-colors hover:text-white data-active:bg-surface-container-high data-active:font-bold data-active:text-white group-data-[variant=default]/tabs-list:data-active:shadow-none"
      />
      <Select
        label="Sort by metric"
        value={sort}
        onValueChange={onSort}
        options={META_SORTS}
        triggerClassName="cursor-pointer rounded-md border border-border-dark bg-surface-card px-3 py-1.5 pr-8 text-xs text-white focus-visible:border-primary"
        indicator={<ChevronDown className="pointer-events-none absolute top-2.5 right-2.5 size-3.5 text-text-muted" />}
      />
    </div>
  );
}
