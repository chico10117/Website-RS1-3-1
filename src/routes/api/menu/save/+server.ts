// src/routes/api/menu/save/+server.ts
import { json, error as svelteKitError } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { db } from '$lib/server/database';
import * as schema from '$lib/server/schema';
import { eq, inArray, and, ne } from 'drizzle-orm';
// Use more precise types for the DB state if possible, otherwise frontend types are okay
import type { Restaurant as FrontendRestaurant, Category as FrontendCategory, Dish as FrontendDish } from '$lib/types/menu.types';

// Define the expected input structure from the frontend service
interface SaveMenuRequestBody {
    restaurantData: {
        name: string;
        logo: string | null;
        slug?: string | null; // Slug is required for new restaurants
        customPrompt?: string | null;
        phoneNumber?: number | null;
        currency: string;
        color: string;
        reservas?: string | null;
        redes_sociales?: string | null;
    };
    currentRestaurantId: string | null; // The ID from the store (could be temp or real)
    changedItems: {
        restaurant: boolean;
        categories: string[]; // Array of changed category IDs (temp or real)
        dishes: string[];     // Array of changed dish IDs (temp or real)
        deletedCategories: string[]; // Array of IDs to delete (real IDs only)
        deletedDishes: string[];     // Array of IDs to delete (real IDs only)
    };
    // Include the current state of categories and dishes from the store
    categories: FrontendCategory[]; // The current frontend state of categories/dishes (using frontend types)
}

// Define types for Drizzle operations explicitly using schema inference
type DishInsert = typeof schema.dishes.$inferInsert;
type CategoryInsert = typeof schema.categories.$inferInsert;
type RestaurantInsert = typeof schema.restaurants.$inferInsert;
type RestaurantUpdate = Partial<RestaurantInsert>; // Use Partial for updates

export async function POST({ request, locals }: RequestEvent) {
    // --- Authentication ---
    if (!locals.user || !locals.user.id) {
        throw svelteKitError(401, 'Unauthorized');
    }
    const userId = locals.user.id;
    console.log('API /api/menu/save - User authenticated:', userId);

    try {
        const body: SaveMenuRequestBody = await request.json();
        const {
            restaurantData,
            currentRestaurantId, // This is the ID the *frontend* thinks it has
            changedItems,
            categories: frontendCategories // Renamed to avoid conflict
        } = body;

        console.log('API /api/menu/save - Received payload:', { /* Limit logging potentially large data */
            restaurantName: restaurantData.name,
            currentRestaurantId,
            changedCounts: {
                cats: changedItems.categories.length,
                dishes: changedItems.dishes.length,
                delCats: changedItems.deletedCategories.length,
                delDishes: changedItems.deletedDishes.length,
            },
            frontendCategoryCount: frontendCategories.length
        });

        let finalRestaurantId: string;

        // --- Database Transaction ---
        const transactionResult = await db.transaction(async (tx) => {
            // -----------------------------
            // Step 1: Save Restaurant Info
            // -----------------------------
            const isNewRestaurant = !currentRestaurantId || currentRestaurantId.startsWith('temp_');

            const restaurantUpdateSet: RestaurantUpdate = {
                name: restaurantData.name,
                logo: restaurantData.logo,
                customPrompt: restaurantData.customPrompt,
                phoneNumber: restaurantData.phoneNumber,
                currency: restaurantData.currency,
                color: restaurantData.color,
                reservas: restaurantData.reservas,
                redes_sociales: restaurantData.redes_sociales,
                updatedAt: new Date(),
                userId: userId // Always ensure user ID is set/correct
            };

            if (isNewRestaurant) {
                if (!restaurantData.slug) {
                    console.error("API Error: Slug is required for new restaurants.");
                    throw new Error("Slug is required for new restaurants.");
                }

                // Check slug uniqueness within transaction
                const conflictingSlug = await tx.select({ id: schema.restaurants.id })
                    .from(schema.restaurants)
                    .where(eq(schema.restaurants.slug, restaurantData.slug))
                    .limit(1);
                if (conflictingSlug.length > 0) {
                    throw new Error(`Slug "${restaurantData.slug}" is already in use.`);
                }
                restaurantUpdateSet.slug = restaurantData.slug;

                const [insertedRestaurant] = await tx.insert(schema.restaurants)
                    .values(restaurantUpdateSet as RestaurantInsert) // Ensure all required fields are present
                    .returning({ id: schema.restaurants.id }); // Only return ID
                finalRestaurantId = insertedRestaurant.id;
                console.log('API: New restaurant inserted:', finalRestaurantId);
            } else {
                finalRestaurantId = currentRestaurantId; // Use the existing ID provided by client

                // Verify ownership and existence
                const [ownerCheck] = await tx.select({ id: schema.restaurants.id })
                    .from(schema.restaurants)
                    .where(and(eq(schema.restaurants.id, finalRestaurantId), eq(schema.restaurants.userId, userId)));
                if (!ownerCheck) {
                    throw new Error("Restaurant not found or user unauthorized.");
                }

                // If slug is changing, check uniqueness
                if (restaurantData.slug) {
                    const currentDbRestaurant = await tx.select({ slug: schema.restaurants.slug }).from(schema.restaurants).where(eq(schema.restaurants.id, finalRestaurantId)).limit(1);
                    if (restaurantData.slug !== currentDbRestaurant[0]?.slug) {
                         const conflictingSlug = await tx.select({ id: schema.restaurants.id})
                            .from(schema.restaurants)
                            .where(and(eq(schema.restaurants.slug, restaurantData.slug), ne(schema.restaurants.id, finalRestaurantId)))
                            .limit(1);
                        if (conflictingSlug.length > 0) {
                            throw new Error(`Slug "${restaurantData.slug}" is already in use.`);
                        }
                        restaurantUpdateSet.slug = restaurantData.slug;
                    }
                }

                await tx.update(schema.restaurants)
                    .set(restaurantUpdateSet)
                    .where(eq(schema.restaurants.id, finalRestaurantId)); // No need to return here
                console.log('API: Restaurant updated:', finalRestaurantId);
            }

            if (!finalRestaurantId) throw new Error("Failed to determine restaurant ID.");

            // -----------------------------
            // Step 2: Process Deletions
            // -----------------------------
            const categoryIdsToDelete = changedItems.deletedCategories.filter(id => !id.startsWith('temp_'));
            const dishIdsToDelete = changedItems.deletedDishes.filter(id => !id.startsWith('temp_'));

            if (categoryIdsToDelete.length > 0) {
                console.log('API: Bulk deleting categories:', categoryIdsToDelete);
                // Cascade delete should handle related dishes
                await tx.delete(schema.categories)
                    .where(and(
                        inArray(schema.categories.id, categoryIdsToDelete),
                        eq(schema.categories.restaurantId, finalRestaurantId)
                    ));
            }
            if (dishIdsToDelete.length > 0) {
                console.log('API: Bulk deleting dishes (that were not in deleted categories):', dishIdsToDelete);
                 // Ensure dishes belong to the restaurant by checking their category's restaurantId
                 // This prevents deleting dishes if the category ID somehow belongs to another restaurant
                 const validDishIdsToDeleteResult = await tx.select({ id: schema.dishes.id })
                     .from(schema.dishes)
                     .innerJoin(schema.categories, eq(schema.dishes.categoryId, schema.categories.id))
                     .where(and(
                         inArray(schema.dishes.id, dishIdsToDelete),
                         eq(schema.categories.restaurantId, finalRestaurantId)
                     ));

                 const validDishIdsToDelete = validDishIdsToDeleteResult.map(d => d.id);
                 if (validDishIdsToDelete.length > 0) {
                     await tx.delete(schema.dishes)
                         .where(inArray(schema.dishes.id, validDishIdsToDelete));
                 }
            }

            // -----------------------------
            // Step 3: Process Categories (Inserts/Updates)
            // -----------------------------
            const tempToRealCategoryIdMap = new Map<string, string>();
            const categoriesToInsert: CategoryInsert[] = [];
            const categoriesToUpdate: { id: string; data: Partial<CategoryInsert> }[] = [];

            // Map frontend temp IDs to their names for easier mapping after insert
            const tempIdToNameMap = new Map<string, string>();
            frontendCategories.forEach(cat => {
                if (cat.id.startsWith('temp_') && changedItems.categories.includes(cat.id)) {
                    tempIdToNameMap.set(cat.id, cat.name.trim());
                }
            });

            for (const categoryId of changedItems.categories) {
                const category = frontendCategories.find(c => c.id === categoryId);
                // Ensure category exists in frontend state and wasn't marked for deletion *in this request*
                if (!category || categoryIdsToDelete.includes(categoryId)) continue;

                const categoryData = {
                    name: category.name.trim(),
                    restaurantId: finalRestaurantId,
                    updatedAt: new Date()
                };

                if (categoryId.startsWith('temp_')) {
                    categoriesToInsert.push({ ...categoryData }); // Add to insert batch
                } else {
                    categoriesToUpdate.push({ id: categoryId, data: categoryData });
                }
            }

            // Bulk Insert Categories
            if (categoriesToInsert.length > 0) {
                console.log('API: Bulk inserting categories:', categoriesToInsert.length);
                const insertedCategories = await tx.insert(schema.categories)
                    .values(categoriesToInsert)
                    .returning({ id: schema.categories.id, name: schema.categories.name });

                // Update map (match by name, requires names to be unique within insert batch)
                insertedCategories.forEach(insertedCat => {
                    let foundTempId: string | null = null;
                    for (const [tempId, name] of tempIdToNameMap.entries()) {
                        if (name === insertedCat.name) {
                            tempToRealCategoryIdMap.set(tempId, insertedCat.id);
                            foundTempId = tempId;
                            break; // Assuming name is unique for the batch
                        }
                    }
                    if(foundTempId) {
                        tempIdToNameMap.delete(foundTempId); // Remove mapped entry
                    } else {
                         console.warn(`API: Could not map inserted category ID for name: ${insertedCat.name}`);
                    }
                });
                console.log('API: Temp to Real Category ID Map:', tempToRealCategoryIdMap);
            }

            // Update Existing Categories
            for (const update of categoriesToUpdate) {
                 // Check for name conflicts before updating
                 const conflictingCategory = await tx.select({ id: schema.categories.id })
                    .from(schema.categories)
                    .where(and(
                        eq(schema.categories.restaurantId, finalRestaurantId),
                        eq(schema.categories.name, update.data.name!),
                        ne(schema.categories.id, update.id)
                    )).limit(1);

                 if (conflictingCategory.length > 0) {
                     console.warn(`API: Skipping category update for "${update.data.name}". Name already exists in this restaurant.`);
                     continue; // Skip update
                 }
                await tx.update(schema.categories)
                    .set(update.data)
                    .where(and(
                        eq(schema.categories.id, update.id),
                        eq(schema.categories.restaurantId, finalRestaurantId) // Ensure it belongs to the restaurant
                    ));
            }

            // -----------------------------
            // Step 4: Process Dishes (Inserts/Updates)
            // -----------------------------
            const dishesToInsert: DishInsert[] = [];
            const dishesToUpdate: { id: string; data: Partial<DishInsert> }[] = [];

            for (const dishId of changedItems.dishes) {
                let dish: FrontendDish | undefined;
                let sourceCategoryId: string | undefined;

                // Find dish in frontend state
                for (const cat of frontendCategories) {
                    const foundDish = cat.dishes?.find(d => d.id === dishId);
                    if (foundDish) {
                        dish = foundDish;
                        sourceCategoryId = cat.id;
                        break;
                    }
                }

                // Skip if dish not found, belongs to a deleted category, or marked for deletion itself
                if (!dish || !sourceCategoryId || categoryIdsToDelete.includes(sourceCategoryId) || dishIdsToDelete.includes(dishId)) continue;

                // Get the real category ID (either existing or newly inserted)
                const realCategoryId = tempToRealCategoryIdMap.get(sourceCategoryId) || sourceCategoryId;
                if (realCategoryId.startsWith('temp_')) {
                     console.warn(`API: Skipping dish "${dish.title}" - its category "${sourceCategoryId}" (Name: ${frontendCategories.find(c=>c.id === sourceCategoryId)?.name}) could not be mapped to a real ID.`);
                    continue;
                }

                 // Final check: Validate category exists in DB and belongs to the restaurant *before* adding/updating dish
                 // This covers edge cases where a category might be invalid despite mapping
                 const [categoryCheck] = await tx.select({ id: schema.categories.id })
                     .from(schema.categories)
                     .where(and(
                         eq(schema.categories.id, realCategoryId),
                         eq(schema.categories.restaurantId, finalRestaurantId)
                     )).limit(1);

                 if (!categoryCheck) {
                     console.warn(`API: Skipping dish "${dish.title}" - DB check failed for category "${realCategoryId}" belonging to restaurant "${finalRestaurantId}".`);
                     continue;
                 }


                const dishData = {
                    title: dish.title.trim(),
                    description: dish.description?.trim() || null,
                    price: String(dish.price), // Ensure string for decimal/numeric type
                    imageUrl: dish.imageUrl,
                    categoryId: realCategoryId,
                    updatedAt: new Date()
                };

                if (dishId.startsWith('temp_')) {
                    dishesToInsert.push({ ...dishData });
                } else {
                    dishesToUpdate.push({ id: dishId, data: dishData });
                }
            }

            // Bulk Insert Dishes
            if (dishesToInsert.length > 0) {
                console.log('API: Bulk inserting dishes:', dishesToInsert.length);
                await tx.insert(schema.dishes).values(dishesToInsert);
            }

            // Update Existing Dishes
            for (const update of dishesToUpdate) {
                // We need to ensure the dish we are updating actually belongs to a category
                // within the target restaurant to prevent unauthorized cross-restaurant updates.
                const dishToUpdate = await tx.select({ id: schema.dishes.id })
                    .from(schema.dishes)
                    .innerJoin(schema.categories, eq(schema.dishes.categoryId, schema.categories.id))
                    .where(and(
                        eq(schema.dishes.id, update.id),
                        eq(schema.categories.restaurantId, finalRestaurantId)
                    )).limit(1);

                if(dishToUpdate.length > 0) {
                    await tx.update(schema.dishes)
                        .set(update.data)
                        .where(eq(schema.dishes.id, update.id));
                } else {
                    console.warn(`API: Skipping update for dish ID ${update.id} as it was not found or does not belong to restaurant ${finalRestaurantId}`);
                }
            }

            console.log('API: Transaction completed successfully.');
            return { restaurantId: finalRestaurantId }; // Return the final ID

        }); // --- End Transaction ---

        // --- Fetch Final State --- Outside the transaction
        console.log('API: Fetching final state for restaurant ID:', transactionResult.restaurantId);
        const finalRestaurantState = await db.query.restaurants.findFirst({
            where: eq(schema.restaurants.id, transactionResult.restaurantId),
            with: {
                categories: {
                    with: {
                        dishes: {
                             orderBy: (dishes, { asc }) => [asc(dishes.createdAt)], // Order dishes
                        }
                    },
                    orderBy: (categories, { asc }) => [asc(categories.createdAt)], // Order categories
                }
            }
        });

        if (!finalRestaurantState) {
            // This should ideally not happen if the transaction succeeded
            throw svelteKitError(500, "Failed to fetch final state after saving.");
        }

        // Ensure nested arrays exist to match frontend types
        finalRestaurantState.categories = finalRestaurantState.categories || [];
        finalRestaurantState.categories.forEach(cat => {
            cat.dishes = cat.dishes || [];
            // Ensure price is a string or number as expected by frontend
            cat.dishes.forEach(dish => {
                dish.price = dish.price ? String(dish.price) : '0'; // Or Number(dish.price) if preferred
            });
        });

        console.log('API: Save process finished, returning final state.');
        // Return the fully populated restaurant object
        return json({ success: true, data: finalRestaurantState as FrontendRestaurant });

    } catch (error: any) {
        console.error('API /api/menu/save - Error:', error);
        // Return a structured error response
        throw svelteKitError(500, error.message || 'Failed to save menu changes');
    }
} 