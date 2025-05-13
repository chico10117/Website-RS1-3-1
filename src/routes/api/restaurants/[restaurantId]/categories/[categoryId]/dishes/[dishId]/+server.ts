import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes, categories } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
  try {
    const { dishId, categoryId } = params;
    
    // Add validation for required params
    if (!dishId || !categoryId) {
      return json({ success: false, error: 'Dish ID and Category ID are required' }, { status: 400 });
    }

    const updatedDish = await request.json();

    console.log('Updating dish:', { dishId, categoryId, updatedDish }); // Debug log

    // Primero verificamos si el plato existe
    const existingDish = await db.select()
      .from(dishes)
      .where(eq(dishes.id, dishId)) // dishId is now guaranteed to be a string
      .limit(1);

    if (!existingDish.length) {
      return json({ success: false, error: 'Dish not found' }, { status: 404 });
    }

    // Actualizamos el plato
    const [dish] = await db.update(dishes)
      .set({
        title: updatedDish.title,
        price: updatedDish.price,
        description: updatedDish.description,
        imageUrl: updatedDish.imageUrl,
        currency: updatedDish.currency, // Add currency update
        categoryId: categoryId, // categoryId is now guaranteed to be a string
        updatedAt: new Date() // Ensure updatedAt is updated
      })
      .where(eq(dishes.id, dishId)) // dishId is now guaranteed to be a string
      .returning();

    if (!dish) {
      return json({ 
        success: false, 
        error: 'Failed to update dish'
      }, { status: 500 });
    }

    // Obtenemos la categoría actualizada con sus platos (optional, depending on required response)
    const updatedCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId)); // categoryId is now guaranteed to be a string

    const categoryDishes = await db.select()
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId)); // categoryId is now guaranteed to be a string

    const response = {
      success: true,
      data: {
        dish,
        // Optional: include updated category and its dishes if needed by frontend
        // category: {
        //   ...updatedCategory[0],
        //   dishes: categoryDishes
        // }
      },
      message: 'Dish updated successfully'
    };

    console.log('Response:', response); // Debug log
    return json(response);

  } catch (error) {
    console.error('Error updating dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update dish',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    const { dishId, categoryId } = params;

    // Add validation for required params
    if (!dishId || !categoryId) {
      return json({ success: false, error: 'Dish ID and Category ID are required' }, { status: 400 });
    }
    
    // Primero verificamos si el plato existe (Check belongs to category too?)
    const existingDish = await db.select()
      .from(dishes)
      // Consider adding 'and(eq(dishes.categoryId, categoryId))' here if needed
      .where(eq(dishes.id, dishId)) // dishId is now guaranteed to be a string
      .limit(1);

    if (!existingDish.length) {
      return json({ success: false, error: 'Dish not found' }, { status: 404 });
    }

    // Eliminamos el plato
    const [deletedDish] = await db.delete(dishes)
       // If you added the categoryId check above, add it here too
      .where(eq(dishes.id, dishId)) // dishId is now guaranteed to be a string
      .returning();

    // Obtenemos la categoría actualizada con sus platos (optional)
    const updatedCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId)); // categoryId is now guaranteed to be a string

    const categoryDishes = await db.select()
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId)); // categoryId is now guaranteed to be a string

    return json({ 
      success: true, 
      data: {
        dish: deletedDish,
         // Optional: include updated category and its dishes if needed by frontend
        // category: {
        //   ...updatedCategory[0],
        //   dishes: categoryDishes
        // }
      },
      message: 'Dish deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete dish',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 