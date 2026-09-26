import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";

const ACTION = "h-auto flex-1 rounded-lg border-0 px-space-md py-space-sm text-center font-label-caps text-label-caps font-bold uppercase transition-colors md:flex-initial";

/** Escrow SLA promise with dispute and concierge shortcuts. */
export function SlaBanner() {
  return (
    <div className="relative flex flex-col items-start justify-between gap-space-lg overflow-hidden rounded-xl bg-surface-container-low p-space-lg shadow-lg md:flex-row md:items-center">
      <div className="flex items-start gap-space-md">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
          <Icon name="shield" className="text-[28px]" />
        </div>
        <div className="flex max-w-2xl flex-col gap-1">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-[16px] font-bold tracking-tight text-text-primary uppercase">Relicto Escrow SLA Guarantee</span>
            <span className="rounded bg-tertiary-container/30 px-1.5 font-label-badge text-[10px] font-bold text-tertiary-fixed-dim">ACTIVE</span>
          </div>
          <p className="font-body-sm text-body-sm text-text-secondary">
            All transactions are strictly protected up to <strong className="text-text-primary">$10,000.00 USD</strong> via our 256-Bit Cold Escrow Vault. If a
            seller doesn&apos;t send the Steam trade offer within 12 hours, your funds are automatically restored to your vault.
          </p>
        </div>
      </div>
      <div className="flex w-full items-center gap-space-sm md:w-auto">
        <NoticeButton
          notice={{ title: "Dispute filed", description: "Dispute intake opens with the support integration." }}
          className={`${ACTION} bg-surface-container text-text-primary hover:bg-surface-container-high`}
        >
          Open a Dispute
        </NoticeButton>
        <NoticeButton
          notice={{ title: "Concierge", description: "24/7 concierge chat arrives with the support integration." }}
          className={`${ACTION} flex items-center justify-center gap-space-xs bg-surface-container-high text-status-upcoming hover:bg-surface-bright`}
        >
          <Icon name="support_agent" className="text-[18px]" />
          <span>24/7 Concierge</span>
        </NoticeButton>
      </div>
    </div>
  );
}
