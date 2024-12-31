import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return json({ success: true, data: allCategories });
  } catch (error) {
    console.error('GET categories error:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function POST({ request }: RequestEvent) {
  try {
    const data = await request.json();
    
    if (!data.name) {
      return json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const [newCategory] = await db.insert(categories)
      .values({
        name: data.name
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