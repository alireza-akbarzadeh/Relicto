"use client";

import * as React from "react";
import { Shield, Lock, Unlock, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DashboardUser } from "../types";

export const DASHBOARD_ROLES = ["Admin", "Operator", "Trader", "VIP Trader", "Moderator", "Suspended"] as const;

interface UsersTableProps {
  users: DashboardUser[];
  loadingId: string | null;
  onRoleChange: (userId: string, newRole: string) => void;
  onToggleFreeze: (userId: string, currentFrozen: boolean) => void;
}

export function UsersTable({ users, loadingId, onRoleChange, onToggleFreeze }: UsersTableProps) {
  const formatUsd = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  if (users.length === 0) {
    return (
      <div className="py-12 text-center text-xs font-mono text-text-muted border border-dashed border-border-subtle rounded-lg">
        <ShieldAlert className="size-6 text-text-muted mx-auto mb-2 opacity-50" />
        No user accounts match current search or filter criteria.
      </div>
    );
  }

  return (
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
          {users.map((u) => (
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
                  onChange={(e) => onRoleChange(u.id, e.target.value)}
                  className="bg-surface-container border border-border-subtle text-text-primary rounded px-2 py-1 text-xs font-mono font-medium outline-none focus:border-primary cursor-pointer"
                >
                  {DASHBOARD_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-3 font-mono font-bold text-text-primary">{formatUsd(u.balanceCents)}</td>
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
                  {u.isFrozen && <span className="text-rose-400 font-bold">LOCKED / FROZEN</span>}
                </div>
              </td>
              <td className="py-3 text-right">
                <Button
                  size="xs"
                  variant={u.isFrozen ? "destructive" : "outline"}
                  disabled={loadingId === u.id}
                  onClick={() => onToggleFreeze(u.id, u.isFrozen)}
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
  );
}
