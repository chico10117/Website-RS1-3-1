import { json } from '@sveltejs/kit';
import { db, createRestaurantWithRelations, getRestaurantWithRelations } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import { generateSlug } from '$lib/utils/slug';

export async function POST({ request }: RequestEvent) {
  try {
    const { name, logo } = await request.json();

    if (!name) {
      return json({ 
        success: false, 
        error: 'Restaurant name is required' 
      }, { status: 400 });
    }

    const slug = generateSlug(name);

    // Check if a restaurant with this slug already exists
    const existingRestaurant = await db.select()
      .from(restaurants)
      .where(eq(restaurants.slug, slug))
      .limit(1);

    if (existingRestaurant.length > 0) {
      return json({ 
        success: false, 
        error: 'A restaurant with this name already exists' 
      }, { status: 400 });
    }

    // Create the new restaurant
    const [newRestaurant] = await db.insert(restaurants)
      .values({
        name,
        slug,
        logo: logo || null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return json({ 
      success: true, 
      data: newRestaurant 
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create restaurant',
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