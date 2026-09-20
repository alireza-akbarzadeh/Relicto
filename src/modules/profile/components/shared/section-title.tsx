import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { TONE_BAR } from "../../lib/tones";
import type { Tone } from "../../types";

type SectionTitleProps = {
  tone: Tone;
  title: string;
  /** Sub-line under the title (collectibles showcase). */
  subtitle?: string;
  /** Inline chip after the title (listing count). */
  chip?: ReactNode;
};

/** Square marker plus an uppercase section heading. */
export function SectionTitle({ tone, title, subtitle, chip }: SectionTitleProps) {
  return (
    <div>
      <div className="flex items-center gap-space-xs">
        <span className={cn("h-2.5 w-2.5 rounded-sm", TONE_BAR[tone])} />
        <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight text-text-primary uppercase">{title}</h2>
        {chip}
      </div>
      {subtitle && <p className="font-body-sm text-body-sm text-text-secondary">{subtitle}</p>}
    </div>
  );
}
