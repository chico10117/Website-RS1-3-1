import pg from 'pg';
import * as dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testColorUpdate() {
  try {
    const client = await pool.connect();
    console.log('Connected to database');
    try {
      // Get a restaurant to update
      const getRestaurant = await client.query(`
        SELECT id, name, color 
        FROM restaurants 
        LIMIT 1
      `);
      
      if (getRestaurant.rows.length === 0) {
        console.log('No restaurants found!');
        return;
      }
      
      const restaurant = getRestaurant.rows[0];
      console.log('Selected restaurant:', restaurant);
      
      // Try updating with a hex color
      const hexColor = '#FF5733';
      console.log(`Updating restaurant color to: ${hexColor}`);
      
      const result = await client.query(`
        UPDATE restaurants 
        SET color = $1 
        WHERE id = $2 
        RETURNING id, name, color
      `, [hexColor, restaurant.id]);
      
      console.log('Update successful!');
      console.table(result.rows);
      
    } finally {
      client.release();
      console.log('Database connection released');
    }
  } catch (err) {
    console.error('Error updating color:', err);
  } finally {
    await pool.end();
    console.log('Pool has ended');
  }
}

testColorUpdate(); 