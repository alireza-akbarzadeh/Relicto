import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "@/lib/db/schema";

const { profiles, user, walletAccounts } = schema;

/** The app's pool or a script's own; the seed and backfill run outside Next. */
type Db = NodePgDatabase<typeof schema>;

export type BootstrapResult = "created" | "exists" | "missing";

/** Steam sign-ins carry `<steamid64>@steam.invalid` (see `steam-auth-plugin.ts`). */
const STEAM_EMAIL = /^(\d{17})@steam\.invalid$/;

/** "Steam trader 4821" → "Steam_trader_4821": handles print as `@handle`, so no spaces. */
export function toHandle(name: string) {
  const handle = name
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_.-]/gu, "")
    .slice(0, 24);
  return handle || "trader";
}

/** The name as given first, then suffixed from the account id, then at random. */
function candidates(base: string, userId: string) {
  const tail = userId.replace(/[^a-z0-9]/gi, "").slice(-4).toLowerCase();
  const random = () => Math.random().toString(36).slice(2, 6);
  return [base, `${base}_${tail}`, `${base}_${random()}`, `${base}_${random()}`];
}

/**
 * Opens a new account's trading profile and vault, so a fresh trader sees their
 * own (empty) profile and a $0.00 vault instead of the sample trader's.
 * Idempotent: an account that already has either keeps it untouched. Runs from
 * Better Auth's `user.create.after` hook, lazily on first profile read, and from
 * `npm run db:backfill-traders` for accounts that predate the hook.
 */
export async function bootstrapTrader(db: Db, userId: string): Promise<BootstrapResult> {
  const [account] = await db
    .select({ name: user.name, email: user.email, image: user.image })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!account) return "missing";

  await db.insert(walletAccounts).values({ id: `wallet-${userId}`, userId }).onConflictDoNothing();

  const hasProfile = async () =>
    (await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, userId)).limit(1)).length > 0;
  if (await hasProfile()) return "exists";

  const handle = toHandle(account.name);
  for (const candidate of candidates(handle, userId)) {
    // No conflict target: a taken handle and a racing insert for the same user both land here.
    const [row] = await db
      .insert(profiles)
      .values({
        id: `profile-${userId}`,
        userId,
        handle: candidate,
        steamId: account.email.match(STEAM_EMAIL)?.[1] ?? null,
        avatar: account.image,
        avatarAlt: account.image ? `${candidate} Steam avatar` : null,
      })
      .onConflictDoNothing()
      .returning({ id: profiles.id });
    if (row) return "created";
    if (await hasProfile()) return "exists";
  }
  throw new Error(`No free handle for ${userId} (tried "${handle}" and suffixes)`);
}
