"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { criteriaChips, type CriteriaChip } from "../../lib/filters";
import { useMarketplace } from "../../state/marketplace-provider";

const TONE: Record<CriteriaChip["tone"], string> = {
  plain: "text-text-primary",
  quality: "text-primary font-bold",
  escrow: "text-status-upcoming",
};

/** Removable chips for the primary criteria, plus "Clear All". */
export function CriteriaChips() {
  const { filters, patch } = useMarketplace();
  const chips = criteriaChips(filters);
  if (!chips.length) return null;

  const clearAll = () => patch(Object.assign({}, ...chips.map((c) => c.clear)));

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-space-xs">
      <span className="mr-1 font-label-badge text-label-badge text-text-muted uppercase">Active Criteria:</span>
      {chips.map((chip) => (
        <span
          key={chip.id}
          className={cn("inline-flex items-center gap-1 rounded bg-surface-container-low px-2.5 py-1 font-label-badge text-label-badge", TONE[chip.tone])}
        >
          <span>{chip.label}</span>
          <button
            type="button"
            aria-label={`Remove ${chip.label}`}
            onClick={() => patch(chip.clear)}
            className="ml-0.5 text-text-muted hover:text-primary"
          >
            <Icon name="close" className="text-[12px]" />
          </button>
        </span>
      ))}
      <button type="button" onClick={clearAll} className="ml-2 font-label-badge text-label-badge text-tertiary hover:underline">
        Clear All ({chips.length})
      </button>
    </div>
  );
}
