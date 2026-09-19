import { cn } from "@/lib/cn";
import type { TeamRoster } from "../../types";

/** Avatar fills cycle through these, matching the design's roster rows. */
const FILLS = [
  "bg-surface-bright text-text-primary",
  "bg-surface-container-high text-text-primary",
  "bg-secondary-container text-on-secondary",
];

const SIZES = {
  md: {
    stack: "-space-x-2",
    item: "w-8 h-8 text-label-badge shadow-xs",
    extra: "w-8 h-8 text-[10px] shadow-xs",
  },
  sm: {
    stack: "-space-x-1.5",
    item: "w-6 h-6 text-[9px]",
    extra: "w-6 h-6 text-[8px]",
  },
} as const;

type TeamStackProps = { roster: TeamRoster; size?: keyof typeof SIZES };

/** Overlapping initials of registered teams, followed by a "+N" counter. */
export function TeamStack({ roster, size = "md" }: TeamStackProps) {
  const s = SIZES[size];
  return (
    <div className={cn("flex items-center", s.stack)}>
      {roster.initials.map((initials, i) => (
        <div
          key={initials}
          className={cn(
            "flex items-center justify-center rounded-full font-label-badge",
            s.item,
            FILLS[i % FILLS.length],
          )}
        >
          {initials}
        </div>
      ))}
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-surface-container-lowest font-label-badge text-text-muted",
          s.extra,
        )}
      >
        +{roster.extra}
      </div>
    </div>
  );
}
