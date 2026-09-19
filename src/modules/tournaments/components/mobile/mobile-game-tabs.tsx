"use client";

import { cn } from "@/lib/cn";
import { useMobileGameFilter } from "../../hooks/selection";
import type { GameFilter } from "../../types";

/** Tab dots carry their own glow, per the design. */
const TAB_DOT: Partial<Record<GameFilter, string>> = {
  dota2: "bg-status-live shadow-[0_0_6px_rgba(239,68,68,0.8)]",
  cs2: "bg-tertiary shadow-[0_0_6px_rgba(245,158,11,0.8)]",
};

type MobileGameTabsProps = { tabs: readonly { value: GameFilter; label: string }[] };

export function MobileGameTabs({ tabs }: MobileGameTabsProps) {
  const { value: active, select } = useMobileGameFilter();

  return (
    <div className="relative w-full overflow-hidden px-margin pt-4 pb-2">
      <div className="pointer-events-none absolute -top-16 left-1/2 h-36 w-80 -translate-x-1/2 rounded-full bg-linear-to-r/srgb from-primary/20 via-tertiary/15 to-secondary/20 blur-3xl" />
      <div
        role="tablist"
        aria-label="Game"
        className="relative flex items-center justify-between rounded-full bg-surface-container-low p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]"
      >
        {tabs.map((tab) => {
          const isActive = tab.value === active;
          const dot = TAB_DOT[tab.value];
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => select(tab.value)}
              className={cn(
                "flex-1 rounded-full py-1.5 font-label-badge text-label-badge tracking-wider uppercase transition-all duration-200",
                dot ? "flex items-center justify-center gap-1.5 px-2.5" : "px-3 text-center",
                isActive
                  ? "bg-surface-container-high text-text-primary"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {dot && <span aria-hidden className={cn("h-2 w-2 rounded-full", dot)} />}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
