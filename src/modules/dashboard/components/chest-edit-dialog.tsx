"use client";

import * as React from "react";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { ChestDefinition, ChestTier } from "@/modules/chests/types";

export function ChestEditDialog({
  open,
  onOpenChange,
  chest,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chest: ChestDefinition | null;
  onSave: (updated: ChestDefinition) => void;
}) {
  const [form, setForm] = React.useState({
    name: "",
    slug: "",
    description: "",
    tier: "legendary" as ChestTier,
    rankBadge: "DIVINE / IMMORTAL",
    priceCoins: 1000,
    priceUsd: 10.0,
    hasEscalatingOdds: true,
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (chest) {
      setForm({
        name: chest.name,
        slug: chest.slug,
        description: chest.description,
        tier: chest.tier,
        rankBadge: chest.rankBadge,
        priceCoins: chest.priceCoins,
        priceUsd: chest.priceUsd,
        hasEscalatingOdds: chest.hasEscalatingOdds,
      });
    } else {
      setForm({
        name: "",
        slug: "",
        description: "",
        tier: "divine",
        rankBadge: "DIVINE V",
        priceCoins: 1000,
        priceUsd: 10.0,
        hasEscalatingOdds: true,
      });
    }
  }, [chest, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast.error("Name and slug are required");
      return;
    }

    setLoading(true);
    const newChest: ChestDefinition = {
      id: chest?.id ?? `chest-${Date.now()}`,
      slug: form.slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
      name: form.name,
      description: form.description,
      tier: form.tier,
      rankBadge: form.rankBadge,
      priceCoins: form.priceCoins,
      priceUsd: form.priceUsd,
      imageUrl: chest?.imageUrl ?? "/images/lootora/hub-01.jpg",
      hasEscalatingOdds: form.hasEscalatingOdds,
      isActive: chest?.isActive ?? true,
      openCount: chest?.openCount ?? 0,
      colorAccent: "crimson",
      items: chest?.items ?? [],
    };

    try {
      const endpoint = chest ? `/api/chests/${chest.slug}` : "/api/chests";
      const res = await fetch(endpoint, {
        method: chest ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChest),
      });

      if (!res.ok) {
        toast.error("Failed to save chest");
        return;
      }

      toast.success(chest ? "Chest updated!" : "Created new chest!");
      onSave(newChest);
      onOpenChange(false);
    } catch {
      toast.error("Network error saving chest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={chest ? `Edit: ${chest.name}` : "Create Gaming Chest"}
      description="Configure chest parameters, tier, odds and coin economy"
      contentClassName="sm:max-w-2xl! p-4"
    >
      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-mono text-text-secondary">Name</label>
            <Input
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  name,
                  slug: chest ? prev.slug : name.toLowerCase().replace(/\s+/g, "-"),
                }));
              }}
              placeholder="e.g. Arcana Treasury"
              className="h-8 text-xs bg-surface-container border-border-subtle"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-text-secondary">Slug</label>
            <Input
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="e.g. arcana-treasury"
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-text-secondary">Description</label>
          <Input
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="High-roller battle pass case containing coveted items..."
            className="h-8 text-xs bg-surface-container border-border-subtle"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-mono text-text-secondary">Tier</label>
            <select
              value={form.tier}
              onChange={(e) => setForm((prev) => ({ ...prev, tier: e.target.value as ChestTier }))}
              className="w-full h-8 px-2 rounded-md border border-border-subtle bg-surface-container text-xs text-text-primary"
            >
              <option value="beginner">Scout / Beginner</option>
              <option value="elite">Global Elite</option>
              <option value="divine">Divine Reliquary</option>
              <option value="legendary">Arcana Vault</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-text-secondary">Badge</label>
            <Input
              value={form.rankBadge}
              onChange={(e) => setForm((prev) => ({ ...prev, rankBadge: e.target.value }))}
              placeholder="DIVINE V"
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-mono text-text-secondary">Price (RC)</label>
            <Input
              type="number"
              min="10"
              value={form.priceCoins}
              onChange={(e) => setForm((prev) => ({ ...prev, priceCoins: Number(e.target.value) }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-text-secondary">Price ($ USD)</label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              value={form.priceUsd}
              onChange={(e) => setForm((prev) => ({ ...prev, priceUsd: Number(e.target.value) }))}
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-container p-2.5">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-bold text-text-primary block">Dota 2 Escalating Odds</span>
            <span className="text-[11px] text-text-muted">Auto-escalate bonus chances on consecutive opens</span>
          </div>
          <Switch
            checked={form.hasEscalatingOdds}
            onCheckedChange={(checked) => setForm((prev) => ({ ...prev, hasEscalatingOdds: checked }))}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
          <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading} className="text-xs font-bold bg-primary text-on-primary">
            {loading ? "Saving..." : chest ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
