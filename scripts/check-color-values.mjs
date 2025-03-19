import { neon } from '@neondatabase/serverless';

// Database URL from database.ts
const DATABASE_URL = 'postgresql://neondb_owner:rH7eRhfOGj4J@ep-jolly-sound-a2rw9fhx.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function checkAndFixColorValues() {
  console.log('Connecting to database...');
  const sql = neon(DATABASE_URL);
  
  console.log('Checking restaurant color values...');
  
  try {
    // Check current color values
    const restaurants = await sql`
      SELECT id, name, color FROM restaurants
    `;
    
    console.log('Current restaurant color values:');
    for (const restaurant of restaurants) {
      console.log(`ID: ${restaurant.id}, Name: ${restaurant.name}, Color: ${restaurant.color} (Type: ${typeof restaurant.color})`);
      
      // Check if color is not a string or is null/undefined
      if (typeof restaurant.color !== 'string' || restaurant.color === null || restaurant.color === undefined) {
        console.log(`  - Fixing invalid color value for restaurant: ${restaurant.name}`);
        // Set a default value of '1'
        await sql`
          UPDATE restaurants 
          SET color = '1' 
          WHERE id = ${restaurant.id}
        `;
      }
    }
    
    // Verify all values are now strings
    const updatedRestaurants = await sql`
      SELECT id, name, color FROM restaurants
    `;
    
    console.log('\nUpdated restaurant color values:');
    for (const restaurant of updatedRestaurants) {
      console.log(`ID: ${restaurant.id}, Name: ${restaurant.name}, Color: ${restaurant.color} (Type: ${typeof restaurant.color})`);
    }
    
    console.log('\nColor value check and fix completed successfully!');
  } catch (error) {
    console.error('Error checking/fixing color values:', error);
    process.exit(1);
  }
}

checkAndFixColorValues(); 