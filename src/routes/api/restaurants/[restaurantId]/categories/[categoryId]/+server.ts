import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
  try {
    await connectDB();
    const { restaurantId, categoryId } = params;
    const { name } = await request.json();

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    const category = restaurant.categories.id(categoryId);
    if (!category) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    category.name = name;
    await restaurant.save();

    return json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error updating category:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    await connectDB();
    const { restaurantId, categoryId } = params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    // Remove the category from the restaurant's categories array
    restaurant.categories = restaurant.categories.filter(
      cat => cat._id.toString() !== categoryId
    );
    
    await restaurant.save();

    return json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error deleting category:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}