"use client";

import { useGameFilter } from "../../../hooks/use-game-filter";
import type { ArenaCard as ArenaCardData, FilterChip, GameFilter } from "../../../types";
import { ArenaCard } from "./arena-card";
import { ArenaSectionHeader } from "./arena-section-header";
import { ArenaToolbar } from "./arena-toolbar";

type ArenaDiscoveryProps = {
  section: Parameters<typeof ArenaSectionHeader>[0]["section"];
  filters: readonly { value: GameFilter; label: string }[];
  chips: FilterChip[];
  cards: ArenaCardData[];
};

/** "Active Arenas": header, circuit filter and the tournament card grid. */
export function ArenaDiscovery({ section, filters, chips, cards }: ArenaDiscoveryProps) {
  const { filter, setFilter, visible } = useGameFilter(cards);

  return (
    <section className="flex flex-col gap-space-lg" aria-labelledby="active-arenas">
      <div className="flex flex-col gap-space-md">
        <ArenaSectionHeader section={section} />
        <ArenaToolbar filters={filters} active={filter} onChange={setFilter} chips={chips} />
      </div>
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-4">
        {visible.map((card) => (
          <ArenaCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
