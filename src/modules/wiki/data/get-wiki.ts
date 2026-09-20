import "server-only";
import { wiki } from "./wiki.mock";

export async function getWiki() {
  return wiki;
}
