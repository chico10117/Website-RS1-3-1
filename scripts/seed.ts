import * as dotenv from 'dotenv';

// Load environment variables before other imports
dotenv.config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/server/schema';
import { seedData as burgerData } from './seed-data/restaurant-data';
import { eq, and } from 'drizzle-orm';
import { generateAndStoreImage } from './dalle';

function getDishType(categoryName: string): 'food' | 'drink' | 'restaurant' {
  const drinkCategories = [
    'Wine - Red',
    'Wine - White',
    'Wine - Skin Contact',
    'Sparkling Wine',
    'Hot Drinks',
    'Cold Drinks',
    'Sodas',
    'Beer',
    'Sake'
  ];

  if (drinkCategories.includes(categoryName)) {
    return 'drink';
  }

  return 'food';
}

async function seedRestaurant(db: any, seedData: any) {
  try {
    // Find user
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.email, seedData.userEmail));

    if (!user) {
      throw new Error(`User with email ${seedData.userEmail} not found`);
    }

    // Generate slug
    const slug = seedData.restaurant.name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '');

    // Check if restaurant exists
    const existingRestaurant = await db.select()
      .from(schema.restaurants)
      .where(
        and(
          eq(schema.restaurants.slug, slug),
          eq(schema.restaurants.userId, user.id)
        )
      );

    // If exists, delete it and its related data
    if (existingRestaurant.length > 0) {
      console.log(`🗑️  Removing existing restaurant data for ${seedData.restaurant.name}...`);
      await db.delete(schema.restaurants)
        .where(eq(schema.restaurants.id, existingRestaurant[0].id));
    }

    // Generate restaurant image
    const restaurantImageUrl = await generateAndStoreImage(
      seedData.restaurant.name,
      'Modern restaurant exterior',
      'restaurant'
    );

    // Create restaurant with generated image
    const [restaurant] = await db.insert(schema.restaurants)
      .values({
        name: seedData.restaurant.name,
        slug,
        userId: user.id,
        logo: restaurantImageUrl
      })
      .returning();

    console.log('✅ Created restaurant:', restaurant.name);

    // Create categories and dishes with generated images
    for (const categoryData of seedData.categories) {
      const [category] = await db.insert(schema.categories)
        .values({
          name: categoryData.name,
          restaurantId: restaurant.id
        })
        .returning();

      console.log('✅ Created category:', category.name);

      if (categoryData.dishes) {
        for (const dishData of categoryData.dishes) {
          try {
            // Generate image for the dish/drink
            const type = getDishType(categoryData.name);
            const dishImageUrl = await generateAndStoreImage(
              dishData.title,
              dishData.description,
              type
            );

            const [dish] = await db.insert(schema.dishes)
              .values({
                ...dishData,
                categoryId: category.id,
                imageUrl: dishImageUrl
              })
              .returning();

            console.log('✅ Created dish:', dish.title);
          } catch (error) {
            console.error('Error creating dish:', dishData.title, error);
            // Continue with next dish instead of failing the entire process
            continue;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in seedRestaurant:', error);
    throw error; // Re-throw to be caught by the main seed function
  }
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  try {
    console.log('🌱 Starting seeding process...');

    // Seed only burger restaurant
    await seedRestaurant(db, burgerData);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
