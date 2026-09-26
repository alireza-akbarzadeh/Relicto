import Image from "next/image";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import type { LedgerRow, OrderFlow, RowAction } from "../../types";

const TAG = {
  indigo: "bg-secondary-container text-on-secondary-container",
  amber: "bg-tertiary-container text-on-tertiary",
  crimson: "bg-primary-container text-on-primary-container",
};

const FLOW: Record<OrderFlow, { label: string; tone: string }> = {
  buy: { label: "BUY", tone: "text-primary" },
  sell: { label: "SELL", tone: "text-tertiary-fixed-dim" },
  liquidate: { label: "LIQUIDATE", tone: "text-tertiary-fixed-dim" },
};

const PARTY_TONE = { cyan: "text-status-upcoming", muted: "text-text-muted", amber: "text-tertiary-fixed-dim" };
const ICON_ACTION = "h-auto rounded border-0 bg-surface-container p-1.5 text-text-secondary transition-colors hover:bg-surface-container-high hover:text-text-primary";
const TEXT_ACTION =
  "h-auto rounded border-0 bg-surface-container px-space-sm py-1 font-label-caps text-label-caps uppercase transition-colors hover:bg-surface-container-high";

const CELL = "px-space-md py-space-md align-middle";

function RowActions({ row }: { row: LedgerRow }) {
  const notice = (title: string, description: string) => ({ title, description });
  const render: Record<RowAction, React.ReactNode> = {
    track: (
      <LinkButton
        key="track"
        href={`/orders/${row.code.replace("#", "")}`}
        className="gap-space-xs rounded border-0 bg-primary-container px-space-md py-1.5 whitespace-normal font-label-caps text-label-caps font-bold text-on-primary-container shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-colors hover:bg-primary"
      >
        <span>Track Live</span>
        <Icon name="bolt" className="text-[16px]" />
      </LinkButton>
    ),
    receipt: (
      <NoticeButton
        key="receipt"
        notice={notice(`Receipt ${row.code}`, "Transaction receipts render once the orders API is wired.")}
        aria-label={`View receipt for ${row.code}`}
        className={ICON_ACTION}
      >
        <Icon name="receipt_long" className="text-[18px]" />
      </NoticeButton>
    ),
    inspect: (
      <NoticeButton
        key="inspect"
        notice={notice(`Inspecting ${row.itemName}`, "Steam Community inspection opens with the Steam API integration.")}
        aria-label={`Inspect ${row.itemName} on Steam`}
        className={ICON_ACTION}
      >
        <Icon name="open_in_new" className="text-[18px]" />
      </NoticeButton>
    ),
    "inspect-label": (
      <NoticeButton
        key="inspect-label"
        notice={notice(`Inspecting ${row.itemName}`, "Float and pattern inspection opens with the Steam API integration.")}
        className={cn(TEXT_ACTION, "text-text-secondary hover:text-text-primary")}
      >
        Inspect
      </NoticeButton>
    ),
    "sell-back": (
      <NoticeButton
        key="sell-back"
        notice={notice(`Sell back ${row.itemName}`, "Instant buy-back quotes arrive with the pricing API.")}
        className={cn(TEXT_ACTION, "text-tertiary-fixed-dim")}
      >
        Sell Back
      </NoticeButton>
    ),
    fingerprint: (
      <NoticeButton
        key="fingerprint"
        notice={notice("Liquidation proof", "Pool settlement proofs open once the liquidity API is wired.")}
        aria-label="View liquidation proof"
        className={ICON_ACTION}
      >
        <Icon name="fingerprint" className="text-[18px]" />
      </NoticeButton>
    ),
  };

  return <div className="flex items-center justify-end gap-space-xs">{row.actions.map((action) => render[action])}</div>;
}

/** One ledger row: order, item, flow, counterparty, settlement, state and actions. */
export function OrderRow({ row, alt }: { row: LedgerRow; alt: boolean }) {
  const flow = FLOW[row.flow];
  return (
    <tr className={cn("transition-colors hover:bg-surface-container", alt ? "bg-surface-container-lowest" : "bg-surface-container-low")}>
      <td className="px-space-lg py-space-md align-middle">
        <div className="flex flex-col">
          <span className={cn("font-data-mono-md text-data-mono-md font-bold", row.state === "escrow" ? "text-primary" : "text-text-primary")}>
            {row.code}
          </span>
          <span className="mt-0.5 font-label-badge text-label-badge text-text-muted">{row.when}</span>
        </div>
      </td>
      <td className={CELL}>
        <div className="flex items-center gap-space-md">
          <div className={cn("relative h-12 w-12 shrink-0 overflow-hidden rounded-lg shadow-sm", alt ? "bg-surface-container-low" : "bg-surface-container-lowest")}>
            <Image src={row.image} alt={row.imageAlt} fill sizes="48px" className="object-cover" />
            <span className={cn("absolute top-0 right-0 rounded-bl px-1 font-label-badge text-[9px] font-bold", TAG[row.tag.variant])}>{row.tag.label}</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span
                className={cn(
                  "rounded bg-surface-container-highest px-1 font-label-badge text-[10px] font-bold uppercase",
                  row.game === "CS2" ? "text-tertiary-fixed-dim" : "text-text-muted",
                )}
              >
                {row.game}
              </span>
              <span className="font-headline-sm text-[14px] font-semibold text-text-primary">{row.itemName}</span>
            </div>
            <span className="max-w-xs truncate font-body-sm text-body-sm text-text-secondary">{row.itemDetail}</span>
          </div>
        </div>
      </td>
      <td className={CELL}>
        <div className="flex flex-col">
          <span className={cn("font-label-caps text-label-caps font-bold uppercase", flow.tone)}>{flow.label}</span>
          <span className="font-label-badge text-label-badge text-text-muted">{row.flowNote}</span>
        </div>
      </td>
      <td className={CELL}>
        <div className="flex items-center gap-space-xs">
          <Icon name={row.party.icon} className={cn("text-[16px]", PARTY_TONE[row.party.iconTone])} />
          <span className="font-data-mono-md text-data-mono-md text-text-primary">{row.party.name}</span>
        </div>
        <span className="font-label-badge text-label-badge text-text-muted">{row.party.note}</span>
      </td>
      <td className={cn(CELL, "text-right")}>
        <div className={cn("font-data-mono-md text-data-mono-md font-bold", row.settlement.tone === "amber" ? "text-tertiary-fixed-dim" : "text-text-primary")}>
          {row.settlement.amount}
        </div>
        <span className="font-label-badge text-label-badge text-text-muted">{row.settlement.note}</span>
      </td>
      <td className={CELL}>
        {row.state === "escrow" ? (
          <div className="inline-flex items-center gap-space-xs rounded-full bg-status-upcoming/15 px-space-sm py-1 font-label-badge text-label-badge font-bold text-status-upcoming">
            <span className="h-2 w-2 animate-ping rounded-full bg-status-upcoming" />
            <span>{row.stateLabel}</span>
          </div>
        ) : (
          <div
            className={cn(
              "inline-flex items-center gap-space-xs rounded-full bg-surface-container px-space-sm py-1 font-label-badge text-label-badge font-bold",
              row.state === "cancelled" ? "text-text-muted" : row.state === "disputed" ? "text-status-live" : "text-tertiary",
            )}
          >
            <Icon name={row.state === "cancelled" ? "cancel" : row.state === "disputed" ? "gavel" : "check_circle"} className="text-[14px]" />
            <span>{row.stateLabel}</span>
          </div>
        )}
      </td>
      <td className="px-space-lg py-space-md text-right align-middle">
        <RowActions row={row} />
      </td>
    </tr>
  );
}
