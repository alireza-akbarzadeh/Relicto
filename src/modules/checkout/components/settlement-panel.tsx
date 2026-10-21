"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { RadioGroup } from "@/components/ui/radio-group";
import { formatMoney } from "@/lib/format";
import type { DispatchChoice } from "../hooks/use-checkout-dispatch";
import { quote } from "../lib/pricing";
import type { CheckoutData } from "../types";

import { useCart } from "@/modules/relicto/state/cart-provider";
import { CryptoModal } from "./crypto-modal";
import { PaymentOption } from "./payment-option";

export function SettlementPanel({
  data,
  onDispatch,
  pending = false,
}: {
  data: CheckoutData;
  onDispatch: (choice: DispatchChoice) => void;
  pending?: boolean;
}) {
  const t = useTranslations("checkout");
  const { promo, setPromo } = useCart();
  const [payment, setPayment] = useState("relicto");
  const [agreed, setAgreed] = useState(true);
  const [cryptoOpen, setCryptoOpen] = useState(false);

  const q = quote(data.items.map((item) => Math.round(item.price * 100)), promo);
  const total = q.dueCents / 100;
  const combo = Math.min(q.comboCents, q.subtotalCents) / 100;
  const promoOff = Math.min(q.promoCents, Math.max(0, q.subtotalCents - q.comboCents)) / 100;

  const handleCtaClick = () => {
    if (payment === "crypto") {
      setCryptoOpen(true);
      return;
    }
    onDispatch({ rail: payment, promo });
  };

  const getCtaLabel = () => {
    if (pending) return t("ctaDispatching");
    if (payment === "card") return t("ctaCard", { total: formatMoney(total) });
    if (payment === "crypto") return t("ctaCrypto", { total: formatMoney(total) });
    if (payment === "steam") return t("ctaSteam", { total: formatMoney(total) });
    return t("ctaAuthorize", { total: formatMoney(total) });
  };

  return (
    <>
      <aside className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-white/8 bg-surface-card p-5 shadow-xl sm:p-6">
        <div className="flex items-center justify-between border-b border-white/6 pb-3">
          <h2 className="font-headline-sm text-sm font-bold text-text-primary">
            {t("paymentMethod")}
          </h2>
          <span className="flex items-center gap-1 font-data-mono-md text-[11px] text-text-muted">
            <Icon name="lock" className="text-[13px] text-status-upcoming" />
            {t("sslSecured")}
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
              <span className="text-[11px] text-text-muted">{t("vaultBalance")}</span>
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
          <Button
            type="button"
            variant={null}
            size={null}
            onClick={() => setPromo((active) => !active)}
            className="h-auto border-0 p-0 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            {promo ? t("promoRemove") : t("promoApply")}
          </Button>
        </div>

        {/* Order Summary Lines */}
        <div className="flex flex-col gap-2 rounded-xl border border-white/6 bg-surface-container-lowest/60 p-4">
          <div className="flex justify-between text-xs text-text-secondary">
            <span>{t("subtotalLabel", { count: data.items.length, items: data.items.length === 1 ? t("itemsWord_one") : t("itemsWord_other") })}</span>
            <span className="font-data-mono-md font-semibold text-text-primary">
              {formatMoney(q.subtotalCents / 100)}
            </span>
          </div>
          {combo > 0 && (
            <div className="flex justify-between text-xs text-tertiary">
              <span className="flex items-center gap-1">
                <Icon name="stars" className="text-[13px]" />
                {t("bundleRebate")}
              </span>
              <span className="font-data-mono-md font-semibold">-{formatMoney(combo)}</span>
            </div>
          )}
          {promo && promoOff > 0 && (
            <div className="flex justify-between text-xs text-status-upcoming">
              <span className="flex items-center gap-1">
                <Icon name="confirmation_number" className="text-[13px]" />
                {t("tournamentCode")}
              </span>
              <span className="font-data-mono-md font-semibold">-{formatMoney(promoOff)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-text-muted">
            <span>{t("escrowUnderwriting")}</span>
            <span className="font-data-mono-md text-status-upcoming">{t("free")}</span>
          </div>

          <div className="my-1 border-t border-white/6" />

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex flex-col">
              <span className="font-headline-sm text-xs font-bold text-text-primary">{t("totalPayable")}</span>
              <span className="text-[11px] text-text-muted">{t("instantDispatch")}</span>
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
            {t("termsConsent")}
          </span>
        </label>

        {/* CTA Button */}
        <Button
          onClick={handleCtaClick}
          disabled={pending || !agreed || data.items.length === 0}
          className="h-12 w-full gap-2 rounded-xl bg-primary-container px-6 font-headline-sm text-sm font-bold tracking-wide text-on-primary-container shadow-lg transition-all hover:bg-primary-container/90 disabled:opacity-50"
        >
          <Icon name="lock" className="text-[17px]" />
          <span>{getCtaLabel()}</span>
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-center font-data-mono-md text-[11px] text-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-status-upcoming" />
          <span>{t("botDispatchFooter")}</span>
        </div>

        {/* Support Strip */}
        <div className="flex items-center justify-between rounded-xl border border-white/6 bg-surface-container-lowest px-3.5 py-2 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Icon name="support_agent" className="text-[16px] text-secondary" />
            <span>{t("needHelp")}</span>
          </div>
          <span className="font-medium text-text-primary hover:underline cursor-pointer">
            {t("liveConcierge")}
          </span>
        </div>
      </aside>

      <CryptoModal
        open={cryptoOpen}
        onOpenChange={setCryptoOpen}
        totalUsd={total}
        isPending={pending}
        onConfirm={({ network, txHash }) => {
          setCryptoOpen(false);
          onDispatch({ rail: "crypto", promo, txHash: `${network.symbol}:${txHash}` });
        }}
      />
    </>
  );
}
