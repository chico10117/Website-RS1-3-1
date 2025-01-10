import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories, dishes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function POST({ params, request }: RequestEvent) {
  try {
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

    const category = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!category.length) {
      return json({ 
        success: false, 
        error: `Category not found with id: ${categoryId}` 
      }, { status: 404 });
    }

    const [newDish] = await db.insert(dishes)
      .values({
        title: dishData.title,
        price: dishData.price,
        description: dishData.description,
        imageUrl: dishData.imageUrl,
        categoryId: categoryId
      })
      .returning();

    return json({ success: true, data: newDish });
  } catch (error) {
    console.error('POST dish error:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error 
    }, { status: 500 });
  }
} 