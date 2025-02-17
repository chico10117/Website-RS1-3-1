import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { generateSlug } from '$lib/utils/slug';
import { join } from 'path';

export async function POST({ request, cookies }: RequestEvent) {
  try {
    // Get the auth token
    const token = cookies.get('auth_token');
    if (!token) {
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Decode the JWT token to get user info
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));

    // Initialize database connection
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql, { schema });

    // Get user from database
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.email, payload.email));

    if (!user) {
      return json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Get request data
    const { fileName, restaurantName, customPrompt } = await request.json();

    if (!fileName || !restaurantName) {
      return json({ 
        success: false, 
        error: 'File name and restaurant name are required' 
      }, { status: 400 });
    }

    // Import the restaurant data file from src/lib/data/restaurants
    const { seedData } = await import(`$lib/data/restaurants/${fileName}`);

    if (!seedData) {
      return json({ 
        success: false, 
        error: 'No seed data found in file' 
      }, { status: 400 });
    }

    // Generate slug for the restaurant
    const slug = await generateSlug(restaurantName);

    // Check if restaurant exists
    const existingRestaurant = await db.select()
      .from(schema.restaurants)
      .where(
        and(
          eq(schema.restaurants.slug, slug),
          eq(schema.restaurants.userId, user.id)
        )
      );

    let restaurant;

    // If restaurant exists, delete it and its related data
    if (existingRestaurant.length > 0) {
      await db.delete(schema.restaurants)
        .where(eq(schema.restaurants.id, existingRestaurant[0].id));
    }

    // Create restaurant
    [restaurant] = await db.insert(schema.restaurants)
      .values({
        name: restaurantName,
        slug,
        userId: user.id,
        logo: seedData.restaurant.logo || null,
        customPrompt: customPrompt || seedData.restaurant.customPrompt || null
      })
      .returning();

    // Create categories and dishes
    for (const categoryData of seedData.categories) {
      const [category] = await db.insert(schema.categories)
        .values({
          name: categoryData.name,
          restaurantId: restaurant.id
        })
        .returning();

      if (categoryData.dishes) {
        for (const dishData of categoryData.dishes) {
          await db.insert(schema.dishes)
            .values({
              ...dishData,
              categoryId: category.id,
              imageUrl: dishData.imageUrl || null
            })
            .returning();
        }
      }
    }

    return json({ 
      success: true, 
      data: {
        restaurant,
        message: 'Restaurant data seeded successfully'
      }
    });
  } catch (error) {
    console.error('Error seeding restaurant data:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to seed restaurant data',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 