import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.user?.id) {
    throw error(401, 'Unauthorized');
  }

  const restaurantId = url.searchParams.get('restaurant');

  if (restaurantId) {
    // Load specific restaurant
    const [restaurant] = await db.select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .limit(1);

    if (!restaurant) {
      throw error(404, 'Restaurant not found');
    }

    // Verify ownership
    if (restaurant.userId !== locals.user.id) {
      throw error(403, 'Unauthorized');
    }

    return {
      restaurant
    };
  }

  // Load first restaurant for user
  const userRestaurants = await db.select()
    .from(restaurants)
    .where(eq(restaurants.userId, locals.user.id))
    .limit(1);

  return {
    restaurant: userRestaurants[0] || null
  };
}; 