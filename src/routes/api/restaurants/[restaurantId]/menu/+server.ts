import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import * as schema from '$lib/server/schema';
import { eq, and, inArray, ne, asc } from 'drizzle-orm';
import { generateSlug } from '$lib/utils/slug';
import { users } from '$lib/server/schema';
import type { Dish } from '$lib/types/menu.types';
import { sql } from 'drizzle-orm';

// Helper to get user from token
async function getUserFromToken(token: string) {
  const [, payloadBase64] = token.split('.');
  const payload = JSON.parse(atob(payloadBase64));
  const [user] = await db.select().from(users).where(eq(users.email, payload.email));
  return user;
}

export async function GET({ params, cookies, url }: RequestEvent) {
  // Redirect to the new consolidated endpoint
  return Response.redirect(new URL(`/api/restaurants/${params.restaurantId}/full`, url.origin));
}

export async function PUT({ request, params, cookies, fetch }: RequestEvent) {
    console.time('PUT-total');
    console.time('PUT-init');
    const { restaurantId } = params;
    const token = cookies.get('auth_token');

    // --- Auth & Validation ---
    if (!restaurantId) return json({ success: false, error: 'Restaurant ID required' }, { status: 400 });
    if (!token) return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    
    let user;
    try {
        user = await getUserFromToken(token);
        if (!user) return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    } catch (error) {
        console.error('Error authenticating user:', error);
        return json({ success: false, error: 'Authentication error' }, { status: 401 });
    }

    // --- Get Payload ---
    let payload;
    try {
        payload = await request.json();
        // Basic payload validation
        if (!payload.restaurant || !Array.isArray(payload.categories)) {
            throw new Error("Invalid payload structure. Requires 'restaurant' object and 'categories' array.");
        }
    } catch (e) {
        console.error('Error parsing request payload:', e);
        return json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }
    console.timeEnd('PUT-init');

    console.time('PUT-validation');
    const { restaurant: restaurantData, categories: receivedCategories } = payload;

    // Calculate payload size for debugging
    const payloadSize = JSON.stringify(payload).length;
    console.log(`Server received payload size: ${(payloadSize / 1024).toFixed(2)} KB`);
    console.log(`Categories: ${receivedCategories.length}, Dishes: ${receivedCategories.reduce((sum: number, cat: any) => sum + (cat.dishes?.length || 0), 0)}`);

    // Validate restaurant data
    if (typeof restaurantData !== 'object') {
        return json({ success: false, error: 'Invalid restaurant data' }, { status: 400 });
    }

    // Validate categories
    for (const category of receivedCategories) {
        if (!category || typeof category !== 'object' || !category.name) {
            return json({ success: false, error: 'Invalid category data' }, { status: 400 });
        }
        if (category.dishes && !Array.isArray(category.dishes)) {
            return json({ success: false, error: 'Category dishes must be an array' }, { status: 400 });
        }
    }
    console.timeEnd('PUT-validation');

    try {
        console.time('PUT-restaurant-verification');
        // 1. Verify restaurant ownership and get current data
        const [currentRestaurant] = await db.select()
            .from(schema.restaurants)
            .where(and(eq(schema.restaurants.id, restaurantId), eq(schema.restaurants.userId, user.id)))
            .limit(1);

        if (!currentRestaurant) {
            return json({ success: false, error: 'Restaurant not found or unauthorized' }, { status: 404 });
        }
        console.timeEnd('PUT-restaurant-verification');

        console.time('PUT-restaurant-update');
        // 2. Update restaurant information
        const restaurantUpdateSet: Partial<typeof schema.restaurants.$inferInsert> = { updatedAt: new Date() };
        
        // Handle name/slug update
        if (restaurantData.name !== undefined && restaurantData.name !== currentRestaurant.name) {
            try {
                const newSlug = await generateSlug(restaurantData.name, fetch);
                const slugExists = await db.select({ id: schema.restaurants.id })
                    .from(schema.restaurants)
                    .where(and(
                        eq(schema.restaurants.userId, user.id),
                        eq(schema.restaurants.slug, newSlug),
                        ne(schema.restaurants.id, restaurantId)
                    ))
                    .limit(1);
                if (slugExists.length > 0) {
                    return json({ success: false, error: "Restaurant name/slug conflict" }, { status: 400 });
                }
                restaurantUpdateSet.name = restaurantData.name;
                restaurantUpdateSet.slug = newSlug;
            } catch (error) {
                console.error('Error generating slug:', error);
                return json({ 
                    success: false, 
                    error: `Error updating restaurant name: ${error instanceof Error ? error.message : 'Unknown error'}` 
                }, { status: 500 });
            }
        }
        
        // Handle other fields with validation
        if (restaurantData.logo !== undefined) restaurantUpdateSet.logo = restaurantData.logo;
        if (restaurantData.customPrompt !== undefined) restaurantUpdateSet.customPrompt = restaurantData.customPrompt;
        if (restaurantData.phoneNumber !== undefined) restaurantUpdateSet.phoneNumber = restaurantData.phoneNumber;
        if (restaurantData.currency !== undefined && typeof restaurantData.currency === 'string') {
            restaurantUpdateSet.currency = restaurantData.currency;
        }
        if (restaurantData.color !== undefined) {
            restaurantUpdateSet.color = String(restaurantData.color);
        }
        if (restaurantData.reservas !== undefined) restaurantUpdateSet.reservas = restaurantData.reservas;
        if (restaurantData.redes_sociales !== undefined) restaurantUpdateSet.redes_sociales = restaurantData.redes_sociales;

        // Update restaurant if needed
        let updatedRestaurant = currentRestaurant;
        if (Object.keys(restaurantUpdateSet).length > 1) { // More than just updatedAt
            [updatedRestaurant] = await db.update(schema.restaurants)
                .set(restaurantUpdateSet)
                .where(eq(schema.restaurants.id, restaurantId))
                .returning();
        }
        console.timeEnd('PUT-restaurant-update');

        console.time('PUT-fetch-current');
        // 3. Get current categories and dishes efficiently
        const currentCategories = await db.select().from(schema.categories)
            .where(eq(schema.categories.restaurantId, restaurantId));
        
        const currentCategoryIds = currentCategories.map(c => c.id);
        
        // Use a single query to get all dishes
        const currentDishes = currentCategoryIds.length > 0
            ? await db.select().from(schema.dishes)
                .where(inArray(schema.dishes.categoryId, currentCategoryIds))
            : [];

        console.log(`Current data: ${currentCategories.length} categories, ${currentDishes.length} dishes`);
        console.timeEnd('PUT-fetch-current');

        console.time('PUT-prepare-maps');
        // Create efficient maps for looking up items
        const currentCategoryMap = new Map(currentCategories.map(c => [c.id, c]));
        const currentDishMap = new Map(currentDishes.map(d => [d.id, d]));
        const receivedCategoryMap = new Map();
        const receivedDishIds = new Set<string>();
        
        // Collect all received items efficiently
        for (const category of receivedCategories) {
            if (category && category.id) {
                receivedCategoryMap.set(category.id, category);
                
                if (Array.isArray(category.dishes)) {
                    for (const dish of category.dishes) {
                        if (dish && dish.id) {
                            receivedDishIds.add(dish.id);
                        }
                    }
                }
            }
        }

        // Identify items to delete
        const categoryIdsToDelete = currentCategories
            .filter(c => !receivedCategoryMap.has(c.id))
            .map(c => c.id);

        const dishIdsToDelete = currentDishes
            .filter(d => !receivedDishIds.has(d.id))
            .map(d => d.id);

        console.log(`To delete: ${categoryIdsToDelete.length} categories, ${dishIdsToDelete.length} dishes`);
        console.timeEnd('PUT-prepare-maps');

        // Prepare collections for bulk operations
        const categoriesToUpdate: any[] = [];
        const categoriesToInsert: any[] = [];
        const dishesToUpdate: any[] = [];
        const dishesToInsert: any[] = [];
        
        // Map to track temporary IDs
        const tempToRealCategoryId = new Map<string, string>();
        
        console.time('PUT-prepare-upserts');
        // Separate items into update/insert collections for bulk operations
        for (const [index, category] of receivedCategories.entries()) {
            try {
                if (!category || !category.name) continue;
                
                const isTempCategory = category.id?.toString().startsWith('temp_');
                const categoryExists = !isTempCategory && currentCategoryMap.has(category.id);
                
                // Prepare category data
                const categoryData = {
                    name: category.name,
                    restaurantId,
                    order: index,
                    updatedAt: new Date()
                };
                
                if (categoryExists) {
                    // Add to update collection
                    categoriesToUpdate.push({
                        id: category.id,
                        ...categoryData
                    });
                } else {
                    // Add to insert collection
                    categoriesToInsert.push(categoryData);
                }
                
                // Prepare dishes data for this category
                if (Array.isArray(category.dishes)) {
                    for (const [dishIndex, dish] of category.dishes.entries()) {
                        if (!dish || !dish.title) continue;
                        
                        const isTempDish = dish.id?.toString().startsWith('temp_');
                        const dishExists = !isTempDish && currentDishMap.has(dish.id);
                        
                        // Skip dishes marked for deletion
                        if (dish.id && dishIdsToDelete.includes(dish.id)) continue;
                        
                        // We'll handle categoryId assignment after category operations
                        const dishData = {
                            title: dish.title,
                            description: dish.description || null,
                            price: dish.price || null,
                            imageUrl: dish.imageUrl || null,
                            currency: (restaurantData.currency || currentRestaurant.currency),
                            // Temporarily store original category reference
                            originalCategoryId: category.id,
                            tempDish: isTempDish,
                            order: dishIndex,
                            updatedAt: new Date()
                        };
                        
                        if (dishExists && dish.id) {
                            dishesToUpdate.push({
                                id: dish.id,
                                ...dishData
                            });
                        } else {
                            dishesToInsert.push(dishData);
                        }
                    }
                }
            } catch (categoryError) {
                console.error('Error preparing category data:', categoryError);
            }
        }
        console.timeEnd('PUT-prepare-upserts');

        try {
            // Process all operations inside a transaction
            console.time('PUT-transaction');
            // First handle deletions to avoid constraint violations
            console.time('PUT-deletions');
            
            // Handle dish deletions
            if (dishIdsToDelete.length > 0) {
                await db.delete(schema.dishes)
                    .where(inArray(schema.dishes.id, dishIdsToDelete));
                console.log(`Deleted ${dishIdsToDelete.length} dishes`);
            }
            
            // Handle category deletions
            if (categoryIdsToDelete.length > 0) {
                await db.delete(schema.categories)
                    .where(inArray(schema.categories.id, categoryIdsToDelete));
                console.log(`Deleted ${categoryIdsToDelete.length} categories`);
            }
            console.timeEnd('PUT-deletions');
            
            // Process category updates and inserts
            console.time('PUT-categories');
            const updatedCategories: any[] = [];
            
            // Update existing categories
            if (categoriesToUpdate.length > 0) {
                for (const category of categoriesToUpdate) {
                    const { id, ...updateData } = category;
                    const [updatedCategory] = await db.update(schema.categories)
                        .set(updateData)
                        .where(eq(schema.categories.id, id))
                        .returning();
                    
                    if (updatedCategory) {
                        updatedCategories.push(updatedCategory);
                    }
                }
                console.log(`Updated ${categoriesToUpdate.length} categories`);
            }
            
            // Insert new categories
            if (categoriesToInsert.length > 0) {
                const insertedCategories = await db.insert(schema.categories)
                    .values(categoriesToInsert)
                    .returning();
                
                // Track the mapping from temp IDs to real IDs
                for (let i = 0; i < insertedCategories.length; i++) {
                    const newCategory = insertedCategories[i];
                    updatedCategories.push(newCategory);
                    
                    // Find the original category index to map IDs
                    const originalIndex = receivedCategories.findIndex((c: any, idx: number) => 
                        !currentCategoryMap.has(c.id) && idx === i);
                    
                    if (originalIndex >= 0 && receivedCategories[originalIndex].id?.toString().startsWith('temp_')) {
                        tempToRealCategoryId.set(receivedCategories[originalIndex].id, newCategory.id);
                    }
                }
                console.log(`Inserted ${categoriesToInsert.length} categories`);
            }
            console.timeEnd('PUT-categories');
            
            // Update dish data with correct category IDs
            console.time('PUT-dishes');
            for (const dish of [...dishesToUpdate, ...dishesToInsert]) {
                if (dish.tempDish || tempToRealCategoryId.has(dish.originalCategoryId)) {
                    dish.categoryId = tempToRealCategoryId.get(dish.originalCategoryId);
                } else {
                    dish.categoryId = dish.originalCategoryId;
                }
                
                // Remove temporary fields
                delete dish.originalCategoryId;
                delete dish.tempDish;
            }
            
            // Process dish updates
            if (dishesToUpdate.length > 0) {
                for (const dish of dishesToUpdate) {
                    const { id, ...updateData } = dish;
                    await db.update(schema.dishes)
                        .set(updateData)
                        .where(eq(schema.dishes.id, id));
                }
                console.log(`Updated ${dishesToUpdate.length} dishes`);
            }
            
            // Process dish inserts in batches
            if (dishesToInsert.length > 0) {
                // Insert in batches of 50 for better performance
                const batchSize = 50;
                for (let i = 0; i < dishesToInsert.length; i += batchSize) {
                    const batch = dishesToInsert.slice(i, i + batchSize);
                    await db.insert(schema.dishes).values(batch);
                }
                console.log(`Inserted ${dishesToInsert.length} dishes in batches`);
            }
            console.timeEnd('PUT-dishes');
            console.timeEnd('PUT-transaction');
        } catch (transactionError) {
            console.error('Error during transaction operations:', transactionError);
            return json({
                success: false,
                error: transactionError instanceof Error 
                    ? transactionError.message 
                    : 'Failed during database operations'
            }, { status: 500 });
        }

        console.time('PUT-fetch-final-state');
        // Fetch final state for response
        const finalRestaurant = await db.select().from(schema.restaurants)
            .where(eq(schema.restaurants.id, restaurantId))
            .limit(1);
            
        if (!finalRestaurant || finalRestaurant.length === 0) {
            return json({ success: false, error: 'Restaurant not found after updates' }, { status: 500 });
        }
            
        const finalCategories = await db.select().from(schema.categories)
            .where(eq(schema.categories.restaurantId, restaurantId))
            .orderBy(asc(schema.categories.order));
            
        const finalCategoryIds = finalCategories.map(c => c.id);
        
        const finalDishes = finalCategoryIds.length > 0
            ? await db.select().from(schema.dishes)
                .where(inArray(schema.dishes.categoryId, finalCategoryIds))
                .orderBy(asc(schema.dishes.order))
            : [];
        console.timeEnd('PUT-fetch-final-state');    
        
        console.time('PUT-prepare-response');
        // Build response more efficiently using Map for category lookup
        const dishesByCategoryMap = new Map();
        
        // Group dishes by category ID (more efficient than filter for each category)
        finalDishes.forEach(dish => {
            if (!dishesByCategoryMap.has(dish.categoryId)) {
                dishesByCategoryMap.set(dish.categoryId, []);
            }
            dishesByCategoryMap.get(dish.categoryId).push(dish);
        });
        
        // Create response structure
        const categoriesWithDishes = finalCategories.map(category => ({
            ...category,
            dishes: dishesByCategoryMap.get(category.id) || []
        }));
        
        const result = {
            ...finalRestaurant[0],
            categories: categoriesWithDishes
        };

        // Calculate response size
        const responseSize = JSON.stringify(result).length;
        console.log(`Response size: ${(responseSize / 1024).toFixed(2)} KB`);
        console.timeEnd('PUT-prepare-response');

        return json({ 
            success: true, 
            data: result, 
            message: 'Menu saved successfully'
        });

    } catch (error) {
        console.error('Error saving menu:', error);
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to save menu'
        }, { status: 500 });
    } finally {
        console.timeEnd('PUT-total');
    }
} 