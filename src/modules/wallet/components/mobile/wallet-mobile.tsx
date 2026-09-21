import { LinkedMobileHeader } from "@/modules/relicto/components/mobile/mobile-headers";
import { MobileTabBar } from "@/modules/relicto/components/mobile/mobile-tab-bar";
import { VaultFreezeProvider } from "../../hooks/use-vault-freeze";
import type { WalletMobile as WalletMobileData } from "../../mobile.types";
import { BalanceCard } from "./balance-card";
import { LedgerActivity } from "./ledger-activity";
import { LiquidityRails } from "./liquidity-rails";
import { QuickActions, VaultAlert } from "./quick-actions";

/** Mobile wallet (Stitch: "Lootora Mobile — Wallet & Instant Cashout"). */
export function WalletMobile({ wallet }: { wallet: WalletMobileData }) {
  return (
    <div className="flex flex-col bg-surface font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <LinkedMobileHeader />
      <main className="relative flex min-h-screen w-full flex-col bg-surface pt-16 pb-24">
        <VaultFreezeProvider>
          <div className="flex w-full flex-col gap-space-md px-margin pb-space-lg">
            <BalanceCard wallet={wallet} />
            <QuickActions actions={wallet.actions} />
            <LiquidityRails rails={wallet.rails} />
            <VaultAlert />
            <LedgerActivity ledger={wallet.ledger} />
          </div>
        </VaultFreezeProvider>
      </main>
      <MobileTabBar family="linked" active="wallet" />
    </div>
  );
}
