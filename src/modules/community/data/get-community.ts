import "server-only";
import { community } from "./community.mock";

export async function getCommunity() {
  return community;
}
