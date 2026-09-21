import "server-only";
import { tracker } from "./tracker.mock";
import { trackerMobile } from "./tracker-mobile.mock";

export async function getTracker() {
  return tracker;
}

/** Mobile terminal: ticker tape, tracked asset, depth book and arbitrage cards. */
export async function getTrackerMobile() {
  return trackerMobile;
}
