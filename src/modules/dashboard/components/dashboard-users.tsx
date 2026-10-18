"use client";

import * as React from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import type { DashboardUser } from "../types";
import { updateUserRoleAction, toggleUserFreezeAction } from "../actions/admin-users";
import { UsersFilterBar, type UsersFilterState } from "./users-filter-bar";
import { UsersTable, DASHBOARD_ROLES } from "./users-table";

const INITIAL_FILTERS: UsersFilterState = {
  search: "",
  role: "all",
  status: "all",
  balance: "all",
  sortBy: "balance_desc",
};

export function DashboardUsers({ users: initialUsers }: { users: DashboardUser[] }) {
  const [users, setUsers] = React.useState(initialUsers);
  const [filters, setFilters] = React.useState<UsersFilterState>(INITIAL_FILTERS);
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleFilterChange = <K extends keyof UsersFilterState>(key: K, value: UsersFilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => setFilters(INITIAL_FILTERS);

  const filteredAndSorted = React.useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const result = users.filter((u) => {
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.handle.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchRole = filters.role === "all" || u.role.toLowerCase() === filters.role.toLowerCase();
      const matchStatus =
        filters.status === "all" ||
        (filters.status === "active" && !u.isFrozen) ||
        (filters.status === "frozen" && u.isFrozen) ||
        (filters.status === "2fa" && u.twoFactorEnabled) ||
        (filters.status === "verified" && u.emailVerified);
      const matchBalance =
        filters.balance === "all" ||
        (filters.balance === "funded" && u.balanceCents > 0) ||
        (filters.balance === "whale" && u.balanceCents >= 50000) ||
        (filters.balance === "zero" && u.balanceCents === 0);
      return matchSearch && matchRole && matchStatus && matchBalance;
    });

    return result.sort((a, b) => {
      if (filters.sortBy === "balance_desc") return b.balanceCents - a.balanceCents;
      if (filters.sortBy === "balance_asc") return a.balanceCents - b.balanceCents;
      if (filters.sortBy === "trust_desc") return b.trustScore - a.trustScore;
      if (filters.sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (filters.sortBy === "name_desc") return b.name.localeCompare(a.name);
      if (filters.sortBy === "created_desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [users, filters]);

  const totalVaultCents = React.useMemo(
    () => filteredAndSorted.reduce((acc, u) => acc + u.balanceCents, 0),
    [filteredAndSorted]
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingId(userId);
    try {
      const res = await updateUserRoleAction(userId, newRole);
      if (res.success) {
        toast.success(`Role updated to ${newRole}`);
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      } else {
        toast.error(res.error);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleFreeze = async (userId: string, currentFrozen: boolean) => {
    setLoadingId(userId);
    try {
      const res = await toggleUserFreezeAction(userId, !currentFrozen);
      if (res.success) {
        toast.success(res.message);
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isFrozen: !currentFrozen } : u)));
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
              <Users className="size-4 text-primary" />
              User Directory & Role Administration
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Live identity registry, security state, and emergency account freeze controls
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-text-muted">
              Showing: <strong className="text-text-primary">{filteredAndSorted.length}</strong> / {users.length}
            </span>
            <span className="text-text-muted">
              Vault: <strong className="text-emerald-400">{formatUsd(totalVaultCents)}</strong>
            </span>
          </div>
        </div>

        <UsersFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          filteredCount={filteredAndSorted.length}
          filteredUsers={filteredAndSorted}
          availableRoles={DASHBOARD_ROLES}
        />
      </CardHeader>

      <CardContent>
        <UsersTable
          users={filteredAndSorted}
          loadingId={loadingId}
          onRoleChange={handleRoleChange}
          onToggleFreeze={handleToggleFreeze}
        />
      </CardContent>
    </Card>
  );
}
