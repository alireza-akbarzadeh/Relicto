"use client";

import { useMemo, useState } from "react";
import type { BalanceSegment } from "../../types";
import { formatByCurrency, type CurrencyMode } from "./currency-utils";

type DonutProps = {
  segments: BalanceSegment[];
  totalUsd: number;
  currency: CurrencyMode;
};

const COLOR_MAP: Record<string, { stroke: string; glow: string; text: string }> = {
  amber: { stroke: "#fbbf24", glow: "rgba(251, 191, 36, 0.4)", text: "text-amber-400" },
  cyan: { stroke: "#38bdf8", glow: "rgba(56, 189, 248, 0.4)", text: "text-cyan-400" },
  indigo: { stroke: "#818cf8", glow: "rgba(129, 140, 248, 0.4)", text: "text-indigo-400" },
  crimson: { stroke: "#f43f5e", glow: "rgba(244, 63, 94, 0.4)", text: "text-rose-400" },
};

export function BalanceDonutChart({ segments, totalUsd, currency }: DonutProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const radius = 72;
  const circumference = 2 * Math.PI * radius;

  const renderedSegments = useMemo(() => {
    return segments.map((seg, idx) => {
      const priorPct = segments.slice(0, idx).reduce((sum, s) => sum + s.pct, 0);
      const strokeDashoffset = -((priorPct / 100) * circumference);
      const strokeDasharray = `${(seg.pct / 100) * circumference} ${circumference}`;
      return {
        ...seg,
        strokeDasharray,
        strokeDashoffset,
        colors: COLOR_MAP[seg.tone] ?? COLOR_MAP.amber,
      };
    });
  }, [segments, circumference]);

  const activeSegment = segments.find((s) => s.id === hoveredId) ?? segments[0];
  const activeAmount = activeSegment ? formatByCurrency(activeSegment.usd, currency) : formatByCurrency(totalUsd, currency);

  return (
    <div className="flex flex-col items-center gap-space-md sm:flex-row sm:justify-around py-space-sm">
      {/* SVG Donut Circle */}
      <div className="relative flex h-60 w-60 sm:h-68 sm:w-68 shrink-0 items-center justify-center">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
          {/* Background Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="16"
          />

          {/* Segment Arcs */}
          {renderedSegments.map((seg) => {
            const isHovered = hoveredId === seg.id;

            return (
              <circle
                key={seg.id}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={seg.colors.stroke}
                strokeWidth={isHovered ? 20 : 16}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-300"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 10px ${seg.colors.glow})` : undefined,
                  opacity: hoveredId && !isHovered ? 0.35 : 1,
                }}
                onMouseEnter={() => setHoveredId(seg.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            );
          })}
        </svg>

        {/* Center Readout */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-label-badge text-[10px] tracking-wider text-text-muted uppercase">
            {hoveredId ? activeSegment?.label : "Portfolio"}
          </span>
          <span className="font-data-mono-lg text-sm font-bold text-text-primary">
            {hoveredId ? `${activeSegment?.pct}%` : "100%"}
          </span>
          <span className="max-w-[110px] truncate font-data-mono-md text-[10px] text-text-secondary">
            {activeAmount.primary}
          </span>
        </div>
      </div>

      {/* Legend items */}
      <div className="flex w-full flex-col gap-2 sm:max-w-xs">
        {segments.map((seg) => {
          const colors = COLOR_MAP[seg.tone] ?? COLOR_MAP.amber;
          const isHovered = hoveredId === seg.id;
          const formatted = formatByCurrency(seg.usd, currency);

          return (
            <div
              key={seg.id}
              onMouseEnter={() => setHoveredId(seg.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-2 transition-all ${
                isHovered
                  ? "border-white/20 bg-surface-container-high shadow-xs"
                  : "border-white/4 bg-surface-container-lowest/50 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: colors.stroke }}
                />
                <span className="font-headline-sm text-xs font-semibold text-text-primary">
                  {seg.label}
                </span>
                <span className="font-data-mono-md text-[11px] text-text-muted">
                  ({seg.pct}%)
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-data-mono-md text-xs font-bold text-text-primary">
                  {formatted.primary}
                </span>
                {formatted.secondary && currency !== "usd" && (
                  <span className="font-data-mono-md text-[10px] text-text-muted">
                    {formatted.secondary}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
