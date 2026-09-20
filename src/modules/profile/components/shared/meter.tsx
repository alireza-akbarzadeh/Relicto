import { cn } from "@/lib/cn";
import { TONE_BAR } from "../../lib/tones";
import type { Tone } from "../../types";

type MeterProps = {
  pct: number;
  tone: Tone;
  /** Amber-to-crimson sweep used by the float bar on the hero item. */
  gradient?: boolean;
  className?: string;
  trackClassName?: string;
};

/** Thin progress track used by float, style and endorsement bars. */
export function Meter({ pct, tone, gradient, className, trackClassName }: MeterProps) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest", trackClassName, className)}>
      <div
        className={cn("h-full rounded-full", gradient ? "bg-linear-to-r/srgb from-tertiary to-primary-container" : TONE_BAR[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
