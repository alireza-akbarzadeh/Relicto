import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TONE_GLOW_SOFT, TONE_TEXT } from "../../lib/tones";
import type { ProfileStat } from "../../types";

function StatCard({ stat }: { stat: ProfileStat }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-card p-space-md">
      <div className={cn("absolute -right-6 -bottom-6 h-24 w-24 rounded-full blur-xl", TONE_GLOW_SOFT[stat.tone])} />
      <div className="flex items-center justify-between text-text-muted">
        <span className="font-label-caps text-label-caps tracking-wider uppercase">{stat.label}</span>
        <Icon name={stat.icon} className={cn("text-[20px]", TONE_TEXT[stat.tone])} />
      </div>
      <div className="mt-space-sm flex items-baseline gap-space-xs">
        <span className="font-headline-xl text-headline-xl font-bold tracking-tight text-text-primary">{stat.value}</span>
        <span
          className={cn(
            "font-data-mono-md",
            stat.unit.mono ? "text-data-mono-md" : "text-body-sm",
            stat.unit.bold && "font-bold",
            TONE_TEXT[stat.unit.tone],
          )}
        >
          {stat.unit.label}
        </span>
      </div>
      <div className="mt-space-xs flex items-center justify-between font-label-badge text-label-badge text-text-muted">
        <span>{stat.foot.left}</span>
        <span className={cn("flex items-center gap-0.5", TONE_TEXT[stat.foot.tone], !stat.foot.icon && "font-semibold")}>
          {stat.foot.icon && <Icon name={stat.foot.icon} className="text-[13px]" />}
          {stat.foot.right}
        </span>
      </div>
    </div>
  );
}

/** Four-metric performance strip under the trader banner. */
export function StatStrip({ stats }: { stats: ProfileStat[] }) {
  return (
    <section className="w-full px-gutter-desktop py-space-lg">
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
