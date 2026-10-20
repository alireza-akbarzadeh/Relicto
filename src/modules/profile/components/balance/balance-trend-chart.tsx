"use client";

import { useMemo, useState } from "react";
import type { BalancePoint } from "../../types";
import { formatByCurrency, type CurrencyMode } from "./currency-utils";

type TrendProps = {
  trend: BalancePoint[];
  currency: CurrencyMode;
};

/**
 * Builds smooth cubic bezier SVG path across points.
 */
function buildSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const dx = (p1.x - p0.x) * 0.5;
    d += ` C ${(p0.x + dx).toFixed(1)} ${p0.y.toFixed(1)}, ${(p1.x - dx).toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}

export function BalanceTrendChart({ trend, currency }: TrendProps) {
  const [activeIdx, setActiveIdx] = useState<number>(trend.length - 1);

  const width = 800;
  const height = 260;
  const paddingX = 40;
  const paddingY = 36;

  const { points, linePath, areaPath, gridLines, activePoint, activeFormatted } = useMemo(() => {
    if (trend.length === 0) {
      return { points: [], linePath: "", areaPath: "", gridLines: [], activePoint: null, activeFormatted: null };
    }
    const values = trend.map((t) => t.usd);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const min = minVal * 0.95;
    const max = maxVal * 1.05;
    const range = max - min || 1;

    const pts = trend.map((t, i) => {
      const x = paddingX + (i / (trend.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((t.usd - min) / range) * (height - 2 * paddingY);
      return { x, y, point: t };
    });

    const lPath = buildSmoothPath(pts);
    const aPath = `${lPath} L ${pts[pts.length - 1].x.toFixed(1)} ${height - 4} L ${pts[0].x.toFixed(1)} ${height - 4} Z`;

    const grids = [0.2, 0.5, 0.8].map((ratio) => {
      const y = paddingY + ratio * (height - 2 * paddingY);
      const val = max - ratio * range;
      return { y, val };
    });

    const safeIdx = Math.min(Math.max(activeIdx, 0), pts.length - 1);
    const ap = pts[safeIdx] ?? pts[pts.length - 1];
    const af = formatByCurrency(ap.point.usd, currency);

    return { points: pts, linePath: lPath, areaPath: aPath, gridLines: grids, activePoint: ap, activeFormatted: af };
  }, [trend, activeIdx, currency]);

  if (trend.length === 0 || !activePoint || !activeFormatted) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Active point hover readout badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/6 bg-surface-container-low/80 px-3.5 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-data-mono-md text-xs text-text-muted">
            Tracking Point: <span className="font-bold text-text-primary">{activePoint.point.day}</span>
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-data-mono-lg text-base font-bold text-primary">
            {activeFormatted.primary}
          </span>
          {activeFormatted.secondary && currency !== "usd" && (
            <span className="font-data-mono-md text-xs text-text-muted">
              ({activeFormatted.secondary})
            </span>
          )}
        </div>
      </div>

      {/* SVG High-Stature Area Chart Container */}
      <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden rounded-xl border border-white/8 bg-surface-container-lowest/80 p-2 shadow-inner">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="balanceAreaGradBig" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#f43f5e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="balanceStrokeGradBig" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <filter id="neonGlowBig" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f43f5e" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Reference Horizontal Grid Lines */}
          {gridLines.map((grid, idx) => (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={grid.y}
                x2={width - paddingX}
                y2={grid.y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 6"
                strokeWidth="1"
              />
              <text
                x={width - paddingX + 6}
                y={grid.y + 3}
                fill="rgba(255, 255, 255, 0.28)"
                fontSize="9"
                fontFamily="monospace"
              >
                {formatByCurrency(grid.val, currency).primary}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#balanceAreaGradBig)" />

          {/* Active Vertical Crosshair */}
          <line
            x1={activePoint.x}
            y1={paddingY - 10}
            x2={activePoint.x}
            y2={height - paddingY + 10}
            stroke="rgba(244, 63, 94, 0.45)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Line Stroke with Neon Glow */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#balanceStrokeGradBig)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonGlowBig)"
          />

          {/* Interactive points */}
          {points.map((p, idx) => {
            const isActive = activeIdx === idx;
            return (
              <g
                key={p.point.day}
                className="cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
              >
                {/* Large invisible hit area */}
                <rect
                  x={p.x - 20}
                  y={0}
                  width={40}
                  height={height}
                  fill="transparent"
                />

                {/* Active Outer Pulse Ring */}
                {isActive && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="10"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                )}

                {/* Visible dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 6 : 4}
                  fill={isActive ? "#ffffff" : "#f43f5e"}
                  stroke="#0f1117"
                  strokeWidth="2.5"
                  className="transition-transform duration-200"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Day ticks aligned below */}
      <div className="flex justify-between px-6 font-data-mono-md text-xs text-text-muted">
        {trend.map((t, idx) => {
          const isActive = activeIdx === idx;
          return (
            <button
              key={t.day}
              type="button"
              onClick={() => setActiveIdx(idx)}
              onMouseEnter={() => setActiveIdx(idx)}
              className={`rounded px-2 py-0.5 transition-all ${
                isActive
                  ? "bg-primary/20 font-bold text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
