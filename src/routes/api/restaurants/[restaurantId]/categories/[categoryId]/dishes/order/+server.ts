import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes, categories, restaurants, users } from '$lib/server/schema';
import { eq, and, inArray } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

// --- Helper Function to Get User (copy if not already in a shared location) ---
// TODO: Consider moving this to a shared utility file (e.g., $lib/server/authUtils.ts)
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

        let existingDishIds: Set<string> = new Set(); // Declare here to be accessible later

        // Verify all provided dish IDs actually belong to this category *before* updating
        if (orderedDishIds.length > 0) {
            const existingDishes = await db.select({ id: dishes.id })
                .from(dishes)
                .where(and(
                    eq(dishes.categoryId, categoryId),
                    inArray(dishes.id, orderedDishIds)
                ));

            existingDishIds = new Set(existingDishes.map(d => d.id)); // Assign here
            const invalidIds = orderedDishIds.filter(id => !existingDishIds.has(id));

            if (invalidIds.length > 0) {
                 console.error(`API Error: Attempted to reorder dishes not belonging to category ${categoryId}:`, invalidIds);
                 // Return 400 Bad Request if invalid IDs are provided
                 return json({ success: false, error: `Invalid dish IDs provided for category ${categoryId}: ${invalidIds.join(', ')}` }, { status: 400 });
            }
             if (existingDishIds.size !== orderedDishIds.length) {
                 console.warn(`API Warning: Mismatch between provided (${orderedDishIds.length}) and existing (${existingDishIds.size}) dish IDs for category ${categoryId}. Some provided IDs might not exist or be duplicates.`);
                 // Decide if this should be an error or just proceed with valid ones based on requirements
                 // For now, we proceed with the valid ones, but return a 400 if any invalid ones were *also* present (handled above)
             }
        } else {
            // If no dishes were sent, we can consider it a success (nothing to update)
            return json({ success: true, message: 'No dishes to order.' });
        }

        // Update order for each dish based on its index in the received array
        // Using individual updates for simplicity here. A bulk update might be more performant for large lists.
        // Ensure we only update dishes that actually exist and belong to the category
        const validOrderedDishIds = orderedDishIds.filter(id => existingDishIds.has(id)); // Filter based on validated IDs
        const updatePromises = validOrderedDishIds.map((dishId, index) =>
            db.update(dishes)
              .set({ order: index })
              .where(eq(dishes.id, dishId)) // Implicitly ensures it's in the correct category due to earlier checks
        );

        await Promise.all(updatePromises);

        return json({ success: true, message: 'Dish order updated successfully' });

    } catch (error) {
        console.error(`API Error updating dish order for category ${categoryId}:`, error);
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update dish order'
        }, { status: 500 });
    }
} 