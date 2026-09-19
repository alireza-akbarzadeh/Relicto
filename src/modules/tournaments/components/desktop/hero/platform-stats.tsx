import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TEXT_TONE } from "../../../lib/tones";
import type { PlatformStat } from "../../../types";

/** Four platform counters under the hero. */
export function PlatformStats({ stats }: { stats: PlatformStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-space-sm lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-space-md rounded-lg bg-surface-card p-space-md shadow-md"
        >
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded bg-surface-container-high",
              TEXT_TONE[stat.tone],
            )}
          >
            <Icon name={stat.icon} className={cn("text-headline-md", stat.pulse && "animate-pulse")} />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="font-data-mono-lg text-data-mono-lg leading-none text-text-primary">{stat.value}</span>
            <span className="truncate font-label-caps text-label-caps text-text-muted uppercase">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
