import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Category } from '$lib/server/models/menu';

// Obtener categorías
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).lean();
    return json({ success: true, data: categories });
  } catch (error) {
    console.error('GET categories error:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

// Crear categoría
export async function POST({ request }) {
  try {
    await connectDB();
    const data = await request.json();
    
    if (!data.name) {
      return json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const category = new Category({
      name: data.name,
      dishes: []
    });

    await category.save();
    return json({ success: true, data: category });
  } catch (error) {
    console.error('POST category error:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}