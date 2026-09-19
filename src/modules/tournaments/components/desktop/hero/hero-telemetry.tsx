import { Dot } from "@/components/ui/dot";

type Telemetry = {
  api: { label: string; value: string };
  tick: { label: string; value: string };
};

/** API sync and server tick chips to the right of the hero tabs. */
export function HeroTelemetry({ telemetry }: { telemetry: Telemetry }) {
  return (
    <div className="flex items-center gap-space-md font-label-badge text-label-badge text-text-secondary">
      <span className="flex items-center gap-1.5 rounded bg-surface-container-high px-space-sm py-1 text-on-surface">
        <Dot className="h-2 w-2 bg-status-live" animation="ping" />
        {telemetry.api.label}
        <span className="ml-1 font-data-mono-md text-data-mono-md text-tertiary">{telemetry.api.value}</span>
      </span>
      <span className="hidden items-center gap-1.5 rounded bg-surface-container-high px-space-sm py-1 text-text-muted md:flex">
        {telemetry.tick.label}
        <span className="font-data-mono-md text-data-mono-md text-text-primary">{telemetry.tick.value}</span>
      </span>
    </div>
  );
}
