"use client";

import { formatClock, formatCountdown, formatTimer } from "@/lib/format";
import { useCountdown } from "@/hooks/use-countdown";

const FORMATS = { clock: formatClock, verbose: formatCountdown, timer: formatTimer } as const;

type CountdownTextProps = {
  seconds: number;
  format?: keyof typeof FORMATS;
  className?: string;
};

/** Live-ticking countdown: "04:12:35" (clock), "04h 12m 30s" (verbose) or "08:42" (timer). */
export function CountdownText({ seconds, format = "clock", className }: CountdownTextProps) {
  const remaining = useCountdown(seconds);
  return (
    <time className={className}>
      {FORMATS[format](remaining)}
    </time>
  );
}
