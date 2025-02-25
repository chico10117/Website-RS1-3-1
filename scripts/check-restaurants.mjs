// Script to check restaurants in the database
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not defined');
  process.exit(1);
}

async function main() {
  try {
    console.log('Connecting to database...');
    const sql = neon(DATABASE_URL);
    
    // Query all users
    console.log('Fetching users...');
    const usersResult = await sql`SELECT * FROM users`;
    console.log(`Found ${usersResult.length} users:`);
    usersResult.forEach(user => {
      console.log(`- User ID: ${user.id}, Email: ${user.email}, Name: ${user.name || 'N/A'}`);
    });
    
    // Query all restaurants
    console.log('\nFetching all restaurants...');
    const allRestaurants = await sql`SELECT * FROM restaurants`;
    console.log(`Found ${allRestaurants.length} restaurants in total:`);
    allRestaurants.forEach(restaurant => {
      console.log(`- Restaurant: ${restaurant.name}, ID: ${restaurant.id}, User ID: ${restaurant.user_id}`);
    });
    
    // Check restaurants for each user
    console.log('\nChecking restaurants by user:');
    for (const user of usersResult) {
      const userRestaurants = await sql`
        SELECT * FROM restaurants 
        WHERE user_id = ${user.id}
      `;
      
      console.log(`User ${user.email} (${user.id}) has ${userRestaurants.length} restaurants:`);
      userRestaurants.forEach(restaurant => {
        console.log(`- ${restaurant.name} (${restaurant.id})`);
      });
    }
    
    // Check for restaurants with null or invalid userId
    console.log('\nChecking for restaurants with missing or invalid userId:');
    const invalidRestaurants = allRestaurants.filter(r => 
      !r.user_id || !usersResult.some(u => u.id === r.user_id)
    );
    
    if (invalidRestaurants.length > 0) {
      console.log(`Found ${invalidRestaurants.length} restaurants with invalid userId:`);
      invalidRestaurants.forEach(restaurant => {
        console.log(`- ${restaurant.name} (${restaurant.id}), User ID: ${restaurant.user_id || 'NULL'}`);
      });
    } else {
      console.log('No restaurants with invalid userId found.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 