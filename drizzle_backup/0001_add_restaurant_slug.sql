ALTER TABLE "restaurants" ADD COLUMN "slug" text UNIQUE;
--> statement-breakpoint
-- Update existing restaurants with slugs based on their names (remove special chars and spaces)
UPDATE "restaurants" SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM(name), '[^\w\s]', '', 'g'), '\s+', '', 'g'));
--> statement-breakpoint
-- Make slug column NOT NULL after populating existing records
ALTER TABLE "restaurants" ALTER COLUMN "slug" SET NOT NULL; 