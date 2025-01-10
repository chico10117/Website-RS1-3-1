import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';

// Obtener todos los restaurantes
export async function GET() {
  try {
    const allRestaurants = await db.select().from(restaurants);
    return json({ success: true, data: allRestaurants });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Crear nuevo restaurante
export async function POST({ request }) {
  try {
    const restaurantData = await request.json();
    
    const [newRestaurant] = await db.insert(restaurants)
      .values(restaurantData)
      .returning();
    
    return json({ success: true, data: newRestaurant });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}