"use client";

import * as React from "react";
import { Tag, ShieldAlert, Ban, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DashboardListing } from "../types";
import { ListingsFilterBar, type ListingsFilterState } from "./listings-filter-bar";
import { updateListingStatusAction } from "../actions/admin-listings";

const INITIAL_FILTERS: ListingsFilterState = {
  search: "",
  game: "all",
  status: "all",
  sortBy: "newest",
};

export function DashboardListings({ listings: initialListings }: { listings: DashboardListing[] }) {
  const [listings, setListings] = React.useState(initialListings);
  const [filters, setFilters] = React.useState<ListingsFilterState>(INITIAL_FILTERS);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleFilterChange = <K extends keyof ListingsFilterState>(key: K, value: ListingsFilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => setFilters(INITIAL_FILTERS);

  const filteredAndSorted = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const result = listings.filter((l) => {
      const matchSearch =
        !q ||
        l.itemName.toLowerCase().includes(q) ||
        l.sellerHandle.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q);
      const matchGame = filters.game === "all" || l.gameId.toLowerCase() === filters.game.toLowerCase();
      const matchStatus = filters.status === "all" || l.status === filters.status;
      return matchSearch && matchGame && matchStatus;
    });

    return result.sort((a, b) => {
      if (filters.sortBy === "newest") return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
      if (filters.sortBy === "price_desc") return b.priceCents - a.priceCents;
      if (filters.sortBy === "price_asc") return a.priceCents - b.priceCents;
      return 0;
    });
  }, [listings, filters]);

  const handleToggleStatus = async (listingId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "cancelled" : "active";
    setLoadingId(listingId);
    try {
      const res = await updateListingStatusAction(listingId, nextStatus);
      if (res.success) {
        toast.success(res.message);
        setListings((prev) => prev.map((l) => (l.id === listingId ? { ...l, status: nextStatus } : l)));
      } else {
        toast.error(res.error);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const formatUsd = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <Card className="bg-surface-card border-border-subtle">
      <CardHeader className="flex flex-col gap-3 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
              <Tag className="size-4 text-primary" />
              Market Listings & Catalog Management
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Live peer-to-peer inventory, price floors, wear validation, and moderation overrides
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Showing: <strong className="text-text-primary">{filteredAndSorted.length}</strong> / {listings.length}
          </span>
        </div>

        <ListingsFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          filteredCount={filteredAndSorted.length}
          filteredListings={filteredAndSorted}
        />
      </CardHeader>

      <CardContent>
        {filteredAndSorted.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted font-mono border border-dashed border-border-subtle rounded-lg">
            <ShieldAlert className="size-6 text-text-muted mx-auto mb-2 opacity-50" />
            No market listings match the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="pb-3 font-semibold">Item & Specs</th>
                  <th className="pb-3 font-semibold">Game</th>
                  <th className="pb-3 font-semibold">Seller</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Price</th>
                  <th className="pb-3 font-semibold text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40">
                {filteredAndSorted.map((l) => (
                  <tr key={l.id} className="hover:bg-surface-container/40 transition-colors">
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary flex items-center gap-1.5">
                          {l.itemName}
                          {l.stattrak && (
                            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              StatTrak™
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono mt-0.5">
                          {l.wear && <span className="uppercase">{l.wear}</span>}
                          {l.float && <span>Float: {l.float.toFixed(4)}</span>}
                          {l.paintSeed && <span>Seed: {l.paintSeed}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-[11px] uppercase text-text-muted">{l.gameId}</td>
                    <td className="py-3 font-mono text-[11px] text-text-secondary">@{l.sellerHandle}</td>
                    <td className="py-3">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-full uppercase ${
                          l.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : l.status === "reserved"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse"
                              : l.status === "sold"
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-text-primary">
                      {formatUsd(l.priceCents)}
                      {l.floorCents && (
                        <span className="block text-[10px] font-normal text-text-muted">
                          Floor: {formatUsd(l.floorCents)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        size="xs"
                        variant={l.status === "active" ? "destructive" : "outline"}
                        disabled={loadingId === l.id || l.status === "sold"}
                        onClick={() => handleToggleStatus(l.id, l.status)}
                        className="gap-1 text-[11px] font-mono"
                      >
                        {l.status === "active" ? (
                          <>
                            <Ban className="size-3" /> Delist
                          </>
                        ) : (
                          <>
                            <CheckCircle className="size-3" /> Relist
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
