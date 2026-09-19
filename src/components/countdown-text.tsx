"use client";

import { formatClock, formatCountdown } from "@/lib/format";
import { useCountdown } from "@/hooks/use-countdown";

const FORMATS = { clock: formatClock, verbose: formatCountdown } as const;

type CountdownTextProps = {
  seconds: number;
  format?: keyof typeof FORMATS;
  className?: string;
};

/** Live-ticking countdown text: "04:12:35" (clock) or "04h 12m 30s" (verbose). */
export function CountdownText({ seconds, format = "clock", className }: CountdownTextProps) {
  const remaining = useCountdown(seconds);
  return (
    <time className={className}>
      {FORMATS[format](remaining)}
    </time>
  );
}
