"use client";

import { useFeaturedGame } from "../../../hooks/selection";
import type { HeroEvent } from "../../../types";
import { HeroBanner } from "./hero-banner";
import { HeroTabs } from "./hero-tabs";
import { HeroTelemetry } from "./hero-telemetry";

type HeroShowcaseProps = {
  events: HeroEvent[];
  telemetry: Parameters<typeof HeroTelemetry>[0]["telemetry"];
};

/** Game switcher + the featured championship banner for the selected game. */
export function HeroShowcase({ events, telemetry }: HeroShowcaseProps) {
  const { value: game, select } = useFeaturedGame();
  const event = events.find((e) => e.game === game) ?? events[0];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-space-md">
        <HeroTabs events={events} active={event.game} onSelect={select} />
        <HeroTelemetry telemetry={telemetry} />
      </div>
      <HeroBanner key={event.game} event={event} />
    </>
  );
}
