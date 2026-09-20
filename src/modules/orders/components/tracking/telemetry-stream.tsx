import { cn } from "@/lib/cn";
import type { LogLine, LogSegment, OrderTracking } from "../../types";

const CHANNEL: Record<LogLine["channelTone"], string> = {
  cyan: "text-status-upcoming",
  amber: "text-tertiary-fixed-dim",
  live: "text-status-live",
};

const SEGMENT: Record<NonNullable<LogSegment["tone"]>, string> = {
  primary: "font-bold text-text-primary",
  amber: "rounded bg-surface-deep px-1.5 py-0.5 font-bold text-tertiary-fixed-dim shadow-inner",
  code: "font-semibold text-text-primary",
};

function Line({ line }: { line: LogLine }) {
  return (
    <div
      className={cn(
        "flex items-start gap-space-sm rounded px-space-xs transition-colors",
        line.active ? "bg-surface-container/50 py-1" : "py-0.5 hover:bg-surface-container/30",
      )}
    >
      <span className={cn("select-none", line.active ? "animate-pulse font-bold text-status-live" : "text-text-muted")}>{line.time}</span>
      <span className={cn("font-bold uppercase", CHANNEL[line.channelTone])}>{line.channel}</span>
      <span className={line.active ? "font-medium text-text-primary" : undefined}>
        {line.message.map((segment, index) => (
          <span key={`${line.id}-${index}`} className={segment.tone ? SEGMENT[segment.tone] : undefined}>
            {segment.text}
          </span>
        ))}
      </span>
    </div>
  );
}

/** WebSocket-style log of the escrow node's events. */
export function TelemetryStream({ telemetry }: { telemetry: OrderTracking["telemetry"] }) {
  return (
    <div className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-deep p-space-lg shadow-xl">
      <div className="flex flex-col justify-between gap-space-sm border-b border-surface-variant pb-space-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-status-live" />
            <span className="h-3 w-3 rounded-full bg-tertiary-fixed-dim" />
            <span className="h-3 w-3 rounded-full bg-status-upcoming" />
          </div>
          <span className="ml-space-xs font-data-mono-md text-data-mono-md font-bold text-text-primary">Relicto Sentinel Telemetry Stream</span>
          <span className="rounded bg-surface-container px-space-xs py-0.5 font-data-mono-md text-[11px] font-semibold text-status-upcoming uppercase">
            {telemetry.node}
          </span>
        </div>
        <div className="flex items-center gap-space-md font-data-mono-md text-[11px] text-text-muted">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 animate-ping rounded-full bg-status-upcoming" />
            <span>FEED CONNECTED</span>
          </span>
          <span>{telemetry.buffer}</span>
        </div>
      </div>
      <div className="flex flex-col gap-space-xs overflow-x-auto font-data-mono-md text-[13px] leading-relaxed text-text-secondary">
        {telemetry.lines.map((line) => (
          <Line key={line.id} line={line} />
        ))}
      </div>
    </div>
  );
}
