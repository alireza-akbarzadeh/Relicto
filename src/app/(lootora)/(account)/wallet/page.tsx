import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WalletMobile } from "@/modules/wallet/components/mobile/wallet-mobile";
import { WalletView } from "@/modules/wallet/components/wallet-view";
import { getWallet, getWalletMobile } from "@/modules/wallet/data/get-wallet";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("walletTitle"),
    description: t("walletDesc"),
  };
}

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default async function WalletPage() {
  const [data, mobile] = await Promise.all([getWallet(), getWalletMobile()]);
  return (
    <Suspense>
      <div className="md:hidden">
        <WalletMobile wallet={mobile} />
      </div>
      <div className="hidden md:block">
        <WalletView data={data} />
      </div>
    </Suspense>
  );
}
