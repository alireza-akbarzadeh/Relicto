import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import type { MetaSpike } from "../../mobile.types";

/** Trending patch alert above the grid. */
export function MetaSpikeBanner({ spike }: { spike: MetaSpike }) {
  return (
    <section className="relative w-full overflow-hidden rounded-xl bg-surface-container p-3.5 shadow-md">
      <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-primary/10 blur-xl" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-container/20 text-primary-container shadow-inner">
            <Icon name="electric_bolt" className="text-[18px]" />
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">
              <span className="font-label-badge text-label-badge tracking-wider text-tertiary uppercase">{spike.kicker}</span>
              <span className="rounded bg-primary-container/20 px-1.5 font-data-mono-md text-[10px] font-bold text-primary-container">
                {spike.surge}
              </span>
            </div>
            <p className="mt-0.5 line-clamp-1 font-body-sm text-body-sm text-text-primary">{spike.headline}</p>
          </div>
        </div>
        <LinkButton
          href={spike.href}
          className="h-auto shrink-0 gap-0.5 rounded-lg border-0 bg-primary px-2.5 py-1 font-label-caps text-label-caps font-bold text-on-primary uppercase transition-transform active:scale-95"
        >
          <span>{spike.cta}</span>
          <Icon name="north_east" className="text-[14px]" />
        </LinkButton>
      </div>
    </section>
  );
}
