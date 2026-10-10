"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { ShowcaseItem } from "../../types";
import { SectionTitle } from "../shared/section-title";
import { ShowcaseCard } from "./showcase-card";

/** Tier-1 collectibles the trader features on their profile. */
export function ShowcaseSection({ items }: { items: ShowcaseItem[] }) {
  const [desc, setDesc] = useState(true);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => (desc ? b.priceUsd - a.priceUsd : a.priceUsd - b.priceUsd));
  }, [items, desc]);

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex flex-col justify-between gap-space-xs sm:flex-row sm:items-center">
        <SectionTitle
          tone="amber"
          title="Prized Collectibles Showcase"
          subtitle="Selected tier-1 weapons & immortal relics authenticated via Steam Web API."
        />
        <div className="flex items-center gap-space-xs self-start sm:self-auto">
          <span className="font-label-badge text-label-badge text-text-muted uppercase">
            SORT: {desc ? "HIGHEST VALUATION" : "LOWEST VALUATION"}
          </span>
          <button
            type="button"
            onClick={() => setDesc((prev) => !prev)}
            aria-label={`Toggle showcase sorting to ${desc ? "lowest" : "highest"}`}
            className="inline-flex cursor-pointer items-center justify-center rounded border-0 bg-surface-container p-1 text-text-muted transition-colors hover:text-text-primary focus-visible:outline-hidden"
          >
            <Icon name="tune" className="text-[18px]" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
        {sorted.map((item) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
