"use client";

import { Dot } from "@/components/ui/dot";
import { cn } from "@/lib/cn";
import { GAME_DOT } from "../../../lib/game-theme";
import { useFeaturedGame } from "../../../hooks/selection";
import type { DesktopShell } from "../../../shell.types";

const ACTIVE_GLOW = {
  dota2: "shadow-[0_0_12px_rgba(244,63,94,0.2)]",
  cs2: "shadow-[0_0_12px_rgba(245,158,11,0.2)]",
} as const;

/** Header-level game switch; drives the same featured game as the hero tabs. */
export function HeaderGamePills({ pills }: { pills: DesktopShell["gamePills"] }) {
  const { value: active, select } = useFeaturedGame();

  return (
    <div
      role="tablist"
      aria-label="Featured game"
      className="hidden items-center rounded-lg bg-surface-container-lowest p-space-xs xl:flex"
    >
      {pills.map(({ game, label }) => {
        const isActive = game === active;
        return (
          <button
            key={game}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => select(game)}
            className={cn(
              "flex items-center gap-space-xs rounded px-space-md py-space-xs font-label-caps text-label-caps uppercase transition-all",
              isActive
                ? cn("bg-surface-container-high text-text-primary", ACTIVE_GLOW[game])
                : "text-text-muted hover:text-on-surface",
            )}
          >
            <Dot className={cn("h-2 w-2", GAME_DOT[game])} animation={isActive ? "pulse" : undefined} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
