"use client";

import { useQueryState } from "nuqs";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { hubMobileSearchParams } from "../../lib/mobile-search-params";
import type { ArenaMatch, ArenaTeam } from "../../mobile.types";
import { PredictSheet } from "./predict-sheet";

function Team({ team, align }: { team: ArenaTeam; align: "start" | "end" }) {
  const end = align === "end";
  const crest = (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-lowest font-headline-sm text-headline-sm text-text-primary shadow-inner">
      <Icon name={team.icon} className={cn("text-[22px]", end ? "text-secondary" : "text-primary")} />
    </div>
  );
  return (
    <div className={cn("flex w-5/12 flex-col gap-1", end ? "items-end text-right" : "items-start")}>
      <div className={cn("flex items-center gap-2", end && "justify-end")}>
        {!end && crest}
        <div className="min-w-0">
          <p className="truncate font-headline-sm text-headline-sm text-text-primary">{team.name}</p>
          <span className={cn("font-label-badge text-label-badge font-bold", end ? "text-tertiary" : "text-emerald-400")}>{team.odds}</span>
        </div>
        {end && crest}
      </div>
      <div className="flex items-center gap-1 font-label-badge text-label-badge text-text-secondary">
        {!end && <span className="h-2 w-2 rounded-xs bg-primary-container" />}
        <span>{team.side}</span>
        {end && <span className="h-2 w-2 rounded-xs bg-secondary" />}
      </div>
    </div>
  );
}

/** Featured live match of the selected tournament: teams, score, win odds and the predict flow. */
export function ArenaCard({ matches }: { matches: ArenaMatch[] }) {
  const [event] = useQueryState("event", hubMobileSearchParams.event);
  const match = matches.find((entry) => entry.event === event) ?? matches[0];

  return (
    <div className="px-margin">
      {/* pt-7: the export's space-y-3 also offsets the first row below the two absolute glows. */}
      <div className="relative flex flex-col gap-3 overflow-hidden rounded-xl bg-surface-card p-4 pt-7 shadow-xl">
        <div className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-primary-container/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-secondary-container/15 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded bg-surface-dim px-2 py-0.5 font-label-badge text-label-badge tracking-wider text-secondary uppercase">{match.badge}</span>
            <div className="flex items-center gap-1 rounded-full bg-status-live/15 px-2 py-0.5 font-label-badge text-label-badge text-error">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-status-live" />
              <span>{match.clock}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded bg-surface-container px-2 py-0.5 font-data-mono-md text-label-caps text-tertiary">
            <Icon name="videocam" className="text-[14px]" />
            <span>{match.viewers}</span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between py-1">
          <Team team={match.teams[0]} align="start" />
          <div className="flex shrink-0 flex-col items-center justify-center px-2">
            <div className="flex items-center gap-1.5 font-data-mono-lg text-data-mono-lg tracking-tight text-text-primary">
              <span className="text-primary-container">{match.score[0]}</span>
              <span className="text-text-muted">:</span>
              <span className="text-secondary">{match.score[1]}</span>
            </div>
            <span className="mt-0.5 font-label-caps text-label-caps tracking-widest text-tertiary uppercase">{match.stage}</span>
          </div>
          <Team team={match.teams[1]} align="end" />
        </div>

        <div className="relative z-10 flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between font-label-badge text-label-badge text-text-muted">
            <span>
              AI Win Prob: {match.shortNames[0]} {match.winPct}%
            </span>
            <span>
              {match.shortNames[1]} {100 - match.winPct}%
            </span>
          </div>
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface-container-lowest">
            <div className="h-full bg-primary-container transition-all duration-500" style={{ width: `${match.winPct}%` }} />
            <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${100 - match.winPct}%` }} />
          </div>
        </div>

        <div className="relative z-10 flex gap-2 pt-2">
          <PredictSheet match={match} />
          <LinkButton
            href="/tournaments"
            aria-label="Live match stream"
            className="h-11 w-11 rounded-lg border-0 bg-surface-container-high text-on-surface shadow-md transition-all hover:text-text-primary active:scale-95"
          >
            <Icon name="play_circle" className="text-[22px] text-error" />
          </LinkButton>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-1 text-center font-label-badge text-label-badge text-tertiary">
          <Icon name="auto_awesome" className="text-[14px]" />
          <span>{match.reward}</span>
        </div>
      </div>
    </div>
  );
}
