import "server-only";
import { sell } from "./sell.mock";

/** Seller studio snapshot; replace this mock with the inventory/listings APIs later. */
export async function getSell() {
  return sell;
}
