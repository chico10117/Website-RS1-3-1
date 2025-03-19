import pg from 'pg';
import * as dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkSchema() {
  try {
    const client = await pool.connect();
    console.log('Connected to database');
    try {
      // Query to check column type
      const result = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'restaurants' 
        AND column_name = 'color'
      `);
      
      console.log('Column schema information:');
      console.table(result.rows);
      
      // Check actual values in the restaurant table
      const values = await client.query(`
        SELECT id, name, color 
        FROM restaurants 
        LIMIT 5
      `);
      
      console.log('Current values in restaurant table:');
      console.table(values.rows);
      
    } finally {
      client.release();
      console.log('Database connection released');
    }
  } catch (err) {
    console.error('Error checking schema:', err);
  } finally {
    await pool.end();
    console.log('Pool has ended');
  }
}

checkSchema(); 