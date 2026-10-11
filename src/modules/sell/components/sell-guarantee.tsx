import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";

export function SellGuarantee() {
  return (
    <section className="mx-margin-desktop mb-space-lg rounded-lg border border-white/8 bg-surface-container-lowest p-space-md">
      <div className="flex flex-col items-start justify-between gap-space-md md:flex-row md:items-center">
        <div className="flex items-start gap-space-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-card text-primary">
            <Icon name="shield_locked" className="text-[20px]" />
          </div>
          <div>
            <h3 className="font-headline-sm text-sm font-bold text-text-primary uppercase">
              Valve Steam Guard Escrow Guarantee
            </h3>
            <p className="max-w-3xl text-[11px] leading-relaxed text-text-muted">
              All listings are managed through an automated zero-collateral P2P bot relay. Your skins
              never leave your backpack until buyer deposits are confirmed on-chain or in
              multi-currency escrow vault.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <LinkButton
            href="/wiki"
            className="h-auto rounded bg-surface-container px-3 py-2 font-label-caps text-[10px] text-text-primary uppercase hover:bg-surface-bright"
          >
            Escrow Protocol
          </LinkButton>
          <LinkButton
            href="/profile"
            className="h-auto rounded bg-primary px-3 py-2 font-label-caps text-[10px] font-bold text-white uppercase hover:bg-primary/90"
          >
            Trade URL Settings
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
