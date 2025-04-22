import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories } from '$lib/server/schema';
import { and, eq, asc, max, gt, sql } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Endpoint POST to find or create a category in a restaurant based on name.
 * Also handles assigning the correct order.
 * @param {RequestEvent} event - Contains request and params of the petition
 * @returns {Promise<Response>} JSON with the found or created category or error
 */
export async function POST({ request, params }: RequestEvent) {
  try {
    const data = await request.json();
    const { restaurantId } = params;

    console.log('Finding or creating category with data:', { ...data, restaurantId }); // Debug log

    if (!data.name || !restaurantId || restaurantId === 'undefined') {
      const error = !data.name ? 'Category name is required' : 'Valid restaurant ID is required';
      return json({ success: false, error }, { status: 400 });
    }

    // Use a transaction to ensure atomicity when finding/creating and setting order
    const result = await db.transaction(async (tx) => {
      // 1. Try to find an existing category with the same name in this restaurant
      const [existingCategory] = await tx.select()
        .from(categories)
        .where(
          and(
            // eq(sql`lower(${categories.name})`, data.name.toLowerCase()), // Optional: case-insensitive
            eq(categories.name, data.name),
            eq(categories.restaurantId, restaurantId)
          )
        )
        .limit(1);

      let finalCategory: typeof categories.$inferSelect;
      let message: string;

      if (existingCategory) {
        // 2. If found, return the existing category
        console.log('Found existing category:', existingCategory);
        finalCategory = existingCategory;
        message = 'Category found successfully';
      } else {
        // 3. If not found, calculate the next order and insert a new category
        console.log('No existing category found with that name, creating new one...');

        // a. Find Max Order
        const maxOrderResult = await tx
          .select({ value: max(categories.order) })
          .from(categories)
          .where(eq(categories.restaurantId, restaurantId));
        const currentMaxOrder = maxOrderResult[0]?.value ?? 0;
        const nextOrder = currentMaxOrder + 1;

        // b. Insert New Category with order
        const [newCategory] = await tx.insert(categories)
          .values({
            name: data.name,
            restaurantId: restaurantId,
            order: nextOrder // <-- Set the order
          })
          .returning();

        console.log('Created new category:', newCategory); // Debug log
        finalCategory = newCategory;
        message = 'Category created successfully';
      }

      return { success: true, data: finalCategory, message: message };
    });

    return json(result);

  } catch (error) {
    // Detailed error handling
    console.error('Error finding or creating category:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * Endpoint GET para obtener todas las categorías de un restaurante
 * @param {RequestEvent} evento - Contiene los params de la petición
 * @returns {Promise<Response>} JSON con las categorías encontradas o error
 */
export async function GET({ params }: RequestEvent) {
  try {
    const { restaurantId } = params;
    console.log('Fetching categories for restaurant:', restaurantId); // Debug log

    // Validación del ID del restaurante
    if (!restaurantId || restaurantId === 'undefined') {
      return json({ success: false, error: 'Valid restaurant ID is required' }, { status: 400 });
    }

    // Consultar categorías del restaurante, ordenadas por 'order'
    const restaurantCategories = await db.select()
      .from(categories)
      .where(eq(categories.restaurantId, restaurantId))
      .orderBy(asc(categories.order));

    console.log('Found categories (ordered):', restaurantCategories); // Debug log

    return json({ success: true, data: restaurantCategories });
  } catch (error) {
    // Manejo detallado de errores
    console.error('Error getting categories:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * Endpoint DELETE para eliminar una categoría específica y reordenar las restantes.
 * @param {RequestEvent} event - Contiene los params de la petición
 * @returns {Promise<Response>} JSON con la categoría eliminada o error
 */
export async function DELETE({ params }: RequestEvent) {
  try {
    const { restaurantId, categoryId } = params;
    console.log('Deleting category and reordering:', { restaurantId, categoryId }); // Debug log

    if (!categoryId || categoryId === 'undefined') {
      return json({ success: false, error: 'Valid category ID is required' }, { status: 400 });
    }
    if (!restaurantId || restaurantId === 'undefined') {
      return json({ success: false, error: 'Valid restaurant ID is required' }, { status: 400 });
    }

    // Use a transaction to ensure atomicity during delete and reorder
    const result = await db.transaction(async (tx) => {
      // a. Get Deleted Item's Info (order and restaurantId)
      const categoryToDeleteInfo = await tx
        .select({
          order: categories.order,
          restaurantId: categories.restaurantId
        })
        .from(categories)
        .where(and(
          eq(categories.id, categoryId),
          eq(categories.restaurantId, restaurantId)
        ))
        .limit(1);

      if (!categoryToDeleteInfo.length) {
        // Throw an error to rollback the transaction if category not found
        throw new Error('Category not found or does not belong to this restaurant');
      }
      const { order: deletedOrder, restaurantId: catRestaurantId } = categoryToDeleteInfo[0];

      // b. Delete Category
      const [deletedCategory] = await tx
        .delete(categories)
        .where(eq(categories.id, categoryId)) // Already confirmed restaurantId above
        .returning(); // Return the deleted category data

      // Ensure restaurantId is not null before proceeding with update
      if (!catRestaurantId) {
          // This should theoretically not happen based on schema/logic, but good practice
          throw new Error("Restaurant ID is missing for the category being deleted.");
      }

      // c. Update Subsequent Orders
      await tx
        .update(categories)
        .set({ order: sql`${categories.order} - 1` })
        .where(and(
          eq(categories.restaurantId, catRestaurantId), // Now TypeScript knows catRestaurantId is string
          gt(categories.order, deletedOrder)
        ));

      console.log('Deleted category:', deletedCategory); // Debug log
      return { success: true, data: deletedCategory };
    });

    // If transaction was successful, return the result
    return json(result);

  } catch (error) {
    console.error('Error deleting category:', error);
    let status = 500;
    let errorMessage = 'Unknown error';

    if (error instanceof Error) {
        errorMessage = error.message;
        // Check if the error is the one we threw for "not found"
        if (errorMessage === 'Category not found or does not belong to this restaurant') {
            status = 404; // Use 404 for not found
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