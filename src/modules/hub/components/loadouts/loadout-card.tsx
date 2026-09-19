import { CircleCheck, Eye, ShoppingBag } from "lucide-react";
import { NoticeButton } from "@/components/notice-button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { OUTLINE_PILL, TONE_TEXT } from "../../lib/tones";
import type { Loadout } from "../../types";

const CTA = {
  buy: {
    icon: ShoppingBag,
    className: "border-0 bg-primary shadow-xs hover:bg-[#e11d48]",
    iconClassName: "",
    notice: (l: Loadout) => ({ title: `${l.player} bundle reserved`, description: "Checkout opens once escrow payments are wired." }),
  },
  inspect: {
    icon: Eye,
    className: "border-surface-bright bg-surface-container-high hover:bg-surface-container-highest",
    iconClassName: "text-text-secondary",
    notice: (l: Loadout) => ({ title: `Opening ${l.player}'s Steam inventory`, description: "Live inventory sync lands with the Steam API integration." }),
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
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">{loadout.player}</h4>
                <span className={cn("rounded border bg-surface-container-high px-2 py-0.5 font-mono text-[9px]", OUTLINE_PILL[loadout.tag.tone])}>
                  {loadout.tag.label}
                </span>
              </div>
              <span className="text-xs text-text-muted">{loadout.role}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-[9px] text-text-muted uppercase">Arsenal Appraisal</span>
            <div className={cn("font-mono text-lg font-bold", TONE_TEXT[loadout.appraisalTone])}>{formatMoney(appraisal)}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {loadout.items.map((item) => (
            <div key={item.name} className="flex flex-col gap-1 rounded-lg border border-border-dark bg-surface p-3">
              <span className={cn("font-mono text-[9px] font-bold uppercase", TONE_TEXT[item.tone])}>{item.slot}</span>
              <span className="truncate text-xs font-bold text-white">{item.name}</span>
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
        <NoticeButton
          notice={cta.notice(loadout)}
          className={cn("gap-2 rounded-md px-4 py-2 text-xs font-bold text-white uppercase", cta.className)}
        >
          <cta.icon className={cn("size-4", cta.iconClassName)} />
          {loadout.cta.label}
        </NoticeButton>
      </div>
    </article>
  );
}
