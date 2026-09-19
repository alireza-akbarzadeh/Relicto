import { ChartLine, Gem } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { SPOTLIGHT_BADGE, TONE_TEXT } from "../../lib/tones";
import type { Spotlight, SpotlightMetric } from "../../types";
import { CorrelationChart } from "./correlation-chart";

function MetricTile({ metric }: { metric: SpotlightMetric }) {
  return (
    <div className="flex flex-col rounded-lg border border-border-dark bg-surface p-3">
      <span className="font-mono text-[9px] text-text-muted uppercase">{metric.label}</span>
      <span className={cn("mt-0.5 font-mono text-lg font-bold", TONE_TEXT[metric.valueTone])}>{metric.value}</span>
      <span className={cn("text-[11px]", TONE_TEXT[metric.noteTone], metric.strong && "font-medium")}>{metric.note}</span>
    </div>
  );
}

/** Tournament meta story for the selected game, next to its market correlation chart. */
export function SpotlightHero({ spotlight }: { spotlight: Spotlight }) {
  const { badges, title, summary, metrics, primaryCta, secondaryCta, chart } = spotlight;
  return (
    <section className="relative w-full overflow-hidden rounded-xl border border-border-dark bg-surface-card p-6 shadow-2xl lg:p-8">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            {badges.map((badge) => (
              <span key={badge.label} className={cn("rounded px-2.5 py-1 font-mono text-[10px] uppercase", SPOTLIGHT_BADGE[badge.variant])}>
                {badge.label}
              </span>
            ))}
          </div>
          <h2 className="text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl sm:leading-9 lg:text-4xl lg:leading-10">
            {title.lead}
            <span className="text-primary underline decoration-primary/40 underline-offset-4">{title.highlight}</span>
            {title.tail}
          </h2>
          <p className="text-sm leading-relaxed text-text-secondary sm:text-base sm:leading-6">{summary}</p>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {metrics.map((metric) => (
              <MetricTile key={metric.label} metric={metric} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <LinkButton
              href={primaryCta.href}
              className="gap-2 rounded-md border-0 bg-primary px-5 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:bg-rose-600"
            >
              <Gem className="size-4" />
              {primaryCta.label}
            </LinkButton>
            <LinkButton
              href={secondaryCta.href}
              className="gap-2 rounded-md border-surface-bright bg-surface-container-high px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-surface-container-highest"
            >
              <ChartLine className="size-4 text-text-secondary" />
              {secondaryCta.label}
            </LinkButton>
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:col-span-5">
          <CorrelationChart chart={chart} />
        </div>
      </div>
    </section>
  );
}
