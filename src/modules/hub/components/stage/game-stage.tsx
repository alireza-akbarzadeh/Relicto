"use client";

import type { ReactNode } from "react";
import { useQueryState } from "nuqs";
import { hubSearchParams } from "../../lib/search-params";
import type { GameId, GameTab, HubPulse, Spotlight } from "../../types";
import { SpotlightHero } from "../spotlight/spotlight-hero";
import { GameSwitcher } from "./game-switcher";
import { HubSubbar } from "./hub-subbar";

type GameStageProps = {
  pulse: HubPulse;
  games: GameTab[];
  spotlights: Record<GameId, Spotlight>;
  /** Sections rendered below the spotlight. */
  children: ReactNode;
};

/** Owns the selected game: the sub-bar switcher drives the spotlight. */
export function GameStage({ pulse, games, spotlights, children }: GameStageProps) {
  const [game, setGame] = useQueryState("game", hubSearchParams.game.withOptions({ history: "replace", clearOnDefault: true }));
  return (
    <>
      <HubSubbar pulse={pulse} switcher={<GameSwitcher games={games} value={game} onChange={(next) => void setGame(next)} />} />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-8">
        <SpotlightHero spotlight={spotlights[game]} />
        {children}
      </div>
    </>
  );
}
