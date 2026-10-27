"use client";

import * as React from "react";
import { Package, Flame, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ChestMetricsStrip({
  activeChests,
  totalChests,
  totalOpens,
}: {
  activeChests: number;
  totalChests: number;
  totalOpens: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-surface-card border-border-subtle p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-text-muted">Total Active Chests</span>
          <Package className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold font-mono text-text-primary mt-1">
          {activeChests} / {totalChests}
        </div>
      </Card>

      <Card className="bg-surface-card border-border-subtle p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-text-muted">Lifetime Opens</span>
          <Flame className="size-4 text-tertiary" />
        </div>
        <div className="text-2xl font-bold font-mono text-text-primary mt-1">
          {totalOpens.toLocaleString()}
        </div>
      </Card>

      <Card className="bg-surface-card border-border-subtle p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-text-muted">Algorithm Telemetry</span>
          <Sparkles className="size-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
          Dota 2 Escalating
        </div>
      </Card>
    </div>
  );
}
