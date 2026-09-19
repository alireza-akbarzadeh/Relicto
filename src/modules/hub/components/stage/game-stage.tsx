"use client";

import { useState, type ReactNode } from "react";
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
  const [game, setGame] = useState<GameId>(games[0].id);
  return (
    <>
      <HubSubbar pulse={pulse} switcher={<GameSwitcher games={games} value={game} onChange={setGame} />} />
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-8">
        <SpotlightHero spotlight={spotlights[game]} />
        {children}
      </div>
    </>
  );
}
