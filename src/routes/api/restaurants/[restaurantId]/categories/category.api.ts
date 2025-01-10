import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';

/**
 * Endpoint GET para obtener las categorías de un restaurante específico
 * @param {Object} params - Contiene restaurantId del restaurante a consultar
 * @returns {Promise<Response>} JSON con las categorías o error
 */
export const GET = async ({ params }) => {
  try {
    await connectDB();
    
    // Buscar el restaurante por su ID y obtener sus categorías
    const restaurant = await Restaurant.findById(params.restaurantId)
      .select('categories')
      .lean();
    
    if (!restaurant) {
      return json(
        { success: false, error: 'Restaurante no encontrado' },
        { status: 404 }
      );
    }

    return json({ success: true, data: restaurant.categories });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
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
    await connectDB();
    const data = await request.json();
    
    // Actualizar el restaurante agregando la nueva categoría
    const restaurant = await Restaurant.findByIdAndUpdate(
      params.restaurantId,
      { $push: { categories: data } },
      { new: true, runValidators: true }
    ).lean();

    if (!restaurant) {
      return json(
        { success: false, error: 'Restaurante no encontrado' },
        { status: 404 }
      );
    }

    return json({ success: true, data: restaurant.categories });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}; 