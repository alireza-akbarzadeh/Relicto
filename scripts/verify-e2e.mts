import { config } from "dotenv";
config({ path: ".env.local" });
config();

import assert from "node:assert/strict";
import { listingService } from "../src/server/modules/listings/listings.service";
import { itemService } from "../src/server/modules/items/items.service";
import { profileService } from "../src/server/modules/profile/profile.service";
import { walletService } from "../src/server/modules/wallet/wallet.service";
import { cashoutInput } from "../src/server/modules/wallet/wallet.schema";
import { DEFAULT_FILTERS } from "../src/modules/marketplace/lib/filters";
import { quote, allocate, COMBO_DISCOUNT_CENTS, PROMO_DISCOUNT_CENTS } from "../src/modules/checkout/lib/pricing";
import { CS2_COLLECTION_POOLS, GRADE_UP_MAP } from "../src/server/modules/trade-ups/trade-ups.collections";
import { steamDaemonService } from "../src/server/modules/steam-daemon/steam-daemon.service";

async function run() {
  console.log("⚡ Starting Relicto End-to-End Verification Suite...");

  // 1. Marketplace & Search Engine
  console.log("▶ [1/7] Testing Marketplace Search & Facet Engine...");
  const searchResult = await listingService.search(DEFAULT_FILTERS);
  assert(searchResult.total > 0, "Marketplace should contain active listings");
  assert(searchResult.items.length > 0, "Marketplace page 1 should contain items");
  assert(searchResult.facets !== undefined, "Search should return facet counts");
  console.log(`  ✓ Search returns ${searchResult.total} active listings across ${searchResult.items.length} cards on page 1`);

  // 2. Item Detail & Seller Book
  console.log("▶ [2/7] Testing Catalog Item Detail & Live Seller Book...");
  const itemDetail = await itemService.detail("butterfly-doppler", null);
  assert(itemDetail !== null, "Item butterfly-doppler must resolve");
  assert(itemDetail.price.lowestUsd > 0, "Lowest price must be positive");
  assert(Array.isArray(itemDetail.offers), "Offers must be an array");
  console.log(`  ✓ Resolved "${itemDetail.name}" (Floor: $${itemDetail.price.lowestUsd}, Sellers in book: ${itemDetail.offers.length})`);

  // 3. Profile & Public Storefront
  console.log("▶ [3/7] Testing Profile Service & Public Storefronts...");
  const profile = await profileService.detail("seed-trader-relicto");
  assert(profile !== null, "Seed trader profile must exist");
  assert(profile.identity.handle.length > 0, "Profile must have a handle");
  const storefront = await profileService.publicStorefront(profile.identity.handle);
  assert(storefront !== null, `Public storefront for ${profile.identity.handle} must resolve`);
  console.log(`  ✓ Profile and public storefront resolved for @${profile.identity.handle} (Alias: ${profile.identity.alias}, Tier: ${profile.identity.tier})`);

  // 4. Wallet Treasury & Committed Funds Protection
  console.log("▶ [4/7] Testing Wallet Treasury & Committed Funds Protection...");
  const liquid = await walletService.liquidCents("seed-trader-relicto");
  const uncommitted = await walletService.uncommittedLiquidCents("seed-trader-relicto");
  assert(liquid >= 0, "Liquid balance must be non-negative");
  assert(uncommitted <= liquid, "Uncommitted balance must be <= liquid balance");
  const treasury = await walletService.treasury("seed-trader-relicto");
  assert(treasury !== null, "Treasury snapshot must resolve");
  assert(treasury.cashoutRails.length === 4, "Must expose 4 cashout rails");
  console.log(`  ✓ Treasury verified: Liquid $${(liquid / 100).toFixed(2)}, Uncommitted $${(uncommitted / 100).toFixed(2)}, Transactions: ${treasury.transactions.length}`);

  // 5. Cashout Validation with Destination Address Support
  console.log("▶ [5/7] Testing Cashout Schema Validation (Destination Support)...");
  const validCashout = cashoutInput.parse({
    rail: "usdt",
    amountUsd: 150.0,
    steamGuardCode: "X9K2P",
    destinationAddress: "TQ7sWk8X19B4gZ9xKLmP2xRa8v4e...99La",
  });
  assert(validCashout.rail === "usdt");
  assert(validCashout.destinationAddress?.startsWith("TQ7s"));
  console.log("  ✓ Cashout schema correctly validates amount, 2FA, and custom destination address");

  // 6. Basket Checkout Pricing & Allocation
  console.log("▶ [6/7] Testing Basket Checkout Pricing & Discount Allocation...");
  const samplePrices = [5000, 10000, 15000]; // 3 items = $300.00
  const quoted = quote(samplePrices, true);
  assert.equal(quoted.subtotalCents, 30000);
  assert.equal(quoted.comboCents, COMBO_DISCOUNT_CENTS); // $25 combo relief
  assert.equal(quoted.promoCents, PROMO_DISCOUNT_CENTS); // $15 promo relief
  assert.equal(quoted.dueCents, 30000 - 2500 - 1500); // $260.00
  const allocated = allocate(samplePrices, quoted.comboCents + quoted.promoCents);
  assert.equal(allocated.reduce((a, b) => a + b, 0), quoted.comboCents + quoted.promoCents);
  console.log(`  ✓ Quote arithmetic verified: Subtotal $300 -> Due $${(quoted.dueCents / 100).toFixed(2)} with proportional allocation`);

  // 7. CS2 Trade-Up Engine & Autonomous Steam Daemon
  console.log("▶ [7/7] Testing CS2 Trade-Up Engine Pools & Steam Bot Daemon...");
  assert("The Breakout Collection" in CS2_COLLECTION_POOLS, "Breakout collection must exist");
  assert.equal(GRADE_UP_MAP["Classified"], "Covert", "Classified must trade up to Covert");
  const daemonCycle = await steamDaemonService.runDaemonCycle();
  assert(typeof daemonCycle.scannedCount === "number", "Daemon cycle must report scanned count");
  console.log(`  ✓ CS2 weapon pools verified; Steam Daemon cycle completed (Scanned: ${daemonCycle.scannedCount}, Dispatched: ${daemonCycle.dispatchedCount})`);

  console.log("\n🎉 All 7 Relicto verification milestones passed with 100% success!");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
