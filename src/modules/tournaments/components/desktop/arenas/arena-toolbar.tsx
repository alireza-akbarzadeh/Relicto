import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { FilterChip, GameFilter } from "../../../types";

type ArenaToolbarProps = {
  filters: readonly { value: GameFilter; label: string }[];
  active: GameFilter;
  onChange: (filter: GameFilter) => void;
  chips: FilterChip[];
};

/** Circuit segmented control plus region / bracket / entry filter chips. */
export function ArenaToolbar({ filters, active, onChange, chips }: ArenaToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-space-md rounded-lg bg-surface-card p-space-sm shadow-md">
      <div role="tablist" aria-label="Circuit" className="flex items-center gap-1.5 rounded-md bg-surface-container-lowest p-1">
        {filters.map((filter) => {
          const isActive = filter.value === active;
          return (
            <button
              key={filter.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(filter.value)}
              className={cn(
                "rounded px-space-md py-1 font-label-caps text-label-caps uppercase transition-all",
                isActive
                  ? "bg-surface-container-high text-text-primary shadow-xs"
                  : "text-text-muted hover:text-on-surface",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-space-sm">
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            aria-haspopup="listbox"
            className="flex items-center gap-1 rounded bg-surface-container-lowest px-space-md py-1.5 font-label-caps text-label-caps text-text-secondary"
          >
            <Icon name={chip.icon} className="text-[16px] text-text-muted" />
            <span className="text-text-muted">{chip.label}</span>
            <span className="font-bold text-text-primary">{chip.value}</span>
            <Icon name="expand_more" className="text-[16px]" />
          </button>
        ))}
        <button
          type="button"
          aria-label="More filters"
          className="rounded bg-surface-container-lowest p-1.5 text-text-muted transition-colors hover:bg-surface-container-high hover:text-text-primary"
        >
          <Icon name="tune" className="text-[18px]" />
        </button>
      </div>
    </div>
  );
}
