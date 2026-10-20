"use client";

import * as React from "react";
import Image from "next/image";
import { Package, Plus, Edit2, ShieldAlert } from "lucide-react";
import { useQueryStates } from "nuqs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DashboardCatalogItem } from "../types";
import { CatalogFilterBar, type CatalogFilterState } from "./catalog-filter-bar";
import { CatalogItemSheet } from "./catalog-item-sheet";
import { GridPagination } from "./grid-pagination";
import { catalogSearchParams } from "../lib/search-params";

export function DashboardCatalog({ catalog }: { catalog: DashboardCatalogItem[] }) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<DashboardCatalogItem | null>(null);

  const [query, setQuery] = useQueryStates(catalogSearchParams, {
    history: "replace",
    shallow: true,
    clearOnDefault: true,
  });

  const filters: CatalogFilterState = React.useMemo(() => ({
    search: query.cq,
    game: query.cgame,
    rarity: query.crarity,
    sortBy: query.csort as CatalogFilterState["sortBy"],
  }), [query]);

  const handleFilterChange = <K extends keyof CatalogFilterState>(key: K, value: CatalogFilterState[K]) => {
    const keyMap = { search: "cq", game: "cgame", rarity: "crarity", sortBy: "csort" } as const;
    void setQuery({ [keyMap[key]]: value, cpage: 1 });
  };

  const handleReset = () => void setQuery({ cq: "", cgame: "all", crarity: "all", csort: "name_asc", cpage: 1 });

  const filteredAndSorted = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const result = catalog.filter((item) => {
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q) || (item.collection && item.collection.toLowerCase().includes(q));
      const matchGame = filters.game === "all" || item.gameId.toLowerCase() === filters.game.toLowerCase();
      const matchRarity = filters.rarity === "all" || (item.rarity && item.rarity.toLowerCase() === filters.rarity.toLowerCase());
      return matchSearch && matchGame && matchRarity;
    });

    return result.sort((a, b) => {
      if (filters.sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (filters.sortBy === "name_desc") return b.name.localeCompare(a.name);
      if (filters.sortBy === "listings_desc") return b.activeListingsCount - a.activeListingsCount;
      if (filters.sortBy === "floor_desc") return (b.floorPriceCents ?? 0) - (a.floorPriceCents ?? 0);
      return 0;
    });
  }, [catalog, filters]);

  const paginatedItems = React.useMemo(() => {
    const start = (query.cpage - 1) * query.cpageSize;
    return filteredAndSorted.slice(start, start + query.cpageSize);
  }, [filteredAndSorted, query.cpage, query.cpageSize]);

  const formatUsd = (cents: number | null | undefined) =>
    cents ? `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—";

  return (
    <Card className="bg-surface-card border-border-subtle">
      <CardHeader className="flex flex-col gap-3 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
              <Package className="size-4 text-primary" />
              Catalog Asset Directory & Game Definitions
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Canonical weapon models, rarity tiers, CS2 collections, float ranges, and market floor monitoring
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setSelectedItem(null);
              setSheetOpen(true);
            }}
            className="gap-1.5 text-xs font-semibold shrink-0"
          >
            <Plus className="size-3.5" />
            Add Weapon Asset
          </Button>
        </div>

        <CatalogFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          filteredCount={filteredAndSorted.length}
        />
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {filteredAndSorted.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted font-mono border border-dashed border-border-subtle rounded-lg">
            <ShieldAlert className="size-6 text-text-muted mx-auto mb-2 opacity-50" />
            No catalog items found matching the current search parameters.
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="pb-3 font-semibold">Asset Name & Collection</th>
                  <th className="pb-3 font-semibold">Game</th>
                  <th className="pb-3 font-semibold">Category / Slot</th>
                  <th className="pb-3 font-semibold">Active Offers</th>
                  <th className="pb-3 font-semibold text-right">Floor Price</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container/40 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.name} width={32} height={32} unoptimized className="size-8 rounded object-cover border border-border-subtle bg-surface-container" />
                        ) : (
                          <div className="size-8 rounded bg-surface-container border border-border-subtle flex items-center justify-center font-bold text-text-muted text-[10px]">
                            {item.name.slice(0, 2)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-semibold text-text-primary leading-tight">{item.name}</span>
                          <span className="text-[10px] text-text-muted font-mono mt-0.5">{item.collection ?? item.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-container border border-border-subtle">{item.gameId}</span>
                    </td>
                    <td className="py-3 font-mono text-text-secondary">{item.slot ?? "Weapon"}</td>
                    <td className="py-3 font-mono text-text-secondary">
                      {item.activeListingsCount > 0 ? (
                        <span className="text-cyan-400 font-semibold">{item.activeListingsCount} listed</span>
                      ) : (
                        <span className="text-text-muted">0 offers</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-mono font-semibold text-amber-400">{formatUsd(item.floorPriceCents)}</td>
                    <td className="py-3 text-right">
                      <Button size="xs" variant="ghost" onClick={() => { setSelectedItem(item); setSheetOpen(true); }} className="gap-1 font-mono text-xs">
                        <Edit2 className="size-3" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <GridPagination
          page={query.cpage}
          pageSize={query.cpageSize}
          totalItems={filteredAndSorted.length}
          onPageChange={(p) => void setQuery({ cpage: p })}
        />
      </CardContent>

      <CatalogItemSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        item={selectedItem}
        onSuccess={() => window.location.reload()}
      />
    </Card>
  );
}
