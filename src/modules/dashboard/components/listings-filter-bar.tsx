"use client";

import * as React from "react";
import { Search, X, RotateCcw, Download, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DashboardListing } from "../types";

export interface ListingsFilterState {
  search: string;
  game: string;
  status: "all" | "active" | "reserved" | "sold" | "cancelled";
  sortBy: "price_desc" | "price_asc" | "newest";
}

interface ListingsFilterBarProps {
  filters: ListingsFilterState;
  onFilterChange: <K extends keyof ListingsFilterState>(key: K, value: ListingsFilterState[K]) => void;
  onReset: () => void;
  filteredCount: number;
  filteredListings: DashboardListing[];
}

export function ListingsFilterBar({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
  filteredListings,
}: ListingsFilterBarProps) {
  const [copied, setCopied] = React.useState(false);

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.game !== "all" ||
    filters.status !== "all" ||
    filters.sortBy !== "newest";

  const handleCopyIds = () => {
    navigator.clipboard.writeText(filteredListings.map((l) => l.id).join(", "));
    setCopied(true);
    toast.success(`Copied ${filteredListings.length} listing IDs`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    const headers = ["ID", "ItemName", "Game", "Seller", "PriceUSD", "Status", "Wear", "Float", "ListedAt"];
    const rows = filteredListings.map((l) => [
      l.id, `"${l.itemName.replace(/"/g, '""')}"`, l.gameId, l.sellerHandle,
      (l.priceCents / 100).toFixed(2), l.status, l.wear ?? "", l.float ?? "", l.listedAt
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `relicto_listings_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success(`Exported ${filteredListings.length} listings to CSV`);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <Input
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search item name, seller, or ID..."
            className="pl-8 pr-8 h-8 text-xs bg-surface-container border-border-subtle focus-visible:ring-1 focus-visible:ring-primary w-full"
          />
          {filters.search && (
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => onFilterChange("search", "")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5 cursor-pointer"
            >
              <X className="size-3" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            size="xs"
            variant="outline"
            onClick={handleCopyIds}
            disabled={filteredListings.length === 0}
            className="h-8 gap-1 font-mono text-[11px] border-border-subtle bg-surface-container"
          >
            {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            Copy IDs ({filteredCount})
          </Button>

          <Button
            size="xs"
            variant="outline"
            onClick={handleExportCsv}
            disabled={filteredListings.length === 0}
            className="h-8 gap-1 font-mono text-[11px] border-border-subtle bg-surface-container"
          >
            <Download className="size-3" />
            Export CSV
          </Button>

          {hasActiveFilters && (
            <Button
              size="xs"
              variant="ghost"
              onClick={onReset}
              className="h-8 gap-1 font-mono text-[11px] text-text-muted hover:text-rose-400"
            >
              <RotateCcw className="size-3" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border-subtle/50 text-xs">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Game</label>
          <select
            value={filters.game}
            onChange={(e) => onFilterChange("game", e.target.value)}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none cursor-pointer"
          >
            <option value="all">All Games</option>
            <option value="cs2">Counter-Strike 2</option>
            <option value="dota2">Dota 2</option>
            <option value="rust">Rust</option>
            <option value="tf2">Team Fortress 2</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value as ListingsFilterState["status"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active On Market</option>
            <option value="reserved">Reserved in Cart</option>
            <option value="sold">Sold & Settled</option>
            <option value="cancelled">Delisted / Cancelled</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange("sortBy", e.target.value as ListingsFilterState["sortBy"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="price_asc">Price: Low → High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
