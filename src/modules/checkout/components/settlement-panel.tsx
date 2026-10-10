"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import type { DispatchChoice } from "../hooks/use-checkout-dispatch";
import { quote } from "../lib/pricing";
import type { CheckoutData, PaymentRail } from "../types";

export function SettlementPanel({
  data,
  onDispatch,
  pending = false,
}: {
  data: CheckoutData;
  onDispatch: (choice: DispatchChoice) => void;
  pending?: boolean;
}) {
  const [payment, setPayment] = useState("relicto");
  const [promo, setPromo] = useState(true);
  const [agreed, setAgreed] = useState(true);

  const q = quote(data.items.map((item) => Math.round(item.price * 100)), promo);
  const total = q.dueCents / 100;
  const combo = Math.min(q.comboCents, q.subtotalCents) / 100;
  const promoOff = Math.min(q.promoCents, Math.max(0, q.subtotalCents - q.comboCents)) / 100;

  return (
    <aside className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-white/8 bg-surface-card p-5 shadow-xl sm:p-6">
      <div className="flex items-center justify-between border-b border-white/6 pb-3">
        <h2 className="font-headline-sm text-sm font-bold text-text-primary">
          Payment Method
        </h2>
        <span className="flex items-center gap-1 font-data-mono-md text-[11px] text-text-muted">
          <Icon name="lock" className="text-[13px] text-status-upcoming" />
          256-bit SSL
        </span>
      </div>

      <RadioGroup value={payment} onValueChange={setPayment} className="flex flex-col gap-2.5">
        {data.paymentRails.map((rail) => (
          <PaymentOption key={rail.id} rail={rail} selected={payment === rail.id} />
        ))}
      </RadioGroup>

      {/* Wallet Balance Status */}
      <div className="flex items-center justify-between rounded-xl border border-white/6 bg-surface-container-lowest px-3.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <Icon name="account_balance_wallet" className="text-[17px] text-text-muted shrink-0" />
          <div className="flex flex-col">
            <span className="text-[11px] text-text-muted">Vault Balance</span>
            <span className="font-data-mono-md text-xs font-semibold text-text-primary">
              {data.walletAfter}
            </span>
          </div>
        </div>
      </div>

      {/* Promo Code Row */}
      <div className="flex items-center justify-between rounded-xl border border-white/6 bg-surface-container-lowest px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <Icon name="confirmation_number" className="text-[16px] text-tertiary" />
          <span className="font-data-mono-md text-xs font-bold text-text-primary">TI14-MAJOR-VIP</span>
          {promo && (
            <span className="rounded bg-status-upcoming/15 px-1.5 py-0.5 font-data-mono-md text-[10px] font-medium text-status-upcoming">
              -$15.00
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setPromo((active) => !active)}
          className="text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          {promo ? "Remove" : "Apply"}
        </button>
      </div>

      {/* Order Summary Lines */}
      <div className="flex flex-col gap-2 rounded-xl border border-white/6 bg-surface-container-lowest/60 p-4">
        <div className="flex justify-between text-xs text-text-secondary">
          <span>Subtotal ({data.items.length} {data.items.length === 1 ? "item" : "items"})</span>
          <span className="font-data-mono-md font-semibold text-text-primary">
            {formatMoney(q.subtotalCents / 100)}
          </span>
        </div>
        {combo > 0 && (
          <div className="flex justify-between text-xs text-tertiary">
            <span className="flex items-center gap-1">
              <Icon name="stars" className="text-[13px]" />
              Bundle Rebate
            </span>
            <span className="font-data-mono-md font-semibold">-{formatMoney(combo)}</span>
          </div>
        )}
        {promo && promoOff > 0 && (
          <div className="flex justify-between text-xs text-status-upcoming">
            <span className="flex items-center gap-1">
              <Icon name="confirmation_number" className="text-[13px]" />
              Tournament Code
            </span>
            <span className="font-data-mono-md font-semibold">-{formatMoney(promoOff)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-text-muted">
          <span>Escrow Underwriting</span>
          <span className="font-data-mono-md text-status-upcoming">Free</span>
        </div>

        <div className="my-1 border-t border-white/6" />

        <div className="flex items-baseline justify-between pt-1">
          <div className="flex flex-col">
            <span className="font-headline-sm text-xs font-bold text-text-primary">Total Payable</span>
            <span className="text-[11px] text-text-muted">Instant escrow dispatch</span>
          </div>
          <span className="font-data-mono-lg text-2xl font-bold tracking-tight text-text-primary">
            {formatMoney(total)}
          </span>
        </div>
      </div>

      {/* Terms and Consent */}
      <label className="flex items-start gap-2.5 cursor-pointer pt-1">
        <Checkbox checked={agreed} onCheckedChange={(val) => setAgreed(!!val)} className="mt-0.5" />
        <span className="text-xs leading-relaxed text-text-muted">
          I verify my Steam Trade URL is operational and authorize the escrow debit. Offers not sent within 12h are 100% refunded.
        </span>
      </label>

      {/* CTA Button */}
      <Button
        onClick={() => onDispatch({ rail: payment, promo })}
        disabled={pending || !agreed || data.items.length === 0}
        className="h-12 w-full gap-2 rounded-xl bg-primary-container px-6 font-headline-sm text-sm font-bold tracking-wide text-on-primary-container shadow-lg transition-all hover:bg-primary-container/90 disabled:opacity-50"
      >
        <Icon name="lock" className="text-[17px]" />
        <span>{pending ? "Dispatching..." : `Authorize & Dispatch (${formatMoney(total)})`}</span>
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-center font-data-mono-md text-[11px] text-text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-status-upcoming" />
        <span>Automated bot dispatch in &lt;30s · Zero loss guarantee</span>
      </div>

      {/* Support Strip */}
      <div className="flex items-center justify-between rounded-xl border border-white/6 bg-surface-container-lowest px-3.5 py-2 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <Icon name="support_agent" className="text-[16px] text-secondary" />
          <span>Need Trade Help?</span>
        </div>
        <span className="font-medium text-text-primary hover:underline cursor-pointer">
          24/7 Live Concierge
        </span>
      </div>
    </aside>
  );
}

function PaymentOption({ rail, selected }: { rail: PaymentRail; selected: boolean }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col gap-1.5 rounded-xl border p-3.5 transition-all",
        selected
          ? "border-primary/50 bg-surface-container-high/90 shadow-xs ring-1 ring-primary/20"
          : "border-white/6 bg-surface-container-lowest/80 hover:bg-surface-container-low hover:border-white/12",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <RadioGroupItem value={rail.id} aria-label={rail.title} className="shrink-0" />
          <Icon name={rail.icon} className="text-[17px] text-text-secondary shrink-0" />
          <span className="truncate font-headline-sm text-xs font-bold text-text-primary">{rail.title}</span>
          {rail.badge && (
            <span className="shrink-0 whitespace-nowrap rounded bg-primary-container/20 px-1.5 py-0.5 font-data-mono-md text-[10px] font-semibold text-primary">
              {rail.badge}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 pl-7 font-data-mono-md text-[11px]">
        <span className="truncate text-text-muted">{rail.detail}</span>
        <span className={cn("shrink-0 font-medium", selected ? "text-status-upcoming" : "text-text-muted")}>
          {rail.note}
        </span>
      </div>
    </label>
  );
}
