import "server-only";
import type { WalletMobile } from "../mobile.types";
import { wallet } from "./wallet.mock";
import { walletMobile } from "./wallet-mobile.mock";

/** Treasury snapshot; replace this mock with the wallet API without changing the UI contract. */
export async function getWallet() {
  return wallet;
}

/** Mobile wallet: vault status, balances, rails and recent ledger. */
export async function getWalletMobile(): Promise<WalletMobile> {
  return walletMobile;
}
