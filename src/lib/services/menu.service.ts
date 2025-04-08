// src/lib/services/menu.service.ts
import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
import * as restaurantService from './restaurant.service';
import * as categoryService from './category.service';
import * as dishService from './dish.service';
import { menuStore } from '$lib/stores/menu-store';
import { get } from 'svelte/store';
import { db } from '$lib/server/database'; // Import db instance
import * as schema from '$lib/server/schema'; // Import schema
import { eq, inArray, and, ne } from 'drizzle-orm'; // Import operators

interface SaveResult {
  restaurant: Restaurant;
  categories: Category[]; // Should include nested dishes
}

// Define types for insert/update data explicitly
type DishInsertData = typeof schema.dishes.$inferInsert;
type CategoryInsertData = typeof schema.categories.$inferInsert;
type RestaurantUpdateData = Partial<typeof schema.restaurants.$inferInsert>; // Using Partial for updates

export async function saveMenuChanges(
  restaurantData: {
    name: string;
    logo: string | null;
    slug?: string;
    customPrompt?: string | null;
    phoneNumber?: number | null;
    currency: string;
    color: string;
    reservas?: string | null;
    redes_sociales?: string | null;
  },
  currentRestaurantId: string | null
): Promise<SaveResult> {
  console.log('Starting saveMenuChanges (Optimized) with:', {
    restaurantData,
    currentRestaurantId,
    reservas: restaurantData.reservas, // Debug
    redes_sociales: restaurantData.redes_sociales // Debug
  });

  const storeState = get(menuStore);
  let savedRestaurant: Restaurant;
  let finalRestaurantId: string;

  const result = await db.transaction(async (tx) => {
    // -----------------------------
    // Step 1: Save Restaurant Info
    // -----------------------------
    const isNewRestaurant = !currentRestaurantId || currentRestaurantId.startsWith('temp_');
    const restaurantUpdateSet: RestaurantUpdateData = {
      name: restaurantData.name,
      logo: restaurantData.logo,
      customPrompt: restaurantData.customPrompt,
      phoneNumber: restaurantData.phoneNumber,
      currency: restaurantData.currency,
      color: restaurantData.color, // Already validated hex or '1'
      reservas: restaurantData.reservas,
      redes_sociales: restaurantData.redes_sociales,
      updatedAt: new Date(),
    };

    if (isNewRestaurant) {
      // We need a slug for new restaurants
      // Ideally, slug generation/checking should move inside the transaction (Phase 4)
      // For now, we assume `generateSlug` is called *before* this service function
      // and passed in `restaurantData.slug` if needed.
      if (!restaurantData.slug) {
          throw new Error("Slug is required for new restaurants.");
      }
      restaurantUpdateSet.slug = restaurantData.slug;
      restaurantUpdateSet.userId = storeState.restaurants.find(r => r.id === currentRestaurantId)?.userId || get(menuStore).restaurants[0]?.userId; // Get user ID from store - needs a reliable way
      if (!restaurantUpdateSet.userId) {
         // Fallback: Fetch user from DB if not in store - this shouldn't happen ideally
         // const user = await tx.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, 'user_email_here')); // Replace with actual user email logic
         // restaurantUpdateSet.userId = user[0]?.id;
         throw new Error("User ID could not be determined for new restaurant.");
      }

      const [insertedRestaurant] = await tx.insert(schema.restaurants)
        .values(restaurantUpdateSet as typeof schema.restaurants.$inferInsert) // Cast needed as we built it partially
        .returning();
      savedRestaurant = insertedRestaurant as Restaurant; // Cast to frontend type
      finalRestaurantId = savedRestaurant.id;
      console.log('New restaurant inserted:', savedRestaurant);
    } else {
      finalRestaurantId = currentRestaurantId; // Use the existing ID
       // Potentially update slug if name changed
      const currentDbRestaurant = await tx.select({ slug: schema.restaurants.slug }).from(schema.restaurants).where(eq(schema.restaurants.id, finalRestaurantId)).limit(1);
      if (restaurantData.slug && restaurantData.slug !== currentDbRestaurant[0]?.slug) {
          // Check for slug conflicts before updating
          const conflictingSlug = await tx.select({ id: schema.restaurants.id})
              .from(schema.restaurants)
              .where(and(eq(schema.restaurants.slug, restaurantData.slug), ne(schema.restaurants.id, finalRestaurantId)))
              .limit(1);
          if (conflictingSlug.length > 0) {
              throw new Error(`Slug "${restaurantData.slug}" is already in use.`);
          }
          restaurantUpdateSet.slug = restaurantData.slug;
      }

      const [updatedRestaurant] = await tx.update(schema.restaurants)
        .set(restaurantUpdateSet)
        .where(eq(schema.restaurants.id, finalRestaurantId))
        .returning();
      savedRestaurant = updatedRestaurant as Restaurant;
      console.log('Restaurant updated:', savedRestaurant);
    }

    if (!finalRestaurantId) {
      throw new Error("Failed to get restaurant ID after save/update.");
    }

    // -----------------------------
    // Step 2: Process Deletions
    // -----------------------------
    const categoryIdsToDelete = Array.from(storeState.changedItems.deletedCategories)
      .filter(id => !id.startsWith('temp_')); // Only delete real IDs

    const dishIdsToDelete = Array.from(storeState.changedItems.deletedDishes)
      .filter(id => !id.startsWith('temp_')); // Only delete real IDs

    if (categoryIdsToDelete.length > 0) {
       console.log('Bulk deleting categories:', categoryIdsToDelete);
       // Cascading delete should handle dishes within these categories
       await tx.delete(schema.categories)
           .where(and(
               inArray(schema.categories.id, categoryIdsToDelete),
               eq(schema.categories.restaurantId, finalRestaurantId) // Ensure deletion is scoped to the restaurant
           ));
    }

    if (dishIdsToDelete.length > 0) {
        console.log('Bulk deleting dishes:', dishIdsToDelete);
        // Need to ensure these dishes belong to the correct restaurant implicitly via category check,
        // or add an explicit check if schema allows dishes without categories (which it shouldn't)
         await tx.delete(schema.dishes)
           .where(inArray(schema.dishes.id, dishIdsToDelete));
           // Note: If a category containing some of these dishes was *also* deleted,
           // the dish might already be gone due to cascade. This delete is for dishes
           // deleted individually from categories that *weren't* deleted.
    }

    // -----------------------------
    // Step 3: Process Categories (Inserts/Updates)
    // -----------------------------
    const tempToRealCategoryIdMap = new Map<string, string>();
    const categoriesToInsert: CategoryInsertData[] = [];
    const categoriesToUpdate: { id: string; data: Partial<CategoryInsertData> }[] = [];

    for (const categoryId of storeState.changedItems.categories) {
      const category = storeState.categories.find(c => c.id === categoryId);
      if (!category || storeState.changedItems.deletedCategories.has(categoryId)) continue; // Skip if not found or marked for deletion

      const categoryData = {
        name: category.name.trim(),
        restaurantId: finalRestaurantId, // Assign to the saved restaurant
        updatedAt: new Date()
      };

      if (categoryId.startsWith('temp_')) {
        // New category
        categoriesToInsert.push({ ...categoryData, restaurantId: finalRestaurantId });
        // Store original temp ID to map later
        tempToRealCategoryIdMap.set(categoryId, ''); // Placeholder value
      } else {
        // Existing category to update
        categoriesToUpdate.push({ id: categoryId, data: categoryData });
      }
    }

    // Bulk Insert Categories
    if (categoriesToInsert.length > 0) {
      console.log('Bulk inserting categories:', categoriesToInsert.length);
      const insertedCategories = await tx.insert(schema.categories)
        .values(categoriesToInsert)
        .returning({ id: schema.categories.id, name: schema.categories.name }); // Return ID and Name

      // Update the temp ID map with real IDs
      // We assume the order is preserved or match by name (safer)
       insertedCategories.forEach(insertedCat => {
           const tempIdEntry = Array.from(tempToRealCategoryIdMap.entries()).find(([tempId, realId]) => {
               if (realId === '') { // Find the first unmapped temp ID
                   const originalCat = categoriesToInsert.find(catToInsert => catToInsert.name === insertedCat.name);
                   // Find the corresponding temp ID from the original store state
                   const originalStoreCat = storeState.categories.find(storeCat => storeCat.name === originalCat?.name && storeCat.id.startsWith('temp_'));
                   if (originalStoreCat) {
                       tempToRealCategoryIdMap.set(originalStoreCat.id, insertedCat.id);
                       return true; // Found the match
                   }
               }
               return false;
           });
           if (!tempIdEntry) {
               console.warn(`Could not map inserted category ID for name: ${insertedCat.name}`);
           }
       });
       console.log('Temp to Real Category ID Map:', tempToRealCategoryIdMap);
    }

    // Update Existing Categories (Individual updates within transaction)
    if (categoriesToUpdate.length > 0) {
      console.log('Updating categories:', categoriesToUpdate.length);
      for (const update of categoriesToUpdate) {
        // Check for name conflicts before updating
        const conflictingCategory = await tx.select({ id: schema.categories.id })
            .from(schema.categories)
            .where(and(
                eq(schema.categories.restaurantId, finalRestaurantId),
                eq(schema.categories.name, update.data.name!),
                ne(schema.categories.id, update.id) // Exclude the category itself
            )).limit(1);

        if (conflictingCategory.length > 0) {
            console.warn(`Skipping category update for "${update.data.name}". Name already exists.`);
            // Optionally throw an error or notify the user
            continue; // Skip this update
        }

        await tx.update(schema.categories)
          .set(update.data)
          .where(and(
              eq(schema.categories.id, update.id),
              eq(schema.categories.restaurantId, finalRestaurantId) // Scope update
          ));
      }
    }

    // -----------------------------
    // Step 4: Process Dishes (Inserts/Updates)
    // -----------------------------
    const dishesToInsert: DishInsertData[] = [];
    const dishesToUpdate: { id: string; data: Partial<DishInsertData> }[] = [];

    for (const dishId of storeState.changedItems.dishes) {
        let dish: Dish | undefined;
        let sourceCategoryId: string | undefined;

        // Find the dish and its original category ID in the store state
        for (const cat of storeState.categories) {
            const foundDish = cat.dishes?.find(d => d.id === dishId);
            if (foundDish) {
                dish = foundDish;
                sourceCategoryId = cat.id;
                break;
            }
        }

        if (!dish || !sourceCategoryId || storeState.changedItems.deletedDishes.has(dishId)) continue; // Skip if not found or marked for deletion

        // Get the REAL category ID (might have been inserted)
        const realCategoryId = tempToRealCategoryIdMap.get(sourceCategoryId) || sourceCategoryId;
        if (realCategoryId.startsWith('temp_')) {
            console.warn(`Skipping dish "${dish.title}" because its category "${sourceCategoryId}" could not be mapped to a real ID.`);
            continue; // Cannot insert/update dish if category ID is still temporary
        }

        const dishData = {
            title: dish.title.trim(),
            description: dish.description?.trim() || null, // Handle potentially null description
            price: dish.price, // Keep as string from store for DB decimal type
            imageUrl: dish.imageUrl,
            categoryId: realCategoryId, // Use the real category ID
            updatedAt: new Date()
        };

        if (dishId.startsWith('temp_')) {
            // New dish
            dishesToInsert.push({ ...dishData, categoryId: realCategoryId });
        } else {
            // Existing dish to update
            dishesToUpdate.push({ id: dishId, data: dishData });
        }
    }

    // Bulk Insert Dishes
    if (dishesToInsert.length > 0) {
      console.log('Bulk inserting dishes:', dishesToInsert.length);
      await tx.insert(schema.dishes).values(dishesToInsert);
    }

    // Update Existing Dishes (Individual updates within transaction)
    if (dishesToUpdate.length > 0) {
      console.log('Updating dishes:', dishesToUpdate.length);
      for (const update of dishesToUpdate) {
         await tx.update(schema.dishes)
           .set(update.data)
           .where(eq(schema.dishes.id, update.id));
            // We assume the dish ID is unique globally, no need to scope by category/restaurant here
            // unless the schema allows non-unique dish IDs across categories.
      }
    }

    // --- Transaction End ---
    console.log('Transaction completed successfully.');
    return { restaurantId: finalRestaurantId };

  }); // End db.transaction

  // -----------------------------
  // Step 5: Fetch Final State
  // -----------------------------
  console.log('Fetching final state for restaurant ID:', result.restaurantId);
  const finalRestaurantState = await db.query.restaurants.findFirst({
    where: eq(schema.restaurants.id, result.restaurantId),
    with: {
      categories: {
        with: {
          dishes: true // Eager load dishes
        },
        // Optionally add ordering
        orderBy: (categories, { asc }) => [asc(categories.createdAt)],
      }
    }
  });

  if (!finalRestaurantState) {
    throw new Error("Failed to fetch final state after saving.");
  }

  // Ensure nested arrays exist even if empty, matching frontend type expectations
  finalRestaurantState.categories = finalRestaurantState.categories || [];
  finalRestaurantState.categories.forEach(cat => {
    cat.dishes = cat.dishes || [];
  });

  console.log('Save process finished, returning final state.');

  // Cast the result to match the frontend types (Restaurant, Category, Dish)
  // Drizzle's inferred types might be slightly different (e.g., Date vs string for timestamps)
  return finalRestaurantState as SaveResult;

} // End saveMenuChanges