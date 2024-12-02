import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';
import mongoose from 'mongoose';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
  try {
    await connectDB();
    const { restaurantId, categoryId } = params;
    const { name } = await request.json();

    console.log('Updating category:', { restaurantId, categoryId, name }); // Debug log

    // Actualizar usando updateOne con operadores de MongoDB
    const result = await Restaurant.updateOne(
      { 
        _id: restaurantId,
        'categories._id': categoryId 
      },
      { 
        $set: { 
          'categories.$.name': name 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return json({ 
        success: false, 
        error: 'Restaurant or category not found' 
      }, { status: 404 });
    }

    // Obtener el restaurante actualizado
    const updatedRestaurant = await Restaurant.findById(restaurantId);

    console.log('Category updated successfully:', result); // Debug log

    return json({ 
      success: true, 
      data: updatedRestaurant 
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return json({ 
      success: false, 
      error: 'Internal server error: ' + error.message,
      stack: error.stack
    }, { status: 500 });
  }
}