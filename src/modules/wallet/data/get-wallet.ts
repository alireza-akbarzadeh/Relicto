import "server-only";
import { requireSettledViewer } from "@/modules/orders/data/expire-escrows";
import { walletService } from "@/server/modules/wallet/wallet.service";
import type { WalletMobile } from "../mobile.types";
import type { WalletData } from "../types";
import { wallet } from "./wallet.mock";
import { walletMobile } from "./wallet-mobile.mock";

/**
 * Treasury snapshot for the signed-in trader, from Postgres. Falls back to the
 * sample treasury until the account has a wallet of its own.
 */
const previewTreasury = (): WalletData => ({
  ...wallet,
  netEquity: "$0.00",
  equityChange: "0.0%",
  equityNote: "Make your first deposit to open your vault ledger.",
  liquidUsd: 0,
  transactions: [],
  isPreview: true,
  testDeposits: walletService.testDeposits(),
  metrics: wallet.metrics.map((metric) =>
    metric.id === "liquid"
      ? { ...metric, value: "$0.00", description: "Withdrawable once you deposit or sell inventory.", foot: "VAULT NOT OPEN · Deposit to activate", live: false }
      : { ...metric, value: "$0.00", foot: metric.foot.replace(/Held across.*/, "Opens with your first balance."), description: metric.description },
  ),
});

export async function getWallet(): Promise<WalletData> {
  const treasury = await walletService.treasury(await requireSettledViewer());
  return treasury ?? previewTreasury();
}

/** Mobile wallet: the same balances and ledger as desktop, with the mobile vault chrome, actions and rails. */
export async function getWalletMobile(): Promise<WalletMobile> {
  const { vault, actions, rails } = walletMobile;
  return (await walletService.treasuryMobile(await requireSettledViewer(), { vault, actions, rails })) ?? walletMobile;
}
