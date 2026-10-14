"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Dot } from "@/components/ui/dot";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { submitPrediction } from "../../../actions/predictions";
import { DOT_TONE, TEXT_TONE } from "../../../lib/tones";
import type { FeedMatch, FeedTeam } from "../../../types";

function FeedTeamRow({
  team,
  pending,
  matchId,
  isPicked,
}: {
  team: FeedTeam;
  pending?: boolean;
  matchId?: string;
  isPicked?: boolean;
}) {
  const [, startTransition] = useTransition();

  const handlePick = () => {
    if (!matchId) return;
    startTransition(async () => {
      try {
        await submitPrediction({ matchId, teamId: team.tag, stakeCents: 0 });
        toast.success(`Prediction Placed: ${team.name}`, {
          description: "Your victory prediction is locked in the arena ledger.",
        });
      } catch {
        toast.info(`Selected ${team.name}`, {
          description: "Sign in to record predictions to your trading profile.",
        });
      }
    });
  };

  return (
    <div
      onClick={pending ? handlePick : undefined}
      className={cn(
        "flex items-center justify-between rounded-lg bg-surface-container-lowest p-space-sm transition-colors",
        pending ? "cursor-pointer hover:bg-surface-container-high/80 opacity-80" : "",
        isPicked ? "ring-1 ring-primary bg-primary/5 opacity-100" : "",
      )}
    >
      <div className="flex items-center gap-space-sm">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded font-label-caps text-label-caps font-bold",
            isPicked ? "bg-primary text-on-primary" : "bg-surface-container-high text-text-primary",
          )}
        >
          {team.tag}
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-body-md leading-tight text-text-primary">{team.name}</span>
          <span className="font-label-badge text-[10px] text-text-muted uppercase">
            {isPicked ? (
              <span className="font-bold text-primary">✓ Your Pick</span>
            ) : pending ? (
              "Pick to Win"
            ) : (
              team.meta
            )}
          </span>
        </div>
      </div>
      {team.score === undefined ? (
        <span className="font-label-badge text-label-badge text-text-muted">VS</span>
      ) : (
        <span className={cn("font-data-mono-lg text-data-mono-lg", TEXT_TONE[team.scoreTone ?? "strong"])}>
          {team.score}
        </span>
      )}
    </div>
  );
}

export function FeedMatchCard({
  match,
  onSelect,
}: {
  match: FeedMatch;
  onSelect?: () => void;
}) {
  const { state, userPick } = match;
  return (
    <article className="flex flex-col gap-space-sm rounded-xl bg-surface-card p-space-md transition-all hover:bg-surface-card/90 hover:shadow-md">
      <div
        onClick={onSelect}
        className={cn(
          "flex items-center justify-between font-label-badge text-label-badge text-text-muted",
          onSelect && "cursor-pointer hover:text-text-primary",
        )}
      >
        <span className={cn("font-bold flex items-center gap-1", TEXT_TONE[match.labelTone])}>
          {match.label}
          {onSelect && <Icon name="open_in_new" className="text-[12px] opacity-60" />}
        </span>
        <span className={cn("flex items-center gap-1 font-bold", TEXT_TONE[state.tone])}>
          {state.indicator && (
            <Dot
              className={cn("h-1.5 w-1.5", DOT_TONE[state.tone])}
              animation={state.indicator === "ping" ? "ping" : undefined}
            />
          )}
          {state.label}
        </span>
      </div>
      {match.teams.map((team) => (
        <FeedTeamRow
          key={team.tag}
          team={team}
          pending={match.pending}
          matchId={match.id}
          isPicked={userPick === team.tag}
        />
      ))}
      {onSelect && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onSelect}
            className="flex items-center gap-1 text-[11px] font-label-caps text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            Inspect Match & Odds <Icon name="chevron_right" className="text-[14px]" />
          </button>
        </div>
      )}
    </article>
  );
}
