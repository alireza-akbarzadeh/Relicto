"use client";

import * as React from "react";
import { Search, X, RotateCcw, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";
import { toast } from "sonner";
import type { DashboardDispute } from "../types";

export interface DisputesFilterState {
  search: string;
  status: "all" | "open" | "under_review" | "resolved_buyer" | "resolved_seller";
  sortBy: "amount_desc" | "newest";
}

const STATUS_OPTIONS: readonly SelectOption<DisputesFilterState["status"]>[] = [
  { value: "all", label: "All Disputes" },
  { value: "open", label: "Open Cases" },
  { value: "under_review", label: "Under Review" },
  { value: "resolved_buyer", label: "Resolved (Buyer Refund)" },
  { value: "resolved_seller", label: "Resolved (Seller Payout)" },
];

const SORT_OPTIONS: readonly SelectOption<DisputesFilterState["sortBy"]>[] = [
  { value: "newest", label: "Newest First" },
  { value: "amount_desc", label: "Amount: High → Low" },
];

interface DisputesFilterBarProps {
  filters: DisputesFilterState;
  onFilterChange: <K extends keyof DisputesFilterState>(key: K, value: DisputesFilterState[K]) => void;
  onReset: () => void;
  filteredCount: number;
  filteredDisputes: DashboardDispute[];
}

export function DisputesFilterBar({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
  filteredDisputes,
}: DisputesFilterBarProps) {
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.sortBy !== "newest";

  const handleExportCsv = () => {
    const headers = ["ID", "OrderCode", "Item", "Buyer", "Seller", "AmountUSD", "Status", "OpenedAt", "Reason"];
    const rows = filteredDisputes.map((d) => [
      d.id, d.orderCode, `"${d.itemName.replace(/"/g, '""')}"`, d.buyerName, d.sellerName,
      (d.amountCents / 100).toFixed(2), d.status, d.openedAt, `"${d.reason.replace(/"/g, '""')}"`
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `relicto_disputes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success(`Exported ${filteredDisputes.length} dispute cases`);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <Input
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search order code, item, or trader..."
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
            disabled={filteredDisputes.length === 0}
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

      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border-subtle/50 text-xs">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Status</label>
          <Select
            label="Dispute Status"
            value={filters.status}
            onValueChange={(val) => onFilterChange("status", val)}
            options={STATUS_OPTIONS}
            triggerClassName="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary flex items-center justify-between cursor-pointer w-full"
            iconClassName="size-3.5 text-text-muted ml-1"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Sort By</label>
          <Select
            label="Dispute Sort"
            value={filters.sortBy}
            onValueChange={(val) => onFilterChange("sortBy", val)}
            options={SORT_OPTIONS}
            triggerClassName="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary flex items-center justify-between cursor-pointer w-full"
            iconClassName="size-3.5 text-text-muted ml-1"
          />
        </div>
      </div>
    </div>
  );
}
