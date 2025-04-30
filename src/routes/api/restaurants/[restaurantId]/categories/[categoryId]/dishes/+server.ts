import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes, categories } from '$lib/server/schema';
import { and, eq, asc, desc, max } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import type { Dish } from '$lib/types/menu.types';

export async function POST({ request, params }: RequestEvent) {
  try {
    const data = await request.json();
    const { categoryId } = params;
    
    // Basic validation
    if (!data.title || !categoryId) {
      return json({ 
        success: false, 
        error: 'Dish title and category ID are required' 
      }, { status: 400 });
    }

    // Calculate the next order value
    const [{ maxOrder }] = await db
      .select({ maxOrder: max(dishes.order) })
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId));

    const nextOrder = (maxOrder ?? -1) + 1;

    // Simple insert
    const [newDish] = await db.insert(dishes)
      .values({
        title: data.title,
        price: data.price || null,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        categoryId,
        order: nextOrder
      })
      .returning();

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

export async function GET({ params }: RequestEvent): Promise<Response> {
  try {
    const { restaurantId, categoryId } = params;

    if (!restaurantId || !categoryId) {
      return json({ success: false, error: 'Restaurant ID and Category ID are required' }, { status: 400 });
    }

    // Optional: Verify category exists and belongs to the restaurant (could be skipped for GET)
    const [categoryExists] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.id, categoryId), eq(categories.restaurantId, restaurantId)))
      .limit(1);

    if (!categoryExists) {
      return json({ success: false, error: 'Category not found in this restaurant' }, { status: 404 });
    }

    // Explicitly select columns and handle potential nulls to match the Dish type
    const dbDishes = await db
      .select({
        id: dishes.id,
        title: dishes.title,
        imageUrl: dishes.imageUrl,
        price: dishes.price,
        description: dishes.description,
        categoryId: dishes.categoryId,
        order: dishes.order,
        createdAt: dishes.createdAt,
        updatedAt: dishes.updatedAt
      })
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId))
      .orderBy(asc(dishes.order));

    // Map database results
    const categoryDishes = dbDishes.map(dbDish => ({
      ...dbDish,
      imageUrl: dbDish.imageUrl ?? null, // Use null if db value is null, matching Dish type
      price: dbDish.price ?? '', // Use empty string if null, matching non-optional string
      description: dbDish.description ?? '', // Use empty string if null, matching non-optional string
      categoryId: dbDish.categoryId ?? '', // Use empty string if null, assuming categoryId is required in Dish type
      createdAt: dbDish.createdAt ?? new Date(), // Provide default if null
      updatedAt: dbDish.updatedAt ?? new Date() // Provide default if null
    }));

    return json({ success: true, data: categoryDishes });
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch dishes' },
      { status: 500 }
    );
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