import { sql } from 'drizzle-orm';
import { db } from '$lib/server/database';

export async function addIndexes() {
  console.log('Running migration: Adding indexes for performance optimization');
  
  try {
    // Add index on restaurants.userId (Foreign Key)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_restaurants_user_id 
      ON restaurants (user_id);
    `);
    console.log('Added index on restaurants.user_id');
    
    // Add index on categories.restaurantId (Foreign Key)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_categories_restaurant_id 
      ON categories (restaurant_id);
    `);
    console.log('Added index on categories.restaurant_id');
    
    // Add index on dishes.categoryId (Foreign Key)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_dishes_category_id 
      ON dishes (category_id);
    `);
    console.log('Added index on dishes.category_id');
    
    // Add composite index for categories.order (optimize ordering)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_categories_order 
      ON categories (restaurant_id, "order");
    `);
    console.log('Added composite index on categories.order');
    
    // Add composite index for dishes.order (optimize ordering)
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_dishes_order 
      ON dishes (category_id, "order");
    `);
    console.log('Added composite index on dishes.order');

    console.log('Migration completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
} 