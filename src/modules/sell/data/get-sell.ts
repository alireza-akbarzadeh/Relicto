import "server-only";
import type { SellMobile } from "../mobile.types";
import { sell } from "./sell.mock";
import { sellMobile } from "./sell-mobile.mock";

/** Seller studio snapshot; replace this mock with the inventory/listings APIs later. */
export async function getSell() {
  return sell;
}

/** Mobile trade-up contract and bulk cashout tray. */
export async function getSellMobile(): Promise<SellMobile> {
  return sellMobile;
}
