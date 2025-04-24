import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories, restaurants, users } from '$lib/server/schema';
import { eq, and, inArray } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

// Helper to get user from token (reuse if available elsewhere)
async function getUserFromToken(token: string) {
  // Basic token validation (should be more robust in production)
  if (!token || !token.includes('.')) return null;
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    // Ensure email exists in payload
    if (!payload.email) return null;
    const [user] = await db.select().from(users).where(eq(users.email, payload.email));
    return user;
  } catch (error) {
    console.error("Error decoding token or fetching user:", error);
    return null;
  }
}

export async function PUT({ request, params, cookies }: RequestEvent) {
  const { restaurantId } = params;
  const token = cookies.get('auth_token');

  // Ensure restaurantId is provided
  if (!restaurantId) {
    return json({ success: false, error: 'Restaurant ID is required' }, { status: 400 });
  }

  if (!token) {
    return json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserFromToken(token);
  if (!user) {
    // Changed status to 401 as 'User not found' might imply the user exists but wasn't located, 
    // whereas an invalid/expired token or non-existent email should result in Unauthorized.
    return json({ success: false, error: 'Unauthorized: Invalid token or user not found' }, { status: 401 }); 
  }

  // Verify restaurant ownership
  const [restaurant] = await db.select({ id: restaurants.id })
    .from(restaurants)
    .where(and(eq(restaurants.id, restaurantId), eq(restaurants.userId, user.id)))
    .limit(1);

  if (!restaurant) {
    return json({ success: false, error: 'Restaurant not found or unauthorized' }, { status: 404 });
  }

  try {
    const { orderedCategoryIds } = await request.json();

    if (!Array.isArray(orderedCategoryIds)) {
      return json({ success: false, error: 'orderedCategoryIds must be an array' }, { status: 400 });
    }

    // Basic validation: Check if IDs are UUIDs (optional but good practice)
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!orderedCategoryIds.every(id => typeof id === 'string' && uuidRegex.test(id))) {
      return json({ success: false, error: 'Invalid category ID format in the list' }, { status: 400 });
    }
    
    if (orderedCategoryIds.length === 0) {
       console.log("Received empty array for category order update, doing nothing.");
       return json({ success: true, message: 'No categories to reorder.' });
    }

    // Verify all provided category IDs belong to the specified restaurant *before* updating
    // Perform checks directly on 'db' instead of 'tx'
    const existingCategories = await db.select({ id: categories.id })
      .from(categories)
      .where(and(
          eq(categories.restaurantId, restaurantId),
          inArray(categories.id, orderedCategoryIds)
      ));

    const existingCategoryIds = new Set(existingCategories.map(cat => cat.id));
    const invalidIds = orderedCategoryIds.filter(id => !existingCategoryIds.has(id));

    if (invalidIds.length > 0) {
        console.error(`Attempted to reorder categories not belonging to restaurant ${restaurantId}:`, invalidIds);
        // Throw error *before* attempting any updates
        throw new Error(`Invalid category IDs provided: ${invalidIds.join(', ')}`);
    }
      
    if (existingCategoryIds.size !== orderedCategoryIds.length) {
      console.warn("Mismatch between provided IDs and existing IDs for the restaurant. Proceeding with valid ones.");
      // Decide if this should be an error based on desired strictness.
    }

    // Proceed with update only if all IDs are valid and belong to the restaurant
    // Perform updates sequentially directly on 'db'
    for (let i = 0; i < orderedCategoryIds.length; i++) {
      const categoryId = orderedCategoryIds[i];
      await db.update(categories)
        .set({ order: i })
        .where(eq(categories.id, categoryId));
    }

    return json({ success: true, message: 'Category order updated successfully' });

  } catch (error) {
    console.error('Error updating category order:', error);
    // Check if it's an error we threw intentionally from validation
    if (error instanceof Error && error.message.startsWith('Invalid category IDs provided')) {
      return json({ success: false, error: error.message }, { status: 400 });
    }
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category order'
    }, { status: 500 });
  }
} 