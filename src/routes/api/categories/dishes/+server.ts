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
    console.error('GET categories/dishes error:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    
    if (!data.title || !data.categoryId) {
      return json({ 
        success: false, 
        error: 'Title and category ID are required' 
      }, { status: 400 });
    }

    // Verificar si la categoría existe
    const category = await db.select()
      .from(categories)
      .where(eq(categories.id, data.categoryId))
      .limit(1);

    if (!category.length) {
      return json({ 
        success: false, 
        error: 'Category not found' 
      }, { status: 404 });
    }

    const [newDish] = await db.insert(dishes)
      .values({
        title: data.title,
        price: data.price,
        description: data.description,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId
      })
      .returning();

    return json({ 
      success: true, 
      data: newDish,
      message: 'Dish created successfully'
    });
  } catch (error) {
    console.error('POST dish error:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
};