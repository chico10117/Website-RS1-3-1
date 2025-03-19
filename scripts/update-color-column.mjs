import { neon } from '@neondatabase/serverless';

// Database URL from database.ts
const DATABASE_URL = 'postgresql://neondb_owner:rH7eRhfOGj4J@ep-jolly-sound-a2rw9fhx.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function runMigration() {
  console.log('Connecting to database...');
  const sql = neon(DATABASE_URL);
  
  console.log('Running migration to alter color column to text type...');
  
  try {
    // Execute the migration SQL
    const result = await sql`ALTER TABLE "restaurants" ALTER COLUMN "color" TYPE text USING color::text;`;
    console.log('Migration completed successfully!');
    
    // Check the updated schema
    const tableInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'restaurants' AND column_name = 'color'
    `;
    
    console.log('Updated schema info:', tableInfo);
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration(); 