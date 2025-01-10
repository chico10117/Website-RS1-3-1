import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
  try {
    const { dishId } = params;
    const updatedDish = await request.json();

    const [dish] = await db.update(dishes)
      .set({
        title: updatedDish.title,
        price: updatedDish.price,
        description: updatedDish.description,
        imageUrl: updatedDish.imageUrl,
        updatedAt: new Date()
      })
      .where(eq(dishes.id, dishId))
      .returning();

    if (!dish) {
      return json({ 
        success: false, 
        error: 'Dish not found' 
      }, { status: 404 });
    }

    return json({ 
      success: true, 
      data: dish,
      message: 'Dish updated successfully'
    });
  } catch (error) {
    console.error('Error updating dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
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
      return json({ 
        success: false, 
        error: 'Dish not found' 
      }, { status: 404 });
    }

    return json({ 
      success: true, 
      data: deletedDish,
      message: 'Dish deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 