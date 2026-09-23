ALTER TABLE "alert_rules" ADD COLUMN "auto_buy" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "alert_rules" ADD COLUMN "max_float" real;