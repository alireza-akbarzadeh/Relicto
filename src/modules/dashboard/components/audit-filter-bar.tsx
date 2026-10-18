"use client";

import * as React from "react";
import { Search, X, RotateCcw, Download, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DashboardAuditLog } from "../types";

export interface AuditFilterState {
  search: string;
  action: string;
  severity: "all" | "info" | "warning" | "critical";
  sortBy: "newest" | "oldest";
}

interface AuditFilterBarProps {
  filters: AuditFilterState;
  onFilterChange: <K extends keyof AuditFilterState>(key: K, value: AuditFilterState[K]) => void;
  onReset: () => void;
  filteredCount: number;
  filteredLogs: DashboardAuditLog[];
}

export function AuditFilterBar({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
  filteredLogs,
}: AuditFilterBarProps) {
  const [copied, setCopied] = React.useState(false);

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.action !== "all" ||
    filters.severity !== "all" ||
    filters.sortBy !== "newest";

  const handleCopyIds = () => {
    navigator.clipboard.writeText(filteredLogs.map((l) => l.id).join(", "));
    setCopied(true);
    toast.success(`Copied ${filteredLogs.length} audit entry IDs`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    const headers = ["ID", "AdminName", "Action", "TargetType", "TargetID", "Severity", "Details", "Timestamp"];
    const rows = filteredLogs.map((l) => [
      l.id, `"${l.adminName.replace(/"/g, '""')}"`, l.action, l.targetType,
      l.targetId ?? "", l.severity, `"${l.details.replace(/"/g, '""')}"`, l.createdAt
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `relicto_audit_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success(`Exported ${filteredLogs.length} audit records to CSV`);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <Input
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search administrator, target ID, or action note..."
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
            onClick={handleCopyIds}
            disabled={filteredLogs.length === 0}
            className="h-8 gap-1 font-mono text-[11px] border-border-subtle bg-surface-container hover:bg-surface-container-high"
          >
            {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            Copy IDs ({filteredCount})
          </Button>

          <Button
            size="xs"
            variant="outline"
            onClick={handleExportCsv}
            disabled={filteredLogs.length === 0}
            className="h-8 gap-1 font-mono text-[11px] border-border-subtle bg-surface-container hover:bg-surface-container-high"
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-border-subtle/50 text-xs">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Action Type</label>
          <select
            value={filters.action}
            onChange={(e) => onFilterChange("action", e.target.value)}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Actions</option>
            <option value="role_update">Role Changes</option>
            <option value="vault_freeze">Vault Freeze</option>
            <option value="vault_unfreeze">Vault Unfreeze</option>
            <option value="balance_adjustment">Balance Adjustments</option>
            <option value="listing_delist">Listing Delist</option>
            <option value="listing_relist">Listing Relist</option>
            <option value="dispute_resolution">Dispute Rulings</option>
            <option value="settings_update">Settings Updates</option>
            <option value="daemon_trigger">Daemon Triggers</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Severity</label>
          <select
            value={filters.severity}
            onChange={(e) => onFilterChange("severity", e.target.value as AuditFilterState["severity"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange("sortBy", e.target.value as AuditFilterState["sortBy"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none focus:border-primary cursor-pointer"
          >
            <option value="newest">Most Recent</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
