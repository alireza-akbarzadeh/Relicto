"use client";

import { useState } from "react";
import type { BalancePoint } from "../../types";
import { formatByCurrency, type CurrencyMode } from "./currency-utils";

type TrendProps = {
  trend: BalancePoint[];
  currency: CurrencyMode;
};

export function BalanceTrendChart({ trend, currency }: TrendProps) {
  const [activeIdx, setActiveIdx] = useState<number>(trend.length - 1);

  if (trend.length === 0) return null;

  const width = 360;
  const height = 120;
  const paddingX = 20;
  const paddingY = 16;

  const values = trend.map((t) => t.usd);
  const min = Math.min(...values) * 0.98;
  const max = Math.max(...values) * 1.02;
  const range = max - min || 1;

  const points = trend.map((t, i) => {
    const x = paddingX + (i / (trend.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((t.usd - min) / range) * (height - 2 * paddingY);
    return { x, y, point: t };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  const activePoint = points[activeIdx] ?? points[points.length - 1];
  const activeFormatted = formatByCurrency(activePoint.point.usd, currency);

  return (
    <div className="flex flex-col gap-2">
      {/* Active point hover readout */}
      <div className="flex items-center justify-between px-1">
        <span className="font-data-mono-md text-[11px] text-text-muted">
          Day: <span className="font-bold text-text-primary">{activePoint.point.day}</span>
        </span>
        <div className="flex items-baseline gap-1">
          <span className="font-data-mono-lg text-sm font-bold text-primary">
            {activeFormatted.primary}
          </span>
          {activeFormatted.secondary && currency !== "usd" && (
            <span className="font-data-mono-md text-[10px] text-text-muted">
              {activeFormatted.secondary}
            </span>
          )}
        </div>
      </div>

      {/* SVG Area Chart */}
      <div className="relative h-28 w-full overflow-hidden rounded-lg bg-surface-container-lowest/60 p-1">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="balanceAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="balanceStrokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaPath} fill="url(#balanceAreaGrad)" />

          {/* Line Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#balanceStrokeGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive points */}
          {points.map((p, idx) => {
            const isActive = activeIdx === idx;
            return (
              <g key={p.point.day} className="cursor-pointer" onMouseEnter={() => setActiveIdx(idx)}>
                {/* Hit area */}
                <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
                {/* Visible dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 5 : 3}
                  fill={isActive ? "#ffffff" : "#f43f5e"}
                  stroke="#121214"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Day ticks */}
      <div className="flex justify-between px-3 font-data-mono-md text-[10px] text-text-muted">
        {trend.map((t, idx) => (
          <span
            key={t.day}
            className={`cursor-pointer transition-colors ${activeIdx === idx ? "font-bold text-primary" : "hover:text-text-primary"}`}
            onMouseEnter={() => setActiveIdx(idx)}
          >
            {t.day}
          </span>
        ))}
      </div>
    </div>
  );
}
