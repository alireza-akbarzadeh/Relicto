"use client";

import * as React from "react";
import { Plus, Save, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createCatalogItemAction, updateCatalogItemAction } from "../actions/admin-catalog";
import type { DashboardCatalogItem } from "../types";

interface CatalogItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: DashboardCatalogItem | null;
  onSuccess: () => void;
}

export function CatalogItemSheet({
  open,
  onOpenChange,
  item,
  onSuccess,
}: CatalogItemSheetProps) {
  const isEditing = Boolean(item);
  const [saving, setSaving] = React.useState(false);

  const [name, setName] = React.useState(item?.name ?? "");
  const [slug, setSlug] = React.useState(item?.slug ?? "");
  const [gameId, setGameId] = React.useState(item?.gameId ?? "cs2");
  const [slot, setSlot] = React.useState(item?.slot ?? "Rifle");
  const [collection, setCollection] = React.useState(item?.collection ?? "");
  const [imageUrl, setImageUrl] = React.useState(item?.imageUrl ?? "");

  React.useEffect(() => {
    if (item) {
      setName(item.name);
      setSlug(item.slug);
      setGameId(item.gameId);
      setSlot(item.slot ?? "Weapon");
      setCollection(item.collection ?? "");
      setImageUrl(item.imageUrl ?? "");
    } else {
      setName("");
      setSlug("");
      setGameId("cs2");
      setSlot("Rifle");
      setCollection("");
      setImageUrl("");
    }
  }, [item, open]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast.error("Item name and slug are required.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing && item) {
        const res = await updateCatalogItemAction(item.id, {
          name,
          slot,
          collection,
          imageUrl,
        });
        if (res.success) {
          toast.success("Catalog item updated.");
          onOpenChange(false);
          onSuccess();
        } else {
          toast.error(res.error ?? "Failed to update item.");
        }
      } else {
        const res = await createCatalogItemAction({
          name,
          slug,
          gameId,
          slot,
          collection,
          imageUrl,
        });
        if (res.success) {
          toast.success("New catalog item created.");
          onOpenChange(false);
          onSuccess();
        } else {
          toast.error(res.error ?? "Failed to create item.");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface-card border-border-subtle">
        <DialogHeader>
          <DialogTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <Package className="size-4 text-primary" />
            {isEditing ? "Edit Catalog Item Definition" : "Add New Weapon / Catalog Asset"}
          </DialogTitle>
          <DialogDescription className="text-xs text-text-muted">
            Define canonical weapon specs, weapon collection, and item presentation assets.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-text-secondary">Item Name</label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. AK-47 | Inheritance"
              className="h-8 text-xs bg-surface-container border-border-subtle"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-text-secondary">Unique Slug</label>
              <Input
                value={slug}
                disabled={isEditing}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ak-47-inheritance"
                className="h-8 text-xs font-mono bg-surface-container border-border-subtle disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-text-secondary">Ecosystem Game</label>
              <select
                value={gameId}
                disabled={isEditing}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full h-8 px-2 text-xs font-mono rounded bg-surface-container border border-border-subtle text-text-secondary disabled:opacity-50"
              >
                <option value="cs2">Counter-Strike 2</option>
                <option value="dota2">Dota 2</option>
                <option value="tf2">Team Fortress 2</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-text-secondary">Slot / Category</label>
              <Input
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                placeholder="Rifle, Knife, Arcana..."
                className="h-8 text-xs bg-surface-container border-border-subtle"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-text-secondary">Weapon Collection</label>
              <Input
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                placeholder="e.g. The Kilowatt Collection"
                className="h-8 text-xs bg-surface-container border-border-subtle"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-text-secondary">Asset Image URL</label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... or /images/..."
              className="h-8 text-xs font-mono bg-surface-container border-border-subtle"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving} className="gap-1.5 text-xs font-semibold">
              <Save className="size-3.5" />
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
