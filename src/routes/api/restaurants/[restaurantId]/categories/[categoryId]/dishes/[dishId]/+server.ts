import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes, categories } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
  try {
    const { dishId, categoryId } = params;
    const updatedDish = await request.json();

    console.log('Updating dish:', { dishId, categoryId, updatedDish }); // Debug log

    // Primero verificamos si el plato existe
    const existingDish = await db.select()
      .from(dishes)
      .where(eq(dishes.id, dishId))
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
        categoryId: categoryId // Usamos el categoryId de los params
      })
      .where(eq(dishes.id, dishId))
      .returning();

    if (!dish) {
      return json({ 
        success: false, 
        error: 'Failed to update dish'
      }, { status: 500 });
    }

    // Obtenemos la categoría actualizada con sus platos
    const updatedCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId));

    const categoryDishes = await db.select()
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId));

    const response = {
      success: true,
      data: {
        dish,
        category: {
          ...updatedCategory[0],
          dishes: categoryDishes
        }
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
    
    // Primero verificamos si el plato existe
    const existingDish = await db.select()
      .from(dishes)
      .where(eq(dishes.id, dishId))
      .limit(1);

    if (!existingDish.length) {
      return json({ success: false, error: 'Dish not found' }, { status: 404 });
    }

    // Eliminamos el plato
    const [deletedDish] = await db.delete(dishes)
      .where(eq(dishes.id, dishId))
      .returning();

    // Obtenemos la categoría actualizada con sus platos
    const updatedCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId));

    const categoryDishes = await db.select()
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId));

    return json({ 
      success: true, 
      data: {
        dish: deletedDish,
        category: {
          ...updatedCategory[0],
          dishes: categoryDishes
        }
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