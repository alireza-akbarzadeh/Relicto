"use client";

import * as React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";

export interface CatalogFilterState {
  search: string;
  game: string;
  rarity: string;
  sortBy: "name_asc" | "name_desc" | "listings_desc" | "floor_desc";
}

const RARITY_OPTIONS: readonly SelectOption<string>[] = [
  { value: "all", label: "All Rarities" },
  { value: "covert", label: "Covert / Immortal" },
  { value: "classified", label: "Classified / Ancient" },
  { value: "restricted", label: "Restricted / Mythical" },
  { value: "mil-spec", label: "Mil-Spec / Rare" },
  { value: "melee", label: "Knives & Gloves" },
];

const SORT_OPTIONS: readonly SelectOption<CatalogFilterState["sortBy"]>[] = [
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
  { value: "listings_desc", label: "Most Active Offers" },
  { value: "floor_desc", label: "Highest Floor Price" },
];

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
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => onFilterChange("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary h-auto"
            >
              <X className="size-3.5" />
            </Button>
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
            <Button
              key={g.id}
              type="button"
              variant={null}
              size={null}
              onClick={() => onFilterChange("game", g.id)}
              className={`h-auto px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                filters.game === g.id
                  ? "bg-primary/20 text-primary font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {g.label}
            </Button>
          ))}
        </div>

        {/* Rarity filter */}
        <Select
          label="Catalog Rarity"
          value={filters.rarity}
          onValueChange={(val) => onFilterChange("rarity", val)}
          options={RARITY_OPTIONS}
          triggerClassName="h-7 px-2 text-xs font-mono rounded bg-surface-container border border-border-subtle text-text-secondary flex items-center justify-between cursor-pointer gap-2"
          iconClassName="size-3 text-text-muted"
        />

        {/* Sort Order */}
        <Select
          label="Catalog Sort"
          value={filters.sortBy}
          onValueChange={(val) => onFilterChange("sortBy", val)}
          options={SORT_OPTIONS}
          triggerClassName="h-7 px-2 text-xs font-mono rounded bg-surface-container border border-border-subtle text-text-secondary flex items-center justify-between cursor-pointer gap-2"
          iconClassName="size-3 text-text-muted"
        />

        <span className="ml-auto font-mono text-[11px] text-text-muted">
          Matching Items: <strong className="text-text-primary">{filteredCount}</strong>
        </span>
      </div>
    </div>
  );
}
