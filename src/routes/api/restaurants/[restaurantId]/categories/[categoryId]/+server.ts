import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories } from '$lib/server/schema';
import { and, eq, ne } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ request, params }: RequestEvent) {
  try {
    const data = await request.json();
    const { restaurantId, categoryId } = params;

    if (!data.name || !restaurantId || !categoryId) {
      return json({ success: false, error: 'Category name and IDs are required' }, { status: 400 });
    }

    // Check for existing category with the same name in this restaurant (excluding current category)
    const existingCategory = await db.select()
      .from(categories)
      .where(
        and(
          eq(categories.name, data.name),
          eq(categories.restaurantId, restaurantId as string),
          ne(categories.id, categoryId as string)
        )
      )
      .limit(1);

    if (existingCategory.length > 0) {
      return json({ 
        success: false, 
        error: 'A category with this name already exists in this restaurant'
      }, { status: 409 });
    }

    // Update the category
    const [updatedCategory] = await db.update(categories)
      .set({
        name: data.name,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(categories.id, categoryId as string),
          eq(categories.restaurantId, restaurantId as string)
        )
      )
      .returning();

    if (!updatedCategory) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    const { restaurantId, categoryId } = params;

    if (!restaurantId || !categoryId) {
      return json({ success: false, error: 'Restaurant ID and Category ID are required' }, { status: 400 });
    }

    const [deletedCategory] = await db.delete(categories)
      .where(
        and(
          eq(categories.id, categoryId as string),
          eq(categories.restaurantId, restaurantId as string)
        )
      )
      .returning();

    if (!deletedCategory) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return json({ success: true, data: deletedCategory });
  } catch (error) {
    console.error('Error deleting category:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}