import type { Metadata } from "next";
import { WalletView } from "@/modules/wallet/components/wallet-view";
import { getWallet } from "@/modules/wallet/data/get-wallet";

export const metadata: Metadata = {
  title: "Wallet & Income",
  description: "Manage wallet deposits, cashouts, escrow locks and audited treasury activity.",
};

export default async function WalletPage() {
  const data = await getWallet();
  return <WalletView data={data} />;
}
