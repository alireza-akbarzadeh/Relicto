import "server-only";
import { tracker } from "./tracker.mock";

export async function getTracker() {
  return tracker;
}
