import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Category } from '$lib/server/models/menu';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ params, request }: RequestEvent) {
  try {
    await connectDB();
    const { categoryId } = params;
    
    console.log('Received categoryId:', categoryId); // Debug log
    
    if (!categoryId) {
      return json({ 
        success: false, 
        error: 'Category ID is required' 
      }, { status: 400 });
    }

    const dishData = await request.json();
    console.log('Received dish data:', dishData); // Debug log

    if (!dishData.title) {
      return json({ 
        success: false, 
        error: 'Dish title is required' 
      }, { status: 400 });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return json({ 
        success: false, 
        error: `Category not found with id: ${categoryId}` 
      }, { status: 404 });
    }

    category.dishes.push(dishData);
    await category.save();

    return json({ success: true, data: category });
  } catch (error) {
    console.error('POST dish error:', error);
    return json({ 
      success: false, 
      error: error.message,
      details: error 
    }, { status: 500 });
  }
} 