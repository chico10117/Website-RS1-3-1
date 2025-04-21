import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Endpoint POST to find or create a category in a restaurant based on name.
 * @param {RequestEvent} evento - Contains request and params of the petition
 * @returns {Promise<Response>} JSON with the found or created category or error
 */
export async function POST({ request, params }: RequestEvent) {
  try {
    const data = await request.json();
    const { restaurantId } = params;

    console.log('Finding or creating category with data:', { ...data, restaurantId }); // Debug log

    if (!data.name) {
      return json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    // Validation of restaurant ID
    if (!restaurantId || restaurantId === 'undefined') {
      return json({ success: false, error: 'Valid restaurant ID is required' }, { status: 400 });
    }

    // 1. Try to find an existing category with the same name in this restaurant
    const [existingCategory] = await db.select()
      .from(categories)
      .where(
        and(
          // Case-insensitive comparison might be better, depends on requirements
          // Using lower() might require indexing for performance:
          // eq(sql`lower(${categories.name})`, data.name.toLowerCase()),
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
      // 3. If not found, insert a new category
      console.log('No existing category found with that name, creating new one...');
      const [newCategory] = await db.insert(categories)
        .values({
          name: data.name,
          restaurantId: restaurantId
        })
        .returning();

      console.log('Created new category:', newCategory); // Debug log
      finalCategory = newCategory;
      message = 'Category created successfully';
    }

    return json({
      success: true,
      data: finalCategory,
      message: message
    });
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

    // Consultar categorías del restaurante
    const restaurantCategories = await db.select()
      .from(categories)
      .where(eq(categories.restaurantId, restaurantId));

    console.log('Found categories:', restaurantCategories); // Debug log

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
 * Endpoint DELETE para eliminar una categoría específica
 * @param {RequestEvent} evento - Contiene los params de la petición
 * @returns {Promise<Response>} JSON con la categoría eliminada o error
 */
export async function DELETE({ params }: RequestEvent) {
  try {
    const { restaurantId, categoryId } = params;
    console.log('Deleting category:', { restaurantId, categoryId }); // Debug log
    
    // Validation of category ID
    if (!categoryId || categoryId === 'undefined') {
      return json({ success: false, error: 'Valid category ID is required' }, { status: 400 });
    }

    // Validation of restaurant ID
    if (!restaurantId || restaurantId === 'undefined') {
      return json({ success: false, error: 'Valid restaurant ID is required' }, { status: 400 });
    }

    // Delete category, verifying it belongs to the correct restaurant
    const [deletedCategory] = await db.delete(categories)
      .where(
        and(
          eq(categories.id, categoryId),
          eq(categories.restaurantId, restaurantId)
        )
      )
      .returning();

    // Verificar si se encontró y eliminó la categoría
    if (!deletedCategory) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    console.log('Deleted category:', deletedCategory); // Debug log

    return json({ success: true, data: deletedCategory });
  } catch (error) {
    // Manejo detallado de errores
    console.error('Error deleting category:', error);
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