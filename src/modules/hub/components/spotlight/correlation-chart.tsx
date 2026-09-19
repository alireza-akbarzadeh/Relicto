import type { Spotlight } from "../../types";

const FLOOR_PATH = "M0,120 Q 50,115 80,95 T 160,80 T 240,45 T 320,15";
const TREND_PATH = "M0,130 Q 60,110 120,112 T 200,70 T 280,40 T 320,25";
const GRID_ROWS = [35, 70, 105];

function ChartSvg() {
  return (
    <svg className="h-full w-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 320 140" aria-hidden>
      <defs>
        <linearGradient id="hub-floor-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0.35 }} />
          <stop offset="100%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id="hub-trend-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" style={{ stopColor: "var(--color-status-upcoming)" }} />
          <stop offset="100%" style={{ stopColor: "var(--color-tertiary)" }} />
        </linearGradient>
      </defs>
      {GRID_ROWS.map((y) => (
        <line key={y} className="stroke-border-dark" strokeDasharray="3 3" x1="0" x2="320" y1={y} y2={y} />
      ))}
      <path d={`${FLOOR_PATH} L 320,140 L 0,140 Z`} fill="url(#hub-floor-area)" />
      <path d={FLOOR_PATH} className="stroke-primary" strokeLinecap="round" strokeWidth="3" />
      <path d={TREND_PATH} stroke="url(#hub-trend-line)" strokeDasharray="4 2" strokeLinecap="round" strokeWidth="2.5" />
      <circle cx="240" cy="45" className="fill-tertiary" r="4" />
      <circle cx="320" cy="15" className="fill-primary" r="5" />
    </svg>
  );
}

/** Floor price vs pro performance, with the all-time-high callout and legend. */
export function CorrelationChart({ chart }: { chart: Spotlight["chart"] }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-dark bg-surface p-4 shadow-inner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded bg-primary" />
          <span className="text-sm font-bold text-white">{chart.title}</span>
        </div>
        <span className="rounded border border-tertiary/30 bg-surface-container-high px-2 py-0.5 font-mono text-[10px] font-bold text-tertiary">
          {chart.window}
        </span>
      </div>
      <div className="relative flex h-44 w-full items-end">
        <ChartSvg />
        <div className="absolute top-2 right-2 rounded border border-border-dark bg-surface-card/90 px-2.5 py-1 text-right shadow-sm">
          <div className="font-mono text-xs font-bold text-primary">{chart.peak}</div>
          <div className="font-mono text-[8px] text-text-muted uppercase">{chart.peakLabel}</div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border-dark pt-1 text-xs leading-4 text-text-secondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-3 rounded-full bg-primary" />
            <span className="font-mono text-[10px] text-white uppercase">{chart.series[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 border border-dashed border-status-upcoming bg-status-upcoming" />
            <span className="font-mono text-[10px] text-text-muted uppercase">{chart.series[1]}</span>
          </div>
        </div>
        <span className="font-mono text-[10px] text-text-muted">{chart.volume}</span>
      </div>
    </div>
  );
}
