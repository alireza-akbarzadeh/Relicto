"use client";

import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { PRICE_PRESETS } from "../../data/facets.mock";
import { useMarketplace } from "../../state/marketplace-provider";

const INPUT = "w-full bg-transparent font-data-mono-md text-data-mono-md text-text-primary focus:outline-hidden placeholder:text-gray-400";

function toAmount(raw: string, fallback: number) {
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

export function PriceFacet() {
  const { filters, patch } = useMarketplace();
  const { min, max, preset } = filters.price;
  const shownMax = max >= 100_000 ? "" : String(max);

  return (
    <div className="mb-space-md">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-label-badge text-label-badge text-text-muted uppercase">Price Band (USD)</span>
        <span className="font-data-mono-md text-data-mono-md text-tertiary">
          {formatMoney(min, { whole: true })} — {max >= 1000 ? "$1,000+" : formatMoney(max, { whole: true })}
        </span>
      </div>
      <div className="mb-2 grid grid-cols-2 gap-2">
        {[
          { label: "Minimum price", value: String(min), set: (v: string) => ({ ...filters.price, min: toAmount(v, 0), preset: null }) },
          { label: "Maximum price", value: shownMax, set: (v: string) => ({ ...filters.price, max: toAmount(v || "100000", 100_000), preset: null }) },
        ].map((field) => (
          <div key={field.label} className="flex items-center rounded bg-surface-container-lowest p-1.5">
            <span className="mr-1 text-[13px] text-text-muted">$</span>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              aria-label={field.label}
              value={field.value}
              onChange={(e) => patch({ price: field.set(e.target.value) })}
              className={INPUT}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {PRICE_PRESETS.map((p) => {
          const active = preset === p.value;
          return (
            <button
              key={p.value}
              type="button"
              aria-pressed={active}
              onClick={() => patch({ price: active ? { min: 0, max: 100_000, preset: null } : { min: p.min, max: p.max, preset: p.value } })}
              className={cn(
                "rounded px-2 py-0.5 font-label-badge text-label-badge",
                active
                  ? "bg-tertiary-container/30 font-bold text-tertiary"
                  : "bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-text-primary",
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
