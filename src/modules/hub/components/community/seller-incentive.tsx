import { ArrowRight, Flame } from "lucide-react";
import { CountdownText } from "@/components/countdown-text";
import { LinkButton } from "@/components/ui/link-button";
import type { SellerIncentive } from "../../types";

/** Zero-fee listing window for items buffed in the current patch. */
export function SellerIncentiveCard({ incentive }: { incentive: SellerIncentive }) {
  return (
    <aside className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-dark bg-linear-to-br/srgb from-surface-card to-surface-container-high p-6 shadow-xl lg:col-span-4">
      <div className="flex flex-col gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-tertiary/40 bg-tertiary/20 text-tertiary">
          <Flame className="size-5" />
        </div>
        <div>
          <span className="font-mono text-[10px] font-bold tracking-widest text-tertiary uppercase">PATCH SURGE INCENTIVE</span>
          <h4 className="mt-1 text-lg font-bold text-white">Own an item buffed in Patch {incentive.patch}?</h4>
          <p className="mt-2 text-xs leading-relaxed text-text-secondary">
            Capitalize on high tournament liquidity. List any Mortred, Invoker, or AWP asset within the next 24 hours to enjoy{" "}
            <strong className="text-white">0% seller transaction fee</strong> and instant automated payout.
          </p>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border-dark bg-surface p-3">
          <span className="font-mono text-[10px] text-text-muted uppercase">Promotion Timer</span>
          <span className="animate-pulse font-mono text-xs font-bold text-status-live">
            <CountdownText seconds={incentive.endsInSeconds} /> REMAINING
          </span>
        </div>
      </div>
      <div className="pt-4">
        <LinkButton
          href="/sell"
          className="w-full gap-2 rounded-md border-0 bg-tertiary-container py-3 text-xs font-bold tracking-wider text-black uppercase shadow-md transition-colors hover:bg-[#fbbf24]"
        >
          <span>Go to Seller Studio</span>
          <ArrowRight className="size-4" />
        </LinkButton>
      </div>
    </aside>
  );
}
