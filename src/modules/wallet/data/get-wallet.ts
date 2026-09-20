import "server-only";
import { wallet } from "./wallet.mock";

/** Treasury snapshot; replace this mock with the wallet API without changing the UI contract. */
export async function getWallet() {
  return wallet;
}
