"use client";

import * as React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface CatalogFilterState {
  search: string;
  game: string;
  rarity: string;
  sortBy: "name_asc" | "name_desc" | "listings_desc" | "floor_desc";
}

interface CatalogFilterBarProps {
  filters: CatalogFilterState;
  onFilterChange: <K extends keyof CatalogFilterState>(key: K, value: CatalogFilterState[K]) => void;
  onReset: () => void;
  filteredCount: number;
}

export function CatalogFilterBar({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
}: CatalogFilterBarProps) {
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.game !== "all" ||
    filters.rarity !== "all" ||
    filters.sortBy !== "name_asc";

  return (
    <div className="flex flex-col gap-2.5 pt-1">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-text-muted" />
          <Input
            placeholder="Search catalog by weapon name, slug, or collection..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-8 pr-8 h-8 text-xs bg-surface-container border-border-subtle"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              size="xs"
              variant="ghost"
              onClick={onReset}
              className="h-8 gap-1 font-mono text-[11px] text-text-muted hover:text-text-primary"
            >
              <RotateCcw className="size-3" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Game Filters */}
        <div className="flex items-center gap-1 rounded-md bg-surface-container p-0.5 border border-border-subtle">
          {[
            { id: "all", label: "All Games" },
            { id: "cs2", label: "CS2" },
            { id: "dota2", label: "Dota 2" },
            { id: "tf2", label: "TF2" },
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onFilterChange("game", g.id)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                filters.game === g.id
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Rarity filter */}
        <select
          value={filters.rarity}
          onChange={(e) => onFilterChange("rarity", e.target.value)}
          className="h-7 px-2 text-xs font-mono rounded bg-surface-container border border-border-subtle text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Rarities</option>
          <option value="covert">Covert / Immortal</option>
          <option value="classified">Classified / Ancient</option>
          <option value="restricted">Restricted / Mythical</option>
          <option value="mil-spec">Mil-Spec / Rare</option>
          <option value="melee">Knives & Gloves</option>
        </select>

        {/* Sort Order */}
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange("sortBy", e.target.value as CatalogFilterState["sortBy"])}
          className="h-7 px-2 text-xs font-mono rounded bg-surface-container border border-border-subtle text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
          <option value="listings_desc">Most Active Offers</option>
          <option value="floor_desc">Highest Floor Price</option>
        </select>

        <span className="ml-auto font-mono text-[11px] text-text-muted">
          Matching Items: <strong className="text-text-primary">{filteredCount}</strong>
        </span>
      </div>
    </div>
  );
}
