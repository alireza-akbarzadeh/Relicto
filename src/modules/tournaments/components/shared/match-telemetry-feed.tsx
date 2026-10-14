"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { getTelemetryForMatch, type MatchTelemetryEvent } from "../../data/match-telemetry.mock";

const TYPE_ICONS: Record<MatchTelemetryEvent["type"], { icon: string; className: string }> = {
  objective: { icon: "flag", className: "text-primary bg-primary/10 border-primary/20" },
  kill: { icon: "sports_kabaddi", className: "text-status-live bg-status-live/10 border-status-live/20" },
  clutch: { icon: "bolt", className: "text-tertiary bg-tertiary/10 border-tertiary/20" },
  economy: { icon: "monetization_on", className: "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20" },
};

export function MatchTelemetryFeed({ matchId, game }: { matchId: string; game?: string }) {
  const events = getTelemetryForMatch(matchId, game);

  return (
    <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
      <div className="flex items-center justify-between pb-1 border-b border-white/5">
        <span className="font-label-caps text-[11px] text-text-muted uppercase">
          Live Telemetry Timeline
        </span>
        <span className="flex items-center gap-1 font-label-badge text-[10px] text-status-live font-bold">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-status-live" />
          Steam API Synced (14ms)
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {events.map((ev) => {
          const cfg = TYPE_ICONS[ev.type];
          return (
            <div
              key={ev.id}
              className="flex items-start gap-2.5 rounded-lg bg-surface-container-lowest/80 p-2.5 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md border", cfg.className)}>
                <Icon name={cfg.icon as any} className="text-[14px]" />
              </div>

              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-xs font-bold text-text-primary truncate">
                    {ev.headline}
                  </span>
                  <span className="font-data-mono-md text-[10px] text-text-muted shrink-0 ml-2">
                    {ev.timestamp}
                  </span>
                </div>
                <p className="font-body-sm text-[11px] text-text-muted leading-tight">
                  {ev.detail}
                </p>
                {ev.teamTag && (
                  <span className="mt-1 inline-flex self-start rounded bg-surface-container-high px-1.5 py-0.5 font-label-caps text-[9px] text-text-secondary">
                    {ev.teamTag} Impact
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
