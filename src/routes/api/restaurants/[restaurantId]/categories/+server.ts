import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Endpoint POST para crear una nueva categoría en un restaurante
 * @param {RequestEvent} evento - Contiene request y params de la petición
 * @returns {Promise<Response>} JSON con la categoría creada o error
 */
export async function POST({ request, params }: RequestEvent) {
  try {
    const data = await request.json();
    const { restaurantId } = params;
    
    console.log('Creating category with data:', { ...data, restaurantId }); // Debug log

    if (!data.name) {
      return json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    // Validación del ID del restaurante
    if (!restaurantId || restaurantId === 'undefined') {
      return json({ success: false, error: 'Valid restaurant ID is required' }, { status: 400 });
    }

    // Insertar nueva categoría en la base de datos
    const [newCategory] = await db.insert(categories)
      .values({
        name: data.name,
        restaurantId: restaurantId
      })
      .returning();

    console.log('Created category:', newCategory); // Debug log

    return json({ 
      success: true, 
      data: newCategory,
      message: 'Category created successfully'
    });
  } catch (error) {
    // Manejo detallado de errores con stack trace
    console.error('Error creating category:', error);
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
    
    // Validación del ID de la categoría
    if (!categoryId || categoryId === 'undefined') {
      return json({ success: false, error: 'Valid category ID is required' }, { status: 400 });
    }

    // Eliminar categoría verificando que pertenezca al restaurante correcto
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