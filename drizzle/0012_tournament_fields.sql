ALTER TABLE "matches" ADD COLUMN "round" text;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "presentation" jsonb;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "format" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "capacity" integer;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "capacity_unit" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "entrant_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "registration_closes_at" timestamp;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "image_alt" text;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "tournaments" ADD COLUMN "presentation" jsonb;