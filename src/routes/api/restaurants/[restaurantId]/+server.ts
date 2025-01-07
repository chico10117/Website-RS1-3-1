import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
  try {
    const { restaurantId } = params;
    const updateData = await request.json();

    // Validate that restaurantId exists
    const existingRestaurant = await db.select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId as string))
      .limit(1);

    if (!existingRestaurant.length) {
      return json({ 
        success: false, 
        error: 'Restaurant not found' 
      }, { status: 404 });
    }

    // Update the restaurant
    const [updatedRestaurant] = await db.update(restaurants)
      .set({
        ...(updateData.name !== undefined && { name: updateData.name }),
        ...(updateData.logo !== undefined && { logo: updateData.logo }),
        updatedAt: new Date()
      })
      .where(eq(restaurants.id, restaurantId as string))
      .returning();

    return json({ 
      success: true, 
      data: updatedRestaurant 
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update restaurant',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    const { restaurantId } = params;

    // Delete the restaurant (categories and dishes will be cascade deleted due to foreign key constraints)
    const [deletedRestaurant] = await db.delete(restaurants)
      .where(eq(restaurants.id, restaurantId as string))
      .returning();

    if (!deletedRestaurant) {
      return json({ 
        success: false, 
        error: 'Restaurant not found' 
      }, { status: 404 });
    }

    return json({
      success: true,
      data: deletedRestaurant
    });

  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete restaurant',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 