import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { generateSlug } from '$lib/utils/slug';
import { join } from 'path';

export async function POST({ request, cookies, fetch }: RequestEvent) {
  try {
    console.log('Starting seed process...');
    
    // Get the auth token
    const token = cookies.get('auth_token');
    if (!token) {
      console.error('No auth token found');
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Decode the JWT token to get user info
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    console.log('User from token:', { email: payload.email });

    // Initialize database connection
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not found in environment');
      throw new Error('DATABASE_URL environment variable is required');
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql, { schema });
    console.log('Database connection initialized');

    // Get user from database
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.email, payload.email));

    if (!user) {
      console.error('User not found in database:', { email: payload.email });
      return json({ success: false, error: 'User not found' }, { status: 404 });
    }
    console.log('User found:', { id: user.id, email: user.email });

    // Get request data
    const { fileName, restaurantName, customPrompt, restaurantId } = await request.json();
    console.log('Request data:', { fileName, restaurantName, hasCustomPrompt: !!customPrompt, restaurantId });

    if (!fileName || !restaurantName) {
      console.error('Missing required fields:', { fileName: !!fileName, restaurantName: !!restaurantName });
      return json({ 
        success: false, 
        error: 'File name and restaurant name are required' 
      }, { status: 400 });
    }

    // Import the restaurant data file
    console.log('Attempting to import restaurant data from:', fileName);
    let seedData;
    try {
      const { seedData: importedData } = await import(/* @vite-ignore */ `/static/data/restaurants/${fileName}`);
      seedData = importedData;
      console.log('Restaurant data imported successfully');
      
      if (!seedData) {
        console.error('No seed data found in imported file');
        return json({ 
          success: false, 
          error: 'No seed data found in file' 
        }, { status: 400 });
      }
      console.log('Seed data structure:', {
        hasRestaurant: !!seedData.restaurant,
        categoriesCount: seedData.categories?.length
      });
    } catch (importError) {
      console.error('Error importing restaurant data:', importError);
      return json({ 
        success: false, 
        error: 'Failed to import restaurant data file',
        details: importError instanceof Error ? importError.message : 'Unknown import error'
      }, { status: 500 });
    }

    let restaurant;

    // Check if we're updating an existing restaurant
    if (restaurantId) {
      // Verify the restaurant exists and belongs to the user
      const [existingRestaurant] = await db.select()
        .from(schema.restaurants)
        .where(
          and(
            eq(schema.restaurants.id, restaurantId),
            eq(schema.restaurants.userId, user.id)
          )
        );

      if (!existingRestaurant) {
        console.error('Restaurant not found or does not belong to user:', { restaurantId });
        return json({ 
          success: false, 
          error: 'Restaurant not found or unauthorized' 
        }, { status: 404 });
      }

      // Delete existing categories and dishes
      const existingCategories = await db.select()
        .from(schema.categories)
        .where(eq(schema.categories.restaurantId, restaurantId));

      for (const category of existingCategories) {
        // Delete dishes in category
        await db.delete(schema.dishes)
          .where(eq(schema.dishes.categoryId, category.id));
      }

      // Delete categories
      await db.delete(schema.categories)
        .where(eq(schema.categories.restaurantId, restaurantId));

      // Update existing restaurant
      [restaurant] = await db.update(schema.restaurants)
        .set({
          name: restaurantName,
          customPrompt: customPrompt || seedData.restaurant.customPrompt || null,
          updatedAt: new Date()
        })
        .where(eq(schema.restaurants.id, restaurantId))
        .returning();

      console.log('Updated existing restaurant:', restaurant);
    } else {
      // Generate slug for new restaurant
      const slug = await generateSlug(restaurantName, fetch);
      console.log('Generated slug:', slug);

      // Create new restaurant
      [restaurant] = await db.insert(schema.restaurants)
        .values({
          name: restaurantName,
          slug,
          userId: user.id,
          logo: seedData.restaurant.logo || null,
          customPrompt: customPrompt || seedData.restaurant.customPrompt || null
        })
        .returning();
      console.log('Created new restaurant:', restaurant);
    }

    // Create categories and dishes
    console.log('Creating categories and dishes...');
    try {
      for (const categoryData of seedData.categories) {
        console.log('Creating category:', categoryData.name);
        const [category] = await db.insert(schema.categories)
          .values({
            name: categoryData.name,
            restaurantId: restaurant.id
          })
          .returning();

        if (categoryData.dishes) {
          console.log(`Creating ${categoryData.dishes.length} dishes for category:`, category.name);
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
      console.log('All categories and dishes created successfully');
    } catch (dbError) {
      console.error('Error creating categories or dishes:', dbError);
      throw dbError;
    }

    console.log('Seed process completed successfully');
    return json({ 
      success: true, 
      data: {
        restaurant,
        message: 'Restaurant data seeded successfully'
      }
    });
  } catch (error) {
    console.error('Error in seed endpoint:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to seed restaurant data',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 