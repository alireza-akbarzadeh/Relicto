"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { SiteFooter } from "@/modules/relicto/components/shell/site-footer";
import { VaultHeader } from "@/modules/relicto/components/shell/vault-header";
import { useCart } from "@/modules/relicto/state/cart-provider";
import { useCheckoutDispatch } from "../hooks/use-checkout-dispatch";
import type { CheckoutData } from "../types";
import { CheckoutIntro } from "./checkout-intro";
import { CheckoutItems } from "./checkout-items";
import { ComboBanner } from "./combo-banner";
import { DispatchModal } from "./dispatch-modal";
import { EscrowGuarantee } from "./escrow-guarantee";
import { RecipientGate } from "./recipient-gate";
import { SettlementPanel } from "./settlement-panel";

export function CheckoutView({ data }: { data: CheckoutData }) {
  const t = useTranslations("checkout");
  const searchParams = useSearchParams();
  const { items, removeItem, sync } = useCart();
  const { dispatch, pending, codes, close, monitor } = useCheckoutDispatch();

  useEffect(() => {
    if (searchParams.get("stripe_success") === "true") {
      toast.success(t("stripeSuccess"), {
        description: t("stripeSuccessDesc"),
      });
      sync([]);
    } else if (searchParams.get("stripe_cancel") === "true") {
      toast.info(t("stripeCancel"), {
        description: t("stripeCancelDesc"),
      });
    }
  }, [searchParams, sync, t]);

  return (
    <div className="min-h-screen bg-canvas-base font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <VaultHeader steamId={data.recipient?.steamId ?? "76561198082348819"} />
      <main className="w-full bg-canvas-base px-4 pb-20 pt-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-6">
          <CheckoutIntro session={data.session} count={items.length} />
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="flex min-w-0 flex-col gap-6 lg:col-span-7 xl:col-span-7">
              <RecipientGate recipient={data.recipient} />
              <CheckoutItems items={items} onRemove={removeItem} />
              <ComboBanner comboDiscount={data.comboDiscount} itemCount={items.length} />
              <EscrowGuarantee />
            </div>
            <div className="lg:col-span-5 xl:col-span-5">
              <SettlementPanel data={{ ...data, items }} onDispatch={dispatch} pending={pending} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      {codes && <DispatchModal items={items} onClose={close} onMonitor={monitor} />}
    </div>
  );
}
