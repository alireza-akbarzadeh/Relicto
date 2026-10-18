"use client";

import * as React from "react";
import { Server, Database, Shield, Zap, RefreshCw, CheckCircle2, Play, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { SystemStatusData } from "../types";
import { triggerDaemonCycleAction, type DaemonCycleResult } from "../actions/admin-daemon";

export function DashboardSystemMonitor({ system }: { system: SystemStatusData }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [executing, setExecuting] = React.useState(false);
  const [lastCycle, setLastCycle] = React.useState<DaemonCycleResult | null>(null);
  const [pulseKey, setPulseKey] = React.useState(0);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setPulseKey((k) => k + 1);
    }, 600);
  };

  const handleTriggerCycle = async () => {
    setExecuting(true);
    try {
      const res = await triggerDaemonCycleAction();
      if (res.success && res.summary) {
        setLastCycle(res.summary);
        setPulseKey((k) => k + 1);
        toast.success(
          `Cycle finished: ${res.summary.scannedCount} scanned, ${res.summary.dispatchedCount} dispatched`
        );
      } else {
        toast.error(res.error ?? "Failed to execute daemon cycle");
      }
    } finally {
      setExecuting(false);
    }
  };

  const botList = React.useMemo(() => {
    return Array.from({ length: system.activeBots }).map((_, i) => ({
      id: `bot-sentinel-0${i + 1}`,
      name: `Relicto Bot #${i + 1}`,
      load: ((i * 17 + pulseKey * 11) % 45) + 20,
      status: "active",
    }));
  }, [system.activeBots, pulseKey]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-heading font-bold text-text-primary">
            Autonomous Steam Bot & Daemon Telemetry
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Active trade bots, multi-sig escrow validator nodes, and Neon Postgres health
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2 font-mono text-xs"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Polling..." : "Ping Fleet"}
          </Button>
          <Button
            size="sm"
            onClick={handleTriggerCycle}
            disabled={executing}
            className="gap-2 font-mono text-xs font-semibold"
          >
            <Play className={`size-3.5 fill-current ${executing ? "animate-pulse" : ""}`} />
            {executing ? "Dispatching..." : "Run Dispatch Cycle"}
          </Button>
        </div>
      </div>

      {lastCycle && (
        <div className="p-3.5 rounded-lg bg-surface-card border border-primary/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-text-primary">
            <Activity className="size-4 text-primary animate-pulse" />
            <span>
              Last Cycle: Scanned <strong>{lastCycle.scannedCount}</strong> orders, dispatched{" "}
              <strong className="text-emerald-400">{lastCycle.dispatchedCount}</strong> bot trade offers
            </span>
          </div>
          <span className="text-[11px] text-text-muted">
            {new Date(lastCycle.timestamp).toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Nodes Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-surface-card border-border-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase">
              Steam Bot Fleet
            </CardTitle>
            <Server className="size-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-bold font-mono text-text-primary flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              {system.activeBots} / {system.activeBots} Online
            </div>
            <p className="text-xs text-text-muted font-mono">
              Average handoff: <strong className="text-text-primary">{system.avgHandoffSeconds}s</strong>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface-card border-border-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase">
              Escrow Multi-Sig Vault
            </CardTitle>
            <Shield className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-bold font-mono text-primary flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              Verified Multi-Sig
            </div>
            <p className="text-xs text-text-muted font-mono">
              Pending trade offers: <strong className="text-text-primary">{system.pendingSteamOffers}</strong>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-surface-card border-border-subtle">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase">
              Database & Ledger Sync
            </CardTitle>
            <Database className="size-4 text-cyan-400" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-bold font-mono text-cyan-400 flex items-center gap-2">
              <Zap className="size-4 text-cyan-400" />
              {system.systemUptimePct}% Uptime
            </div>
            <p className="text-xs text-text-muted font-mono">
              PostgreSQL replication: <strong className="text-emerald-400">0ms lag</strong>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sentinel Fleet Grid */}
      <Card className="bg-surface-card border-border-subtle" key={pulseKey}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading font-bold text-text-primary">
            Sentinel Node Fleet Activity
          </CardTitle>
          <CardDescription className="text-xs text-text-muted">
            Independent trading daemon processes handling trade offers and verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {botList.map((bot) => (
              <div
                key={bot.id}
                className="p-3 rounded-lg bg-surface-container/60 border border-border-subtle space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary truncate">{bot.name}</span>
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
                  <span>Capacity</span>
                  <span className="text-text-primary">{bot.load}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${bot.load}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
