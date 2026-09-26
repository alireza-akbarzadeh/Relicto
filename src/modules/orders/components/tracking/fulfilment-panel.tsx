import { CountdownText } from "@/components/countdown-text";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { Fulfilment } from "../../types";
import { FulfilmentActions } from "./fulfilment-actions";

type Headline = { icon: IconName; tone: string; title: string; body: string };

/** What the viewer is waiting for or has to do, by side and stage. */
function headline({ role, stage, counterparty }: Fulfilment): Headline {
  const seller = role === "seller";
  switch (stage) {
    case "awaiting-offer":
      return seller
        ? { icon: "send", tone: "text-tertiary", title: `Send the Steam trade offer to ${counterparty}`, body: "Open their trade URL, offer exactly this item, then paste the offer's link below. Escrow refunds the buyer if the window runs out." }
        : { icon: "schedule", tone: "text-status-upcoming", title: `Waiting for ${counterparty} to send the trade offer`, body: "Your payment is safe in escrow. If the seller doesn't send the offer in time, you're refunded automatically." };
    case "offer-sent":
      return seller
        ? { icon: "schedule", tone: "text-status-upcoming", title: `Waiting for ${counterparty} to accept`, body: "They accept your offer in Steam and confirm receipt here. Your payout is released the moment they do." }
        : { icon: "swap_horiz", tone: "text-tertiary", title: "Your trade offer is ready", body: "Accept it in Steam, check the item arrived, then confirm receipt to complete the order." };
    case "completed":
      return seller
        ? { icon: "payments", tone: "text-emerald-400", title: "Sold — payout released", body: "The buyer confirmed receipt and the escrow was credited to your vault." }
        : { icon: "check_circle", tone: "text-emerald-400", title: "Delivered", body: "The item is in your Steam inventory and escrow was released to the seller." };
    case "cancelled":
      return seller
        ? { icon: "cancel", tone: "text-text-muted", title: "Order cancelled", body: "The buyer was refunded and your listing is back on the market." }
        : { icon: "cancel", tone: "text-text-muted", title: "Order cancelled — refunded", body: "The escrow was returned to your vault." };
    default:
      return { icon: "gavel", tone: "text-status-live", title: "Escrow frozen for review", body: "Funds stay locked while Relicto reviews the trade with both sides." };
  }
}

/** The peer-to-peer trade panel: the tracker's call to action for whoever is looking. */
export function FulfilmentPanel({ code, fulfilment }: { code: string; fulfilment: Fulfilment }) {
  const head = headline(fulfilment);
  return (
    <section className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-card p-space-lg shadow-2xl">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-container/10 blur-3xl" />
      <div className="flex flex-col justify-between gap-space-md sm:flex-row sm:items-start">
        <div className="flex items-start gap-space-md">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-variant shadow-inner">
            <Icon name={head.icon} className={cn("text-[26px]", head.tone)} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">
              {fulfilment.role === "seller" ? "You're selling" : "You're buying"} · Peer-to-peer Steam trade
            </span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-text-primary">{head.title}</h2>
            <p className="max-w-xl font-body-sm text-body-sm text-text-secondary">{head.body}</p>
          </div>
        </div>
        {fulfilment.secondsLeft !== null && (
          <div className="flex shrink-0 flex-col items-start rounded-lg bg-surface-container-lowest px-space-md py-space-sm sm:items-end">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">Dispatch window</span>
            <CountdownText seconds={fulfilment.secondsLeft} format="clock" className="font-data-mono-lg text-data-mono-lg font-bold text-tertiary" />
          </div>
        )}
      </div>
      <FulfilmentActions code={code} fulfilment={fulfilment} />
    </section>
  );
}
