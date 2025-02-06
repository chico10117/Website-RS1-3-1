import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables before other imports
dotenv.config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/server/schema';
import { seedData as burgerData } from './seed-data/restaurant-data';
import { seedData as santoData } from './seed-data/restaurant-data-santo';
import { eq, and, sql } from 'drizzle-orm';
import { eq, and } from 'drizzle-orm';
import { generateAndStoreImage } from './dalle';

// ES Module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDishType(categoryName: string): 'food' | 'drink' | 'restaurant' {
  const drinkCategories = [
    'Wine - Red',
    'Wine - White',
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

interface SeedOptions {
  updateNamesOnly?: boolean;
}

async function seedRestaurant(db: any, seedData: any, options: SeedOptions = {}) {
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

    if (options.updateNamesOnly && existingRestaurant.length > 0) {
      // If updating names only, use existing restaurant
      restaurant = existingRestaurant[0];
      console.log('🔄 Updating dish names for restaurant:', restaurant.name);
    } else if (!options.updateNamesOnly) {
      // Only create new restaurant if not updating names
      // If restaurant exists, delete it and its related data
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

      // Create restaurant with generated image and customPrompt
      [restaurant] = await db.insert(schema.restaurants)
        .values({
          name: seedData.restaurant.name,
          slug,
          userId: user.id,
          logo: restaurantImageUrl,
          customPrompt: seedData.restaurant.customPrompt
        })
        .returning();

      console.log('✅ Created restaurant:', restaurant.name);
    } else {
      throw new Error(`Restaurant ${seedData.restaurant.name} not found for updating names`);
    }

    // Create or update categories and dishes
    for (const categoryData of seedData.categories) {
      let category;

      if (options.updateNamesOnly) {
        // If updating names only, find existing category
        const [existingCategory] = await db.select()
          .from(schema.categories)
          .where(
            and(
              eq(schema.categories.name, categoryData.name),
              eq(schema.categories.restaurantId, restaurant.id)
            )
          );
        
        if (existingCategory) {
          category = existingCategory;
        } else {
          console.log(`⚠️ Category ${categoryData.name} not found, skipping...`);
          continue;
        }
      } else {
        // Create new category
        [category] = await db.insert(schema.categories)
          .values({
            name: categoryData.name,
            restaurantId: restaurant.id
          })
          .returning();

        console.log('✅ Created category:', category.name);
      }

      if (categoryData.dishes) {
        for (const dishData of categoryData.dishes) {
          try {
            if (options.updateNamesOnly) {
              // If updating names only, find and update existing dish
              const existingDishes = await db.select()
                .from(schema.dishes)
                .where(
                  and(
                    eq(schema.dishes.categoryId, category.id),
                    eq(schema.dishes.price, dishData.price)
                  )
                );

              if (existingDishes.length > 0) {
                await db.update(schema.dishes)
                  .set({ title: dishData.title })
                  .where(eq(schema.dishes.id, existingDishes[0].id));
                console.log('🔄 Updated dish name:', dishData.title);
              } else {
                console.log(`⚠️ Dish not found for updating: ${dishData.title}`);
              }
            } else {
              // Only create new dishes if not updating names
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
            }
          } catch (error) {
            console.error('Error with dish:', dishData.title, error);
            if (!options.updateNamesOnly) {
              // Only throw error if creating new dishes
              throw error;
            }
            // For name updates, just continue to next dish
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

    // Get command line arguments
    const updateNamesOnly = process.argv.includes('--update-names-only');
    
    // Get the restaurant data file from command line argument
    const dataFile = process.argv[2];
    if (!dataFile) {
      console.error('Please provide a restaurant data file as an argument');
      console.error('Usage: pnpm seed <restaurant-data-file>');
      process.exit(1);
    }

    // Remove any "scripts/" prefix if present
    const cleanDataFile = dataFile.replace(/^scripts\//, '');

    // Construct the file path
    const seedDataDir = path.join(__dirname, 'seed-data');
    const filePath = path.join(seedDataDir, cleanDataFile);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      // List available files
      const availableFiles = fs.readdirSync(seedDataDir)
        .filter(file => file.endsWith('.ts'))
        .join('\n');
      console.error('\nAvailable restaurant data files:\n', availableFiles);
      process.exit(1);
    }

    // Dynamically import the restaurant data
    const importPath = `./seed-data/${cleanDataFile}`;
    const { seedData } = await import(importPath);

    if (!seedData) {
      console.error(`No seedData export found in ${cleanDataFile}`);
      process.exit(1);
    }

    console.log(`📝 Using restaurant data from: ${cleanDataFile}`);

    // Seed restaurant with options
    await seedRestaurant(db, seedData, { updateNamesOnly });

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
