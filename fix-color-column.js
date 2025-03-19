import pg from 'pg';
import * as dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixColorColumn() {
  try {
    const client = await pool.connect();
    console.log('Connected to database');
    
    try {
      // Start a transaction
      await client.query('BEGIN');
      
      // 1. Check all schemas in the database
      const schemasResult = await client.query(`
        SELECT schema_name 
        FROM information_schema.schemata
        WHERE schema_name NOT LIKE 'pg_%' AND schema_name <> 'information_schema'
      `);
      
      console.log('Database schemas:');
      console.table(schemasResult.rows);
      
      // 2. Check all tables named 'restaurants' in all schemas
      const tablesResult = await client.query(`
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_name = 'restaurants'
      `);
      
      console.log('Tables named "restaurants":');
      console.table(tablesResult.rows);
      
      // 3. For each schema with a restaurants table, fix the column type
      for (const row of tablesResult.rows) {
        const schema = row.table_schema;
        console.log(`\nAttempting to fix column in schema: ${schema}`);
        
        try {
          // 3a. Create a temporary backup column
          await client.query(`
            ALTER TABLE ${schema}.restaurants 
            ADD COLUMN color_new text DEFAULT '1' NOT NULL
          `);
          console.log('- Added new column color_new (text)');
          
          // 3b. Copy existing numeric values as strings
          await client.query(`
            UPDATE ${schema}.restaurants 
            SET color_new = color::text
          `);
          console.log('- Copied existing values to new column');
          
          // 3c. Drop the original column
          await client.query(`
            ALTER TABLE ${schema}.restaurants 
            DROP COLUMN color
          `);
          console.log('- Dropped original numeric column');
          
          // 3d. Rename the new column to color
          await client.query(`
            ALTER TABLE ${schema}.restaurants 
            RENAME COLUMN color_new TO color
          `);
          console.log('- Renamed column to color');
          
          console.log(`Successfully fixed column in schema: ${schema}`);
        } catch (err) {
          console.error(`Error fixing column in schema ${schema}:`, err);
        }
      }
      
      // Commit the transaction
      await client.query('COMMIT');
      console.log('\nTransaction committed');
      
      // Verify the change
      const verifyResult = await client.query(`
        SELECT column_name, data_type, table_schema
        FROM information_schema.columns
        WHERE table_name = 'restaurants' AND column_name = 'color'
      `);
      
      console.log('\nVerified column information:');
      console.table(verifyResult.rows);
      
      const sampleData = await client.query(`
        SELECT id, name, color
        FROM restaurants
        LIMIT 5
      `);
      
      console.log('\nSample data from restaurants:');
      console.table(sampleData.rows);
      
    } catch (err) {
      // Rollback the transaction on error
      await client.query('ROLLBACK');
      console.error('Error fixing color column, transaction rolled back:', err);
    } finally {
      client.release();
      console.log('Database connection released');
    }
  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    await pool.end();
    console.log('Pool has ended');
  }
}

fixColorColumn(); 