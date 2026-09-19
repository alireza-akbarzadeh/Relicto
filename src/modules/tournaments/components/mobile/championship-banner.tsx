import { Dot, PingDot } from "@/components/ui/dot";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TEXT_TONE } from "../../lib/tones";
import type { Championship } from "../../mobile.types";

export function ChampionshipBanner({ data }: { data: Championship }) {
  return (
    <div className="px-margin pt-2 pb-4">
      <div className="relative overflow-hidden rounded-xl bg-linear-to-b/srgb from-surface-card to-surface-container-low p-4 shadow-xl">
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-48 w-48 rounded-full bg-linear-to-tr/srgb from-primary to-tertiary opacity-20 blur-2xl" />

        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest/80 px-2.5 py-1 backdrop-blur-md">
            <Icon name={data.badge.icon} className="text-[15px] text-tertiary" />
            <span className="font-label-badge text-label-badge tracking-wider text-text-primary uppercase">
              {data.badge.label}
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-status-live/15 px-2 py-0.5 text-status-live">
            <PingDot sizeClassName="h-1.5 w-1.5" colorClassName="bg-status-live" />
            <span className="font-label-badge text-label-badge font-semibold tracking-widest uppercase">
              {data.status}
            </span>
          </div>
        </div>

        <h1 className="font-headline-xl-mobile text-headline-xl-mobile leading-tight font-bold tracking-tight text-text-primary uppercase">
          {data.title}{" "}
          <span className="bg-linear-to-r/srgb from-primary via-tertiary to-primary-fixed bg-clip-text text-transparent">
            {data.highlight}
          </span>
        </h1>
        <p className="mt-1 max-w-[280px] font-body-sm text-body-sm text-text-secondary">{data.description}</p>

        <dl className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-surface-deep/80 px-3 py-2.5 backdrop-blur-xs">
          {data.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">{stat.label}</dt>
              <dd
                className={cn(
                  "font-data-mono-md text-data-mono-md",
                  stat.emphasis === "strong" ? "font-bold tracking-tight" : "font-semibold",
                  TEXT_TONE[stat.tone],
                )}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-label-caps text-label-caps text-on-primary uppercase shadow-[0_0_18px_rgba(244,63,94,0.4)] transition-transform active:scale-[0.98]"
          >
            <Icon name={data.primaryAction.icon} className="text-[18px]" />
            <span>{data.primaryAction.label}</span>
          </button>
          <button
            type="button"
            className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-surface-container-high px-3 font-label-caps text-label-caps text-text-primary transition-all active:scale-[0.98]"
          >
            <Dot className="h-2 w-2 bg-status-live" animation="pulse" />
            <Icon name={data.secondaryAction.icon} className="text-[18px] text-text-secondary" />
            <span>{data.secondaryAction.label}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
