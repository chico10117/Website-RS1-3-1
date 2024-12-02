import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ params, request }: RequestEvent) {
  try {
    await connectDB();
    const { restaurantId, categoryId } = params;
    const dishData = await request.json();

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    const category = restaurant.categories.id(categoryId);
    if (!category) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    category.dishes.push(dishData);
    await restaurant.save();

    return json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error adding dish:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT({ params, request }: RequestEvent) {
  try {
    await connectDB();
    const { restaurantId, categoryId } = params;
    const { dishId, ...updatedDish } = await request.json();

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    const category = restaurant.categories.id(categoryId);
    if (!category) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    const dish = category.dishes.id(dishId);
    if (!dish) {
      return json({ success: false, error: 'Dish not found' }, { status: 404 });
    }

    Object.assign(dish, updatedDish);
    await restaurant.save();

    return json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error updating dish:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE({ params }) {
  try {
    await connectDB();
    const { restaurantId, categoryId, dishId } = params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    const category = restaurant.categories.id(categoryId);
    if (!category) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    category.dishes = category.dishes.filter(dish => dish._id.toString() !== dishId);
    await restaurant.save();

    return json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}