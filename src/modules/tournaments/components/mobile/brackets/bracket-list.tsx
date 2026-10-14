"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useMobileGameFilter } from "../../../hooks/selection";
import { filterByGame } from "../../../lib/filter";
import type { BracketCardData, QuickMatchData } from "../../../mobile.types";
import type { ArenaCard } from "../../../types";
import { TournamentBracketModal } from "../../shared/tournament-bracket-modal";
import { SectionHeading } from "../section-heading";
import { BracketCard } from "./bracket-card";
import { QuickMatchCard } from "./quick-match-card";

type BracketListProps = {
  section: { title: string; meta: string };
  cards: BracketCardData[];
  quickMatch: QuickMatchData;
};

function toArenaCard(card: BracketCardData): ArenaCard {
  return {
    id: card.id,
    game: card.game,
    gameLabel: card.tag.split(" • ")[0] ?? card.game.toUpperCase(),
    accent: card.game === "cs2" ? "tertiary" : "primary",
    status: { label: "UPCOMING", kind: "upcoming" },
    prizeUsd: card.reward.usd,
    prizeEmphasis: "tertiary",
    format: card.tag.split(" • ")[1] ?? "Double Elimination",
    capacity: card.slots.capacity,
    title: card.title,
    description: card.subtitle.label,
    teams: { initials: card.crest.map((c) => c.icon), extra: card.extraTeams },
    perk: { icon: "military_tech", label: card.subtitle.label, tone: card.subtitle.tone },
    action: { label: card.action.label, icon: card.action.icon, emphasis: card.action.emphasis },
    image: card.image,
    imageAlt: card.imageAlt,
  };
}

/** "Premier Brackets": cards filtered by the game tabs at the top of the page. */
export function BracketList({ section, cards, quickMatch }: BracketListProps) {
  const { value: filter } = useMobileGameFilter();
  const [selectedCard, setSelectedCard] = useState<BracketCardData | null>(null);

  const visibleCards = filterByGame(cards, filter);
  const showQuickMatch = filterByGame([quickMatch], filter).length > 0;

  return (
    <section id="brackets" className="scroll-mt-20">
      <SectionHeading
        className="px-margin pt-5 pb-2"
        leading={<Icon name="trophy" className="text-[20px] text-primary" />}
        title={section.title}
        meta={<span className="font-label-badge text-label-badge text-tertiary uppercase">{section.meta}</span>}
      />
      <div className="flex flex-col gap-3.5 px-margin">
        {visibleCards.map((card, i) => (
          <BracketCard
            key={card.id}
            card={card}
            highPriorityImage={i === 0}
            onSelect={() => setSelectedCard(card)}
          />
        ))}
        {showQuickMatch && <QuickMatchCard match={quickMatch} />}
      </div>

      <TournamentBracketModal
        card={selectedCard ? toArenaCard(selectedCard) : null}
        open={Boolean(selectedCard)}
        onOpenChange={(open) => !open && setSelectedCard(null)}
      />
    </section>
  );
}
