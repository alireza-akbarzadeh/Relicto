"use client";

import type { KeyboardEvent } from "react";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { GAME_OPTIONS, RANGE_OPTIONS, type GameFilter, type LedgerTab, type RangeFilter } from "../../lib/history-filters";
import type { LedgerData } from "../../types";

const TAB =
  "flex-none rounded border-0 bg-surface-container px-space-md py-1.5 font-label-caps text-label-caps font-semibold text-text-secondary uppercase transition-all hover:bg-surface-container-high hover:text-text-primary data-active:bg-primary-container data-active:font-bold data-active:text-on-primary-container group-data-[variant=default]/tabs-list:data-active:shadow-none";
const SELECT =
  "cursor-pointer appearance-none rounded-lg bg-surface-container-lowest px-space-md py-space-sm pr-8 font-label-caps text-label-caps text-text-primary";

type FilterBarProps = {
  counts: LedgerData["counts"];
  tab: LedgerTab;
  onTab: (tab: LedgerTab) => void;
  game: GameFilter;
  onGame: (game: GameFilter) => void;
  range: RangeFilter;
  onRange: (range: RangeFilter) => void;
  query: string;
  onQuery: (query: string) => void;
};

/** Search, game and range pickers, export, and the status tab row. */
export function FilterBar({ counts, tab, onTab, game, onGame, range, onRange, query, onQuery }: FilterBarProps) {
  const tabs = [
    { value: "all" as const, content: `All Orders (${counts.all})` },
    { value: "purchases" as const, content: `Purchases (${counts.purchases})` },
    { value: "sales" as const, content: `Sales & Liquidations (${counts.sales})` },
    {
      value: "escrow" as const,
      className: "gap-space-xs text-status-upcoming",
      content: (
        <>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-upcoming" />
          <span>Active Escrow ({counts.escrow})</span>
        </>
      ),
    },
    { value: "disputed" as const, className: "text-text-muted", content: `Disputed / Cancelled (${counts.disputed})` },
  ];

  const clearOnEscape = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") onQuery("");
  };

  return (
    <div className="flex flex-col gap-space-md rounded-xl bg-surface-container-low p-space-md shadow-md">
      <div className="flex flex-col items-stretch justify-between gap-space-md lg:flex-row lg:items-center">
        <div className="relative max-w-xl flex-1">
          <div className="relative flex items-center rounded-lg bg-surface-container-lowest px-space-md py-space-sm shadow-inner">
            <Icon name="search" className="mr-space-sm text-[18px] text-text-muted" />
            <Input
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              onKeyDown={clearOnEscape}
              placeholder="Search by Order ID, Item name, Hero, or Counterparty..."
              aria-label="Search transactions"
              className="h-auto rounded-none border-0 bg-transparent p-0 font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus-visible:ring-0 md:text-body-sm"
            />
            <span className="ml-2 rounded bg-surface-container-high px-space-xs py-0.5 font-data-mono-md text-[10px] font-bold text-text-muted">ESC to clear</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm">
          <Select
            label="Filter by game"
            value={game}
            onValueChange={onGame}
            options={GAME_OPTIONS}
            triggerClassName={SELECT}
            iconClassName="absolute right-2 top-2.5 text-[16px] text-text-muted"
          />
          <Select
            label="Filter by date range"
            value={range}
            onValueChange={onRange}
            options={RANGE_OPTIONS}
            triggerClassName={SELECT}
            iconClassName="absolute right-2 top-2.5 text-[16px] text-text-muted"
          />
          <NoticeButton
            notice={{ title: "Export queued", description: "CSV and tax reports download once the orders API is wired." }}
            className="h-auto gap-space-xs rounded-lg border-0 bg-surface-container px-space-md py-space-sm font-label-caps text-label-caps font-bold text-text-primary uppercase shadow-xs transition-colors hover:bg-surface-container-high"
          >
            <Icon name="download" className="text-[18px]" />
            <span>Export CSV</span>
          </NoticeButton>
        </div>
      </div>
      <div className="flex items-center justify-between overflow-x-auto pt-space-xs pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SegmentedTabs
          label="Filter orders by status"
          value={tab}
          onChange={onTab}
          tabs={tabs}
          listClassName="w-auto justify-start gap-space-xs bg-transparent p-0"
          tabClassName={TAB}
        />
        <div className="hidden items-center gap-space-xs font-label-badge text-label-badge text-text-muted md:flex">
          <span>STEAM API V2 COMPLIANT</span>
          <Icon name="verified" className="text-[14px] text-status-upcoming" />
        </div>
      </div>
    </div>
  );
}
