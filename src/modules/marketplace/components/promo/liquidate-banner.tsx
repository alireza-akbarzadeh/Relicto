import Link from "next/link";
import { Icon } from "@/components/ui/icon";

/** "Have items to liquidate?" call to action into the sell studio. */
export function LiquidateBanner() {
  return (
    <div className="relative mb-space-lg w-full overflow-hidden rounded-2xl bg-linear-to-r/srgb from-surface-card via-surface-container-high to-surface-card p-space-lg shadow-xl">
      <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-1/3 bg-linear-to-l/srgb from-primary/10 to-transparent" />
      <div className="relative z-10 flex flex-col items-center justify-between gap-space-lg md:flex-row">
        <div className="flex items-center gap-space-md">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-tertiary-container text-on-tertiary-container shadow-lg">
            <Icon name="sync_alt" className="text-[32px]" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-headline-md text-headline-md font-bold tracking-tight text-text-primary uppercase">Have items to liquidate?</h3>
              <span className="rounded bg-tertiary/20 px-2 py-0.5 font-label-badge text-label-badge font-bold text-tertiary uppercase">
                0% Listing Fee
              </span>
            </div>
            <p className="max-w-xl font-body-md text-body-md text-text-secondary">
              Connect your Steam Inventory to auto-price your duplicates and list instantly with automated bot escrow settlements.
            </p>
          </div>
        </div>
        <div className="flex w-full shrink-0 items-center gap-space-sm md:w-auto">
          <Link
            href="/sell"
            className="flex w-full items-center justify-center gap-space-xs rounded-lg bg-tertiary px-space-lg py-3 font-headline-sm text-headline-sm font-bold text-on-tertiary uppercase shadow-md transition-all hover:bg-tertiary-fixed md:w-auto"
          >
            <Icon name="account_balance_wallet" className="text-[20px]" />
            <span>Connect Inventory & Sell</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
