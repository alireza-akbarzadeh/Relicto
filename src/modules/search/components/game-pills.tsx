"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import type { SearchGame, SearchResults } from "../types";

const GAMES: { id: Exclude<SearchGame, "all">; label: string; dot: string }[] =
  [
    { id: "dota2", label: "Dota 2", dot: "bg-status-live" },
    { id: "cs2", label: "Counter-Strike 2", dot: "bg-tertiary" },
    { id: "tf2", label: "Team Fortress 2", dot: "bg-secondary" },
  ];

const PILL =
  "h-auto shrink-0 gap-1.5 rounded-full border-0 px-3 py-1.5 font-label-caps text-label-caps tracking-wider uppercase transition-all";

/** Which game to search, each pill carrying how many items match there. */
export function GamePills({
  game,
  counts,
  onSelect,
}: {
  game: SearchGame;
  counts: SearchResults["counts"] | undefined;
  onSelect: (game: SearchGame) => void;
}) {
  const all = game === "all";
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-nowrap select-none [scrollbar-width:none]">
      <Button
        variant={null}
        size={null}
        aria-pressed={all}
        onClick={() => onSelect("all")}
        className={cn(
          PILL,
          all
            ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            : "bg-surface-container text-text-secondary hover:bg-surface-container-high hover:text-text-primary",
        )}
      >
        <Icon name="apps" className="text-[15px]" />
        <span>All Games</span>
        {counts && (
          <span
            className={cn(
              "rounded-full px-1.5 font-label-badge text-[10px] leading-tight",
              all ? "bg-on-primary-container/20" : "text-text-muted",
            )}
          >
            {formatCount(counts.all)}
          </span>
        )}
      </Button>
      {GAMES.map((option) => {
        const selected = game === option.id;
        return (
          <Button
            key={option.id}
            variant={null}
            size={null}
            aria-pressed={selected}
            onClick={() => onSelect(option.id)}
            className={cn(
              PILL,
              selected
                ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                : "bg-surface-container text-text-secondary hover:bg-surface-container-high hover:text-text-primary",
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", option.dot)} />
            <span>{option.label}</span>
            {counts && (
              <span
                className={cn(
                  "font-label-badge text-[10px]",
                  selected ? "" : "text-text-muted",
                )}
              >
                {formatCount(counts[option.id])}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
