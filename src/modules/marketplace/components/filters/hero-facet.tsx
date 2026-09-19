"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { HEROES } from "../../data/facets.mock";
import { toggle } from "../../lib/filters";
import { useMarketplace } from "../../state/marketplace-provider";

const VISIBLE = 6;

/** Dota 2 hero chips with a type-to-filter box. */
export function HeroFacet() {
  const { filters, patch } = useMarketplace();
  const [search, setSearch] = useState("");

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? HEROES.filter((h) => h.toLowerCase().includes(q)) : HEROES.slice(0, VISIBLE);
  }, [search]);

  return (
    <div className="mb-space-md">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-label-badge text-label-badge text-text-muted uppercase">Dota 2 Hero</span>
        <span className="font-label-badge text-label-badge text-tertiary">124 Heroes</span>
      </div>
      <div className="relative mb-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          aria-label="Filter heroes"
          placeholder="Filter hero..."
          className="w-full rounded bg-surface-container-lowest px-2.5 py-1.5 font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:outline-hidden"
        />
        <Icon name="filter_list" className="absolute top-2 right-2 text-[16px] text-text-muted" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {shown.map((hero) => {
          const active = filters.heroes.includes(hero);
          return (
            <button
              key={hero}
              type="button"
              aria-pressed={active}
              onClick={() => patch({ heroes: toggle(filters.heroes, hero) })}
              className={cn(
                "rounded px-2 py-1 font-label-badge text-label-badge",
                active
                  ? "bg-primary-container font-bold text-on-primary-container"
                  : "bg-surface-container-low text-text-secondary hover:text-text-primary",
              )}
            >
              {hero}
            </button>
          );
        })}
        {shown.length === 0 && <span className="font-body-sm text-[12px] text-text-muted">No hero matches “{search}”.</span>}
      </div>
    </div>
  );
}
