import { CircleCheck, Eye, ShoppingBag } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { OUTLINE_PILL, TONE_TEXT } from "../../lib/tones";
import type { Loadout } from "../../types";

const CTA = {
  buy: {
    icon: ShoppingBag,
    className: "border-0 bg-primary shadow-xs hover:bg-rose-600",
    iconClassName: "",
    href: () => "/checkout",
  },
  inspect: {
    icon: Eye,
    className: "border-surface-bright bg-surface-container-high hover:bg-surface-container-highest",
    iconClassName: "text-text-secondary",
    href: (l: Loadout) => `/marketplace?q=${encodeURIComponent(l.player)}`,
  },
} as const;

/** A pro player's championship loadout with its appraisal and a bundle action. */
export function LoadoutCard({ loadout }: { loadout: Loadout }) {
  const cta = CTA[loadout.cta.variant];
  const appraisal = loadout.items.reduce((sum, item) => sum + item.priceUsd, 0);
  return (
    <article className="flex flex-col justify-between rounded-xl border border-border-dark bg-surface-card p-5 shadow-xl sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-surface-bright bg-surface-container-high text-base font-bold text-white">
              {loadout.initials}
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-white">{loadout.player}</h3>
              <p className="text-xs text-text-muted">{loadout.role}</p>
            </div>
          </div>
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", OUTLINE_PILL[loadout.tag.tone])}>
            {loadout.tag.label}
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-surface-container-lowest p-3">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Bundle Valuation</span>
            <span className="font-mono font-bold text-tertiary">{formatMoney(appraisal)}</span>
          </div>
          {loadout.items.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <span className="text-text-primary">{item.name}</span>
              <span className="font-mono text-[11px] text-text-secondary">{formatMoney(item.priceUsd)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-dark pt-4">
        <div className="flex items-center gap-2">
          <CircleCheck className={cn("size-4", TONE_TEXT[loadout.guarantee.tone])} />
          <span className="text-xs text-text-secondary">{loadout.guarantee.label}</span>
        </div>
        <LinkButton
          href={cta.href(loadout)}
          className={cn("gap-2 rounded-md px-4 py-2 text-xs font-bold text-white uppercase", cta.className)}
        >
          <cta.icon className={cn("size-4", cta.iconClassName)} />
          <span>{loadout.cta.label}</span>
        </LinkButton>
      </div>
    </article>
  );
}
