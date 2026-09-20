import type { Metadata } from "next";
import { SellView } from "@/modules/sell/components/sell-view";
import { getSell } from "@/modules/sell/data/get-sell";

export const metadata: Metadata = {
  title: "Sell Items",
  description: "List Steam inventory items with live floor pricing and instant escrow liquidity.",
};

export default async function SellPage() {
  const data = await getSell();
  return <SellView data={data} />;
}
