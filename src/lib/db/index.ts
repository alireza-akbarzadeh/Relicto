import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

/**
 * Neon closes idle connections on its side, and a pool that hands out a socket
 * the server already dropped fails the first query after a quiet spell
 * ("Connection terminated unexpectedly"). Retire idle clients well before that,
 * and keep a dropped socket's error from escaping as an uncaught exception.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (error) => {
  console.error("[db] idle client error — it will be replaced", error.message);
});

/** On Vercel, lets the function release idle clients before it suspends (Neon's guidance). */
attachDatabasePool(pool);

export const db = drizzle(pool, { schema });
