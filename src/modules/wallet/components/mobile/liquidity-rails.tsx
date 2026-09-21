import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TONE_TEXT } from "../../lib/mobile";
import type { LiquidityRail } from "../../mobile.types";

const CHIP = {
  crimson: "bg-primary-container text-on-primary-container",
  indigo: "bg-surface-container-highest text-secondary",
  muted: "bg-surface-container-highest text-text-muted",
};

/** Deposit and cashout rails with their fees and settlement speed. */
export function LiquidityRails({ rails }: { rails: LiquidityRail[] }) {
  return (
    <>
      <div className="flex items-center justify-between pt-space-xs">
        <div className="flex items-center gap-1.5">
          <Icon name="hub" className="text-[18px] text-primary-container" />
          <span className="font-headline-sm text-headline-sm text-text-primary">Instant Liquidity Rails</span>
        </div>
        <span className="font-label-badge text-label-badge text-secondary uppercase">Realtime Gas Low</span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {rails.map((rail) => (
          <div key={rail.id} className="flex items-center justify-between rounded-xl bg-surface-card p-space-sm shadow-xs transition-colors hover:bg-surface-container">
            <div className="flex min-w-0 items-center gap-space-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                <Icon name={rail.icon} className={cn("text-[22px]", TONE_TEXT[rail.tone])} />
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-headline-sm leading-tight text-text-primary">{rail.title}</span>
                  <span className={cn("rounded px-1.5 font-label-badge text-label-badge", CHIP[rail.chipTone])}>{rail.chip}</span>
                </div>
                <span className="truncate font-body-sm text-body-sm text-text-secondary">{rail.note}</span>
              </div>
            </div>
            <NoticeButton
              aria-label={`Open ${rail.title}`}
              notice={{ title: rail.title, description: `${rail.note}. Fees: ${rail.chip}.` }}
              className="h-8 w-8 shrink-0 rounded-lg border-0 bg-surface-container text-text-primary"
            >
              <Icon name="chevron_right" className="text-[18px]" />
            </NoticeButton>
          </div>
        ))}
      </div>
    </>
  );
}
