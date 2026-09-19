"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useToggleSet } from "../../hooks/use-toggle-set";
import { TEXT_TONE } from "../../lib/tones";
import type { QuickChip } from "../../mobile.types";

type MobileSearchProps = { placeholder: string; chips: QuickChip[] };

/** Search field with a ⌘K hint and horizontally scrolling quick-filter chips. */
export function MobileSearch({ placeholder, chips }: MobileSearchProps) {
  const active = useToggleSet(chips.filter((c) => c.active).map((c) => c.label));

  return (
    <div className="px-margin py-1">
      <div className="relative flex w-full items-center">
        <Icon name="search" className="absolute left-3 text-[18px] text-text-muted" />
        <input
          type="text"
          enterKeyHint="search"
          aria-label="Search tournaments"
          placeholder={placeholder}
          className="h-11 w-full rounded-lg bg-surface-container-low pr-14 pl-9 font-body-sm text-body-sm text-text-primary shadow-inner transition-colors placeholder:text-text-muted focus:bg-surface-container focus:outline-hidden"
        />
        <kbd className="absolute right-2.5 rounded bg-surface-container-high px-1.5 py-0.5 font-label-badge text-label-badge text-text-muted">
          ⌘K
        </kbd>
      </div>

      <div className="no-scrollbar mt-2.5 flex items-center gap-2 overflow-x-auto py-0.5">
        {chips.map((chip) => {
          const isActive = active.has(chip.label);
          return (
            <button
              key={chip.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => active.toggle(chip.label)}
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-label-badge text-label-badge tracking-wider uppercase",
                isActive
                  ? "bg-surface-container-high text-text-primary"
                  : "bg-surface-container-low text-text-secondary hover:text-text-primary",
              )}
            >
              <Icon name={chip.icon} className={cn("text-[14px]", TEXT_TONE[chip.tone])} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
