import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Menu } from '$lib/server/models/menu';

export async function POST({ params, request }) {
  try {
    await connectDB();
    const { menuId } = params;
    const { name } = await request.json();
    
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return json({ success: false, error: 'Menu not found' }, { status: 404 });
    }

    menu.categories.push({ name, dishes: [] });
    await menu.save();
    
    return json({ success: true, data: menu });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET({ params }) {
  try {
    await connectDB();
    const { menuId } = params;
    
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return json({ success: false, error: 'Menu not found' }, { status: 404 });
    }
    
    return json({ success: true, data: menu.categories });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
} 