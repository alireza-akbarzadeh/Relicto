"use client";

import * as React from "react";
import {
  Play,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import type { ChestDefinition } from "@/modules/chests/types";

type SimStats = {
  totalRolls: number;
  itemHits: Record<
    string,
    { name: string; count: number; percentage: number; theoreticalPct: number }
  >;
  bonusHits: number;
  houseEdgePct: number;
};

export function ChestSimulationDialog({
  open,
  onOpenChange,
  chest,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chest: ChestDefinition | null;
}) {
  const [rollsCount, setRollsCount] = React.useState<number>(1000);
  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState<SimStats | null>(null);

  const runSimulation = async () => {
    if (!chest) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/chests/${chest.slug}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: rollsCount }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Simulation failed");
        return;
      }
      setStats(data.stats);
      toast.success(
        `Completed ${rollsCount.toLocaleString()} empirical roll simulations!`,
      );
    } catch {
      toast.error("Error executing simulation");
    } finally {
      setLoading(false);
    }
  };

  if (!chest) return null;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Odds Simulator: ${chest.name}`}
      description="Run Monte Carlo simulations to empirically verify Dota 2 escalating drop rates & house edge"
      contentClassName="sm:max-w-[620px]!"
    >
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-container p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-secondary">
              Simulate Rolls:
            </span>
            {[100, 1000, 5000].map((n) => (
              <Button
                key={n}
                size="xs"
                variant={rollsCount === n ? "default" : "outline"}
                onClick={() => setRollsCount(n)}
                className="font-mono text-xs h-6 px-2.5"
              >
                {n.toLocaleString()}x
              </Button>
            ))}
          </div>
          <Button
            size="sm"
            onClick={runSimulation}
            disabled={loading}
            className="gap-1.5 font-bold text-xs bg-primary text-on-primary"
          >
            <Play className="size-3.5 fill-current" />
            {loading ? "Simulating..." : "Execute Simulation"}
          </Button>
        </div>

        {stats && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border-subtle bg-surface-container p-2.5 text-center">
                <span className="text-[10px] font-mono text-text-muted">
                  Total Unboxes
                </span>
                <div className="text-sm font-bold font-mono text-text-primary">
                  {stats.totalRolls.toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg border border-border-subtle bg-surface-container p-2.5 text-center">
                <span className="text-[10px] font-mono text-text-muted">
                  Bonus Items Hit
                </span>
                <div className="text-sm font-bold font-mono text-amber-400">
                  {stats.bonusHits} (
                  {((stats.bonusHits / stats.totalRolls) * 100).toFixed(2)}%)
                </div>
              </div>
              <div className="rounded-lg border border-border-subtle bg-surface-container p-2.5 text-center">
                <span className="text-[10px] font-mono text-text-muted">
                  Calculated House Margin
                </span>
                <div className="text-sm font-bold font-mono text-emerald-400">
                  {stats.houseEdgePct}%
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-container p-3 space-y-2 max-h-56 overflow-y-auto no-scrollbar">
              <span className="text-xs font-mono font-bold text-text-secondary">
                Empirical vs Theoretical Drop Rates:
              </span>
              <div className="space-y-1.5">
                {Object.entries(stats.itemHits).map(([id, hit]) => (
                  <div
                    key={id}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded bg-surface-container-high/60 border border-border-subtle/50"
                  >
                    <span className="text-text-primary font-medium truncate max-w-[200px]">
                      {hit.name}
                    </span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-text-muted">
                        Expected: {hit.theoreticalPct}%
                      </span>
                      <span className="font-bold text-tertiary">
                        Simulated: {hit.percentage}% ({hit.count})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ResponsiveDialog>
  );
}
