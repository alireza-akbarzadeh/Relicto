"use client";

import * as React from "react";
import { Search, X, RotateCcw, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DashboardTransaction } from "../types";

export interface TransactionsFilterState {
  search: string;
  kind: string;
  direction: "all" | "credit" | "debit";
  status: "all" | "settled" | "pending" | "failed";
  sortBy: "newest" | "amount_desc" | "amount_asc";
}

interface TransactionsFilterBarProps {
  filters: TransactionsFilterState;
  onFilterChange: <K extends keyof TransactionsFilterState>(key: K, value: TransactionsFilterState[K]) => void;
  onReset: () => void;
  filteredCount: number;
  filteredTransactions: DashboardTransaction[];
}

export function TransactionsFilterBar({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
  filteredTransactions,
}: TransactionsFilterBarProps) {
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.kind !== "all" ||
    filters.direction !== "all" ||
    filters.status !== "all" ||
    filters.sortBy !== "newest";

  const handleExportCsv = () => {
    const headers = ["ID", "Title", "Venue", "Kind", "Direction", "Status", "AmountUSD", "BalanceAfterUSD", "OccurredAt", "Hash"];
    const rows = filteredTransactions.map((t) => [
      t.id, `"${t.title.replace(/"/g, '""')}"`, t.venue, t.kind, t.direction, t.status,
      (t.amountCents / 100).toFixed(2), (t.balanceAfterCents / 100).toFixed(2),
      t.occurredAt, t.hash ?? ""
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `relicto_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success(`Exported ${filteredTransactions.length} records to CSV`);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <Input
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search title, venue, or transaction hash..."
            className="pl-8 pr-8 h-8 text-xs bg-surface-container border-border-subtle focus-visible:ring-1 focus-visible:ring-primary w-full"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            size="xs"
            variant="outline"
            onClick={handleExportCsv}
            disabled={filteredTransactions.length === 0}
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-border-subtle/50 text-xs">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Type</label>
          <select
            value={filters.kind}
            onChange={(e) => onFilterChange("kind", e.target.value)}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="purchase">Purchase</option>
            <option value="sale">Sale</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="promo">Promo</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Direction</label>
          <select
            value={filters.direction}
            onChange={(e) => onFilterChange("direction", e.target.value as TransactionsFilterState["direction"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none cursor-pointer"
          >
            <option value="all">All Flows</option>
            <option value="credit">Inflow (+) Credit</option>
            <option value="debit">Outflow (-) Debit</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value as TransactionsFilterState["status"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="settled">Settled</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange("sortBy", e.target.value as TransactionsFilterState["sortBy"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="amount_desc">Amount: High → Low</option>
            <option value="amount_asc">Amount: Low → High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
