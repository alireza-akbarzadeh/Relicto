import { Icon } from "@/components/ui/icon";

export function ComboBanner({ comboDiscount, itemCount }: { comboDiscount: number; itemCount: number }) {
  if (comboDiscount > 0) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-tertiary/30 bg-surface-card p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tertiary/15 text-tertiary">
              <Icon name="stars" className="text-[20px]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-xs font-bold text-tertiary">
                  Multi-Item Bundle Activated
                </span>
                <span className="rounded bg-tertiary-container/40 px-1.5 py-0.5 font-data-mono-md text-[10px] text-tertiary">
                  {itemCount} Items
                </span>
              </div>
              <span className="font-body-sm text-xs text-text-secondary">
                -$ {comboDiscount.toFixed(2)} USD instant escrow rebate applied to this order.
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-white/6 bg-surface-container-lowest px-3 py-1.5 text-right sm:self-center">
            <span className="block font-data-mono-md text-[10px] text-text-muted">Rebate Applied</span>
            <span className="font-data-mono-md text-sm font-bold text-tertiary">
              -${comboDiscount.toFixed(2)} USD
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (itemCount > 0 && itemCount < 3) {
    const needed = 3 - itemCount;
    return (
      <section className="flex items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-surface-card/60 p-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
          <Icon name="auto_awesome" className="text-[18px]" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-sm text-xs font-bold text-text-primary">
            Unlock $25.00 Escrow Rebate
          </span>
          <span className="font-body-sm text-xs text-text-muted">
            Add {needed} more {needed === 1 ? "item" : "items"} to activate bundle savings on this order.
          </span>
        </div>
      </section>
    );
  }

  return null;
}
