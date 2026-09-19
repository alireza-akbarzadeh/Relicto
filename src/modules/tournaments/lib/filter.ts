import type { GameFilter, GameId } from "../types";

export function filterByGame<T extends { game: GameId }>(items: T[], filter: GameFilter) {
  return filter === "all" ? items : items.filter((item) => item.game === filter);
}
