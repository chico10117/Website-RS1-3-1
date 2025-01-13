import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes, categories } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, params }: RequestEvent) {
  try {
    const data = await request.json();
    const { categoryId } = params;
    
    console.log('Creating dish:', { data, categoryId }); // Debug log

    // Basic validation
    if (!data.title || !categoryId) {
      return json({ 
        success: false, 
        error: 'Dish title and category ID are required' 
      }, { status: 400 });
    }

    // Simple insert
    const [newDish] = await db.insert(dishes)
      .values({
        title: data.title,
        price: data.price || null,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        categoryId
      })
      .returning();

    console.log('Created dish:', newDish); // Debug log

    return json({ 
      success: true, 
      data: newDish 
    });
  } catch (error) {
    console.error('Error creating dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET({ params }: RequestEvent) {
  try {
    const { restaurantId, categoryId } = params;

    // Validate that the category exists and belongs to the restaurant
    const existingCategory = await db.select()
      .from(categories)
      .where(
        and(
          eq(categories.id, categoryId as string),
          eq(categories.restaurantId, restaurantId as string)
        )
      )
      .limit(1);

    if (!existingCategory.length) {
      return json({ 
        success: false, 
        error: 'Category not found or does not belong to this restaurant' 
      }, { status: 404 });
    }

    const categoryDishes = await db.select()
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId as string));

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
    const { restaurantId, categoryId, dishId } = params;
    const data = await request.json();

    // Validate that the category exists and belongs to the restaurant
    const existingCategory = await db.select()
      .from(categories)
      .where(
        and(
          eq(categories.id, categoryId as string),
          eq(categories.restaurantId, restaurantId as string)
        )
      )
      .limit(1);

    if (!existingCategory.length) {
      return json({ 
        success: false, 
        error: 'Category not found or does not belong to this restaurant' 
      }, { status: 404 });
    }

    const [updatedDish] = await db.update(dishes)
      .set({
        title: data.title,
        imageUrl: data.imageUrl || null,
        price: data.price || null,
        description: data.description || null,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(dishes.id, dishId as string),
          eq(dishes.categoryId, categoryId as string)
        )
      )
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
    const { restaurantId, categoryId, dishId } = params;
    
    // Validate that the category exists and belongs to the restaurant
    const existingCategory = await db.select()
      .from(categories)
      .where(
        and(
          eq(categories.id, categoryId as string),
          eq(categories.restaurantId, restaurantId as string)
        )
      )
      .limit(1);

    if (!existingCategory.length) {
      return json({ 
        success: false, 
        error: 'Category not found or does not belong to this restaurant' 
      }, { status: 404 });
    }

    const [deletedDish] = await db.delete(dishes)
      .where(
        and(
          eq(dishes.id, dishId as string),
          eq(dishes.categoryId, categoryId as string)
        )
      )
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