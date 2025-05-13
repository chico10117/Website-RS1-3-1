ALTER TABLE "restaurants" ALTER COLUMN "color" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "color" SET DEFAULT '1';--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "dishes" ADD COLUMN "currency" text DEFAULT '€' NOT NULL;--> statement-breakpoint
ALTER TABLE "dishes" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "phoneNumber" bigint;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "reservas" text;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "redes_sociales" text;