"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/ui/link-button";
import { useEscrowActions } from "../../hooks/use-escrow-actions";
import { useFulfilment } from "../../hooks/use-fulfilment";
import type { Fulfilment } from "../../types";
import { CancelOrderButton } from "./cancel-order-button";

const PRIMARY = "h-auto gap-space-sm rounded-lg border-0 bg-primary-container px-space-lg py-space-md font-headline-sm text-[14px] font-bold tracking-wider text-on-primary-container uppercase shadow-[0_0_24px_rgba(244,63,94,0.35)] transition-all hover:opacity-95 disabled:opacity-50";
const SECONDARY = "h-auto gap-space-xs rounded-lg border-0 bg-surface-container-high px-space-md py-space-md font-label-caps text-label-caps font-bold text-text-primary uppercase transition-colors hover:bg-surface-container-highest";

/** The buttons for whoever is looking, at the stage the trade is at. */
export function FulfilmentActions({ code, fulfilment }: { code: string; fulfilment: Fulfilment }) {
  const { pending, offer, setOffer, markSent, confirm, simulate } = useFulfilment(code);
  const { pending: disputing, dispute } = useEscrowActions(code);
  const { role, stage } = fulfilment;

  if (role === "seller" && stage === "awaiting-offer") {
    return (
      <div className="flex flex-col gap-space-sm">
        {fulfilment.buyerTradeUrl ? (
          <LinkButton href={fulfilment.buyerTradeUrl} target="_blank" rel="noopener noreferrer" className={SECONDARY}>
            <Icon name="open_in_new" className="text-[16px]" />
            <span>Open {fulfilment.counterparty}&apos;s Steam trade URL</span>
          </LinkButton>
        ) : (
          <span className="rounded-lg bg-surface-container-lowest px-space-md py-space-sm font-body-sm text-body-sm text-text-muted">
            {fulfilment.counterparty} hasn&apos;t saved a Steam trade URL yet. Send the offer from their Steam profile as a friend trade.
          </span>
        )}
        <div className="flex flex-col gap-space-sm sm:flex-row">
          <Input
            value={offer}
            onChange={(event) => setOffer(event.target.value)}
            placeholder="https://steamcommunity.com/tradeoffer/6012345678/"
            aria-label="Steam trade offer link or number"
            className="h-12 flex-1 rounded-lg border-0 bg-surface-container-lowest px-space-md font-data-mono-md text-text-primary shadow-inner placeholder:text-text-muted"
          />
          <Button variant={null} size={null} disabled={pending || offer.trim().length < 6} onClick={markSent} className={PRIMARY}>
            <Icon name="send" className="text-[18px]" />
            <span>I&apos;ve sent the offer</span>
          </Button>
        </div>
      </div>
    );
  }

  if (role === "buyer" && stage === "awaiting-offer") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-space-md">
        <CancelOrderButton code={code} />
        {fulfilment.canSimulate && (
          <Button variant={null} size={null} disabled={pending} onClick={simulate} className={SECONDARY}>
            <Icon name="bolt" className="text-[16px] text-status-upcoming" />
            <span>Test mode: simulate the seller</span>
          </Button>
        )}
      </div>
    );
  }

  if (role === "buyer" && stage === "offer-sent") {
    return (
      <div className="flex flex-col gap-space-sm sm:flex-row">
        {fulfilment.offerUrl && (
          <LinkButton href={fulfilment.offerUrl} target="_blank" rel="noopener noreferrer" className={SECONDARY}>
            <Icon name="open_in_new" className="text-[16px]" />
            <span>Open the offer in Steam</span>
          </LinkButton>
        )}
        <Button variant={null} size={null} disabled={pending} onClick={confirm} className={`${PRIMARY} sm:flex-1`}>
          <Icon name="check_circle" className="text-[18px]" />
          <span>I received the item</span>
        </Button>
        <Button variant={null} size={null} disabled={disputing} onClick={dispute} className={SECONDARY}>
          <Icon name="gavel" className="text-[16px]" />
          <span>Report a problem</span>
        </Button>
      </div>
    );
  }

  if (role === "seller" && stage === "offer-sent" && fulfilment.offerUrl) {
    return (
      <LinkButton href={fulfilment.offerUrl} target="_blank" rel="noopener noreferrer" className={`${SECONDARY} self-start`}>
        <Icon name="open_in_new" className="text-[16px]" />
        <span>View your sent offer</span>
      </LinkButton>
    );
  }

  return null;
}
