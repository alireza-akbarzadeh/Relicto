"use client";

import * as React from "react";
import { Search, X, RotateCcw, Download, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DashboardUser } from "../types";

export interface UsersFilterState {
  search: string;
  role: string;
  status: "all" | "active" | "frozen" | "2fa" | "verified";
  balance: "all" | "funded" | "whale" | "zero";
  sortBy: "balance_desc" | "balance_asc" | "trust_desc" | "name_asc" | "name_desc" | "created_desc";
}

interface UsersFilterBarProps {
  filters: UsersFilterState;
  onFilterChange: <K extends keyof UsersFilterState>(key: K, value: UsersFilterState[K]) => void;
  onReset: () => void;
  filteredCount: number;
  filteredUsers: DashboardUser[];
  availableRoles: readonly string[];
}

export function UsersFilterBar({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
  filteredUsers,
  availableRoles,
}: UsersFilterBarProps) {
  const [copied, setCopied] = React.useState(false);

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.role !== "all" ||
    filters.status !== "all" ||
    filters.balance !== "all" ||
    filters.sortBy !== "balance_desc";

  const handleCopyIds = () => {
    navigator.clipboard.writeText(filteredUsers.map((u) => u.id).join(", "));
    setCopied(true);
    toast.success(`Copied ${filteredUsers.length} user IDs to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    const headers = ["ID", "Name", "Handle", "Email", "Role", "BalanceUSD", "TrustScore", "Frozen", "2FA"];
    const rows = filteredUsers.map((u) => [
      u.id, `"${u.name.replace(/"/g, '""')}"`, u.handle, u.email, u.role,
      (u.balanceCents / 100).toFixed(2), u.trustScore, u.isFrozen ? "Yes" : "No", u.twoFactorEnabled ? "Yes" : "No"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `relicto_users_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success(`Exported ${filteredUsers.length} records to CSV`);
  };

  return (
    <div className="space-y-3">
      {/* Top Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-md">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <Input
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search by name, handle, email, or user ID..."
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

        {/* Quick Bulk Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button
            size="xs"
            variant="outline"
            onClick={handleCopyIds}
            disabled={filteredUsers.length === 0}
            className="h-8 gap-1 font-mono text-[11px] border-border-subtle bg-surface-container hover:bg-surface-container-high"
          >
            {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            Copy IDs ({filteredCount})
          </Button>

          <Button
            size="xs"
            variant="outline"
            onClick={handleExportCsv}
            disabled={filteredUsers.length === 0}
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

      {/* Filter Selectors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-border-subtle/50 text-xs">
        {/* Role Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Role</label>
          <select
            value={filters.role}
            onChange={(e) => onFilterChange("role", e.target.value)}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Roles</option>
            {availableRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Account Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value as UsersFilterState["status"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Vaults</option>
            <option value="frozen">Frozen Accounts</option>
            <option value="2fa">2FA Protected</option>
            <option value="verified">Verified Email</option>
          </select>
        </div>

        {/* Balance Tier */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Balance</label>
          <select
            value={filters.balance}
            onChange={(e) => onFilterChange("balance", e.target.value as UsersFilterState["balance"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Balances</option>
            <option value="funded">Funded (&gt; $0)</option>
            <option value="whale">High Capital (&gt; $500)</option>
            <option value="zero">Zero Balance ($0)</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange("sortBy", e.target.value as UsersFilterState["sortBy"])}
            className="h-8 bg-surface-container border border-border-subtle rounded-md px-2 text-xs font-mono text-text-primary outline-none focus:border-primary cursor-pointer"
          >
            <option value="balance_desc">Balance: High → Low</option>
            <option value="balance_asc">Balance: Low → High</option>
            <option value="trust_desc">Trust Score: High → Low</option>
            <option value="name_asc">Name: A → Z</option>
            <option value="name_desc">Name: Z → A</option>
            <option value="created_desc">Newest Registered</option>
          </select>
        </div>
      </div>
    </div>
  );
}
