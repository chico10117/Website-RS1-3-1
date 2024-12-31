import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, params }: RequestEvent) {
  try {
    const data = await request.json();
    const { categoryId } = params;
    
    if (!data.title) {
      return json({ success: false, error: 'Dish title is required' }, { status: 400 });
    }

    const [newDish] = await db.insert(dishes)
      .values({
        title: data.title,
        imageUrl: data.imageUrl || null,
        price: data.price || null,
        description: data.description || null,
        categoryId
      })
      .returning();

    return json({ 
      success: true, 
      data: newDish,
      message: 'Dish created successfully'
    });
  } catch (error) {
    console.error('Error creating dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET({ params }: RequestEvent) {
  try {
    const { categoryId } = params;
    const categoryDishes = await db.select()
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId));

    return json({ success: true, data: categoryDishes });
  } catch (error) {
    console.error('Error getting dishes:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function PUT({ params, request }: RequestEvent) {
  try {
    const { dishId } = params;
    const data = await request.json();

    const [updatedDish] = await db.update(dishes)
      .set({
        title: data.title,
        imageUrl: data.imageUrl || null,
        price: data.price || null,
        description: data.description || null,
      })
      .where(eq(dishes.id, dishId))
      .returning();

    if (!updatedDish) {
      return json({ success: false, error: 'Dish not found' }, { status: 404 });
    }

    return json({ success: true, data: updatedDish });
  } catch (error) {
    console.error('Error updating dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    const { dishId } = params;
    
    const [deletedDish] = await db.delete(dishes)
      .where(eq(dishes.id, dishId))
      .returning();

    if (!deletedDish) {
      return json({ success: false, error: 'Dish not found' }, { status: 404 });
    }

    return json({ success: true, data: deletedDish });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}