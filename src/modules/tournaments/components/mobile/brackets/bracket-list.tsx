"use client";

import { Icon } from "@/components/ui/icon";
import { useMobileGameFilter } from "../../../hooks/selection";
import { filterByGame } from "../../../lib/filter";
import type { BracketCardData, QuickMatchData } from "../../../mobile.types";
import { SectionHeading } from "../section-heading";
import { BracketCard } from "./bracket-card";
import { QuickMatchCard } from "./quick-match-card";

type BracketListProps = {
  section: { title: string; meta: string };
  cards: BracketCardData[];
  quickMatch: QuickMatchData;
};

/** "Premier Brackets": cards filtered by the game tabs at the top of the page. */
export function BracketList({ section, cards, quickMatch }: BracketListProps) {
  const { value: filter } = useMobileGameFilter();
  const visibleCards = filterByGame(cards, filter);
  const showQuickMatch = filterByGame([quickMatch], filter).length > 0;

  return (
    <section>
      <SectionHeading
        className="px-margin pt-5 pb-2"
        leading={<Icon name="trophy" className="text-[20px] text-primary" />}
        title={section.title}
        meta={<span className="font-label-badge text-label-badge text-tertiary uppercase">{section.meta}</span>}
      />
      <div className="flex flex-col gap-3.5 px-margin">
        {visibleCards.map((card, i) => (
          <BracketCard key={card.id} card={card} highPriorityImage={i === 0} />
        ))}
        {showQuickMatch && <QuickMatchCard match={quickMatch} />}
      </div>
    </section>
  );
}
