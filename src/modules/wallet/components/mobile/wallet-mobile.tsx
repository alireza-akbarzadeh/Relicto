"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LinkedMobileHeader } from "@/modules/relicto/components/mobile/mobile-headers";
import { MobileTabBar } from "@/modules/relicto/components/mobile/mobile-tab-bar";
import { VaultFreezeProvider } from "../../hooks/use-vault-freeze";
import type { QuickAction, WalletMobile as WalletMobileData } from "../../mobile.types";
import { BalanceCard } from "./balance-card";
import { LedgerActivity } from "./ledger-activity";
import { LiquidityRails } from "./liquidity-rails";
import { MobileCashoutSheet } from "./mobile-cashout-sheet";
import { MobileDepositSheet } from "./mobile-deposit-sheet";
import { MobileSendSheet } from "./mobile-send-sheet";
import { QuickActions, VaultAlert } from "./quick-actions";

/** Mobile wallet (Stitch: "Lootora Mobile — Wallet & Instant Cashout"). */
export function WalletMobile({ wallet }: { wallet: WalletMobileData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [depositOpen, setDepositOpen] = useState(false);
  const [cashoutOpen, setCashoutOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [selectedRail, setSelectedRail] = useState<string>("crypto");

  useEffect(() => {
    if (searchParams.get("stripe_deposit_success") === "true") {
      const amount = searchParams.get("amount");
      toast.success("Deposit Confirmed via Stripe", {
        description: amount
          ? `$${amount} USD has been credited to your Relicto Vault.`
          : "Your deposit has been credited to your Relicto Vault.",
      });
    } else if (searchParams.get("stripe_deposit_cancel") === "true") {
      toast.info("Deposit Cancelled", {
        description: "No funds were charged to your card.",
      });
    }
  }, [searchParams]);

  const handleAction = (actionId: QuickAction["id"]) => {
    if (actionId === "deposit") {
      setSelectedRail("crypto");
      setDepositOpen(true);
    } else if (actionId === "cashout") {
      setCashoutOpen(true);
    } else if (actionId === "send") {
      setSendOpen(true);
    }
  };

  const handleSelectRail = (railId: string) => {
    if (railId === "steam") {
      router.push("/sell");
    } else if (railId === "card") {
      setSelectedRail("cards");
      setDepositOpen(true);
    } else if (railId === "wire") {
      setSelectedRail("bank");
      setDepositOpen(true);
    } else {
      setSelectedRail("crypto");
      setDepositOpen(true);
    }
  };

  return (
    <div className="flex flex-col bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <LinkedMobileHeader />
      <main className="relative flex min-h-screen w-full flex-col bg-surface pt-16 pb-24">
        <VaultFreezeProvider initial={wallet.frozen}>
          <div className="flex w-full flex-col gap-space-md px-margin pb-space-lg">
            <BalanceCard wallet={wallet} />
            <QuickActions actions={wallet.actions} onAction={handleAction} />
            <LiquidityRails rails={wallet.rails} onSelectRail={handleSelectRail} />
            <VaultAlert />
            <LedgerActivity ledger={wallet.ledger} />
          </div>
        </VaultFreezeProvider>
      </main>
      <MobileTabBar family="linked" active="wallet" />

      <MobileDepositSheet
        open={depositOpen}
        onOpenChange={setDepositOpen}
        rail={selectedRail}
        onRailChange={setSelectedRail}
      />

      <MobileCashoutSheet
        open={cashoutOpen}
        onOpenChange={setCashoutOpen}
        availableUsd={wallet.availableUsd}
      />

      <MobileSendSheet
        open={sendOpen}
        onOpenChange={setSendOpen}
        availableUsd={wallet.availableUsd}
      />
    </div>
  );
}
