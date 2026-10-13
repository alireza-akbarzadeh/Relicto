import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export const WIKI_FILTERS = [
  "All Universes",
  "CS2 Weapon Finishes",
  "Case Hardened Seeds",
  "CS2 Doppler Spectrum",
  "Dota 2 Arcanas & Personas",
  "Prismatic & Ethereal Gems",
];

export function WikiSearch({
  query,
  setQuery,
  filter,
  setFilter,
}: {
  query: string;
  setQuery: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
}) {
  return (
    <section className="px-margin-desktop py-space-sm">
      <div className="mx-auto max-w-7xl rounded-xl bg-surface-card p-space-md shadow-xl">
        <div className="flex items-center rounded bg-surface-container-lowest px-space-md">
          <Icon name="search" className="mr-space-sm text-[22px] text-text-muted" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search patterns, float formulas, Doppler phases, Dota 2 prismatic gems, souvenir history..."
            aria-label="Search wiki"
            className="h-auto border-0 bg-transparent py-space-md text-text-primary focus-visible:ring-0"
          />
          <span className="rounded bg-surface-container-high px-2 py-0.5 font-data-mono-md text-[11px] text-text-muted">
            ⌘K
          </span>
        </div>
        <div className="mt-space-md flex gap-space-xs overflow-x-auto pb-1">
          {WIKI_FILTERS.map((item) => (
            <Button
              key={item}
              variant={null}
              size={null}
              onClick={() => setFilter(item)}
              className={cn(
                "h-auto shrink-0 rounded px-space-md py-space-xs font-headline-sm text-[12px] uppercase",
                filter === item
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest",
              )}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-space-sm">
        <span className="h-6 w-2.5 rounded-sm bg-primary-container" />
        <h2 className="font-headline-lg text-headline-lg tracking-tight text-text-primary">
          {title}
        </h2>
      </div>
      <span className="font-label-badge text-label-badge text-text-muted uppercase">
        Sorting: <b className="text-primary">Impact Rank</b>
      </span>
    </div>
  );
}
