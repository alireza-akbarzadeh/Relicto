import { config } from "dotenv";
import { writeFileSync } from "node:fs";
config({ path: ".env.local" });
const T = "seed-trader-relicto";
const imp = (p: string) => import(p);
const { listingService } = await imp("@/server/modules/listings/listings.service");
const { alertService } = await imp("@/server/modules/alerts/alerts.service");
const { orderService } = await imp("@/server/modules/orders/orders.service");
const { profileService } = await imp("@/server/modules/profile/profile.service");
const { sellService } = await imp("@/server/modules/sell/sell.service");
const { trackerService } = await imp("@/server/modules/tracker/tracker.service");
const { walletService } = await imp("@/server/modules/wallet/wallet.service");
const { itemService } = await imp("@/server/modules/items/items.service");
const out = {
  catalog: await listingService.catalog({ sort: "recent" }),
  stats: await listingService.marketStats(["manifold-paradox", "butterfly-doppler"]),
  alerts: await alertService.list(T),
  ledger: await orderService.ledger(T),
  tracking: await orderService.tracking("LT-89410-ES"),
  profile: await profileService.detail(T),
  studio: await sellService.studio(T),
  tracker: await trackerService.terminal(T),
  wallet: await walletService.treasury(T),
  itemAk: await itemService.detail("ak-case-hardened"),
};
const replacer = (_k: string, v: unknown) => v instanceof Map ? Object.fromEntries(v) : v;
writeFileSync(process.argv[2], JSON.stringify(out, replacer, 2));
console.log("wrote", process.argv[2]);
process.exit(0);
