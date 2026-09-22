import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load environment variables from .env.local first, falling back to .env
config({ path: ".env.local" });
config();

/** Migrations run over the direct (unpooled) endpoint; the app uses the pooler. */
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error("Missing DATABASE_URL_UNPOOLED or DATABASE_URL in environment variables.");
}

export default defineConfig({
  schema: "./src/lib/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});