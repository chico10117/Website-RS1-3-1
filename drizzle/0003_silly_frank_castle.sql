ALTER TABLE "restaurants" ADD COLUMN "custom_prompt" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "currency" text DEFAULT '€' NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "color" integer DEFAULT 1 NOT NULL;