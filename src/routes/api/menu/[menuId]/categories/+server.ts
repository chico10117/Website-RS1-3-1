import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function POST({ params, request }) {
  try {
    const { menuId } = params;
    const { name } = await request.json();
    
    const [newCategory] = await db.insert(categories)
      .values({
        name,
        restaurantId: menuId // Asumiendo que menuId es el restaurantId
      })
      .returning();
    
    return json({ success: true, data: newCategory });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET({ params }) {
  try {
    const { menuId } = params;
    
    const menuCategories = await db.select()
      .from(categories)
      .where(eq(categories.restaurantId, menuId));
    
    return json({ success: true, data: menuCategories });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 