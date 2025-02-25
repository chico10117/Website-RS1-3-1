import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants, users } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import { generateSlug } from '$lib/utils/slug';

async function getUserFromToken(token: string) {
  const [, payloadBase64] = token.split('.');
  const payload = JSON.parse(atob(payloadBase64));
  const [user] = await db.select().from(users).where(eq(users.email, payload.email));
  return user;
}

export async function POST({ request, cookies, fetch }: RequestEvent) {
  try {
    const token = cookies.get('auth_token');
    if (!token) {
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const { id, name, logo, slug } = await request.json();

    if (!name) {
      return json({ 
        success: false, 
        error: 'Restaurant name is required' 
      }, { status: 400 });
    }

    // Use provided slug or generate one from name
    const finalSlug = slug || await generateSlug(name, fetch);

    // Check if a restaurant with this slug already exists for this user
    const existingRestaurant = await db.select()
      .from(restaurants)
      .where(
        and(
          eq(restaurants.slug, finalSlug),
          eq(restaurants.userId, user.id)
        )
      )
      .limit(1);

    if (existingRestaurant.length > 0) {
      return json({ 
        success: false, 
        error: 'A restaurant with this name already exists' 
      }, { status: 400 });
    }

    console.log('Creating new restaurant:', {
      id,
      name,
      slug: finalSlug,
      logo,
      userId: user.id
    });

    // Create the new restaurant with the provided ID if available
    const [newRestaurant] = await db.insert(restaurants)
      .values({
        id: id || undefined, // Use provided ID or let the database generate one
        name,
        slug: finalSlug,
        logo: logo || null,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    console.log('Restaurant created:', newRestaurant);

    return json({ 
      success: true, 
      data: newRestaurant 
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create restaurant',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET({ url, cookies }: RequestEvent) {
  try {
    console.log('GET /api/restaurants - Request received');
    
    const token = cookies.get('auth_token');
    if (!token) {
      console.log('GET /api/restaurants - No auth token found');
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.log('GET /api/restaurants - Auth token found');

    const user = await getUserFromToken(token);
    if (!user) {
      console.log('GET /api/restaurants - User not found for token');
      return json({ success: false, error: 'User not found' }, { status: 404 });
    }
    console.log(`GET /api/restaurants - User found: ID=${user.id}, Email=${user.email}`);

    const restaurantId = url.searchParams.get('id');
    
    if (restaurantId) {
      console.log(`GET /api/restaurants - Fetching specific restaurant: ${restaurantId}`);
      // Get a specific restaurant with its relations
      const restaurant = await db.select()
        .from(restaurants)
        .where(eq(restaurants.id, restaurantId))
        .limit(1);

      if (!restaurant.length) {
        console.log(`GET /api/restaurants - Restaurant not found: ${restaurantId}`);
        return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
      }

      // Verify ownership
      if (restaurant[0].userId !== user.id) {
        console.log(`GET /api/restaurants - Unauthorized access: Restaurant userId=${restaurant[0].userId}, User ID=${user.id}`);
        return json({ success: false, error: 'Unauthorized' }, { status: 403 });
      }

      console.log(`GET /api/restaurants - Returning restaurant: ${restaurant[0].name}`);
      return json({ success: true, data: restaurant[0] });
    }
    
    // Get all restaurants for the authenticated user
    console.log(`GET /api/restaurants - Fetching all restaurants for user: ${user.id}`);
    const userRestaurants = await db.select()
      .from(restaurants)
      .where(eq(restaurants.userId, user.id));

    console.log(`GET /api/restaurants - Found ${userRestaurants.length} restaurants for user`);
    if (userRestaurants.length > 0) {
      userRestaurants.forEach(r => console.log(`Restaurant: ${r.name}, ID: ${r.id}, User ID: ${r.userId}`));
    }

    return json({ success: true, data: userRestaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 