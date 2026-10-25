"use client";

import * as React from "react";
import { Search, X, RotateCcw, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DashboardOrder } from "../types";

export interface OrdersFilterState {
  search: string;
  state: "all" | "escrow" | "completed" | "disputed" | "cancelled";
  flow: "all" | "buy" | "sell" | "liquidate";
  sortBy: "newest" | "total_desc" | "total_asc" | "fee_desc";
}

interface OrdersFilterBarProps {
  filters: OrdersFilterState;
  onFilterChange: <K extends keyof OrdersFilterState>(key: K, value: OrdersFilterState[K]) => void;
  onReset: () => void;
  filteredCount: number;
  filteredOrders: DashboardOrder[];
}

export function OrdersFilterBar({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
  filteredOrders,
}: OrdersFilterBarProps) {
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.state !== "all" ||
    filters.flow !== "all" ||
    filters.sortBy !== "newest";

  const handleExportCsv = () => {
    const headers = ["Code", "Item", "Flow", "State", "TotalUSD", "FeeUSD", "Counterparty", "PlacedAt"];
    const rows = filteredOrders.map((o) => [
      o.code, `"${o.itemName.replace(/"/g, '""')}"`, o.flow, o.state,
      (o.totalCents / 100).toFixed(2), (o.feeCents / 100).toFixed(2),
      `"${o.counterpartyName ?? ""}"`, o.placedAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `relicto_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success(`Exported ${filteredOrders.length} orders to CSV`);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <Input
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search code, item, or counterparty..."
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
            onClick={handleExportCsv}
            disabled={filteredOrders.length === 0}
            className="h-8 gap-1 font-mono text-[11px] border-border-subtle bg-surface-container"
          >
            <Download className="size-3" />
            Export ({filteredCount})
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
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">State</label>
          <select
            value={filters.state}
            onChange={(e) => onFilterChange("state", e.target.value as OrdersFilterState["state"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none cursor-pointer"
          >
            <option value="all">All States</option>
            <option value="escrow">Escrow Active</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Flow</label>
          <select
            value={filters.flow}
            onChange={(e) => onFilterChange("flow", e.target.value as OrdersFilterState["flow"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none cursor-pointer"
          >
            <option value="all">All Flows</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
            <option value="liquidate">Liquidate</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange("sortBy", e.target.value as OrdersFilterState["sortBy"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="total_desc">Total: High → Low</option>
            <option value="total_asc">Total: Low → High</option>
            <option value="fee_desc">Fee: High → Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
