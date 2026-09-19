import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { GAME_THEME } from "../../../lib/game-theme";
import type { GameId, HeroEvent } from "../../../types";

type HeroTabsProps = {
  events: HeroEvent[];
  active: GameId;
  onSelect: (game: GameId) => void;
};

export function HeroTabs({ events, active, onSelect }: HeroTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Featured championship"
      className="flex items-center rounded-lg bg-surface-card p-1 shadow-md backdrop-blur-md"
    >
      {events.map(({ game, tab }) => {
        const isActive = game === active;
        return (
          <button
            key={game}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(game)}
            className={cn(
              "flex items-center gap-space-sm rounded px-space-md py-space-xs font-label-caps text-label-caps uppercase transition-all",
              isActive ? GAME_THEME[game].tabActive : "text-text-muted hover:text-text-primary",
            )}
          >
            <Icon name={tab.icon} className="text-[16px]" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
