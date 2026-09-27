import { cn } from "@/lib/cn";
import { WalletAction } from "./wallet-action-button";

type WalletSummaryProps = {
  numericAmount: number;
  skins: boolean;
  activeAction: WalletAction;
};

export function WalletSummary(props: WalletSummaryProps) {
  const { activeAction, numericAmount, skins } = props;
  const credited = (skins ? numericAmount * 1.02 : numericAmount).toFixed(2);

  return (
    <div className="overflow-hidden rounded-lg border border-surface-variant/60 bg-surface-container-lowest/70">
      <div className="flex flex-col gap-space-sm p-space-md font-data-mono-md text-body-sm">
        {/* Breakdown */}
        <div className="flex items-center justify-between gap-space-md">
          <span className="text-text-muted">Subtotal</span>
          <span className="text-text-secondary">
            ${numericAmount.toFixed(2)} USD
          </span>
        </div>

        <div className="flex items-center justify-between gap-space-md">
          <span className="text-text-muted">Network Protocol Ingress Fee</span>
          <span className="text-tertiary">0.00 USD (PROMO)</span>
        </div>

        <div className="flex items-center justify-between gap-space-md">
          <span className="text-text-muted">Liquidation Booster Tier</span>

          <span className="text-right text-primary">
            {skins ? (
              <>
                +2.0%{" "}
                <span className="text-text-secondary">
                  (${(numericAmount * 0.02).toFixed(2)} USD)
                </span>
              </>
            ) : (
              "Skin rail only"
            )}
          </span>
        </div>

        <div className="flex items-center justify-between gap-space-md">
          <span className="text-text-muted">Type</span>

          <span
            className={cn(
              "inline-flex items-center rounded-md border px-space-sm py-0.5",
              "font-label-caps text-[10px] uppercase tracking-wider",
              activeAction === "deposit"
                ? "border-tertiary/20 bg-tertiary/10 text-tertiary"
                : "border-primary/20 bg-primary/10 text-primary",
            )}
          >
            {activeAction}
          </span>
        </div>

        {/* Total */}
        <div className="mt-space-xs flex items-center justify-between gap-space-md border-t border-surface-variant/70 pt-space-md">
          <div className="flex flex-col gap-0.5">
            <span className="font-label-caps text-label-caps text-text-muted">
              Total Balance Credited
            </span>
            <span className="text-[10px] uppercase tracking-wider text-text-muted">
              Final settlement
            </span>
          </div>

          <span className="font-data-mono-xl font-semibold text-tertiary">
            ${credited} USD
          </span>
        </div>
      </div>
    </div>
  );
}
