"use client";

import { Icon } from "@/components/ui/icon";
import { useSearchPalette } from "../hooks/use-search-palette";
import { EntityResults } from "./entity-results";
import { GamePills } from "./game-pills";
import { ItemResult } from "./item-result";
import { RecentSearches } from "./recent-searches";
import { SearchField } from "./search-field";
import { SearchFooter } from "./search-footer";
import { TuningChips } from "./tuning-chips";

/** Everything inside the palette. Keyed per opening by the dialog, so each one starts clean. */
export function PaletteBody({
  initialQuery,
  onClose,
}: {
  initialQuery: string;
  onClose: () => void;
}) {
  const close = onClose;
  const palette = useSearchPalette(initialQuery, close);
  const { criteria, update, results, items, active } = palette;
  const typed = criteria.q.trim().length > 0;

  return (
    <>
      <div className="flex shrink-0 flex-col gap-space-md bg-surface-deep/90 p-space-md pb-space-sm md:p-space-lg md:pb-space-sm">
        <SearchField
          value={criteria.q}
          loading={palette.loading}
          onChange={(q) => update({ q })}
          onKeyDown={palette.onKeyDown}
          onClose={close}
        />
        <GamePills
          game={criteria.game}
          counts={results?.counts}
          onSelect={(game) => update({ game })}
        />
        <TuningChips criteria={criteria} onChange={update} />
      </div>

      <div
        role="listbox"
        aria-label="Search results"
        className="min-h-0 flex-1 space-y-space-md overflow-y-auto px-space-md py-space-md md:px-space-lg"
      >
        {!typed && (
          <RecentSearches
            entries={palette.recents.entries}
            onPick={(q) => update({ q })}
            onClear={palette.recents.clear}
          />
        )}

        <div className="space-y-space-sm">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Icon
                name={typed ? "local_fire_department" : "trending_up"}
                className="text-[18px] text-primary"
              />
              <span className="font-label-caps text-label-caps tracking-wider text-text-primary uppercase">
                {typed ? "Instant Item Matches" : "Moving Right Now"}
              </span>
              {results && (
                <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-data-mono-md text-[11px] text-primary">
                  {items.length} matches
                </span>
              )}
            </div>
            <span className="font-data-mono-md text-[12px] text-text-muted">
              {typed ? "Sort: Highest Liquidity" : "Sort: Biggest 24h Move"}
            </span>
          </div>
          {items.map((item, index) => (
            <ItemResult
              key={item.slug}
              item={item}
              active={index === active}
              onHover={() => palette.setActive(index)}
              onOpen={() => palette.openItem(item)}
              onBasket={() => palette.basket(item)}
            />
          ))}
          {results && items.length === 0 && (
            <div className="rounded-lg bg-surface-deep/60 px-space-md py-space-lg text-center font-body-sm text-body-sm text-text-muted">
              {palette.failed
                ? "Search is unreachable right now. Try again in a moment."
                : `Nothing on the market matches “${criteria.q}”. Press Enter to search the full marketplace.`}
            </div>
          )}
        </div>

        {results && (
          <EntityResults
            traders={results.traders}
            tournaments={results.tournaments}
            onNavigate={close}
          />
        )}
      </div>

      <SearchFooter
        tookMs={results?.tookMs ?? null}
        results={
          items.length +
          (results?.traders.length ?? 0) +
          (results?.tournaments.length ?? 0)
        }
      />
    </>
  );
}
