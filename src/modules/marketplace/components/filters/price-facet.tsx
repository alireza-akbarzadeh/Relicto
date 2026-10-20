"use client";

import { Button } from "@/components/ui/button";
import { PriceInput } from "@/components/ui/price-input";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { PRICE_PRESETS } from "../../data/facets.mock";
import { useMarketplace } from "../../state/marketplace-provider";

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
          { label: "Min ($)", value: String(min), set: (v: string) => ({ ...filters.price, min: toAmount(v, 0), preset: null }) },
          { label: "Max ($)", value: shownMax, set: (v: string) => ({ ...filters.price, max: toAmount(v || "100000", 100_000), preset: null }) },
        ].map((field) => (
          <PriceInput
            key={field.label}
            currencyPrefix="$"
            currencySuffix=""
            placeholder={field.label}
            value={field.value ? Number(field.value) : null}
            onChange={(val) => patch({ price: field.set(val ? String(val) : "") })}
            className="h-8 bg-surface-container-lowest text-xs"
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {PRICE_PRESETS.map((p) => {
          const active = preset === p.value;
          return (
            <Button
              key={p.value}
              type="button"
              variant={null}
              size={null}
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
            </Button>
          );
        })}
      </div>
    </div>
  );
}
