"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { SearchCriteria } from "../hooks/use-search-results";

/** Catalog grades, grouped the way traders think of them. */
const RARITIES: { value: string; label: string }[] = [
  { value: "arcana", label: "Arcana" },
  { value: "immortal", label: "Immortal" },
  { value: "exalted", label: "Exalted" },
  { value: "persona", label: "Persona" },
  { value: "mythical", label: "Mythical" },
  { value: "ancient", label: "Ancient" },
  { value: "covert", label: "Covert" },
  { value: "melee", label: "★ Knives" },
  { value: "gloves", label: "★ Gloves" },
  { value: "rare", label: "Rare" },
];

const CHIP =
  "h-auto gap-1 rounded border-0 px-2.5 py-1 font-label-badge text-label-badge transition-colors";
const IDLE = "bg-surface-container-lowest hover:bg-surface-container";

type TuningChipsProps = {
  criteria: SearchCriteria;
  onChange: (patch: Partial<SearchCriteria>) => void;
};

/**
 * The palette's narrowing chips. Each maps to a real filter on the search
 * API; the design's sticker and trade-hold chips have no data behind them
 * yet, so they aren't offered.
 */
export function TuningChips({ criteria, onChange }: TuningChipsProps) {
  const rarity = RARITIES.find((option) => option.value === criteria.rarity);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-nowrap select-none [scrollbar-width:none]">
      <div className="flex items-center gap-1 pr-1 font-label-badge text-label-badge text-text-muted uppercase">
        <Icon name="tune" className="text-[14px]" />
        <span>Tuning:</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            CHIP,
            "flex items-center text-text-secondary outline-hidden",
            IDLE,
          )}
        >
          <span>Rarity:</span>
          <span className="font-bold text-primary">
            {rarity?.label ?? "All Tiers"}
          </span>
          <Icon name="expand_more" className="text-[12px]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuRadioGroup
            value={criteria.rarity ?? "all"}
            onValueChange={(next) =>
              onChange({ rarity: next === "all" ? null : next })
            }
          >
            <DropdownMenuRadioItem value="all">All Tiers</DropdownMenuRadioItem>
            {RARITIES.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant={null}
        size={null}
        aria-pressed={criteria.fnOnly}
        onClick={() => onChange({ fnOnly: !criteria.fnOnly })}
        className={cn(
          CHIP,
          criteria.fnOnly
            ? "bg-secondary-container/30 text-on-secondary-container shadow-sm"
            : cn(IDLE, "text-text-secondary"),
        )}
      >
        <span>Float:</span>
        <span className="font-bold">&lt; 0.07 (FN)</span>
        {criteria.fnOnly && <Icon name="close" className="text-[12px]" />}
      </Button>

      <Button
        variant={null}
        size={null}
        aria-pressed={criteria.fiftyPlus}
        onClick={() => onChange({ fiftyPlus: !criteria.fiftyPlus })}
        className={cn(
          CHIP,
          criteria.fiftyPlus
            ? "bg-tertiary-container/30 text-tertiary shadow-sm"
            : cn(IDLE, "text-tertiary"),
        )}
      >
        <span>Price: $50 – $1,000+</span>
        {criteria.fiftyPlus && <Icon name="close" className="text-[12px]" />}
      </Button>
    </div>
  );
}
