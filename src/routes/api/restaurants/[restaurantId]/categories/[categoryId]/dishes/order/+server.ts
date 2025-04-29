import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes, categories, restaurants, users } from '$lib/server/schema';
import { eq, and, inArray } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

// --- Helper Function to Get User (ensure consistent implementation) ---
async function getUserFromToken(token: string | undefined) {
    if (!token || !token.includes('.')) return null;
    try {
        const [, payloadBase64] = token.split('.');
        const payload = JSON.parse(atob(payloadBase64));
        if (!payload.email) return null;
        const [user] = await db.select().from(users).where(eq(users.email, payload.email));
        return user;
    } catch (error) {
        console.error("Helper getUserFromToken Error:", error);
        return null;
    }
}
// --- End Helper ---

export async function PUT({ request, params, cookies }: RequestEvent): Promise<Response> {
    const { restaurantId, categoryId } = params;
    const token = cookies.get('auth_token');

    // --- Basic Validation ---
    if (!restaurantId || !categoryId) {
        return json({ success: false, error: 'Restaurant ID and Category ID are required' }, { status: 400 });
    }

    // --- Authentication & Authorization ---
    if (!token) {
        return json({ success: false, error: 'Unauthorized - No token' }, { status: 401 });
    }
    const user = await getUserFromToken(token);
    if (!user) {
        return json({ success: false, error: 'Unauthorized - Invalid user' }, { status: 401 });
    }

    // Verify ownership: Check if the category belongs to a restaurant owned by the user
    const [categoryCheck] = await db.select({ catId: categories.id })
        .from(categories)
        .innerJoin(restaurants, eq(categories.restaurantId, restaurants.id))
        .where(and(
            eq(categories.id, categoryId),
            eq(restaurants.id, restaurantId), // Ensure category is in the specified restaurant
            eq(restaurants.userId, user.id)     // Ensure restaurant belongs to the user
        ))
        .limit(1);

    if (!categoryCheck) {
        return json({ success: false, error: 'Category not found or unauthorized' }, { status: 404 });
    }
    // --- End Auth & Authz ---

    try {
        const { orderedDishIds } = await request.json() as { orderedDishIds: string[] };

        if (!Array.isArray(orderedDishIds)) {
            return json({ success: false, error: 'orderedDishIds must be an array' }, { status: 400 });
        }
        
        console.log(`API Endpoint: Received orderedDishIds in request body for category ${categoryId}:`, orderedDishIds);

        console.log(`API: Updating dish order for category ${categoryId}. Received IDs:`, orderedDishIds);

        // --- Remove Transaction Wrapper ---
        // await db.transaction(async (tx) => { 
            if (orderedDishIds.length > 0) {
                // Verify all provided dish IDs actually belong to this category *before* updating
                // Use `db` directly instead of `tx`
                const existingDishes = await db.select({ id: dishes.id })
                    .from(dishes)
                    .where(and(
                        eq(dishes.categoryId, categoryId),
                        inArray(dishes.id, orderedDishIds)
                    ));

                const existingDishIds = new Set(existingDishes.map(d => d.id));
                const invalidIds = orderedDishIds.filter(id => !existingDishIds.has(id));

                if (invalidIds.length > 0) {
                    console.error(`API Error: Attempted to reorder dishes not belonging to category ${categoryId}:`, invalidIds);
                    throw new Error(`Invalid dish IDs provided for category ${categoryId}: ${invalidIds.join(', ')}`);
                }
                 if (existingDishIds.size !== orderedDishIds.length) {
                      console.warn(`API Warning: Mismatch between provided (${orderedDishIds.length}) and existing (${existingDishIds.size}) dish IDs for category ${categoryId}.`);
                 }
            } else {
                 console.log(`API: No dishes provided for ordering in category ${categoryId}. Skipping update.`);
                 // If no dishes, we can return success early 
                 return json({ success: true, message: 'No dishes to order.' }); 
            }

            // Update order for each dish based on its index in the received array
            // Use `db` directly instead of `tx`
            const updatePromises = orderedDishIds.map((dishId, index) =>
                db.update(dishes)
                  .set({ order: index })
                  .where(eq(dishes.id, dishId))
            );

            await Promise.all(updatePromises);
        // }); // End of removed transaction wrapper
        // --- End Remove Transaction Wrapper ---

        console.log(`API: Successfully updated dish order for category ${categoryId}`);
        return json({ success: true, message: 'Dish order updated successfully' });

    } catch (error) {
        console.error(`API Error updating dish order for category ${categoryId}:`, error);
        if (error instanceof Error && error.message.startsWith('Invalid dish IDs provided')) {
            return json({ success: false, error: error.message }, { status: 400 }); // Bad request if IDs don't match
        }
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update dish order'
        }, { status: 500 });
    }
} 