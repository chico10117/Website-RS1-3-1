import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants, categories, dishes } from '$lib/server/schema';
import { eq, and, ne, inArray } from 'drizzle-orm';
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
    
    if (!restaurantId) {
       return json({ success: false, error: 'Restaurant ID is required' }, { status: 400 });
    }

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

    // First check if restaurant exists at all and belongs to the user
    const [restaurant] = await db.select()
      .from(restaurants)
      .where(and(eq(restaurants.id, restaurantId), eq(restaurants.userId, user.id)))
      .limit(1);

    console.log('Restaurant lookup result:', {
      found: !!restaurant,
      restaurant,
      requestedId: restaurantId
    });

    if (!restaurant) {
      return json({ 
        success: false, 
        error: 'Restaurant not found or does not belong to user' 
      }, { status: 404 }); // Use 404 for not found or 403 for forbidden
    }

    // --- Prepare update data ---
    const updateSet: Partial<typeof restaurants.$inferInsert> = {
      updatedAt: new Date()
    };
    let currencyChanged = false;
    let newCurrency = restaurant.currency; // Start with the current currency

    // Handle name update if provided
    if (updateData.name !== undefined && updateData.name !== restaurant.name) {
      const slug = await generateSlug(updateData.name, fetch);
      
      // Check if slug is already taken by another restaurant owned by the same user
      const slugExists = await db.select({ id: restaurants.id })
        .from(restaurants)
        .where(
          and(
            eq(restaurants.userId, user.id),
            eq(restaurants.slug, slug),
            ne(restaurants.id, restaurantId)
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
      // If slug is provided directly and has changed, use it (Validate if needed)
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

    // Handle phone number update if provided
    if (updateData.phoneNumber !== undefined) {
      updateSet.phoneNumber = updateData.phoneNumber;
    }

    // Handle new fields update if provided
    if (updateData.reservas !== undefined) {
      // Validate reservas URL
      if (updateData.reservas && typeof updateData.reservas === 'string' && updateData.reservas.startsWith('#')) {
        console.warn('CRITICAL: Detected color value in reservas field in API, resetting to null');
        updateSet.reservas = null;
      } else {
        updateSet.reservas = updateData.reservas;
      }
    }
    
    if (updateData.redes_sociales !== undefined) {
      // Validate redes_sociales URL
      if (updateData.redes_sociales && typeof updateData.redes_sociales === 'string' && updateData.redes_sociales.startsWith('#')) {
        console.warn('CRITICAL: Detected color value in redes_sociales field in API, resetting to null');
        updateSet.redes_sociales = null;
      } else {
        updateSet.redes_sociales = updateData.redes_sociales;
      }
    }

    // Add currency and color updates
    if (updateData.currency !== undefined && updateData.currency !== restaurant.currency) {
      updateSet.currency = updateData.currency;
      newCurrency = updateData.currency; // Store the new currency for dish update
      currencyChanged = true;
    }

    if (updateData.color !== undefined) {
      console.log('Before conversion - Color value:', updateData.color, 'type:', typeof updateData.color);
      // Ensure color is saved as a string
      updateSet.color = String(updateData.color);
      console.log('After conversion - Updating restaurant color to:', updateSet.color, 'type:', typeof updateSet.color);
    }
    
    // --- End Prepare update data ---

    // --- Update the restaurant --- 
    // Check if there's anything to update besides updatedAt
    if (Object.keys(updateSet).length === 1 && updateSet.updatedAt) {
       console.log('No changes detected for restaurant update.');
        // Optionally return early or just return the current restaurant data
         return json({ 
           success: true, 
           data: restaurant // Return existing data as nothing changed
         });
    }
    
    const [updatedRestaurantResult] = await db.update(restaurants)
      .set(updateSet)
      .where(eq(restaurants.id, restaurantId))
      .returning();

    if (!updatedRestaurantResult) {
       // This shouldn't happen if the initial check passed, but good to handle
       console.error('Failed to update restaurant after initial check passed');
       return json({ success: false, error: 'Failed to update restaurant' }, { status: 500 });
    }
    // --- End Update the restaurant ---

    // --- Update Dish Currencies if Restaurant Currency Changed ---
    if (currencyChanged) {
      console.log(`Restaurant currency changed to ${newCurrency}. Updating dishes...`);
      try {
        // 1. Find all category IDs for this restaurant
        const restaurantCategories = await db.select({ id: categories.id })
          .from(categories)
          .where(eq(categories.restaurantId, restaurantId));
        
        const categoryIds = restaurantCategories.map(cat => cat.id);

        if (categoryIds.length > 0) {
          // 2. Update dishes in those categories
          const updateResult = await db.update(dishes)
            .set({ currency: newCurrency })
            .where(inArray(dishes.categoryId, categoryIds));
            
          console.log(`Updated currency for ${updateResult.rowCount} dishes in categories:`, categoryIds);
        } else {
           console.log('No categories found for this restaurant, skipping dish currency update.');
        }
      } catch (dishUpdateError) {
        // Log the error but don't fail the whole request, 
        // as the restaurant update itself was successful.
        console.error(`Error updating dish currencies for restaurant ${restaurantId}:`, dishUpdateError);
        // Optionally, you could add a message to the response indicating the partial failure.
      }
    }
    // --- End Update Dish Currencies ---

    return json({ 
      success: true, 
      data: updatedRestaurantResult 
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

export async function DELETE({ params, cookies }: RequestEvent) {
  try {
     const { restaurantId } = params;

     if (!restaurantId) {
        return json({ success: false, error: 'Restaurant ID is required' }, { status: 400 });
     }

     // --- Optional but Recommended: Authentication/Authorization Check ---
     const token = cookies.get('auth_token');
     if (!token) {
       return json({ success: false, error: 'Unauthorized' }, { status: 401 });
     }
     const user = await getUserFromToken(token);
     if (!user) {
       return json({ success: false, error: 'User not found' }, { status: 404 });
     }
     
     // Verify the restaurant belongs to the user before deleting
     const [restaurant] = await db.select({ id: restaurants.id })
       .from(restaurants)
       .where(and(eq(restaurants.id, restaurantId), eq(restaurants.userId, user.id)))
       .limit(1);
       
     if (!restaurant) {
        return json({ success: false, error: 'Restaurant not found or does not belong to user' }, { status: 404 });
     }
     // --- End Auth Check ---

    // Delete the restaurant (categories and dishes should cascade delete if FKs are set up correctly)
    const [deletedRestaurant] = await db.delete(restaurants)
      .where(eq(restaurants.id, restaurantId)) // Already verified ownership
      .returning();

    // No need to check deletedRestaurant here again, as we verified existence and ownership

    return json({
      success: true,
      data: deletedRestaurant
    });

  } catch (error) {
    console.error('Error deleting restaurant:', error);
    // Check for specific database errors if needed (e.g., foreign key constraints if cascade isn't set)
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete restaurant',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 