import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import * as schema from '$lib/server/schema';
import { eq, and, inArray, asc } from 'drizzle-orm';

// Helper to get user from token
async function getUserFromToken(token: string) {
  const [, payloadBase64] = token.split('.');
  const payload = JSON.parse(atob(payloadBase64));
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, payload.email));
  return user;
}

export async function GET({ params, cookies }: RequestEvent) {
  console.time('GET-consolidated-menu');
  const { restaurantId } = params;
  const token = cookies.get('auth_token');

  // Auth & Validation
  if (!restaurantId) return json({ success: false, error: 'Restaurant ID required' }, { status: 400 });
  if (!token) return json({ success: false, error: 'Unauthorized' }, { status: 401 });
  
  try {
    console.time('GET-auth');
    const user = await getUserFromToken(token);
    if (!user) return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    console.timeEnd('GET-auth');

    console.time('GET-restaurant');
    // Verify restaurant ownership
    const [restaurant] = await db.select()
      .from(schema.restaurants)
      .where(and(eq(schema.restaurants.id, restaurantId), eq(schema.restaurants.userId, user.id)))
      .limit(1);

    if (!restaurant) {
      return json({ 
        success: false, 
        error: 'Restaurant not found or not authorized' 
      }, { status: 404 });
    }
    console.timeEnd('GET-restaurant');

    console.time('GET-categories-dishes');
    // Fetch all categories for this restaurant in one query
    const categories = await db.select()
      .from(schema.categories)
      .where(eq(schema.categories.restaurantId, restaurantId))
      .orderBy(asc(schema.categories.order));
      
    // Get all category IDs
    const categoryIds = categories.map(c => c.id);
    
    // Fetch all dishes for all categories in one query
    const dishes = categoryIds.length > 0
      ? await db.select()
          .from(schema.dishes)
          .where(inArray(schema.dishes.categoryId, categoryIds))
          .orderBy(asc(schema.dishes.order))
      : [];
    console.timeEnd('GET-categories-dishes');

    console.time('GET-structure-response');
    // Build the response more efficiently using a Map to group dishes by category
    const dishesByCategoryMap = new Map();
    
    // Group dishes by category ID (more efficient than filter for each category)
    dishes.forEach(dish => {
      if (!dishesByCategoryMap.has(dish.categoryId)) {
        dishesByCategoryMap.set(dish.categoryId, []);
      }
      dishesByCategoryMap.get(dish.categoryId).push(dish);
    });
    
    // Create response structure
    const categoriesWithDishes = categories.map(category => ({
      ...category,
      dishes: dishesByCategoryMap.get(category.id) || []
    }));
    
    const result = {
      ...restaurant,
      categories: categoriesWithDishes
    };
    console.timeEnd('GET-structure-response');

    console.timeEnd('GET-consolidated-menu');
    return json({ 
      success: true, 
      data: result
    });
  } catch (error) {
    console.error('Error fetching consolidated restaurant menu:', error);
    console.timeEnd('GET-consolidated-menu');
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch menu'
    }, { status: 500 });
  }
} 