"use client";

import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { useMobileMarket } from "../../state/mobile-market-provider";
import { MarketFilterSheet } from "./market-filter-sheet";

/** Live search (writes `q` as you type) plus the filter-matrix sheet. */
export function MarketSearchBar({ placeholder }: { placeholder: string }) {
  const { criteria, set } = useMobileMarket();

  return (
    <section className="flex w-full items-center gap-space-sm">
      <div role="search" className="relative flex flex-1 items-center">
        <Icon name="search" className="pointer-events-none absolute left-3 text-[20px] text-text-secondary" />
        <Input
          value={criteria.q}
          onChange={(event) => set({ q: event.target.value })}
          type="text"
          enterKeyHint="search"
          aria-label="Search the marketplace"
          placeholder={placeholder}
          className="h-11 rounded-xl border-0 bg-surface-container-low pr-9 pl-10 font-body-sm text-body-sm text-on-surface shadow-inner transition-all duration-200 placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-border-focus md:text-body-sm dark:bg-surface-container-low"
        />
        <NoticeButton
          aria-label="Voice scan"
          notice={{ title: "Voice scan", description: "Say an item name to search. Microphone search ships with the mobile app." }}
          className="absolute right-2.5 h-6 w-6 rounded border-0 text-text-muted transition-colors hover:text-primary"
        >
          <Icon name="mic" className="text-[18px]" />
        </NoticeButton>
      </div>
      <MarketFilterSheet />
    </section>
  );
}
