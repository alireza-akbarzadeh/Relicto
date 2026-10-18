"use client";

import * as React from "react";
import { Users, Shield, Lock, Unlock, CheckCircle2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { DashboardUser } from "../types";
import { updateUserRoleAction, toggleUserFreezeAction } from "../actions/admin-users";

const ROLES = ["Admin", "Operator", "Trader", "VIP Trader", "Moderator", "Suspended"] as const;

export function DashboardUsers({ users: initialUsers }: { users: DashboardUser[] }) {
  const [users, setUsers] = React.useState(initialUsers);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.handle.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" ? true : u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingId(userId);
    try {
      const res = await updateUserRoleAction(userId, newRole);
      if (res.success) {
        toast.success(`User role updated to ${newRole}`);
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
      <CardHeader className="flex flex-col gap-3 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
              <Users className="size-4 text-primary" />
              User Directory & Role Administration
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Manage platform permissions, operator privileges, and vault emergency locks
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search trader or email..."
                className="pl-8 h-8 text-xs w-48 sm:w-60 bg-surface-container border-border-subtle"
              />
            </div>
          </div>
        </div>

        {/* Role Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-surface-container border border-border-subtle text-xs">
          {["all", ...ROLES].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                roleFilter.toLowerCase() === role.toLowerCase()
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
              <tr>
                <th className="pb-3 font-semibold">User Identity</th>
                <th className="pb-3 font-semibold">Role & Access</th>
                <th className="pb-3 font-semibold">Vault Balance</th>
                <th className="pb-3 font-semibold">Trust & Tier</th>
                <th className="pb-3 font-semibold">Security Status</th>
                <th className="pb-3 font-semibold text-right">Emergency Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container/40 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-text-primary block leading-tight">{u.name}</span>
                        <span className="text-[11px] text-text-muted font-mono block">@{u.handle}</span>
                        <span className="text-[10px] text-text-muted/80">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <select
                      value={u.role}
                      disabled={loadingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-surface-container border border-border-subtle text-text-primary rounded px-2 py-1 text-xs font-mono font-medium outline-none focus:border-primary cursor-pointer"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 font-mono font-bold text-text-primary">
                    {formatUsd(u.balanceCents)}
                  </td>
                  <td className="py-3">
                    <span className="text-text-primary font-mono text-[11px] block">{u.tier ?? "Standard"}</span>
                    <span className="text-text-muted text-[10px] font-mono">{u.trustScore}% Trust Score</span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-col gap-0.5 text-[10px] font-mono">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        {u.emailVerified ? "Verified Email" : "Unverified"}
                      </span>
                      {u.twoFactorEnabled && (
                        <span className="text-cyan-400 flex items-center gap-1">
                          <Shield className="size-3" /> 2FA Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      size="xs"
                      variant={u.isFrozen ? "destructive" : "outline"}
                      disabled={loadingId === u.id}
                      onClick={() => handleToggleFreeze(u.id, u.isFrozen)}
                      className="gap-1 text-[11px] font-mono"
                    >
                      {u.isFrozen ? (
                        <>
                          <Unlock className="size-3" /> Unfreeze
                        </>
                      ) : (
                        <>
                          <Lock className="size-3" /> Freeze
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
