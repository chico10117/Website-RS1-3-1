import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';

export async function POST({ params, request }) {
  try {
    await connectDB();
    const { restaurantId } = params;
    const { name } = await request.json();
    
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    restaurant.categories.push({ name, dishes: [] });
    await restaurant.save();
    
    return json({ success: true, data: restaurant });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET({ params }) {
  try {
    await connectDB();
    const { restaurantId } = params;
    
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }
    
    return json({ success: true, data: restaurant.categories });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
} 