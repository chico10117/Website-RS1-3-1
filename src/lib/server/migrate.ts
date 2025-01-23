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

    // Create admin user
    await sql`
      INSERT INTO "users" (id, email, name, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        'admin@example.com',
        'Admin',
        now(),
        now()
      )
      ON CONFLICT (email) DO NOTHING;
    `;

    // Add user_id column if it doesn't exist
    const columnExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'restaurants' AND column_name = 'user_id'
      );
    `;

    if (!columnExists[0].exists) {
      await sql`ALTER TABLE "restaurants" ADD COLUMN "user_id" uuid;`;
    }

    // Update existing restaurants to use admin user
    await sql`
      UPDATE "restaurants" 
      SET "user_id" = (SELECT id FROM "users" WHERE email = 'admin@example.com')
      WHERE "user_id" IS NULL;
    `;

    // Make user_id not null
    await sql`ALTER TABLE "restaurants" ALTER COLUMN "user_id" SET NOT NULL;`;

    // Add foreign key constraint if it doesn't exist
    const constraintExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE constraint_name = 'restaurants_user_id_users_id_fk'
      );
    `;

    if (!constraintExists[0].exists) {
      await sql`
        ALTER TABLE "restaurants" 
        ADD CONSTRAINT "restaurants_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") 
        REFERENCES "users"("id") 
        ON DELETE cascade 
        ON UPDATE no action;
      `;
    }

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration(); 