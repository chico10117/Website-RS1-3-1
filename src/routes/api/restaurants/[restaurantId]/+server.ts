import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { eq, and, ne } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import { generateSlug } from '$lib/utils/slug';
import { users } from '$lib/server/schema';

async function getUserFromToken(token: string) {
  const [, payloadBase64] = token.split('.');
  const payload = JSON.parse(atob(payloadBase64));
  const [user] = await db.select().from(users).where(eq(users.email, payload.email));
  return user;
}

export async function PUT({ params, request, cookies, fetch }: RequestEvent) {
  try {
    const { restaurantId } = params;
    const updateData = await request.json();

    console.log('PUT /api/restaurants/[restaurantId]:', {
      restaurantId,
      updateData
    });

    // Check authentication
    const token = cookies.get('auth_token');
    if (!token) {
      console.log('No auth token found');
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      console.log('No user found for token');
      return json({ success: false, error: 'User not found' }, { status: 404 });
    }

    console.log('User found:', {
      userId: user.id,
      userEmail: user.email
    });

    // First check if restaurant exists at all
    const [restaurant] = await db.select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId as string))
      .limit(1);

    console.log('Restaurant lookup result:', {
      found: !!restaurant,
      restaurant,
      requestedId: restaurantId
    });

    if (!restaurant) {
      return json({ 
        success: false, 
        error: 'Restaurant not found' 
      }, { status: 404 });
    }

    // Then check if it belongs to the user
    if (restaurant.userId !== user.id) {
      console.log('Restaurant ownership mismatch:', {
        restaurantUserId: restaurant.userId,
        requestingUserId: user.id
      });
      return json({ 
        success: false, 
        error: 'Restaurant does not belong to current user' 
      }, { status: 403 });
    }

    // Prepare update data
    const updateSet: any = {
      updatedAt: new Date()
    };

    // Handle name update if provided
    if (updateData.name !== undefined && updateData.name !== restaurant.name) {
      const slug = await generateSlug(updateData.name, fetch);
      
      // Check if name is already taken by another restaurant owned by the same user
      const slugExists = await db.select()
        .from(restaurants)
        .where(
          and(
            eq(restaurants.userId, user.id),
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

      updateSet.name = updateData.name;
      updateSet.slug = slug;
    } else if (updateData.slug !== undefined && updateData.slug !== restaurant.slug) {
      // If slug is provided directly and has changed, use it
      updateSet.slug = updateData.slug;
    }

    // Handle logo update if provided
    if (updateData.logo !== undefined) {
      updateSet.logo = updateData.logo;
    }

    // Handle custom prompt update if provided
    if (updateData.customPrompt !== undefined) {
      updateSet.customPrompt = updateData.customPrompt;
    }

    // Add currency and color updates
    if (updateData.currency !== undefined) {
      updateSet.currency = updateData.currency;
    }

    if (updateData.color !== undefined) {
      updateSet.color = updateData.color;
    }

    // Update the restaurant
    const [updatedRestaurant] = await db.update(restaurants)
      .set(updateSet)
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