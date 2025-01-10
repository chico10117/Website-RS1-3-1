import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';

/**
 * Endpoint GET para obtener todos los restaurantes
 * @returns {Promise<Response>} JSON con los restaurantes o error
 */
export const GET = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Obtener todos los restaurantes de la base de datos
    // El método lean() retorna un objeto JavaScript plano en lugar de un documento Mongoose
    const restaurants = await Restaurant.find({}).lean();
    
    // Retornar respuesta exitosa con los datos
    return json({ success: true, data: restaurants });
  } catch (error) {
    // En caso de error, retornar respuesta de error con estado 500
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

/**
 * Endpoint POST para crear un nuevo restaurante
 * @param {Request} request - Objeto de solicitud HTTP
 */
export const POST = async ({ request }) => {
  // ... existing POST logic
}; 