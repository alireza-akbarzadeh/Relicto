"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { signedPct } from "../../lib/terminal-format";
import type { MarketQuote } from "../../market.types";

type MarketTickerProps = {
  quotes: MarketQuote[];
  /** Slugs whose floor just moved; they flash once. */
  moved: Set<string>;
  current?: string;
  onFocus: (slug: string) => void;
};

/**
 * Watched items first, then the most traded: each at its live Relicto floor
 * and how that floor sits against the secondary market (below it is good for buyers).
 */
export function MarketTicker({ quotes, moved, current, onFocus }: MarketTickerProps) {
  return (
    <section className="flex items-center gap-space-md overflow-hidden border-b border-white/6 bg-surface-deep px-gutter-desktop py-2.5">
      <span className="flex shrink-0 items-center gap-2 font-headline-sm text-xs font-bold tracking-wider text-text-primary uppercase">
        <span className="h-2 w-2 animate-ping rounded-full bg-status-live" />
        Synapse Ticker
      </span>
      <div className="flex min-w-0 items-center gap-space-xl overflow-x-auto whitespace-nowrap">
        {quotes.length === 0 && <span className="font-label-badge text-label-badge text-text-muted">Nothing listed in this market right now.</span>}
        {quotes.map((quote) => (
          <Button
            key={quote.slug}
            variant={null}
            size={null}
            onClick={() => onFocus(quote.slug)}
            aria-pressed={quote.slug === current}
            title={`${quote.name} — ${quote.listings} listed, ${quote.bids} bids${quote.secondary.source === "sim" ? " (market price simulated)" : ""}`}
            className={cn(
              "h-auto gap-2 rounded px-1.5 py-0.5 transition-colors duration-700 hover:bg-surface-container-high",
              quote.slug === current && "bg-surface-container-high ring-1 ring-primary/30",
              moved.has(quote.slug) && "bg-tertiary/15",
            )}
          >
            <span className="font-label-badge text-label-badge text-text-muted">{quote.name}</span>
            <span className="font-data-mono-md text-data-mono-md text-text-primary">{formatMoney(quote.floorUsd)}</span>
            {quote.vsMarketPct !== null && (
              <span
                className={cn(
                  "rounded bg-surface-container-high px-1 py-0.5 font-label-badge text-[10px] font-bold tabular-nums",
                  quote.vsMarketPct <= 0 ? "text-status-upcoming" : "text-primary",
                )}
              >
                {signedPct(quote.vsMarketPct)}
              </span>
            )}
          </Button>
        ))}
      </div>
    </section>
  );
}
