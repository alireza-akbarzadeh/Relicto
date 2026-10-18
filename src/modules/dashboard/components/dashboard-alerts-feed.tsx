"use client";

import * as React from "react";
import { Bell, Scale, Receipt, ShieldAlert, Check, Server, ExternalLink } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DashboardData, DashboardTab } from "../types";

interface DashboardAlertsFeedProps {
  data: DashboardData;
  onNavigateTab: (tab: DashboardTab) => void;
}

export function DashboardAlertsFeed({ data, onNavigateTab }: DashboardAlertsFeedProps) {
  const [open, setOpen] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  const openDisputes = React.useMemo(
    () => data.disputes.filter((d) => d.status === "open" || d.status === "under_review"),
    [data.disputes]
  );

  const pendingOffers = data.system.pendingSteamOffers;

  const criticalAudits = React.useMemo(
    () => data.auditLogs.filter((a) => a.severity === "critical").slice(0, 3),
    [data.auditLogs]
  );

  const totalAlertCount = openDisputes.length + (pendingOffers > 0 ? 1 : 0) + criticalAudits.length;
  const unreadCount = dismissed ? 0 : totalAlertCount;

  const handleJump = (tab: DashboardTab) => {
    onNavigateTab(tab);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="relative size-9 flex items-center justify-center rounded-md border border-border-subtle bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
        title="Terminal Alert Center"
      >
        <Bell className="size-4 text-text-muted" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 font-mono text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 bg-surface-card border-border-subtle shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between p-3 border-b border-border-subtle/60">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-xs text-text-primary">Operations Alerts</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                {unreadCount} Active
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-[11px] text-text-muted hover:text-text-primary flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Check className="size-3 text-emerald-400" />
            Clear
          </button>
        </div>

        <div className="divide-y divide-border-subtle/40 max-h-72 overflow-y-auto no-scrollbar">
          {totalAlertCount === 0 ? (
            <div className="p-4 text-center text-text-muted text-[11px]">
              All operational nodes nominal. No pending warnings.
            </div>
          ) : (
            <>
              {openDisputes.length > 0 && (
                <div
                  onClick={() => handleJump("disputes")}
                  className="p-3 hover:bg-surface-container/60 cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between text-amber-400 font-semibold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Scale className="size-3.5" />
                      {openDisputes.length} Disputes Pending Arbitration
                    </span>
                    <ExternalLink className="size-3 opacity-60" />
                  </div>
                  <p className="text-[10px] text-text-muted truncate">
                    Latest: {openDisputes[0]?.itemName} (${(openDisputes[0]?.amountCents / 100).toFixed(2)})
                  </p>
                </div>
              )}

              {pendingOffers > 0 && (
                <div
                  onClick={() => handleJump("orders")}
                  className="p-3 hover:bg-surface-container/60 cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between text-cyan-400 font-semibold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Receipt className="size-3.5" />
                      {pendingOffers} Escrow Offers in Flight
                    </span>
                    <ExternalLink className="size-3 opacity-60" />
                  </div>
                  <p className="text-[10px] text-text-muted">
                    Trade offers dispatched awaiting physical Steam receipt
                  </p>
                </div>
              )}

              {criticalAudits.map((a) => (
                <div
                  key={a.id}
                  onClick={() => handleJump("audit")}
                  className="p-3 hover:bg-surface-container/60 cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between text-rose-400 font-semibold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="size-3.5" />
                      Critical Audit: {a.action.replace(/_/g, " ")}
                    </span>
                    <ExternalLink className="size-3 opacity-60" />
                  </div>
                  <p className="text-[10px] text-text-muted truncate">
                    {a.details} • by @{a.adminName}
                  </p>
                </div>
              ))}

              <div
                onClick={() => handleJump("monitoring")}
                className="p-3 hover:bg-surface-container/60 cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-emerald-400 font-semibold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Server className="size-3.5" />
                    Steam Sentinel Bot Daemon
                  </span>
                  <span className="text-[10px] font-mono">{data.system.activeBots} / 12 Online</span>
                </div>
                <p className="text-[10px] text-text-muted">
                  System uptime {data.system.systemUptimePct}% • Replication 0ms lag
                </p>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
