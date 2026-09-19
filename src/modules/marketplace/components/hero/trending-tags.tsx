"use client";

import { cn } from "@/lib/cn";
import { TRENDING_TAGS } from "../../data/facets.mock";
import { scrollToListings } from "../../lib/scroll";
import { useMarketplace } from "../../state/marketplace-provider";

/** Hot search shortcuts: each one runs a marketplace query. */
export function TrendingTags() {
  const { patch } = useMarketplace();

  return (
    <div className="flex flex-wrap items-center justify-center gap-space-xs font-body-sm text-body-sm text-text-muted">
      <span className="mr-1 font-label-badge text-label-badge tracking-wider text-text-secondary uppercase">Trending Hot:</span>
      {TRENDING_TAGS.map((tag) => (
        <button
          key={tag.label}
          type="button"
          onClick={() => {
            patch({ query: tag.query });
            scrollToListings();
          }}
          className={cn(
            "rounded bg-surface-container-low px-2 py-1 text-text-secondary transition-colors hover:bg-surface-container",
            tag.hover,
          )}
        >
          {tag.emoji} {tag.label}
        </button>
      ))}
    </div>
  );
}
