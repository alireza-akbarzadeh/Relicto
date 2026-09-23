CREATE TYPE "public"."book_side" AS ENUM('buy', 'sell');--> statement-breakpoint
CREATE TABLE "market_spreads" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text,
	"asset" text NOT NULL,
	"detail" text,
	"floor_cents" integer NOT NULL,
	"steam_cents" integer NOT NULL,
	"secondary_cents" integer NOT NULL,
	"fee_bps" integer DEFAULT 1200 NOT NULL,
	"tone" text DEFAULT 'muted' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_book_levels" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"source" text NOT NULL,
	"side" "book_side" NOT NULL,
	"price_cents" integer NOT NULL,
	"total_cents" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "watchlist" ADD COLUMN "label" text;--> statement-breakpoint
ALTER TABLE "watchlist" ADD COLUMN "detail" text;--> statement-breakpoint
ALTER TABLE "watchlist" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "watchlist" ADD COLUMN "icon" text DEFAULT 'target' NOT NULL;--> statement-breakpoint
ALTER TABLE "watchlist" ADD COLUMN "tone" text DEFAULT 'muted' NOT NULL;--> statement-breakpoint
ALTER TABLE "watchlist" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "market_spreads" ADD CONSTRAINT "market_spreads_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_book_levels" ADD CONSTRAINT "order_book_levels_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "market_spreads_item_idx" ON "market_spreads" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "order_book_levels_item_idx" ON "order_book_levels" USING btree ("item_id","price_cents");