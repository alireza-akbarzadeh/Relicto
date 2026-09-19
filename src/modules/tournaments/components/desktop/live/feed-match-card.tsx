import { Dot } from "@/components/ui/dot";
import { cn } from "@/lib/cn";
import { DOT_TONE, TEXT_TONE } from "../../../lib/tones";
import type { FeedMatch, FeedTeam } from "../../../types";

function FeedTeamRow({ team, pending }: { team: FeedTeam; pending?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg bg-surface-container-lowest p-space-sm",
        pending && "opacity-80",
      )}
    >
      <div className="flex items-center gap-space-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-surface-container-high font-label-caps text-label-caps font-bold text-text-primary">
          {team.tag}
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-body-md leading-tight text-text-primary">{team.name}</span>
          <span className="font-label-badge text-[10px] text-text-muted uppercase">{team.meta}</span>
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

export function FeedMatchCard({ match }: { match: FeedMatch }) {
  const { state } = match;
  return (
    <article className="flex flex-col gap-space-sm rounded-xl bg-surface-card p-space-md transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between font-label-badge text-label-badge text-text-muted">
        <span className={cn("font-bold", TEXT_TONE[match.labelTone])}>{match.label}</span>
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
        <FeedTeamRow key={team.tag} team={team} pending={match.pending} />
      ))}
    </article>
  );
}
