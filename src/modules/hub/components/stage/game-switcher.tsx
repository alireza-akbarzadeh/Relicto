"use client";

import { GitBranch, Shield, Swords, type LucideIcon } from "lucide-react";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { cn } from "@/lib/cn";
import { TONE_TEXT } from "../../lib/tones";
import type { GameId, GameTab } from "../../types";

const GLYPHS: Record<GameId, { icon: LucideIcon; className: string }> = {
  dota: { icon: Shield, className: "text-primary" },
  cs2: { icon: Swords, className: "text-status-upcoming" },
  cross: { icon: GitBranch, className: "text-secondary" },
};

function GameTabLabel({ game }: { game: GameTab }) {
  const { icon: Glyph, className } = GLYPHS[game.id];
  return (
    <>
      <Glyph className={cn("size-4 transition-transform group-hover:scale-110", className)} />
      <div className="flex flex-col items-start leading-tight">
        <span className="text-xs font-bold tracking-tight uppercase">{game.title}</span>
        <span className={cn("font-mono text-[9px] tracking-wider", TONE_TEXT[game.captionTone], game.live && "font-semibold")}>
          {game.caption}
        </span>
      </div>
      {game.live && <span className="ml-1 h-2 w-2 animate-ping rounded-full bg-status-live" />}
    </>
  );
}

type GameSwitcherProps = { games: GameTab[]; value: GameId; onChange: (game: GameId) => void };

/** Dota 2 / CS2 / cross-game switch that drives the spotlight. */
export function GameSwitcher({ games, value, onChange }: GameSwitcherProps) {
  return (
    <SegmentedTabs
      label="Game hub"
      value={value}
      onChange={onChange}
      tabs={games.map((game) => ({ value: game.id, content: <GameTabLabel game={game} /> }))}
      listClassName="w-auto rounded-lg border border-border-dark bg-surface-container-lowest p-1 shadow-inner"
      tabClassName="group flex-none gap-2.5 rounded-md border-0 px-4 py-2 font-normal text-text-muted hover:bg-surface-card hover:text-white data-active:border data-active:border-surface-bright data-active:bg-surface-container-high data-active:text-white group-data-[variant=default]/tabs-list:data-active:shadow-md"
    />
  );
}
