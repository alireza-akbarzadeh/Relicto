"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PingDot } from "@/components/ui/dot";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { RadarMatch } from "../../../mobile.types";
import type { FeedMatch } from "../../../types";
import { MatchDetailModal } from "../../shared/match-detail-modal";
import { SectionHeading } from "../section-heading";
import { RadarMatchCard } from "./radar-match-card";

type RadarFeedProps = { section: { title: string; meta: string }; matches: RadarMatch[] };

type StatusTab = "all" | "live" | "upcoming" | "completed";
type GameFilter = "all" | "dota2" | "cs2";

function radarToFeedMatch(m: RadarMatch): FeedMatch {
  return {
    id: m.id,
    label: m.label,
    labelTone: m.labelTone,
    state: { label: m.clock.label, tone: m.clock.tone, indicator: "ping" },
    teams: [
      {
        tag: m.home.tag,
        name: m.home.name,
        meta: m.home.meta,
        score: Number.parseInt(m.score[0], 10) || 0,
        scoreTone: m.scoreTones[0],
      },
      {
        tag: m.away.tag,
        name: m.away.name,
        meta: m.away.meta,
        score: Number.parseInt(m.score[1], 10) || 0,
        scoreTone: m.scoreTones[1],
      },
    ],
    tournamentName: m.tournamentName,
    game: m.game,
    statusKind: m.statusKind,
    map: m.map,
    predictionSplit: m.predictionSplit,
    casters: m.casters,
    goldLead: m.goldLead,
    userPick: m.userPick,
  };
}

export function RadarFeed({ section, matches }: RadarFeedProps) {
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [gameFilter, setGameFilter] = useState<GameFilter>("all");
  const [selectedMatch, setSelectedMatch] = useState<RadarMatch | null>(null);

  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      if (activeTab === "live" && m.statusKind !== "live") return false;
      if (activeTab === "upcoming" && m.statusKind !== "scheduled") return false;
      if (activeTab === "completed" && m.statusKind !== "completed") return false;
      if (gameFilter === "dota2" && m.game !== "dota2") return false;
      if (gameFilter === "cs2" && m.game !== "cs2") return false;
      return true;
    });
  }, [matches, activeTab, gameFilter]);

  const counts = useMemo(
    () => ({
      all: matches.length,
      live: matches.filter((m) => m.statusKind === "live").length,
      upcoming: matches.filter((m) => m.statusKind === "scheduled").length,
      completed: matches.filter((m) => m.statusKind === "completed").length,
    }),
    [matches],
  );

  return (
    <section id="radar-feed" className="scroll-mt-20">
      <SectionHeading
        className="px-margin pt-6 pb-2"
        leading={<PingDot sizeClassName="h-2 w-2" colorClassName="bg-status-live" />}
        title={section.title}
        meta={<span className="font-label-badge text-label-badge text-text-muted uppercase">{section.meta}</span>}
      />

      {/* Filter Tabs and Game Chips */}
      <div className="flex flex-col gap-2 px-margin pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(
            [
              { id: "all", label: `All (${counts.all})` },
              { id: "live", label: `Live (${counts.live})` },
              { id: "upcoming", label: `Upcoming (${counts.upcoming})` },
              { id: "completed", label: `Results (${counts.completed})` },
            ] as const
          ).map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant={null}
              size={null}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "h-auto whitespace-nowrap rounded-full px-3 py-1 font-label-caps text-xs transition-colors",
                activeTab === tab.id
                  ? "bg-surface-container-highest text-primary font-bold shadow-xs"
                  : "bg-surface-container-low text-text-muted hover:text-text-primary",
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {(
            [
              { id: "all", label: "All Games" },
              { id: "dota2", label: "Dota 2" },
              { id: "cs2", label: "CS2" },
            ] as const
          ).map((g) => (
            <Button
              key={g.id}
              type="button"
              variant={null}
              size={null}
              onClick={() => setGameFilter(g.id)}
              className={cn(
                "h-auto rounded-md px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                gameFilter === g.id
                  ? "bg-primary/20 text-primary border border-primary/40 font-semibold"
                  : "bg-surface-container-low/60 text-text-secondary border border-transparent",
              )}
            >
              {g.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-margin">
        {filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-surface-card p-6 text-center text-text-muted">
            <Icon name="sports_kabaddi" className="text-2xl text-text-secondary mb-1" />
            <span className="font-label-caps text-xs">No matches found for current filter</span>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <RadarMatchCard key={match.id} match={match} onSelect={() => setSelectedMatch(match)} />
          ))
        )}
      </div>

      <MatchDetailModal
        match={selectedMatch ? radarToFeedMatch(selectedMatch) : null}
        open={Boolean(selectedMatch)}
        onOpenChange={(open) => !open && setSelectedMatch(null)}
      />
    </section>
  );
}
