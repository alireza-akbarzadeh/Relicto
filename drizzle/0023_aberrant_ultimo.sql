ALTER TABLE "listings" ADD COLUMN "allow_offers" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "listings" ADD COLUMN "min_offer_cents" integer;