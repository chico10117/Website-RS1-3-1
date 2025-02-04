import * as dotenv from 'dotenv';

// Load environment variables before other imports
dotenv.config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/server/schema';
import { seedData as burgerData } from './seed-data/restaurant-data';
import { seedData as santoData } from './seed-data/restaurant-data-santo';
import { eq, and, sql } from 'drizzle-orm';
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

    let restaurant;

    if (existingRestaurant.length > 0) {
      console.log(`📝 Restaurant ${seedData.restaurant.name} already exists, updating...`);
      restaurant = existingRestaurant[0];
    } else {
      // Generate restaurant image
      const restaurantImageUrl = await generateAndStoreImage(
        seedData.restaurant.name,
        'Modern restaurant exterior',
        'restaurant'
      );

      // Create restaurant with generated image
      [restaurant] = await db.insert(schema.restaurants)
        .values({
          name: seedData.restaurant.name,
          slug,
          userId: user.id,
          logo: restaurantImageUrl
        })
        .returning();

      console.log('✅ Created restaurant:', restaurant.name);
    }

    // Create categories and dishes with generated images
    for (const categoryData of seedData.categories) {
      // Check if category exists
      let [category] = await db.select()
        .from(schema.categories)
        .where(
          and(
            eq(schema.categories.name, categoryData.name),
            eq(schema.categories.restaurantId, restaurant.id)
          )
        );

      if (!category) {
        [category] = await db.insert(schema.categories)
          .values({
            name: categoryData.name,
            restaurantId: restaurant.id
          })
          .returning();
        console.log('✅ Created category:', category.name);
      } else {
        console.log('📝 Category already exists:', category.name);
      }

      if (categoryData.dishes) {
        for (const dishData of categoryData.dishes) {
          try {
            // Check if dish exists
            const [existingDish] = await db.select()
              .from(schema.dishes)
              .where(
                and(
                  eq(schema.dishes.title, dishData.title),
                  eq(schema.dishes.categoryId, category.id)
                )
              );

            if (existingDish) {
              console.log('📝 Dish already exists:', dishData.title);
              continue;
            }

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

async function updateDishTitlesCase(db: any, seedData: any) {
  console.log('📝 Updating dish titles case sensitivity...');
  
  for (const categoryData of seedData.categories) {
    for (const dishData of categoryData.dishes) {
      await db
        .update(schema.dishes)
        .set({ title: dishData.title })
        .where(
          and(
            eq(sql`LOWER(${schema.dishes.title})`, dishData.title.toLowerCase()),
            eq(schema.dishes.categoryId, 
              db.select({ id: schema.categories.id })
                .from(schema.categories)
                .where(eq(schema.categories.name, categoryData.name))
            )
          )
        );
    }
  }
  console.log('✅ Dish titles case sensitivity updated');
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

    // First update existing titles case
    await updateDishTitlesCase(db, santoData);
    
    // Then proceed with regular seeding
    await seedRestaurant(db, santoData);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
