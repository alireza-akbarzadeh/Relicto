CREATE TYPE "public"."counterparty_kind" AS ENUM('bot', 'merchant', 'user', 'pool');--> statement-breakpoint
CREATE TYPE "public"."ledger_venue" AS ENUM('tron', 'sepa', 'stripe', 'steam-escrow', 'marketplace', 'market-maker', 'internal');--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "detail_snapshot" text;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "attributes" jsonb;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "funding_label" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "settlement_note" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "counterparty_kind" "counterparty_kind";--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "counterparty_name" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "counterparty_note" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "thumbnail_alt" text;--> statement-breakpoint
ALTER TABLE "trade_offers" ADD COLUMN "bot_level" text;--> statement-breakpoint
ALTER TABLE "trade_offers" ADD COLUMN "bot_since" text;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD COLUMN "venue" "ledger_venue" DEFAULT 'internal' NOT NULL;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD COLUMN "asset_label" text;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD COLUMN "detail_label" text;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD COLUMN "node_label" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "fulfillment_seconds" integer;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "blurb" text;