"use client";

import * as React from "react";
import { Plus, Package } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChestMetricsStrip } from "./chest-metrics-strip";
import { ChestTableRow } from "./chest-table-row";
import { ChestEditDialog } from "./chest-edit-dialog";
import { ChestSimulationDialog } from "./chest-simulation-dialog";
import type { ChestDefinition } from "@/modules/chests/types";

export function DashboardChests({ initialChests }: { initialChests: ChestDefinition[] }) {
  const [chests, setChests] = React.useState<ChestDefinition[]>(initialChests);
  const [selectedChest, setSelectedChest] = React.useState<ChestDefinition | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [simDialogOpen, setSimDialogOpen] = React.useState(false);

  const totalOpens = chests.reduce((acc, c) => acc + (c.openCount || 0), 0);
  const activeChests = chests.filter((c) => c.isActive).length;

  const handleToggleActive = async (chest: ChestDefinition) => {
    const updated = { ...chest, isActive: !chest.isActive };
    try {
      const res = await fetch(`/api/chests/${chest.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setChests((prev) => prev.map((c) => (c.id === chest.id ? updated : c)));
        toast.success(`Chest ${updated.isActive ? "activated" : "suspended"}`);
      }
    } catch {
      toast.error("Failed to toggle chest status");
    }
  };

  const handleDelete = async (chestId: string, slug: string) => {
    if (!confirm("Are you sure you want to delete this chest?")) return;
    try {
      const res = await fetch(`/api/chests/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setChests((prev) => prev.filter((c) => c.id !== chestId));
        toast.success("Chest deleted");
      }
    } catch {
      toast.error("Failed to delete chest");
    }
  };

  return (
    <div className="space-y-6">
      <ChestMetricsStrip
        activeChests={activeChests}
        totalChests={chests.length}
        totalOpens={totalOpens}
      />

      <Card className="bg-surface-card border-border-subtle">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
                <Package className="size-4 text-primary" />
                Configured Chests & Odds Registry
              </CardTitle>
              <CardDescription className="text-xs text-text-muted mt-0.5">
                Manage skin pool items, configure escalating odds thresholds, and run empirical simulations
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setSelectedChest(null);
                setEditDialogOpen(true);
              }}
              className="gap-1.5 font-bold text-xs bg-primary text-on-primary shadow-sm"
            >
              <Plus className="size-3.5" />
              Create New Chest
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container border-y border-border-subtle font-mono text-text-secondary text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Chest / Slug</th>
                  <th className="py-2.5 px-4">Tier Bracket</th>
                  <th className="py-2.5 px-4">Pool Items</th>
                  <th className="py-2.5 px-4">Coin Price</th>
                  <th className="py-2.5 px-4">USD Value</th>
                  <th className="py-2.5 px-4">Opens</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono">
                {chests.map((chest) => (
                  <ChestTableRow
                    key={chest.id}
                    chest={chest}
                    onToggleActive={handleToggleActive}
                    onSimulate={(c) => {
                      setSelectedChest(c);
                      setSimDialogOpen(true);
                    }}
                    onEdit={(c) => {
                      setSelectedChest(c);
                      setEditDialogOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ChestEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        chest={selectedChest}
        onSave={(saved) => {
          setChests((prev) => {
            const idx = prev.findIndex((c) => c.id === saved.id);
            if (idx >= 0) {
              const cp = [...prev];
              cp[idx] = saved;
              return cp;
            }
            return [...prev, saved];
          });
        }}
      />

      <ChestSimulationDialog
        open={simDialogOpen}
        onOpenChange={setSimDialogOpen}
        chest={selectedChest}
      />
    </div>
  );
}
