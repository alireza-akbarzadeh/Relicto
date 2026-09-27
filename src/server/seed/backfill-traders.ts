/**
 * Opens a profile and vault for every real account that has none — accounts
 * made before the sign-up hook existed. Safe to re-run; existing rows are untouched.
 *
 *   npm run db:backfill-traders
 */
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../../lib/db/schema";
import { bootstrapTrader, type BootstrapResult } from "../modules/profile/profile.bootstrap";

config({ path: ".env.local" });
config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function main() {
  // Seed accounts are the seed's business: the house seller has no profile on purpose ("House inventory").
  const { rows } = await db.execute<{ id: string }>(sql`
    select u.id from "user" u
    where u.id not like 'seed-%'
      and (not exists (select 1 from profiles p where p.user_id = u.id)
        or not exists (select 1 from wallet_accounts w where w.user_id = u.id))
  `);

  const tally: Record<BootstrapResult, number> = { created: 0, exists: 0, missing: 0 };
  for (const { id } of rows) tally[await bootstrapTrader(db, id)] += 1;

  console.log(`${rows.length} account(s) needed a profile or vault:`, tally);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
