// src/routes/api/seed/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database'; // Use the centralized db instance
import * as schema from '$lib/server/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { generateSlug } from '$lib/utils/slug'; // Keep for now, ideally move later

// Define types for seed data structure
interface SeedDish {
  title: string;
  description?: string | null;
  price: number | string; // Can be number or string
  imageUrl?: string | null;
  // Add other potential fields like allergens, portions if needed
}

interface SeedCategory {
  name: string;
  dishes?: SeedDish[];
}

interface SeedRestaurant {
  name: string;
  logo?: string | null;
  customPrompt?: string | null;
  currency?: string; // Optional currency
  // Add other restaurant fields if present in seed data
}

interface SeedData {
  restaurant: SeedRestaurant;
  categories: SeedCategory[];
  userEmail?: string; // Optional user email for association
}

export async function POST({ request, cookies, fetch }: RequestEvent) {
  try {
    console.log('Starting seed process (Optimized)...');

    // --- Authentication & User Fetch ---
    const token = cookies.get('auth_token');
    if (!token) {
      console.error('No auth token found');
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const [user] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, payload.email));
    if (!user) {
      console.error('User not found in database:', { email: payload.email });
      return json({ success: false, error: 'User not found' }, { status: 404 });
    }
    const userId = user.id;
    console.log('User authenticated:', { userId, email: payload.email });

    // --- Request Data & Validation ---
    const { fileName, restaurantName, customPrompt, restaurantId: existingRestaurantId } = await request.json();
    console.log('Request data:', { fileName, restaurantName, hasCustomPrompt: !!customPrompt, existingRestaurantId });

    if (!fileName || !restaurantName) {
      return json({ success: false, error: 'File name and restaurant name are required' }, { status: 400 });
    }

    // --- Import Seed Data ---
    let importedSeedData: SeedData;
    try {
      // Adjust the import path if necessary, ensure it resolves correctly relative to the built output
      const modulePath = `/src/lib/data/restaurants/${fileName}`; // Path relative to project root
      const { seedData: dataFromFile } = await import(/* @vite-ignore */ modulePath);
      importedSeedData = dataFromFile as SeedData;

      if (!importedSeedData || !importedSeedData.restaurant || !importedSeedData.categories) {
        throw new Error('Invalid seed data structure in file.');
      }
      console.log('Seed data imported successfully.');
    } catch (importError) {
      console.error('Error importing restaurant data:', importError);
      return json({ success: false, error: 'Failed to import seed data file' }, { status: 500 });
    }

    // --- Database Transaction ---
    const result = await db.transaction(async (tx) => {
      let restaurant: typeof schema.restaurants.$inferSelect;
      const restaurantSeedInfo = importedSeedData.restaurant;

      // --- Handle Restaurant (Update or Create) ---
      if (existingRestaurantId) {
        // --- Update Existing Restaurant ---
        console.log('Updating existing restaurant ID:', existingRestaurantId);
        const [targetRestaurant] = await tx.select({ id: schema.restaurants.id })
          .from(schema.restaurants)
          .where(and(
            eq(schema.restaurants.id, existingRestaurantId),
            eq(schema.restaurants.userId, userId) // Verify ownership
          ));

        if (!targetRestaurant) {
          throw new Error('Restaurant not found or unauthorized');
        }

        // --- Delete Existing Categories & Dishes ---
        console.log('Deleting existing categories and dishes for restaurant:', existingRestaurantId);
        const existingCategories = await tx.select({ id: schema.categories.id })
          .from(schema.categories)
          .where(eq(schema.categories.restaurantId, existingRestaurantId));

        if (existingCategories.length > 0) {
          const categoryIds = existingCategories.map(c => c.id);
          await tx.delete(schema.dishes).where(inArray(schema.dishes.categoryId, categoryIds));
          await tx.delete(schema.categories).where(eq(schema.categories.restaurantId, existingRestaurantId));
          console.log(`Deleted ${existingCategories.length} categories and their dishes.`);
        }

        // --- Update Restaurant Details ---
        const [updatedRestaurant] = await tx.update(schema.restaurants)
          .set({
            name: restaurantName, // Use name from request
            customPrompt: customPrompt || restaurantSeedInfo.customPrompt || null,
            logo: restaurantSeedInfo.logo || null, // Use logo from seed data if not provided
            currency: restaurantSeedInfo.currency || '€', // Default currency
            updatedAt: new Date(),
            // Add other fields to update if necessary (e.g., color, phone)
          })
          .where(eq(schema.restaurants.id, existingRestaurantId))
          .returning();
        restaurant = updatedRestaurant;
        console.log('Restaurant details updated.');

      } else {
        // --- Create New Restaurant ---
        // Ideally, slug generation should be inside transaction (Phase 4)
        const slug = await generateSlug(restaurantName, fetch); // Using external fetch for now
        console.log('Generated slug for new restaurant:', slug);

        const [insertedRestaurant] = await tx.insert(schema.restaurants)
          .values({
            name: restaurantName,
            slug: slug,
            userId: userId,
            logo: restaurantSeedInfo.logo || null,
            customPrompt: customPrompt || restaurantSeedInfo.customPrompt || null,
            currency: restaurantSeedInfo.currency || '€', // Default currency
            // Add other fields if needed (color, phone default to schema defaults)
          })
          .returning();
        restaurant = insertedRestaurant;
        console.log('New restaurant created:', restaurant.id);
      }

      const finalRestaurantId = restaurant.id;

      // --- Seed Categories & Dishes ---
      const categoriesToInsert = importedSeedData.categories.map(cat => ({
        name: cat.name,
        restaurantId: finalRestaurantId,
      }));

      if (categoriesToInsert.length === 0) {
        console.log('No categories found in seed data.');
        return restaurant; // Return restaurant data even if no categories
      }

      console.log(`Preparing to insert ${categoriesToInsert.length} categories.`);
      const insertedCategories = await tx.insert(schema.categories)
        .values(categoriesToInsert)
        .returning({ id: schema.categories.id, name: schema.categories.name });
      console.log(`${insertedCategories.length} categories inserted.`);

      // Map category names to their newly inserted IDs
      const categoryNameToIdMap = new Map(insertedCategories.map(c => [c.name, c.id]));

      // Prepare dishes for bulk insert
      const dishesToInsert: (typeof schema.dishes.$inferInsert)[] = [];
      importedSeedData.categories.forEach(seedCat => {
        const categoryId = categoryNameToIdMap.get(seedCat.name);
        if (categoryId && seedCat.dishes) {
          seedCat.dishes.forEach(seedDish => {
            dishesToInsert.push({
              title: seedDish.title,
              description: seedDish.description || null,
              price: String(seedDish.price), // Ensure price is string for decimal
              imageUrl: seedDish.imageUrl || null,
              categoryId: categoryId,
            });
          });
        }
      });

      if (dishesToInsert.length > 0) {
        console.log(`Preparing to insert ${dishesToInsert.length} dishes.`);
        await tx.insert(schema.dishes).values(dishesToInsert);
        console.log(`${dishesToInsert.length} dishes inserted.`);
      } else {
        console.log('No dishes found in seed data.');
      }

      return restaurant; // Return the saved/updated restaurant data
    }); // --- End Transaction ---

    console.log('Seed process completed successfully.');
    return json({
      success: true,
      data: {
        restaurant: result, // The final restaurant data from the transaction
        message: 'Restaurant data seeded successfully'
      }
    });

  } catch (error) {
    console.error('Error in seed endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to seed restaurant data';
    return json({
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined
    }, { status: error instanceof Error && error.message.includes('unauthorized') ? 403 : 500 });
  }
}