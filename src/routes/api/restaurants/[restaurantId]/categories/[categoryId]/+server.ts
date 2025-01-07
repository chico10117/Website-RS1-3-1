import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories, dishes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
  try {
    const { restaurantId, categoryId } = params;
    const { name } = await request.json();

    if (!name || typeof name !== 'string') {
      return json({ 
        success: false, 
        error: 'Category name is required and must be a string' 
      }, { status: 400 });
    }

    // Validate that categoryId exists
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId as string))
      .limit(1);

    if (!existingCategory.length) {
      return json({ 
        success: false, 
        error: 'Category not found' 
      }, { status: 404 });
    }

    // Update the category
    const [updatedCategory] = await db.update(categories)
      .set({ 
        name,
        updatedAt: new Date()
      })
      .where(eq(categories.id, categoryId as string))
      .returning();

    // Get all dishes for this category
    const categoryDishes = await db.select()
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId as string));

    // Return the updated category with its dishes
    return json({
      success: true,
      data: {
        ...updatedCategory,
        dishes: categoryDishes
      }
    });

  } catch (error) {
    console.error('Error updating category:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update category',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    const { categoryId } = params;

    // Delete the category (dishes will be cascade deleted due to foreign key constraint)
    const [deletedCategory] = await db.delete(categories)
      .where(eq(categories.id, categoryId as string))
      .returning();

    if (!deletedCategory) {
      return json({ 
        success: false, 
        error: 'Category not found' 
      }, { status: 404 });
    }

    return json({
      success: true,
      data: deletedCategory
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete category',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}