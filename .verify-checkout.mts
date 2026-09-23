import { config } from "dotenv";
config({ path: ".env.local" });
const { checkoutService } = await import("@/server/modules/checkout/checkout.service");
const { checkout } = await import("@/modules/checkout/data/checkout.mock");

const stable = (v: unknown): string => JSON.stringify(v, (_k, x) =>
  x && typeof x === "object" && !Array.isArray(x)
    ? Object.fromEntries(Object.entries(x).sort(([a],[b]) => a.localeCompare(b))) : x);
const drop = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).filter(([k]) => k !== "id"));
let bad = 0;
const check = (l: string, a: unknown, b: unknown) => {
  if (stable(a) === stable(b)) return;
  bad++; console.log(`MISMATCH ${l}\n live:${stable(a)}\n mock:${stable(b)}`);
};
const live = await checkoutService.basket("seed-trader-relicto");
if (!live) throw new Error("empty basket");
live.items.forEach((x, i) => check(`item[${i}]`, drop(x as never), drop(checkout.items[i] as never)));
live.paymentRails.forEach((r, i) => check(`rail[${i}]`, r, checkout.paymentRails[i]));
check("totals", [live.subtotal, live.comboDiscount, live.promoDiscount], [checkout.subtotal, checkout.comboDiscount, checkout.promoDiscount]);
console.log("session   :", live.session, "| mock:", checkout.session);
console.log("walletAfter:", live.walletAfter, "| mock:", checkout.walletAfter);
console.log(bad === 0 ? "PARITY OK — basket matches the mock" : `${bad} mismatches`);
process.exit(0);
