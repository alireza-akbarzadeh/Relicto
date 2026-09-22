ALTER TABLE "items" ADD COLUMN "presentation" jsonb;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "offer_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "change_percent" real;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "change_window" text;