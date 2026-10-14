"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { submitPrediction } from "../../../actions/predictions";
import { TEXT_TONE } from "../../../lib/tones";
import type { RadarMatch, RadarTeam } from "../../../mobile.types";

function RadarTeamBlock({
  team,
  align,
  matchId,
  isPicked,
}: {
  team: RadarTeam;
  align: "start" | "end";
  matchId?: string;
  isPicked?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const handlePick = () => {
    if (!matchId) return;
    startTransition(async () => {
      try {
        await submitPrediction({ matchId, teamId: team.tag, stakeCents: 0 });
        toast.success(`Prediction Locked: ${team.name}`, {
          description: "Your prediction has been registered on the arena radar ledger.",
        });
      } catch {
        toast.info(`Selected ${team.name}`, {
          description: "Sign in to record arena predictions to your trading profile.",
        });
      }
    });
  };

  return (
    <Button
      variant={null}
      size={null}
      onClick={handlePick}
      disabled={pending}
      title={`Pick ${team.name} to win`}
      className={cn(
        "flex h-auto items-center gap-2 rounded-lg p-1.5 transition-all text-left",
        align === "end" && "flex-row-reverse text-right",
        isPicked ? "ring-1 ring-primary bg-primary/10" : "hover:bg-surface-container active:scale-95",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          isPicked ? "bg-primary text-on-primary" : "bg-surface-container-high text-text-primary",
        )}
      >
        {team.tag}
      </div>
      <div className={cn("flex flex-col", align === "end" && "items-end")}>
        <span className="font-headline-sm text-sm font-semibold text-text-primary">{team.name}</span>
        <span
          className={cn(
            "font-label-badge text-label-badge",
            isPicked ? "text-primary font-bold" : TEXT_TONE[team.metaTone],
          )}
        >
          {isPicked ? "✓ Locked Pick" : team.meta}
        </span>
      </div>
    </Button>
  );
}

export function RadarMatchCard({
  match,
  onSelect,
}: {
  match: RadarMatch;
  onSelect?: () => void;
}) {
  const { clock, userPick } = match;
  return (
    <article className="rounded-lg bg-surface-container-low p-3 shadow-xs transition-all hover:bg-surface-container">
      <div
        onClick={onSelect}
        className={cn(
          "mb-2 flex items-center justify-between",
          onSelect && "cursor-pointer hover:opacity-90",
        )}
      >
        <span
          className={cn(
            "flex items-center gap-1 font-label-badge text-label-badge font-bold uppercase",
            TEXT_TONE[match.labelTone],
          )}
        >
          <Icon name={match.labelIcon} className="text-[13px]" /> {match.label}
          {onSelect && <Icon name="open_in_new" className="text-[11px] opacity-60 ml-0.5" />}
        </span>
        <span
          className={cn(
            "font-data-mono-md text-xs",
            clock.emphasis ? "flex items-center gap-1 font-semibold" : "font-medium",
            TEXT_TONE[clock.tone],
          )}
        >
          {clock.icon && <Icon name={clock.icon} className="text-[13px]" />} {clock.label}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <RadarTeamBlock team={match.home} align="start" matchId={match.id} isPicked={userPick === match.home.tag} />
        <div
          onClick={onSelect}
          className={cn(
            "flex items-center gap-2 rounded bg-surface-deep px-3 py-1 font-data-mono-lg text-data-mono-lg font-bold",
            onSelect && "cursor-pointer hover:ring-1 hover:ring-white/10",
          )}
        >
          <span className={TEXT_TONE[match.scoreTones[0]]}>{match.score[0]}</span>
          <span className="text-sm text-text-muted">{match.separator}</span>
          <span className={TEXT_TONE[match.scoreTones[1]]}>{match.score[1]}</span>
        </div>
        <RadarTeamBlock team={match.away} align="end" matchId={match.id} isPicked={userPick === match.away.tag} />
      </div>

      {match.goldShare !== undefined && (
        <div className="mt-2.5 flex h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
          <div className="h-full bg-status-upcoming" style={{ width: `${match.goldShare}%` }} />
          <div className="h-full bg-status-live" style={{ width: `${100 - match.goldShare}%` }} />
        </div>
      )}
    </article>
  );
}
