import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants, users } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import { generateSlug } from '$lib/utils/slug';
import { normalizeUrl, ensureStringOrNull } from '$lib/utils/validation';

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

    const data = await request.json();

    if (!data.name) {
      return json({ 
        success: false, 
        error: 'Restaurant name is required' 
      }, { status: 400 });
    }

    // Use provided slug or generate one from name
    const finalSlug = data.slug || await generateSlug(data.name, fetch);

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

    // Process fields before insertion
    const restaurantData = {
      id: data.id,
      name: data.name,
      slug: finalSlug,
      logo: data.logo || null,
      customPrompt: ensureStringOrNull(data.customPrompt),
      phoneNumber: ensureStringOrNull(data.phoneNumber),
      currency: data.currency || '€',
      color: String(data.color || '1'),
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      reservas: normalizeUrl(data.reservas),
      redes_sociales: normalizeUrl(data.redes_sociales),
    };

    // Create the new restaurant
    const [newRestaurant] = await db.insert(restaurants)
      .values(restaurantData)
      .returning();

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
    const token = cookies.get('auth_token');
    if (!token) {
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const restaurantId = url.searchParams.get('id');
    
    if (restaurantId) {
      const restaurant = await db.select()
        .from(restaurants)
        .where(eq(restaurants.id, restaurantId))
        .limit(1);

      if (!restaurant.length) {
        return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
      }

      if (restaurant[0].userId !== user.id) {
        return json({ success: false, error: 'Unauthorized' }, { status: 403 });
      }

      return json({ success: true, data: restaurant[0] });
    }
    
    const userRestaurants = await db.select()
      .from(restaurants)
      .where(eq(restaurants.userId, user.id));

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