"use client";

import * as React from "react";
import { Wallet, Lock, TrendingUp, ShieldCheck, ArrowUpRight, Plus, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DashboardKpis, SystemStatusData, DashboardTab } from "../types";
import { ChargeWalletDialog } from "./charge-wallet-dialog";

interface DashboardOverviewProps {
  kpis: DashboardKpis;
  system: SystemStatusData;
  onNavigateTab: (tab: DashboardTab) => void;
}

export function DashboardOverview({ kpis, system, onNavigateTab }: DashboardOverviewProps) {
  const [chargeOpen, setChargeOpen] = React.useState(false);

  const formatUsd = (cents: number) =>
    `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      {/* Real-time Daemon Status Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container/70 border border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-semibold text-text-primary tracking-wide flex items-center gap-1.5">
            <Activity className="size-3.5 text-emerald-400" />
            STEAM BOT FLEET: {system.daemonStatus.toUpperCase()} ({system.activeBots} BOTS CONNECTED)
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
          <span>Latency: <strong className="text-text-primary">{system.avgHandoffSeconds}s</strong></span>
          <span>Uptime: <strong className="text-emerald-400">{system.systemUptimePct}%</strong></span>
          <Button variant="outline" size="xs" onClick={() => onNavigateTab("monitoring")} className="text-[11px]">
            Inspect Daemon
          </Button>
        </div>
      </div>

      {/* KPI Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Liquid Balance */}
        <Card className="bg-surface-card border-border-subtle relative overflow-hidden group hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Liquid Vault Balance
            </CardTitle>
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Wallet className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold font-mono text-text-primary">
              {formatUsd(kpis.liquidBalanceCents)}
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-emerald-400 font-medium flex items-center gap-0.5">
                <ArrowUpRight className="size-3" />
                +{kpis.dailyYieldPct}% 24h
              </span>
              <Button
                size="xs"
                variant="outline"
                onClick={() => setChargeOpen(true)}
                className="gap-1 border-primary/40 text-primary hover:bg-primary/10 text-[11px]"
              >
                <Plus className="size-3" /> Charge
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Escrow Lock */}
        <Card className="bg-surface-card border-border-subtle relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Active Escrow Lock
            </CardTitle>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
              <Lock className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold font-mono text-text-primary">
              {formatUsd(kpis.escrowLockedCents)}
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-text-muted font-mono">
                {kpis.activeEscrowCount} active order{kpis.activeEscrowCount === 1 ? "" : "s"}
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500">
                Multi-Sig
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Traded Income */}
        <Card className="bg-surface-card border-border-subtle relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Total Platform Income
            </CardTitle>
            <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold font-mono text-cyan-400">
              {formatUsd(kpis.totalIncomeCents)}
            </div>
            <div className="flex items-center justify-between text-xs pt-1 text-text-muted">
              <span>Vol: {formatUsd(kpis.totalVolumeCents)}</span>
              <span className="font-mono text-emerald-400 font-semibold">Gold Tier</span>
            </div>
          </CardContent>
        </Card>

        {/* Escrow Success Rate */}
        <Card className="bg-surface-card border-border-subtle relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Escrow Success Rate
            </CardTitle>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold font-mono text-text-primary">
              {kpis.escrowSuccessRate}%
            </div>
            <div className="flex items-center justify-between text-xs pt-1 text-text-muted">
              <span>{kpis.ordersCount} Total Trades</span>
              <span className="text-emerald-400 font-mono font-semibold">0 Disputes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ChargeWalletDialog open={chargeOpen} onOpenChange={setChargeOpen} />
    </div>
  );
}
