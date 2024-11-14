import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Category } from '$lib/server/models/menu';

export async function POST({ request }) {
  try {
    await connectDB();
    const { categoryIndex, dish } = await request.json();
    
    if (categoryIndex === undefined || !dish) {
      return json({ 
        success: false, 
        error: 'Category index and dish data are required' 
      }, { status: 400 });
    }

    const categories = await Category.find({});
    if (!categories[categoryIndex]) {
      return json({ 
        success: false, 
        error: 'Category not found' 
      }, { status: 404 });
    }

    const category = categories[categoryIndex];
    category.dishes.push(dish);
    await category.save();

    return json({ success: true, data: category });
  } catch (error) {
    console.error('POST dish error:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}