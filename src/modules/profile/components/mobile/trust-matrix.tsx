import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { starGlyphs, TONE_TEXT } from "../../lib/mobile-tones";
import type { TrustStat } from "../../mobile.types";

function Stat({ stat }: { stat: TrustStat }) {
  return (
    <div className="flex flex-col justify-between rounded-lg bg-surface-container-lowest p-space-sm">
      <span className="font-label-badge text-label-badge text-text-muted uppercase">{stat.label}</span>
      <div className={cn("my-1 flex items-baseline", stat.suffix?.chip || stat.rating ? "gap-1.5" : "gap-1")}>
        <span className={cn("font-data-mono-lg text-data-mono-lg font-bold", TONE_TEXT[stat.tone])}>{stat.value}</span>
        {stat.suffix &&
          (stat.suffix.chip ? (
            <span className="font-label-badge text-label-badge font-semibold text-status-upcoming">{stat.suffix.text}</span>
          ) : (
            <span className="text-[11px] text-text-muted">{stat.suffix.text}</span>
          ))}
        {stat.rating !== undefined && (
          <div className="flex items-center text-[12px] text-tertiary" aria-label={`${stat.rating} out of 5`}>
            {starGlyphs(stat.rating).map((glyph, index) => (
              <Icon key={index} name={glyph} filled className="text-[13px]" />
            ))}
          </div>
        )}
      </div>
      <span
        className={cn(
          "font-body-sm text-[11px]",
          stat.noteTone === "cyan" ? "flex items-center gap-0.5 text-status-upcoming" : "text-text-secondary",
          stat.truncate && "truncate",
        )}
      >
        {stat.live && <span className="h-1.5 w-1.5 rounded-full bg-status-upcoming" />}
        {stat.note}
      </span>
    </div>
  );
}

/** Trust score, rating, dispute rate and dispatch speed. */
export function TrustMatrix({ stats }: { stats: TrustStat[] }) {
  return (
    <div className="flex flex-col gap-space-sm rounded-xl bg-surface-card p-space-md shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon name="verified_user" className="text-[18px] text-tertiary" />
          <span className="font-headline-sm text-[15px] tracking-tight text-text-primary uppercase">Reputation &amp; Trust Matrix</span>
        </div>
        <div className="flex items-center gap-1 rounded bg-tertiary-container/30 px-2 py-0.5 font-label-badge text-label-badge font-bold text-tertiary">
          <Icon name="shield" className="text-[12px]" />
          ESCROW PRO
        </div>
      </div>
      <div className="mt-1 grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <Stat key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}
