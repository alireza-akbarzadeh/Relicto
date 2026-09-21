import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { outcomeGain } from "../../lib/trade-up";
import type { Outcome } from "../../mobile.types";

const TONE = {
  jackpot: { name: "font-bold text-tertiary", tier: "text-status-upcoming", chance: "font-bold text-tertiary" },
  mid: { name: "text-text-primary", tier: "text-text-secondary", chance: "text-text-primary" },
  risk: { name: "text-on-surface-variant", tier: "text-status-live", chance: "text-status-live" },
};

/** Simulated contract outcomes; gains are measured against the current input value. */
export function OutcomeOdds({ outcomes, seed, input }: { outcomes: Outcome[]; seed: string; input: number }) {
  return (
    <div className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon name="casino" className="text-[18px] text-tertiary" />
          <span className="font-headline-sm text-headline-sm tracking-tight text-text-primary">Simulated Probabilities</span>
        </div>
        <span className="font-label-badge text-label-badge text-text-secondary uppercase">{seed}</span>
      </div>
      <div className="flex flex-col gap-2">
        {outcomes.map((outcome) => {
          const tone = TONE[outcome.tone];
          return (
            <div key={outcome.id} className="flex items-center justify-between rounded-xl bg-surface-card p-space-sm shadow-md">
              <div className="flex min-w-0 items-center gap-space-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-container-highest p-1">
                  <Image src={outcome.image} alt={outcome.imageAlt} width={80} height={80} sizes="40px" className="h-10 w-10 object-contain" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-1">
                    <span className={cn("truncate font-headline-sm text-body-md", tone.name)}>{outcome.name}</span>
                  </div>
                  <span className={cn("font-label-badge text-label-badge", tone.tier)}>
                    {outcome.tier} | {outcomeGain(outcome, input)} {outcome.verdict}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end pl-2">
                <span className={cn("font-data-mono-lg text-data-mono-md", tone.chance)}>{outcome.chance.toFixed(1)}%</span>
                <span className="font-label-badge text-[10px] text-text-secondary">~{formatMoney(outcome.valueUsd)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
