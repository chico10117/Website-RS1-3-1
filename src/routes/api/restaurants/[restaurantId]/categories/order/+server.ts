import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Endpoint PUT to update the order of categories for a specific restaurant.
 * Expects a body like: { orderedCategoryIds: ["id1", "id2", "id3"] }
 * @param {RequestEvent} event - Contains request, params.
 * @returns {Promise<Response>} JSON confirmation or error.
 */
export async function PUT({ request, params }: RequestEvent) {
  try {
    const { restaurantId } = params;
    const { orderedCategoryIds } = await request.json();

    console.log('Reordering categories for restaurant:', restaurantId, 'New order:', orderedCategoryIds); // Debug log

    // Basic validation
    if (!restaurantId || restaurantId === 'undefined') {
      return json({ success: false, error: 'Valid restaurant ID is required' }, { status: 400 });
    }
    if (!Array.isArray(orderedCategoryIds) || orderedCategoryIds.some(id => typeof id !== 'string')) {
      return json({ success: false, error: 'orderedCategoryIds must be an array of strings' }, { status: 400 });
    }

    // Use a transaction to update all orders atomically
    await db.transaction(async (tx) => {
      // Optional validation: Check if all provided IDs exist and belong to the restaurant
      // This adds safety but increases query count. Could be skipped if frontend guarantees correctness.
      /* 
      const existingCats = await tx.select({ id: categories.id })
        .from(categories)
        .where(and(
          eq(categories.restaurantId, restaurantId),
          inArray(categories.id, orderedCategoryIds)
        ));
      if (existingCats.length !== orderedCategoryIds.length) {
         // Find missing/extra IDs for a better error message
         throw new Error("Mismatch between provided category IDs and existing categories for this restaurant.");
      }
      */

      // Bulk update orders based on the array index (1-based order)
      const updatePromises = orderedCategoryIds.map((categoryId, index) => {
        const newOrder = index + 1; // Order is 1-based
        return tx
          .update(categories)
          .set({ order: newOrder })
          .where(and(
            eq(categories.id, categoryId),
            eq(categories.restaurantId, restaurantId) // Ensure we only update categories in this restaurant
          ));
      });

      // Wait for all updates to complete
      await Promise.all(updatePromises);
    });

    console.log('Categories reordered successfully for restaurant:', restaurantId); // Debug log
    return json({ success: true, message: 'Categories reordered successfully' });

  } catch (error) {
    console.error('Error reordering categories:', error);
    let status = 500;
    let errorMessage = 'Unknown error during reordering';

    if (error instanceof Error) {
      errorMessage = error.message;
      // Check for specific validation errors if added
      if (errorMessage.includes('Mismatch between provided category IDs')) {
          status = 400; // Bad request if IDs don't match
      } else {
          console.error('Error details:', error.message, error.stack);
      }
    }

    return json({ 
      success: false, 
      error: errorMessage,
      details: (error instanceof Error && status === 500) ? error.stack : undefined // Only include stack for internal errors
    }, { status });
  }
} 