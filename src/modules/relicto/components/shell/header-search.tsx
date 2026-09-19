"use client";

import { Icon } from "@/components/ui/icon";
import { useCommandSearch } from "../../hooks/use-command-search";

/** Header search fields per family. All support ⌘K and search the marketplace on Enter. */

export function MarketHeaderSearch() {
  const input = useCommandSearch();
  return (
    <div className="mx-space-md hidden max-w-md flex-1 lg:block">
      <div className="relative flex items-center rounded bg-surface-container-lowest px-space-md py-1.5">
        <Icon name="search" className="mr-space-sm text-[18px] text-text-muted" />
        <input
          {...input}
          placeholder="Search skins, weapon tiers, floats or pattern ID..."
          className="w-full bg-transparent font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:outline-hidden"
        />
        <kbd className="ml-space-sm rounded bg-surface-container-high px-1.5 py-0.5 font-label-badge text-label-badge text-text-secondary">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}

export function LedgerHeaderSearch() {
  const input = useCommandSearch();
  return (
    <div className="mx-space-sm hidden max-w-md flex-1 items-center gap-space-md lg:flex">
      <div className="relative flex w-full items-center rounded-lg bg-surface-container-lowest px-space-md py-space-sm">
        <Icon name="search" className="mr-space-sm text-[18px] text-text-muted" />
        <input
          {...input}
          placeholder="Search skins, Doppler phase, float, pattern index..."
          className="w-full bg-transparent font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:outline-hidden"
        />
        <div className="ml-space-sm flex items-center">
          <kbd className="rounded bg-surface-container-high px-space-xs py-0.5 font-data-mono-md text-[11px] leading-none font-bold text-text-muted">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  );
}

export function StudioHeaderSearch() {
  const input = useCommandSearch();
  return (
    <div className="relative hidden max-w-xs flex-1 lg:block">
      <div className="flex items-center bg-surface-container-lowest px-3 py-1.5 focus-within:ring-1 focus-within:ring-secondary">
        <Icon name="search" className="mr-2 text-[18px] text-text-muted" />
        <input
          {...input}
          placeholder="Search skins, cases, collections..."
          className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-text-muted focus:outline-hidden"
        />
        <div className="ml-2 flex shrink-0 items-center gap-1 rounded bg-surface-container-high px-1.5 py-0.5 font-data-mono-md text-label-badge text-text-secondary">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>
    </div>
  );
}
