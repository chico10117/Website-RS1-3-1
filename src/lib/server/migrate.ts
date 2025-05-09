import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const runMigration = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('⏳ Running migrations...');
  
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "email" text NOT NULL,
        "name" text,
        "picture" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "users_email_unique" UNIQUE("email")
      );
    `;

    // Create admin user (idempotent)
    await sql`
      INSERT INTO "users" (id, email, name, created_at, updated_at)
      VALUES (
        '00000000-0000-0000-0000-000000000000', -- Consistent Admin UUID for idempotency
        'admin@example.com',
        'Admin',
        now(),
        now()
      )
      ON CONFLICT (email) DO NOTHING;
    `;

    // Create restaurants table if not exists (added for completeness and FK dependency)
    await sql`
      CREATE TABLE IF NOT EXISTS "restaurants" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "slug" text NOT NULL,
        "logo" text,
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action,
        "custom_prompt" text,
        "currency" text NOT NULL DEFAULT '€',
        "color" text NOT NULL DEFAULT '1',
        "phone_number" bigint,
        "reservas" text,
        "redes_sociales" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "restaurants_slug_unique" UNIQUE("slug")
      );
    `;
    
    // Create categories table if not exists (added for completeness and FK dependency)
    await sql`
      CREATE TABLE IF NOT EXISTS "categories" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "restaurant_id" uuid REFERENCES "restaurants"("id") ON DELETE cascade ON UPDATE no action,
        "order" integer NOT NULL DEFAULT 0,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "categories_name_restaurant_id_unique" UNIQUE("name", "restaurant_id")
      );
    `;

    // Create dishes table if not exists (added for completeness)
    await sql`
      CREATE TABLE IF NOT EXISTS "dishes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "title" text NOT NULL,
        "image_url" text,
        "price" numeric(10, 2),
        "description" text,
        "category_id" uuid REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action,
        "order" integer NOT NULL DEFAULT 0,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `;


    // Add user_id column to restaurants if it doesn't exist
    const restaurantUserIdColumnExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'restaurants' AND column_name = 'user_id'
      );
    `;

    if (!restaurantUserIdColumnExists[0].exists) {
      await sql`ALTER TABLE "restaurants" ADD COLUMN "user_id" uuid;`;
      // Make user_id not null after potentially populating it
      await sql`
        UPDATE "restaurants" 
        SET "user_id" = (SELECT id FROM "users" WHERE email = 'admin@example.com')
        WHERE "user_id" IS NULL;
      `;
      await sql`ALTER TABLE "restaurants" ALTER COLUMN "user_id" SET NOT NULL;`;
    } else {
        // Ensure user_id is not null if it already exists
        const userIdIsNullable = await sql`
            SELECT is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'restaurants' AND column_name = 'user_id';
        `;
        if (userIdIsNullable[0].is_nullable === 'YES') {
            await sql`
              UPDATE "restaurants" 
              SET "user_id" = (SELECT id FROM "users" WHERE email = 'admin@example.com')
              WHERE "user_id" IS NULL;
            `;
            await sql`ALTER TABLE "restaurants" ALTER COLUMN "user_id" SET NOT NULL;`;
        }
    }

    // Add foreign key constraint for user_id in restaurants if it doesn't exist
    const restaurantUserFkConstraintExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE constraint_name = 'restaurants_user_id_users_id_fk' AND table_name = 'restaurants'
      );
    `;

    if (!restaurantUserFkConstraintExists[0].exists) {
      await sql`
        ALTER TABLE "restaurants" 
        ADD CONSTRAINT "restaurants_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") 
        REFERENCES "users"("id") 
        ON DELETE cascade 
        ON UPDATE no action;
      `;
    }
    
    // Add indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_categories_restaurant_id_order ON "categories" ("restaurant_id", "order");`;
    console.log('Checked/Created index idx_categories_restaurant_id_order.');
    
    await sql`CREATE INDEX IF NOT EXISTS idx_dishes_category_id_order ON "dishes" ("category_id", "order");`;
    console.log('Checked/Created index idx_dishes_category_id_order.');

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration(); 