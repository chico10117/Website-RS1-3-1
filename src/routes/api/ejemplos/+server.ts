import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Menu } from '$lib/server/models/menu';

// Crear nuevo menú
export async function POST({ request }) {
  try {
    await connectDB();
    const menuData = await request.json();
    
    const newMenu = new Menu(menuData);
    await newMenu.save();
    
    return json({ success: true, data: newMenu });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}

// Obtener todos los menús
export async function GET() {
  try {
    await connectDB();
    const menus = await Menu.find({});
    
    return json({ success: true, data: menus });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}