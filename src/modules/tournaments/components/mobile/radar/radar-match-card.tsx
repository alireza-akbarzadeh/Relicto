import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TEXT_TONE } from "../../../lib/tones";
import type { RadarMatch, RadarTeam } from "../../../mobile.types";

function RadarTeamBlock({ team, align }: { team: RadarTeam; align: "start" | "end" }) {
  return (
    <div className={cn("flex items-center gap-2", align === "end" && "flex-row-reverse text-right")}>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-text-primary">
        {team.tag}
      </div>
      <div className={cn("flex flex-col", align === "end" && "items-end")}>
        <span className="font-headline-sm text-sm font-semibold text-text-primary">{team.name}</span>
        <span className={cn("font-label-badge text-label-badge", TEXT_TONE[team.metaTone])}>{team.meta}</span>
      </div>
    </div>
  );
}

export function RadarMatchCard({ match }: { match: RadarMatch }) {
  const { clock } = match;
  return (
    <article className="rounded-lg bg-surface-container-low p-3 shadow-xs">
      <div className="mb-2 flex items-center justify-between">
        <span
          className={cn(
            "flex items-center gap-1 font-label-badge text-label-badge font-bold uppercase",
            TEXT_TONE[match.labelTone],
          )}
        >
          <Icon name={match.labelIcon} className="text-[13px]" /> {match.label}
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
        <RadarTeamBlock team={match.home} align="start" />
        <div className="flex items-center gap-2 rounded bg-surface-deep px-3 py-1 font-data-mono-lg text-data-mono-lg font-bold">
          <span className={TEXT_TONE[match.scoreTones[0]]}>{match.score[0]}</span>
          <span className="text-sm text-text-muted">{match.separator}</span>
          <span className={TEXT_TONE[match.scoreTones[1]]}>{match.score[1]}</span>
        </div>
        <RadarTeamBlock team={match.away} align="end" />
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
