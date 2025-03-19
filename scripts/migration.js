import pg from 'pg';
import * as dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  try {
    const client = await pool.connect();
    console.log('Connected to database');
    try {
      await client.query('ALTER TABLE restaurants ALTER COLUMN color TYPE text USING color::text;');
      console.log('Migration successful: color column changed to text type');
    } finally {
      client.release();
      console.log('Database connection released');
    }
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await pool.end();
    console.log('Pool has ended');
  }
}

runMigration(); 