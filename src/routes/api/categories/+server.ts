import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories, dishes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const allCategories = await db.select().from(categories);
    
    const categoriesWithDishes = await Promise.all(
      allCategories.map(async (category) => {
        const categoryDishes = await db.select()
          .from(dishes)
          .where(eq(dishes.categoryId, category.id));

        return {
          ...category,
          dishes: categoryDishes
        };
      })
    );

    return json({ success: true, data: categoriesWithDishes });
  } catch (error) {
    console.error('GET categories error:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    
    if (!data.name) {
      return json({ 
        success: false, 
        error: 'Category name is required' 
      }, { status: 400 });
    }

    const [newCategory] = await db.insert(categories)
      .values({
        name: data.name
      })
      .returning();

    return json({ 
      success: true, 
      data: newCategory,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('POST category error:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}; 