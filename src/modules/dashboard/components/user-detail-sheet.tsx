"use client";

import * as React from "react";
import { Lock, Unlock, CheckCircle2, DollarSign, Copy, Check, Save } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { DashboardUser } from "../types";
import { adjustUserBalanceAction } from "../actions/admin-users";
import { DASHBOARD_ROLES } from "./users-table";

interface UserDetailSheetProps {
  user: DashboardUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChange: (userId: string, newRole: string) => void;
  onToggleFreeze: (userId: string, currentFrozen: boolean) => void;
  onBalanceAdjusted: (userId: string, newBalanceCents: number) => void;
}

export function UserDetailSheet({
  user,
  open,
  onOpenChange,
  onRoleChange,
  onToggleFreeze,
  onBalanceAdjusted,
}: UserDetailSheetProps) {
  const [copied, setCopied] = React.useState(false);
  const [adjustAmount, setAdjustAmount] = React.useState("");
  const [adjustReason, setAdjustReason] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  if (!user) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    toast.success("User ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    const dollars = parseFloat(adjustAmount);
    if (isNaN(dollars) || dollars === 0) {
      toast.error("Enter a valid non-zero adjustment amount (e.g. 25.00 or -10.00).");
      return;
    }
    const centsDelta = Math.round(dollars * 100);
    setLoading(true);
    try {
      const res = await adjustUserBalanceAction(user.id, centsDelta, adjustReason);
      if (res.success && res.newBalanceCents !== undefined) {
        toast.success(res.message);
        onBalanceAdjusted(user.id, res.newBalanceCents);
        setAdjustAmount("");
        setAdjustReason("");
      } else {
        toast.error(res.error ?? "Failed to adjust balance.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatUsd = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-surface-card border-border-subtle p-5 overflow-y-auto">
        <SheetHeader className="pb-3 border-b border-border-subtle/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-sm text-primary shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-sm font-heading font-bold text-text-primary block truncate">
                {user.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-text-muted font-mono flex items-center gap-2">
                <span>@{user.handle}</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="flex items-center gap-1 hover:text-text-primary transition-colors cursor-pointer"
                >
                  <span>{user.id.slice(0, 10)}...</span>
                  {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                </button>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-5 pt-4 text-xs font-mono">
          {/* Identity & Role Management */}
          <div className="p-3 rounded-lg bg-surface-container border border-border-subtle space-y-2.5">
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold block">
              Identity & Access Role
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-text-secondary">Assigned Role:</span>
              <select
                value={user.role}
                onChange={(e) => onRoleChange(user.id, e.target.value)}
                className="bg-surface-card border border-border-subtle text-text-primary rounded px-2 py-1 text-xs font-mono outline-none focus:border-primary cursor-pointer"
              >
                {DASHBOARD_ROLES.map((r) => (<option key={r} value={r}>{r}</option>))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border-subtle/40">
              <span className="text-text-secondary">Emergency Vault State:</span>
              <Button
                size="xs"
                variant={user.isFrozen ? "destructive" : "outline"}
                onClick={() => onToggleFreeze(user.id, user.isFrozen)}
                className="gap-1 font-mono text-[11px] h-7"
              >
                {user.isFrozen ? (<><Unlock className="size-3" /> Unfreeze Vault</>) : (<><Lock className="size-3" /> Freeze Vault</>)}
              </Button>
            </div>
          </div>

          {/* Security & Trust Telemetry */}
          <div className="p-3 rounded-lg bg-surface-container border border-border-subtle space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold block">
              Security & Trust Telemetry
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-text-muted block text-[10px]">CURRENT VAULT</span>
                <strong className="text-emerald-400 text-sm font-bold">{formatUsd(user.balanceCents)}</strong>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">TRUST SCORE</span>
                <strong className="text-text-primary text-sm font-bold">{user.trustScore}%</strong>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">TIER & LEVEL</span>
                <span className="text-text-primary font-semibold">{user.tier ?? "Standard"} (Lvl {user.level})</span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">AUTHENTICATION</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-400" />
                  {user.twoFactorEnabled ? "2FA Guard Active" : "Standard Auth"}
                </span>
              </div>
            </div>
          </div>

          {/* Manual Audited Balance Adjustment Form */}
          <form onSubmit={handleAdjustBalance} className="p-3 rounded-lg bg-surface-container border border-border-subtle space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold flex items-center gap-1.5">
              <DollarSign className="size-3.5 text-primary" />
              Audited Balance Adjustment
            </span>
            <p className="text-[10px] text-text-muted">
              Credit (+) or debit (-) funds with an audit note inserted into platform ledger.
            </p>
            <div className="grid grid-cols-1 gap-2 pt-1">
              <Input
                type="number" step="0.01" placeholder="Amount ($ USD, e.g. 50.00 or -25.50)"
                value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)}
                className="h-8 text-xs font-mono bg-surface-card border-border-subtle"
              />
              <Input
                placeholder="Audited Reason / Ticket ID (e.g. Ticket #402 Compensation)"
                value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)}
                className="h-8 text-xs font-mono bg-surface-card border-border-subtle"
              />
              <Button type="submit" size="sm" disabled={loading || !adjustAmount} className="w-full gap-1.5 text-xs font-semibold h-8 mt-1">
                <Save className="size-3.5" />
                {loading ? "Adjusting..." : "Apply Audited Adjustment"}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
