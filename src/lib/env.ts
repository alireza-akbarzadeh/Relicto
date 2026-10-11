import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_URL_UNPOOLED: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().optional(),
  BETTER_AUTH_API_KEY: z.string().optional(),
  STEAM_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  ESCROW_WEBHOOK_SECRET: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().optional(),
  CHECKOUT_MOCK_PAYMENTS: z.string().optional(),
  TRACKER_SIMULATE_VENUES: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
});

const isBuildOrLint = Boolean(
  process.env.npm_lifecycle_event === "lint" ||
  process.env.SKIP_ENV_VALIDATION === "true"
);

function validateEnv() {
  const server = serverSchema.safeParse(process.env);
  const client = clientSchema.safeParse(process.env);

  if (!server.success && !isBuildOrLint) {
    console.error("❌ Invalid environment variables:", server.error.flatten().fieldErrors);
    throw new Error("Invalid server environment variables. Check DATABASE_URL and BETTER_AUTH_SECRET.");
  }

  if (!client.success && !isBuildOrLint) {
    console.error("❌ Invalid client environment variables:", client.error.flatten().fieldErrors);
    throw new Error("Invalid client environment variables.");
  }

  return {
    ...server.data,
    ...client.data,
  };
}

export const env = validateEnv();
