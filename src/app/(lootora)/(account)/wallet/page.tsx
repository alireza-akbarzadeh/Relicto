import type { Metadata } from "next";
import { WalletMobile } from "@/modules/wallet/components/mobile/wallet-mobile";
import { WalletView } from "@/modules/wallet/components/wallet-view";
import { getWallet, getWalletMobile } from "@/modules/wallet/data/get-wallet";

export const metadata: Metadata = {
  title: "Wallet & Income",
  description: "Manage wallet deposits, cashouts, escrow locks and audited treasury activity.",
};

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default async function WalletPage() {
  const [data, mobile] = await Promise.all([getWallet(), getWalletMobile()]);
  return (
    <>
      <div className="md:hidden">
        <WalletMobile wallet={mobile} />
      </div>
      <div className="hidden md:block">
        <WalletView data={data} />
      </div>
    </>
  );
}
