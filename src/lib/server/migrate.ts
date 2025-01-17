import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const runMigration = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  // Create the connection
  const sql = neon(process.env.DATABASE_URL);

  // Run the ALTER TABLE query
  console.log('Running migration to change price column type...');
  
  try {
    await sql`ALTER TABLE dishes ALTER COLUMN price TYPE numeric(10,2) USING price::numeric(10,2)`;
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
};

runMigration(); 