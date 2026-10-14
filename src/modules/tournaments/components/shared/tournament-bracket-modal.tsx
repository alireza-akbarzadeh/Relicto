"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatUsd } from "../../lib/format";
import type { ArenaCard as ArenaCardData } from "../../types";

type TournamentBracketModalProps = {
  card: ArenaCardData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TournamentBracketModal({
  card,
  open,
  onOpenChange,
}: TournamentBracketModalProps) {
  const [registered, setRegistered] = useState(false);

  if (!card) return null;

  const handleRegister = () => {
    setRegistered(true);
    toast.success(`Registered for ${card.title}`, {
      description:
        "Your roster has been locked into the open qualifier seed ledger.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-white/10 bg-surface-deep/95 p-6 backdrop-blur-2xl text-on-surface">
        <DialogHeader className="gap-1 border-b border-white/5 pb-4">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps tracking-wider text-primary uppercase">
              {card.gameLabel} • {card.format}
            </span>
            <span className="rounded bg-primary-container/20 px-2 py-0.5 font-data-mono-md text-xs font-bold text-primary">
              PRIZE: {formatUsd(card.prizeUsd)}
            </span>
          </div>
          <DialogTitle className="font-headline-sm text-xl font-bold text-text-primary">
            {card.title}
          </DialogTitle>
          <p className="font-body-sm text-xs text-text-muted">
            {card.description}
          </p>
        </DialogHeader>

        {/* Tournament Bracket Stages */}
        <div className="flex flex-col gap-3 py-2">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps tracking-wider text-text-muted uppercase">
              Championship Bracket Architecture
            </span>
            <span className="font-label-badge text-[11px] text-text-secondary">
              Double Elimination • VAC+ Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Round 1 */}
            <div className="flex flex-col gap-2 rounded-lg bg-surface-container-lowest/80 p-3">
              <span className="font-label-badge text-[10px] text-primary uppercase font-bold">
                Quarterfinals (BO1)
              </span>
              <div className="flex flex-col gap-1.5 text-xs font-data-mono-md">
                <div className="flex justify-between rounded bg-surface-container-high/60 px-2 py-1 text-text-primary">
                  <span>GL vs BB</span>
                  <span className="text-primary font-bold">1 - 0</span>
                </div>
                <div className="flex justify-between rounded bg-surface-container-high/60 px-2 py-1 text-text-primary">
                  <span>NV vs FZ</span>
                  <span className="text-primary font-bold">2 - 1</span>
                </div>
                <div className="flex justify-between rounded bg-surface-container-high/60 px-2 py-1 text-text-muted">
                  <span>MOUZ vs AST</span>
                  <span>14 - 14</span>
                </div>
              </div>
            </div>

            {/* Round 2 */}
            <div className="flex flex-col gap-2 rounded-lg bg-surface-container-lowest/80 p-3">
              <span className="font-label-badge text-[10px] text-status-upcoming uppercase font-bold">
                Semifinals (BO3)
              </span>
              <div className="flex flex-col gap-1.5 text-xs font-data-mono-md">
                <div className="flex justify-between rounded bg-surface-container-high/60 px-2 py-1 text-text-primary">
                  <span>Liquid vs TBD</span>
                  <span className="text-status-upcoming font-bold">LIVE</span>
                </div>
                <div className="flex justify-between rounded bg-surface-container-high/60 px-2 py-1 text-text-muted">
                  <span>VIT vs G2</span>
                  <span>22:00 UTC</span>
                </div>
              </div>
            </div>

            {/* Grand Final */}
            <div className="flex flex-col gap-2 rounded-lg bg-surface-container-lowest/80 p-3 ring-1 ring-primary/20">
              <span className="font-label-badge text-[10px] text-tertiary uppercase font-bold">
                Grand Final (BO5)
              </span>
              <div className="flex flex-col gap-1.5 text-xs font-data-mono-md">
                <div className="flex justify-between rounded bg-primary/10 px-2 py-2 text-text-primary font-semibold">
                  <span>Champion Decider</span>
                  <span className="text-tertiary font-bold">$1.25M</span>
                </div>
                <span className="text-[10px] text-text-muted text-center pt-1">
                  Decider Trophy & Aegis
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity and Registration Bar */}
        <div className="flex items-center justify-between rounded-lg bg-surface-container-low/70 p-3 text-xs">
          <div className="flex items-center gap-2">
            <Icon name="groups" className="text-[18px] text-primary" />
            <div className="flex flex-col">
              <span className="font-semibold text-text-primary">
                Squad Capacity
              </span>
              <span className="text-text-muted">
                {card.capacity.filled + (registered ? 1 : 0)} /{" "}
                {card.capacity.total} {card.capacity.unit}
              </span>
            </div>
          </div>
          <Button
            type="button"
            disabled={registered}
            onClick={handleRegister}
            className={cn(
              "font-headline-sm text-xs tracking-wider uppercase",
              registered
                ? "bg-status-upcoming text-canvas-base"
                : "bg-primary-container text-on-primary hover:bg-primary-container/90",
            )}
          >
            {registered ? "✓ Squad Registered" : card.action.label}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
