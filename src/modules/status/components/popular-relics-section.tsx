import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { POPULAR_RELICS, type PopularRelic } from "../data/status.mock";

const TONE: Record<PopularRelic["tone"], { tag: string; hover: string }> = {
  crimson: { tag: "text-primary", hover: "group-hover:text-primary" },
  indigo: { tag: "text-secondary", hover: "group-hover:text-secondary" },
  amber: { tag: "text-tertiary", hover: "group-hover:text-tertiary" },
  cyan: { tag: "text-status-upcoming", hover: "group-hover:text-status-upcoming" },
};

function RelicCard({ relic }: { relic: PopularRelic }) {
  const tone = TONE[relic.tone];
  return (
    <LinkButton
      href={`/items/${relic.slug}`}
      className="group flex h-auto flex-col justify-between rounded-xl border-0 bg-surface-card p-space-md text-left whitespace-normal shadow-md transition-all hover:bg-surface-container-high"
    >
      <span className="flex w-full items-start justify-between gap-2">
        <span className={cn("rounded bg-surface-deep px-space-xs py-0.5 font-data-mono-md text-label-badge uppercase", tone.tag)}>{relic.kicker}</span>
        <Icon name="open_in_new" className={cn("text-[20px] text-text-muted transition-colors", tone.hover)} />
      </span>
      <span className="my-space-md block w-full">
        <span className={cn("block truncate font-headline-sm text-headline-sm text-text-primary transition-colors", tone.hover)}>{relic.name}</span>
        <span className="block font-body-sm text-body-sm text-text-muted">{relic.detail}</span>
      </span>
      <span className="flex w-full items-baseline justify-between pt-space-xs">
        <span className="font-data-mono-md text-label-badge text-text-secondary">FLOOR</span>
        <span className="font-data-mono-lg text-data-mono-lg font-bold text-tertiary">{formatMoney(relic.floorUsd)}</span>
      </span>
    </LinkButton>
  );
}

export function PopularRelicsSection() {
  return (
    <div className="mt-space-xl flex w-full flex-col items-center pt-space-md">
      <div className="mb-space-md flex w-full items-center justify-between px-2">
        <div className="flex items-center gap-space-sm">
          <Icon name="local_fire_department" className="text-tertiary" />
          <span className="font-headline-sm text-headline-sm text-text-primary">Popular Liquid Relics &amp; Flooring Assets</span>
        </div>
        <span className="hidden font-data-mono-md text-label-badge text-text-muted sm:inline-block">REAL-TIME TIER 1 SPREAD</span>
      </div>
      <div className="grid w-full grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
        {POPULAR_RELICS.map((relic) => (
          <RelicCard key={relic.slug} relic={relic} />
        ))}
      </div>
    </div>
  );
}
