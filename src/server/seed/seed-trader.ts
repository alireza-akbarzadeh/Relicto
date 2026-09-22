/**
 * Picks whose ledger and treasury get seeded. By default that's a demo trader;
 * pass `--user you@example.com` to attach the sample data to a real account so
 * the signed-in screens show it:
 *
 *   npm run db:seed -- --user you@example.com
 */
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../lib/db/schema";

type Db = NodePgDatabase<typeof schema>;

const DEMO_TRADER = {
  id: "seed-trader-relicto",
  name: "NyxTrader",
  email: "trader@relicto.seed",
  emailVerified: true,
  image: "/images/lootora/avatar.jpg",
};

/** The merchant on the far side of the live escrow, shown on the tracker. */
const VENDOR = {
  id: "seed-vendor-kuroskins",
  name: "KuroSkins",
  email: "kuroskins@relicto.seed",
  emailVerified: true,
  image: "/images/lootora/live-order-02.jpg",
};

const VENDOR_PROFILE = {
  id: "profile-kuroskins",
  userId: VENDOR.id,
  handle: "KuroSkins",
  role: "Merchant",
  tier: "PRO",
  level: 42,
  avatar: "/images/lootora/live-order-02.jpg",
  blurb: "Dota 2 & CS2 High-Tier Trader",
  /** Percent × 10, so 99.8% survives as an integer. */
  trustScore: 998,
  tradeCount: 4120,
  fulfillmentSeconds: 45,
} satisfies typeof schema.profiles.$inferInsert;

/** Reads `--user <email>` from argv, if present. */
export function targetEmail(argv: string[]): string | null {
  const at = argv.indexOf("--user");
  return at >= 0 ? (argv[at + 1] ?? null) : null;
}

export async function seedTrader(db: Db, email: string | null) {
  await db.insert(schema.user).values([DEMO_TRADER, VENDOR]).onConflictDoNothing();

  await db
    .insert(schema.profiles)
    .values(VENDOR_PROFILE)
    .onConflictDoUpdate({ target: schema.profiles.id, set: VENDOR_PROFILE });

  if (!email) return { traderId: DEMO_TRADER.id, vendorId: VENDOR.id, handle: DEMO_TRADER.name };

  const [account] = await db.select().from(schema.user).where(eq(schema.user.email, email)).limit(1);
  if (!account) throw new Error(`No account with email ${email} — sign up first, then re-run the seed.`);

  return { traderId: account.id, vendorId: VENDOR.id, handle: account.name };
}
