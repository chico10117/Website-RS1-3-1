import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { eq, and, ne } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import { generateSlug } from '$lib/utils/slug';

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

    // If name is being updated, check for duplicates
    if (updateData.name !== undefined && updateData.name !== existingRestaurant[0].name) {
      const slug = generateSlug(updateData.name);
      
      // Check if name is already taken by another restaurant owned by the same user
      const slugExists = await db.select()
        .from(restaurants)
        .where(
          and(
            eq(restaurants.userId, existingRestaurant[0].userId),
            eq(restaurants.slug, slug),
            ne(restaurants.id, restaurantId as string)
          )
        )
        .limit(1);

      if (slugExists.length > 0) {
        return json({ 
          success: false, 
          error: 'A restaurant with this name already exists' 
        }, { status: 400 });
      }

      // Update the restaurant with new name and slug
      const [updatedRestaurant] = await db.update(restaurants)
        .set({
          name: updateData.name,
          slug,
          ...(updateData.logo !== undefined && { logo: updateData.logo }),
          updatedAt: new Date()
        })
        .where(eq(restaurants.id, restaurantId as string))
        .returning();

      return json({ 
        success: true, 
        data: updatedRestaurant 
      });
    }

    // If only updating logo or other fields
    const [updatedRestaurant] = await db.update(restaurants)
      .set({
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