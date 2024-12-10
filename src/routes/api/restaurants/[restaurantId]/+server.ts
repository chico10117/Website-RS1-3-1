import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
  try {
    await connectDB();
    const { restaurantId } = params;
    const updateData = await request.json();

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    // Update only the fields that are provided
    if (updateData.logo !== undefined) {
      restaurant.logo = updateData.logo;
    }
    if (updateData.name !== undefined) {
      restaurant.name = updateData.name;
    }

    await restaurant.save();

    return json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    await connectDB();
    const { restaurantId } = params;

    const restaurant = await Restaurant.findByIdAndDelete(restaurantId);
    if (!restaurant) {
      return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    return json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
} 