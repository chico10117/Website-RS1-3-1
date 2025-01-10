import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants, categories } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

/**
 * Endpoint GET para obtener las categorías de un restaurante específico
 * @param {Object} params - Contiene restaurantId del restaurante a consultar
 * @returns {Promise<Response>} JSON con las categorías o error
 */
export const GET = async ({ params }) => {
  try {
    const { restaurantId } = params;
    
    // Buscar las categorías del restaurante
    const restaurantCategories = await db.select()
      .from(categories)
      .where(eq(categories.restaurantId, restaurantId));
    
    return json({ success: true, data: restaurantCategories });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
};

/**
 * Endpoint POST para agregar una nueva categoría a un restaurante
 * @param {Object} params - Contiene restaurantId del restaurante a modificar
 * @param {Request} request - Contiene los datos de la nueva categoría
 * @returns {Promise<Response>} JSON con la categoría creada o error
 */
export const POST = async ({ params, request }) => {
  try {
    const { restaurantId } = params;
    const data = await request.json();
    
    // Verificar si el restaurante existe
    const restaurant = await db.select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .limit(1);

    if (!restaurant.length) {
      return json({ 
        success: false, 
        error: 'Restaurant not found' 
      }, { status: 404 });
    }

    // Crear nueva categoría
    const [newCategory] = await db.insert(categories)
      .values({
        name: data.name,
        restaurantId: restaurantId
      })
      .returning();

    return json({ success: true, data: newCategory });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}; 