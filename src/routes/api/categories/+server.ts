import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Category } from '$lib/server/models/menu';

// Obtener categorías
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({});
    return json({ success: true, data: categories });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

// Crear categoría
export async function POST({ request }) {
  try {
    await connectDB();
    const data = await request.json();
    const category = new Category(data);
    await category.save();
    return json({ success: true, data: category });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

// Actualizar categoría
export async function PUT({ request, params }) {
  try {
    await connectDB();
    const { categoryIndex, dish } = await request.json();
    const category = await Category.findOne().skip(categoryIndex);
    if (!category) throw new Error('Categoría no encontrada');
    
    category.dishes.push(dish);
    await category.save();
    
    return json({ success: true, data: category });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
} 