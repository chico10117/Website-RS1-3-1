import { json, error as svelteKitError } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import * as schema from '$lib/server/schema';
import { eq, and, inArray, sql as drizzleSql } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import { generateSlug } from '$lib/utils/slug'; // Assuming this util is adapted for server-side or passed `fetch`

// Helper to get user from token
async function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  const [, payloadBase64] = token.split('.');
  if (!payloadBase64) return null;
  try {
    const payload = JSON.parse(atob(payloadBase64));
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, payload.email));
    return user;
  } catch (e) {
    console.error("Error decoding token or fetching user:", e);
    return null;
  }
}

interface DishPayload {
  id?: string; // tempId for new, actual id for existing
  title: string;
  description: string | null;
  price: string; // Assuming price is string from client
  imageUrl: string | null;
  order?: number;
  // categoryId will be resolved server-side for new dishes
}

interface CategoryPayload {
  id?: string; // tempId for new, actual id for existing
  name: string;
  dishes: DishPayload[];
  order?: number;
}

interface BulkSavePayload {
  restaurant: {
    id?: string; // tempId for new, actual id for existing
    name: string;
    logo: string | null;
    customPrompt: string | null;
    phoneNumber: number | null;
    currency: string;
    color: string;
    reservas: string | null;
    redes_sociales: string | null;
    slug?: string; // Optional, can be auto-generated
  };
  categories: CategoryPayload[];
  deletedCategoryIds: string[];
  deletedDishIds: string[];
  orderedCategoryIds: string[]; // All category IDs in their desired order
}

export async function POST({ request, cookies, fetch: svelteKitFetch }: RequestEvent) {
  const token = cookies.get('auth_token');
  const user = await getUserFromToken(token);

  if (!user) {
    return json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json() as BulkSavePayload;
  const tempToRealIdMap = new Map<string, string>(); // For mapping temp client IDs to real DB IDs

  try {
    // 1. Save/Update Restaurant
    let restaurantId = payload.restaurant.id?.startsWith('temp_') ? undefined : payload.restaurant.id;
    let savedRestaurant: any;
    const restaurantData = payload.restaurant;
    const restaurantSlug = restaurantData.slug || await generateSlug(restaurantData.name, svelteKitFetch);

    if (restaurantId && !payload.restaurant.id?.startsWith('temp_')) {
      const [existingRestaurant] = await db.select()
        .from(schema.restaurants)
        .where(and(eq(schema.restaurants.id, restaurantId), eq(schema.restaurants.userId, user.id)));
      if (!existingRestaurant) throw svelteKitError(404, 'Restaurant not found or not owned by user');
      
      [savedRestaurant] = await db.update(schema.restaurants)
        .set({
          name: restaurantData.name, 
          slug: restaurantSlug, 
          logo: restaurantData.logo,
          customPrompt: restaurantData.customPrompt, 
          phoneNumber: restaurantData.phoneNumber,
          currency: restaurantData.currency, 
          color: restaurantData.color,
          reservas: restaurantData.reservas, 
          redes_sociales: restaurantData.redes_sociales,
          updatedAt: new Date(),
        })
        .where(eq(schema.restaurants.id, restaurantId)).returning();
    } else {
      [savedRestaurant] = await db.insert(schema.restaurants)
        .values({
          name: restaurantData.name, 
          slug: restaurantSlug, 
          logo: restaurantData.logo,
          customPrompt: restaurantData.customPrompt, 
          phoneNumber: restaurantData.phoneNumber,
          currency: restaurantData.currency, 
          color: restaurantData.color,
          reservas: restaurantData.reservas, 
          redes_sociales: restaurantData.redes_sociales,
          userId: user.id,
        }).returning();
      restaurantId = savedRestaurant.id;
      if (payload.restaurant.id && typeof payload.restaurant.id === 'string') {
        tempToRealIdMap.set(payload.restaurant.id, restaurantId);
      }
    }
    if (!restaurantId) throw new Error("Failed to get restaurant ID");

    // 2. Handle Deletions
    if (payload.deletedDishIds.length > 0) {
      const realDeletedDishIds = payload.deletedDishIds.filter(id => !id.startsWith('temp_'));
      if (realDeletedDishIds.length > 0) {
        const dishesToDelete = await db.select({ id: schema.dishes.id })
          .from(schema.dishes)
          .innerJoin(schema.categories, eq(schema.dishes.categoryId, schema.categories.id))
          .where(and(eq(schema.categories.restaurantId, restaurantId), inArray(schema.dishes.id, realDeletedDishIds)));
        const validatedDishIdsToDelete = dishesToDelete.map(d => d.id);
        if (validatedDishIdsToDelete.length > 0) {
          await db.delete(schema.dishes).where(inArray(schema.dishes.id, validatedDishIdsToDelete));
        }
      }
    }
    if (payload.deletedCategoryIds.length > 0) {
      const realDeletedCategoryIds = payload.deletedCategoryIds.filter(id => !id.startsWith('temp_'));
      if (realDeletedCategoryIds.length > 0) {
        await db.delete(schema.categories)
          .where(and(eq(schema.categories.restaurantId, restaurantId), inArray(schema.categories.id, realDeletedCategoryIds)));
      }
    }

    // 3. Handle Category and Dish Creations & Updates
    const savedCategoriesWithDishes: any[] = []; // To store the final structure

    for (const [catIndex, catPayload] of payload.categories.entries()) {
      let categoryDbId = catPayload.id?.startsWith('temp_') ? undefined : tempToRealIdMap.get(catPayload.id || '') || catPayload.id;
      let savedCategory: any;
      const targetCategoryOrder = catPayload.id ? payload.orderedCategoryIds.indexOf(catPayload.id) : -1; // Get order from ordered list

      const categoryDataToSave = {
        name: catPayload.name,
        restaurantId: restaurantId,
        order: targetCategoryOrder !== -1 ? targetCategoryOrder : catIndex, // Use resolved order or fall back to payload index
      };

      if (categoryDbId && !catPayload.id?.startsWith('temp_')) { // Update
        [savedCategory] = await db.update(schema.categories)
          .set({ ...categoryDataToSave, updatedAt: new Date() })
          .where(and(eq(schema.categories.id, categoryDbId), eq(schema.categories.restaurantId, restaurantId)))
          .returning();
      } else { // Create
        [savedCategory] = await db.insert(schema.categories).values(categoryDataToSave).returning();
        categoryDbId = savedCategory.id;
        if (catPayload.id && typeof catPayload.id === 'string') {
          tempToRealIdMap.set(catPayload.id, categoryDbId);
        }
      }
      if (!categoryDbId) throw new Error(`Failed to save category: ${catPayload.name}`);

      const savedDishesForThisCategory: any[] = [];
      if (catPayload.dishes && catPayload.dishes.length > 0) {
        const dishesToCreate: any[] = [];
        const dishUpdatePromises: Promise<any[]>[] = [];

        for (const [dishIndex, dishPayload] of catPayload.dishes.entries()) {
          let dishDbId = dishPayload.id?.startsWith('temp_') ? undefined : tempToRealIdMap.get(dishPayload.id || '') || dishPayload.id;
          const dishData = {
            title: dishPayload.title, 
            description: dishPayload.description,
            price: dishPayload.price, 
            imageUrl: dishPayload.imageUrl,
            order: dishPayload.order !== undefined ? dishPayload.order : dishIndex,
            categoryId: categoryDbId,
          };

          if (dishDbId && !dishPayload.id?.startsWith('temp_')) { // Update
            dishUpdatePromises.push(
              db.update(schema.dishes)
                .set({ ...dishData, updatedAt: new Date() })
                .where(and(eq(schema.dishes.id, dishDbId), eq(schema.dishes.categoryId, categoryDbId)))
                .returning()
            );
          } else { // Create
            dishesToCreate.push(dishData);
          }
        }

        if (dishesToCreate.length > 0) {
          const newDbDishes = await db.insert(schema.dishes).values(dishesToCreate).returning();
          savedDishesForThisCategory.push(...newDbDishes);
          newDbDishes.forEach((newDish, i) => { // Attempt to map temp IDs
            const originalPayloadDish = catPayload.dishes.find(dp => dp.title === newDish.title && dp.id?.startsWith('temp_'));
            if (originalPayloadDish?.id && !tempToRealIdMap.has(originalPayloadDish.id)) { // check if not already mapped
              tempToRealIdMap.set(originalPayloadDish.id, newDish.id);
            }
          });
        }
        const updatedDishResults = await Promise.all(dishUpdatePromises);
        updatedDishResults.forEach(result => {
          if(result && result.length > 0) savedDishesForThisCategory.push(...result);
        });
      }
      // Ensure dishes are ordered correctly before adding to the category
      savedDishesForThisCategory.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      savedCategoriesWithDishes.push({ ...savedCategory, dishes: savedDishesForThisCategory });
    }
    
    // 4. Final Category Reordering (using resolved IDs)
    if (payload.orderedCategoryIds && payload.orderedCategoryIds.length > 0) {
      const finalOrderedRealCategoryIds = payload.orderedCategoryIds
        .map(id => tempToRealIdMap.get(id) || id)
        .filter(id => !id.startsWith('temp_')); // Filter out any unresolved temp IDs

      if (finalOrderedRealCategoryIds.length > 0) {
        // Using Drizzle `sql` for potential single batch update if Neon supports it
        const cases = drizzleSql.raw(
          finalOrderedRealCategoryIds.map((id, index) => `WHEN '${id}' THEN ${index}`).join(' ')
        );
        const idList = drizzleSql.raw(
          finalOrderedRealCategoryIds.map(id => `'${id}'`).join(',')
        );
        
        // Check if there are cases to apply
        if (finalOrderedRealCategoryIds.length > 0) {
          const updateQuery = drizzleSql`UPDATE ${schema.categories} SET "order" = CASE id ${cases} END WHERE id IN (${idList}) AND "restaurant_id" = ${restaurantId}`;
          await db.execute(updateQuery);
        }
      }
    }

    // 5. Re-fetch the final state to ensure consistency and correct ordering
    // Instead of using relational queries, we'll do it manually with regular queries
    const [finalRestaurant] = await db.select().from(schema.restaurants)
      .where(eq(schema.restaurants.id, restaurantId));
    
    if (!finalRestaurant) {
      throw new Error("Failed to fetch final restaurant state after save.");
    }

    // Get categories ordered by their order field
    const categories = await db.select().from(schema.categories)
      .where(eq(schema.categories.restaurantId, restaurantId))
      .orderBy(schema.categories.order);
    
    // For each category, get its dishes
    const categoriesWithDishes = await Promise.all(categories.map(async (category) => {
      const dishes = await db.select().from(schema.dishes)
        .where(eq(schema.dishes.categoryId, category.id))
        .orderBy(schema.dishes.order);
      
      return {
        ...category,
        dishes
      };
    }));

    // Create the final restaurant state with categories and dishes
    const finalRestaurantState = {
      ...finalRestaurant,
      categories: categoriesWithDishes
    };

    return json({
      success: true,
      data: finalRestaurantState
    });

  } catch (e: any) {
    console.error("Bulk save error:", e);
    const errorMessage = e instanceof Error ? e.message : "Failed to save menu";
    // If e is a SvelteKit error, it will have a status property
    const errorStatus = typeof e === 'object' && e !== null && 'status' in e ? (e as any).status : 500;
    return json({ success: false, error: errorMessage, details: e.stack }, { status: errorStatus });
  }
} 