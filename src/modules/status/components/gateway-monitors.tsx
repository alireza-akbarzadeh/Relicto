import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { OUTAGE } from "../data/status.mock";

const MONITOR_TONE: Record<string, { text: string; bar: string; dot: string }> = {
  tertiary: { text: "text-tertiary", bar: "bg-tertiary", dot: "bg-tertiary" },
  primary: { text: "text-primary", bar: "bg-primary-container", dot: "bg-status-live" },
  cyan: { text: "text-status-upcoming", bar: "bg-status-upcoming", dot: "bg-status-upcoming" },
};

export function GatewayMonitors() {
  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <Icon name="tune" className="text-[20px] text-primary" />
          <h3 className="font-headline-sm text-headline-sm tracking-wide text-text-primary uppercase">
            Live Infrastructure Monitor Dashboard
          </h3>
        </div>
        <span className="font-label-badge text-label-badge text-text-muted">FREQUENCY: 500MS REFRESH</span>
      </div>
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-5">
        {OUTAGE.monitors.map((tile) => {
          const palette = MONITOR_TONE[tile.tone] ?? MONITOR_TONE.cyan;
          return (
            <div
              key={tile.label}
              className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-card p-space-md shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-text-muted uppercase">{tile.label}</span>
                <span className={cn("h-2.5 w-2.5 rounded-full", palette.dot, tile.ping && "animate-ping")} />
              </div>
              <div className="flex flex-col">
                <span className={cn("font-headline-sm text-headline-sm", palette.text)}>{tile.status}</span>
                <span className="font-label-badge text-label-badge text-text-secondary">{tile.detail}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div className={cn("h-1.5 rounded-full", palette.bar, tile.bar)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
