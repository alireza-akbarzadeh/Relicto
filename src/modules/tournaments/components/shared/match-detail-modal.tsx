"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dot } from "@/components/ui/dot";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { submitPrediction } from "../../actions/predictions";
import { DOT_TONE, TEXT_TONE } from "../../lib/tones";
import type { FeedMatch } from "../../types";

type MatchDetailModalProps = {
  match: FeedMatch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MatchDetailModal({ match, open, onOpenChange }: MatchDetailModalProps) {
  const [isPending, startTransition] = useTransition();

  if (!match) return null;

  const [teamA, teamB] = match.teams;
  const isDota = match.game === "dota2" || match.label.includes("DOTA");
  const split = match.predictionSplit ?? [50, 50];

  const handlePick = (teamTag: string, teamName: string) => {
    startTransition(async () => {
      try {
        await submitPrediction({ matchId: match.id, teamId: teamTag, stakeCents: 0 });
        toast.success(`Prediction Locked: ${teamName}`, {
          description: "Your victory prediction is synchronized to the arena ledger.",
        });
      } catch {
        toast.info(`Selected ${teamName}`, {
          description: "Sign in to persist your tournament predictions.",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-white/10 bg-surface-deep/95 p-6 backdrop-blur-2xl text-on-surface">
        <DialogHeader className="gap-1 border-b border-white/5 pb-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-label-caps text-label-caps tracking-wider text-primary uppercase">
              <Icon name="trophy" className="text-[16px]" />
              {match.tournamentName ?? "Official Arena Tournament"}
            </span>
            <span className={cn("flex items-center gap-1 font-label-badge text-label-badge font-bold uppercase", TEXT_TONE[match.state.tone])}>
              {match.state.indicator && (
                <Dot className={cn("h-1.5 w-1.5", DOT_TONE[match.state.tone])} animation={match.state.indicator === "ping" ? "ping" : undefined} />
              )}
              {match.state.label}
            </span>
          </div>
          <DialogTitle className="font-headline-sm text-lg font-bold text-text-primary">
            {match.label}
          </DialogTitle>
        </DialogHeader>

        {/* Scoreboard Arena */}
        <div className="grid grid-cols-7 items-center rounded-xl bg-surface-container-lowest/80 p-4 shadow-inner">
          <div className="col-span-3 flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high font-headline-sm text-sm font-bold text-text-primary shadow-xs">
              {teamA.tag}
            </div>
            <span className="font-headline-sm text-sm font-semibold text-text-primary line-clamp-1">{teamA.name}</span>
            <span className="font-label-badge text-[11px] text-text-muted">{teamA.meta}</span>
          </div>

          <div className="col-span-1 flex flex-col items-center justify-center">
            {teamA.score !== undefined && teamB.score !== undefined ? (
              <div className="flex items-center gap-1.5 font-data-mono-lg text-2xl font-bold">
                <span className={TEXT_TONE[teamA.scoreTone ?? "strong"]}>{teamA.score}</span>
                <span className="text-text-muted text-sm">:</span>
                <span className={TEXT_TONE[teamB.scoreTone ?? "strong"]}>{teamB.score}</span>
              </div>
            ) : (
              <span className="rounded bg-surface-container px-2 py-0.5 font-label-caps text-xs text-text-muted">VS</span>
            )}
            <span className="mt-1 font-label-badge text-[10px] text-text-secondary uppercase">{match.map ?? (isDota ? "Decider Map" : "Competitive")}</span>
          </div>

          <div className="col-span-3 flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high font-headline-sm text-sm font-bold text-text-primary shadow-xs">
              {teamB.tag}
            </div>
            <span className="font-headline-sm text-sm font-semibold text-text-primary line-clamp-1">{teamB.name}</span>
            <span className="font-label-badge text-[11px] text-text-muted">{teamB.meta}</span>
          </div>
        </div>

        {/* Telemetry telemetry bar */}
        <div className="flex flex-col gap-2 rounded-lg bg-surface-container-low/50 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary flex items-center gap-1">
              <Icon name="sensors" className="text-[14px] text-primary" />
              {isDota ? "Gold Differential" : "Live Round Probability"}
            </span>
            <span className="font-data-mono-md text-text-primary font-semibold">
              {match.goldLead ?? `${split[0]}% vs ${split[1]}%`}
            </span>
          </div>
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
            <div className="bg-primary transition-all duration-500" style={{ width: `${split[0]}%` }} />
            <div className="bg-status-upcoming transition-all duration-500" style={{ width: `${split[1]}%` }} />
          </div>
          {match.casters && (
            <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
              <span>Official Casters: <b className="text-text-secondary">{match.casters}</b></span>
              <span className="text-status-live flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-live" /> 1080p 60fps Broadcast
              </span>
            </div>
          )}
        </div>

        {/* Victory Prediction Station */}
        <div className="flex flex-col gap-2.5 pt-1">
          <span className="font-label-caps text-label-caps tracking-wider text-text-muted uppercase">
            Arena Victory Prediction
          </span>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={match.userPick === teamA.tag ? "default" : "outline"}
              disabled={isPending}
              onClick={() => handlePick(teamA.tag, teamA.name)}
              className={cn(
                "h-auto flex flex-col items-center py-2.5 px-3 rounded-lg border-white/10 transition-all",
                match.userPick === teamA.tag ? "bg-primary text-on-primary ring-2 ring-primary/40" : "hover:bg-surface-container-high",
              )}
            >
              <span className="font-headline-sm text-xs font-bold">{teamA.name}</span>
              <span className="text-[11px] opacity-80 mt-0.5">
                {match.userPick === teamA.tag ? "✓ Your Pick Locked" : `Pick (${split[0]}% Votes)`}
              </span>
            </Button>

            <Button
              type="button"
              variant={match.userPick === teamB.tag ? "default" : "outline"}
              disabled={isPending}
              onClick={() => handlePick(teamB.tag, teamB.name)}
              className={cn(
                "h-auto flex flex-col items-center py-2.5 px-3 rounded-lg border-white/10 transition-all",
                match.userPick === teamB.tag ? "bg-primary text-on-primary ring-2 ring-primary/40" : "hover:bg-surface-container-high",
              )}
            >
              <span className="font-headline-sm text-xs font-bold">{teamB.name}</span>
              <span className="text-[11px] opacity-80 mt-0.5">
                {match.userPick === teamB.tag ? "✓ Your Pick Locked" : `Pick (${split[1]}% Votes)`}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
