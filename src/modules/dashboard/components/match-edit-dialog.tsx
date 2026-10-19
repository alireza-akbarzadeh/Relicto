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
import { toast } from "sonner";
import { updateMatchScoreAction } from "../actions/admin-tournaments";
import type { DashboardMatch } from "../types";

interface MatchEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match?: DashboardMatch | null;
  onSuccess: () => void;
}

export function MatchEditDialog({ open, onOpenChange, match, onSuccess }: MatchEditDialogProps) {
  const [scoreA, setScoreA] = React.useState(0);
  const [scoreB, setScoreB] = React.useState(0);
  const [status, setStatus] = React.useState<"scheduled" | "live" | "completed">("scheduled");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (match) {
      setScoreA(match.scoreA);
      setScoreB(match.scoreB);
      setStatus(match.status);
    }
  }, [match, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;

    setSaving(true);
    try {
      const res = await updateMatchScoreAction({
        matchId: match.id,
        scoreA,
        scoreB,
        status,
      });

      if (res.success) {
        toast.success(res.message);
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.error ?? "Failed to update match.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!match) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-surface-card border-border-subtle">
        <DialogHeader>
          <DialogTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <Trophy className="size-4 text-primary" />
            Update Match Score & State
          </DialogTitle>
          <DialogDescription className="text-xs text-text-muted">
            {match.tournamentName} • {match.round ?? "Bracket Round"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="space-y-1 text-center">
              <span className="text-xs font-semibold text-text-primary truncate block">{match.teamAName}</span>
              <Input
                type="number"
                min="0"
                max="50"
                value={scoreA}
                onChange={(e) => setScoreA(Number(e.target.value))}
                className="h-10 text-center text-lg font-mono font-bold bg-surface-container border-border-subtle"
              />
            </div>

            <div className="space-y-1 text-center">
              <span className="text-xs font-semibold text-text-primary truncate block">{match.teamBName}</span>
              <Input
                type="number"
                min="0"
                max="50"
                value={scoreB}
                onChange={(e) => setScoreB(Number(e.target.value))}
                className="h-10 text-center text-lg font-mono font-bold bg-surface-container border-border-subtle"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-text-secondary">Match Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "scheduled" | "live" | "completed")}
              className="w-full h-8 px-2 text-xs font-mono rounded bg-surface-container border border-border-subtle text-text-secondary"
            >
              <option value="scheduled">Scheduled / Upcoming</option>
              <option value="live">🔴 Live in Progress</option>
              <option value="completed">Concluded / Final</option>
            </select>
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
              {saving ? "Saving..." : "Save Match Score"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
