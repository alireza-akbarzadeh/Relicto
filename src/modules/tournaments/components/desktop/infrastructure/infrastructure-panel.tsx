import { Dot } from "@/components/ui/dot";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { DOT_TONE } from "../../../lib/tones";
import type { Infrastructure } from "../../../types";
import { DiagnosticsCard } from "./diagnostics-card";

/** Closing section: platform pitch on the left, bot diagnostics on the right. */
export function InfrastructurePanel({ data }: { data: Infrastructure }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-surface-card p-space-lg shadow-2xl lg:p-space-xl">
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
      <div className="relative z-10 flex flex-col items-start justify-between gap-space-xl lg:flex-row lg:items-center">
        <div className="flex max-w-2xl flex-col gap-space-sm">
          <div className="flex items-center gap-space-xs font-label-caps text-label-caps tracking-wider text-primary-container uppercase">
            <Icon name={data.kicker.icon} className="text-[18px]" />
            {data.kicker.label}
          </div>
          <h2 className="font-headline-xl text-headline-xl leading-none tracking-tight text-text-primary uppercase">
            {data.title}
          </h2>
          <p className="font-body-md text-body-md text-text-secondary">{data.description}</p>
          <ul className="flex flex-wrap items-center gap-space-md pt-space-xs">
            {data.features.map((feature) => (
              <li key={feature.label} className="flex items-center gap-2">
                <Dot className={cn("h-2 w-2", DOT_TONE[feature.tone])} />
                <span className="font-label-caps text-label-caps text-text-primary uppercase">{feature.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <DiagnosticsCard diagnostics={data.diagnostics} />
      </div>
    </section>
  );
}
