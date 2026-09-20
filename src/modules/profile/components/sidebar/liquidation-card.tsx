import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";

/** Shortcut into the batch liquidation scanner. */
export function LiquidationCard() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-linear-to-br/srgb from-surface-container to-surface-card p-space-lg">
      <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-primary/20 blur-xl" />
      <div className="mb-space-xs flex items-center gap-space-xs">
        <Icon name="currency_exchange" className="text-[20px] text-primary" />
        <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-primary uppercase">Instant Skin Liquidation</span>
      </div>
      <p className="mb-space-md font-body-sm text-body-sm text-text-secondary">
        Have duplicate CS2 cases, keys, or Dota immortals? Auto-liquidate to Relicto Bot Escrow for 0% maker fee with instant Steam Wallet crediting.
      </p>
      <NoticeButton
        notice={{ title: "Loading batch liquidation scanner...", description: "The scanner opens once the inventory API is wired." }}
        className="h-auto w-full gap-space-xs rounded-lg border-0 bg-primary px-space-md py-space-sm font-headline-sm text-[13px] font-bold tracking-wider text-on-primary uppercase shadow-md transition-all hover:bg-primary-container hover:text-on-primary-container"
      >
        <span>Liquidate Duplicates (0% Fee)</span>
        <Icon name="arrow_forward" className="text-[16px]" />
      </NoticeButton>
    </section>
  );
}
