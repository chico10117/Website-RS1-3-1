import { json } from '@sveltejs/kit';
import { db, createRestaurantWithRelations, getRestaurantWithRelations } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
  try {
    const data = await request.json();
    
    console.log('Received restaurant data:', data); // Debug log

    if (!data.name) {
      return json({ success: false, error: 'Restaurant name is required' }, { status: 400 });
    }

    // Si el logo es "Add logo", lo establecemos como null
    if (data.logo === 'Add logo') {
      data.logo = null;
    }

    // Si hay categorías, usar createRestaurantWithRelations
    if (data.categories?.length > 0) {
      console.log('Creating restaurant with categories:', data); // Debug log
      const newRestaurant = await createRestaurantWithRelations(data);
      return json({ 
        success: true, 
        data: newRestaurant,
        message: 'Restaurant created successfully with categories'
      });
    }

    // Si no hay categorías, crear solo el restaurante
    console.log('Creating restaurant without categories:', data); // Debug log
    const [newRestaurant] = await db.insert(restaurants)
      .values({
        name: data.name,
        logo: data.logo
      })
      .returning();

    console.log('Created restaurant:', newRestaurant); // Debug log
    
    return json({ 
      success: true, 
      data: newRestaurant,
      message: 'Restaurant created successfully'
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
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

export async function GET({ url }: RequestEvent) {
  try {
    console.log('Fetching restaurants...'); // Debug log
    
    const restaurantId = url.searchParams.get('id');
    
    if (restaurantId) {
      // Si se proporciona un ID, obtener un restaurante específico con sus relaciones
      const restaurant = await getRestaurantWithRelations(restaurantId);
      if (!restaurant) {
        return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
      }
      return json({ success: true, data: restaurant });
    }
    
    // Si no se proporciona ID, obtener todos los restaurantes (sin relaciones)
    const allRestaurants = await db.select().from(restaurants);
    console.log('Found restaurants:', allRestaurants); // Debug log
    return json({ success: true, data: allRestaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
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