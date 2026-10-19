"use client";

import * as React from "react";
import { Trophy, Save } from "lucide-react";
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
import { PriceInput } from "@/components/ui/price-input";
import { toast } from "sonner";
import { createTournamentAction } from "../actions/admin-tournaments";

interface TournamentCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function TournamentCreateDialog({ open, onOpenChange, onSuccess }: TournamentCreateDialogProps) {
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [gameId, setGameId] = React.useState("cs2");
  const [prizePoolUsd, setPrizePoolUsd] = React.useState(25000);
  const [format, setFormat] = React.useState("5v5 DOUBLE ELIMINATION");
  const [status, setStatus] = React.useState<"upcoming" | "live" | "completed">("upcoming");
  const [saving, setSaving] = React.useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast.error("Tournament name is required.");
      return;
    }

    setSaving(true);
    try {
      const res = await createTournamentAction({
        name,
        slug,
        gameId,
        prizePoolUsd,
        format,
        status,
      });

      if (res.success) {
        toast.success(res.message);
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.error ?? "Failed to create tournament.");
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
            <Trophy className="size-4 text-primary" />
            Create Esports Tournament
          </DialogTitle>
          <DialogDescription className="text-xs text-text-muted">
            Launch official tournament bracket, prize pool distribution, and match scheduling.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-text-secondary">Tournament Title</label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Relicto Major Championship: Season 1"
              className="h-8 text-xs bg-surface-container border-border-subtle"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-text-secondary">Game</label>
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full h-8 px-2 text-xs font-mono rounded bg-surface-container border border-border-subtle text-text-secondary"
              >
                <option value="cs2">Counter-Strike 2</option>
                <option value="dota2">Dota 2</option>
                <option value="tf2">Team Fortress 2</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-text-secondary">Prize Pool</label>
              <PriceInput
                value={prizePoolUsd}
                onChange={setPrizePoolUsd}
                currencyPrefix="$"
                currencySuffix="USD"
                allowDecimals={false}
                min={100}
                placeholder="25,000"
                className="h-8"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-text-secondary">Bracket Format</label>
              <Input
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                placeholder="5v5 DOUBLE ELIMINATION"
                className="h-8 text-xs bg-surface-container border-border-subtle"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-text-secondary">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "upcoming" | "live" | "completed")}
                className="w-full h-8 px-2 text-xs font-mono rounded bg-surface-container border border-border-subtle text-text-secondary"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live in Progress</option>
                <option value="completed">Concluded</option>
              </select>
            </div>
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
              {saving ? "Creating..." : "Create Tournament"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
