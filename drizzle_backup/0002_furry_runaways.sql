-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"picture" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Create a temporary admin user for existing restaurants
DO $$ 
BEGIN
  INSERT INTO "users" (id, email, name, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'admin@example.com',
    'Admin',
    now(),
    now()
  )
  ON CONFLICT (email) DO NOTHING;
END $$;

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'restaurants' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE "restaurants" ADD COLUMN "user_id" uuid;
  END IF;
END $$;

-- Update existing restaurants to use the admin user
UPDATE "restaurants" 
SET "user_id" = (SELECT id FROM "users" WHERE email = 'admin@example.com')
WHERE "user_id" IS NULL;

-- Make user_id not null after updating existing records
ALTER TABLE "restaurants" ALTER COLUMN "user_id" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "restaurants" 
ADD CONSTRAINT "restaurants_user_id_users_id_fk" 
FOREIGN KEY ("user_id") 
REFERENCES "public"."users"("id") 
ON DELETE cascade 
ON UPDATE no action;