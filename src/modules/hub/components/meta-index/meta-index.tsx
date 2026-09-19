"use client";

import { Award } from "lucide-react";
import { useMetaIndex } from "../../hooks/use-meta-index";
import type { MetaCard } from "../../types";
import { SectionHeading } from "../shared/section-heading";
import { MetaCardView } from "./meta-card";
import { MetaToolbar } from "./meta-toolbar";

/** "Meta Cosmetic Index": tier-filtered, sortable grid of meta cosmetics. */
export function MetaIndex({ cards }: { cards: MetaCard[] }) {
  const { filter, setFilter, sort, setSort, visible } = useMetaIndex(cards);
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <SectionHeading icon={Award} tone="amber" eyebrow="TACTICAL WEAPON & HERO AUDIT" title="Meta Cosmetic Index" size="lg" tracking="widest" />
        <MetaToolbar filter={filter} onFilter={setFilter} sort={sort} onSort={setSort} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visible.map((card) => (
          <MetaCardView key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
