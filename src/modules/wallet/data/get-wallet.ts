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
export async function getWallet(): Promise<WalletData> {
  const treasury = await walletService.treasury(await requireSettledViewer());
  return treasury ?? wallet;
}

/** Mobile wallet: the same balances and ledger as desktop, with the mobile vault chrome, actions and rails. */
export async function getWalletMobile(): Promise<WalletMobile> {
  const { vault, actions, rails } = walletMobile;
  return (await walletService.treasuryMobile(await requireSettledViewer(), { vault, actions, rails })) ?? walletMobile;
}
