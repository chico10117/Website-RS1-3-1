import pg from 'pg';
import * as dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateColor() {
  try {
    const client = await pool.connect();
    console.log('Connected to database');
    try {
      // Get the first restaurant to update
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
      console.log('Updating restaurant:', restaurant);
      
      // Update with a hex color code
      const colorToSet = '#FF5733';
      const result = await client.query(`
        UPDATE restaurants 
        SET color = $1 
        WHERE id = $2 
        RETURNING id, name, color
      `, [colorToSet, restaurant.id]);
      
      console.log('Update successful:');
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

updateColor(); 