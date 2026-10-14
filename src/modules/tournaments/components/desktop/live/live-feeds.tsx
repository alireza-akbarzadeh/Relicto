"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { FeedMatch } from "../../../types";
import { MatchDetailModal } from "../../shared/match-detail-modal";
import { FeedMatchCard } from "./feed-match-card";

type StatusTab = "all" | "live" | "scheduled" | "completed";
type GameTab = "all" | "dota2" | "cs2";

export function LiveFeeds({ matches }: { matches: FeedMatch[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusTab>("all");
  const [gameFilter, setGameFilter] = useState<GameTab>("all");
  const [selectedMatch, setSelectedMatch] = useState<FeedMatch | null>(null);

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      // Game filter
      if (gameFilter !== "all") {
        const isDota = m.game === "dota2" || m.label.includes("DOTA");
        if (gameFilter === "dota2" && !isDota) return false;
        if (gameFilter === "cs2" && isDota) return false;
      }

      // Status filter
      if (statusFilter === "all") return true;
      if (statusFilter === "live") return m.statusKind === "live" || (m.state.tone === "live" && !m.pending);
      if (statusFilter === "scheduled") return m.statusKind === "scheduled" || m.pending;
      if (statusFilter === "completed") return m.statusKind === "completed" || m.state.label.includes("FINAL");
      return true;
    });
  }, [matches, statusFilter, gameFilter]);

  const liveCount = matches.filter((m) => m.statusKind === "live" || (m.state.tone === "live" && !m.pending)).length;

  return (
    <div id="live-matches" className="flex scroll-mt-24 flex-col gap-space-md lg:col-span-5">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-headline-sm text-headline-sm tracking-wide text-text-primary uppercase">
              Championship Matches
            </h2>
            <span className="flex items-center gap-1 rounded bg-status-live/15 px-2 py-0.5 font-label-badge text-[10px] text-status-live font-bold uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-live" />
              {liveCount} Live
            </span>
          </div>
          <span className="font-data-mono-md text-xs text-text-muted">
            {filteredMatches.length} of {matches.length} matches
          </span>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-surface-container-low p-1">
            <Button
              variant={null}
              size={null}
              type="button"
              onClick={() => setStatusFilter("all")}
              className={cn(
                "rounded px-2.5 py-1 font-label-badge text-[11px] uppercase transition-colors",
                statusFilter === "all" ? "bg-surface-container-high text-text-primary font-bold shadow-xs" : "text-text-muted hover:text-text-primary",
              )}
            >
              All
            </Button>
            <Button
              variant={null}
              size={null}
              type="button"
              onClick={() => setStatusFilter("live")}
              className={cn(
                "rounded px-2.5 py-1 font-label-badge text-[11px] uppercase transition-colors flex items-center gap-1",
                statusFilter === "live" ? "bg-surface-container-high text-primary font-bold shadow-xs" : "text-text-muted hover:text-text-primary",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-status-live" />
              Live
            </Button>
            <Button
              variant={null}
              size={null}
              type="button"
              onClick={() => setStatusFilter("scheduled")}
              className={cn(
                "rounded px-2.5 py-1 font-label-badge text-[11px] uppercase transition-colors",
                statusFilter === "scheduled" ? "bg-surface-container-high text-text-primary font-bold shadow-xs" : "text-text-muted hover:text-text-primary",
              )}
            >
              Upcoming
            </Button>
            <Button
              variant={null}
              size={null}
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={cn(
                "rounded px-2.5 py-1 font-label-badge text-[11px] uppercase transition-colors",
                statusFilter === "completed" ? "bg-surface-container-high text-text-primary font-bold shadow-xs" : "text-text-muted hover:text-text-primary",
              )}
            >
              Results
            </Button>
          </div>

          {/* Game Pills */}
          <div className="flex items-center gap-1">
            <Button
              variant={null}
              size={null}
              type="button"
              onClick={() => setGameFilter(gameFilter === "dota2" ? "all" : "dota2")}
              className={cn(
                "rounded-full px-2.5 py-0.5 font-label-badge text-[10px] uppercase transition-colors border",
                gameFilter === "dota2" ? "border-primary bg-primary/10 text-primary font-bold" : "border-white/10 text-text-muted hover:text-text-secondary",
              )}
            >
              DOTA 2
            </Button>
            <Button
              variant={null}
              size={null}
              type="button"
              onClick={() => setGameFilter(gameFilter === "cs2" ? "all" : "cs2")}
              className={cn(
                "rounded-full px-2.5 py-0.5 font-label-badge text-[10px] uppercase transition-colors border",
                gameFilter === "cs2" ? "border-tertiary bg-tertiary/10 text-tertiary font-bold" : "border-white/10 text-text-muted hover:text-text-secondary",
              )}
            >
              CS2
            </Button>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="flex flex-col gap-space-sm">
        {filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-surface-card p-8 text-center text-text-muted gap-2">
            <Icon name="sports_esports" className="text-2xl text-text-muted opacity-60" />
            <span className="font-headline-sm text-sm text-text-secondary">No matches found for selected filter</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setGameFilter("all");
              }}
              className="mt-1 border-white/10 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <FeedMatchCard
              key={match.id}
              match={match}
              onSelect={() => setSelectedMatch(match)}
            />
          ))
        )}
      </div>

      <MatchDetailModal
        match={selectedMatch}
        open={!!selectedMatch}
        onOpenChange={(open) => !open && setSelectedMatch(null)}
      />
    </div>
  );
}
