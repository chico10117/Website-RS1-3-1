import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants, categories, dishes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

/**
 * Endpoint GET para obtener todos los restaurantes
 * @returns {Promise<Response>} JSON con los restaurantes o error
 */
export const GET = async () => {
  try {
    const allRestaurants = await db.select().from(restaurants);
    
    // Obtener categorías y platos para cada restaurante
    const restaurantsWithDetails = await Promise.all(
      allRestaurants.map(async (restaurant) => {
        const restaurantCategories = await db.select()
          .from(categories)
          .where(eq(categories.restaurantId, restaurant.id));

        const categoriesWithDishes = await Promise.all(
          restaurantCategories.map(async (category) => {
            const categoryDishes = await db.select()
              .from(dishes)
              .where(eq(dishes.categoryId, category.id));

            return {
              ...category,
              dishes: categoryDishes
            };
          })
        );

        return {
          ...restaurant,
          categories: categoriesWithDishes
        };
      })
    );
    
    return json({ success: true, data: restaurantsWithDetails });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
};

/**
 * Endpoint POST para crear un nuevo restaurante
 * @param {Request} request - Objeto de solicitud HTTP
 */
export const POST = async ({ request }: { request: Request }) => {
  try {
    const data = await request.json();
    
    // Generate a slug from the name if not provided
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
    
    // Check if userId is provided
    if (!data.userId) {
      return json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }
    
    const [newRestaurant] = await db.insert(restaurants)
      .values({
        name: data.name,
        slug: slug,
        userId: data.userId,
        logo: data.logo || null,
        customPrompt: data.customPrompt || null,
        phoneNumber: data.phoneNumber || null,
        currency: data.currency || '€',
        color: data.color || 1
      })
      .returning();

    return json({ success: true, data: newRestaurant });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}; 