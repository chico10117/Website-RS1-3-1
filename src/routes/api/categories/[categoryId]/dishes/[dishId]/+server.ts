import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Category } from '$lib/server/models/menu';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
  try {
    await connectDB();
    const { categoryId, dishId } = params;
    const updatedDish = await request.json();

    const category = await Category.findById(categoryId);
    if (!category) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    // Encontrar y actualizar el plato específico
    const dishIndex = category.dishes.findIndex(dish => dish._id.toString() === dishId);
    if (dishIndex === -1) {
      return json({ success: false, error: 'Dish not found' }, { status: 404 });
    }

    // Actualizar el plato
    category.dishes[dishIndex] = {
      ...category.dishes[dishIndex],
      ...updatedDish
    };

    await category.save();
    return json({ success: true, data: category });
  } catch (error) {
    console.error('PUT dish error:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE({ params }) {
  try {
    await connectDB();
    const { categoryId, dishId } = params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    // Remove the dish from the category's dishes array
    category.dishes = category.dishes.filter(dish => dish._id.toString() !== dishId);
    await category.save();

    return json({ success: true, data: category });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
} 