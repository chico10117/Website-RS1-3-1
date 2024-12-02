import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';

export async function POST({ request }) {
  try {
    await connectDB();
    const data = await request.json();
    
    if (!data.name) {
      return json({ success: false, error: 'Restaurant name is required' }, { status: 400 });
    }

    // Check if restaurant already exists
    const existingRestaurant = await Restaurant.findOne({ name: data.name });
    if (existingRestaurant) {
      return json({ 
        success: false, 
        error: 'Restaurant with this name already exists' 
      }, { status: 400 });
    }

    const restaurant = new Restaurant({
      name: data.name,
      logo: data.logo,
      categories: []
    });

    await restaurant.save();
    return json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const restaurants = await Restaurant.find({}).lean();
    return json({ success: true, data: restaurants });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
async function saveRestaurant() {
  try {
    const response = await fetch('/api/restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: restaurantName,
        logo: restaurantLogo
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }

    restaurantId = data.data._id;
    return data.data;
  } catch (error) {
    console.error('Error saving restaurant:', error);
    alert('Error saving restaurant: ' + error.message);
    throw error;
  }
}

async function saveCategory(categoryName: string) {
  try {
    if (!restaurantId) {
      const restaurant = await saveRestaurant();
      restaurantId = restaurant._id;
    }

    const response = await fetch(`/api/restaurants/${restaurantId}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: categoryName })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }

    categories = data.data.categories;
    return data.data;
  } catch (error) {
    console.error('Error saving category:', error);
    alert('Error saving category: ' + error.message);
    throw error;
  }
} 
