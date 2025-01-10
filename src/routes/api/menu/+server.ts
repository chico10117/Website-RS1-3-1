import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants, categories, dishes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

// Crear nuevo menú (en este caso, un restaurante)
export async function POST({ request }: RequestEvent) {
  try {
    const menuData = await request.json();
    
    const [newRestaurant] = await db.insert(restaurants)
      .values({
        name: menuData.name,
        logo: menuData.logo
      })
      .returning();
    
    return json({ success: true, data: newRestaurant });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Obtener todos los menús (restaurantes)
export async function GET() {
  try {
    const allRestaurants = await db.select().from(restaurants);
    
    // Obtener categorías y platos para cada restaurante
    const restaurantsWithDetails = await Promise.all(
      allRestaurants.map(async (restaurant) => {
        const restaurantCategories = await db.select()
          .from(categories)
          .where(eq(categories.restaurantId, restaurant.id));

        const categoriesWithDishes = await Promise.all(
          restaurantCategories.map(async (category) => {
            const categoryDishes = await db.select()
              .from(dishes)
              .where(eq(dishes.categoryId, category.id));

            return {
              ...category,
              dishes: categoryDishes
            };
          })
        );

        return {
          ...restaurant,
          categories: categoriesWithDishes
        };
      })
    );
    
    return json({ success: true, data: restaurantsWithDetails });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Actualizar menú
export async function PUT({ request }: RequestEvent) {
  try {
    const { id, ...menuData } = await request.json();
    
    // Reemplazar con la lógica de actualización de la nueva base de datos
    // const updatedMenu = await Menu.findByIdAndUpdate(
    //   id,
    //   menuData,
    //   { new: true }
    // );
    
    // return json({ success: true, data: updatedMenu });
    return json({ success: true, message: 'Lógica de actualización pendiente' });
  } catch (error: unknown) {
    return json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// Eliminar menú
export async function DELETE({ request }: RequestEvent) {
  try {
    const { id } = await request.json();
    
    // Reemplazar con la lógica de eliminación de la nueva base de datos
    // await Menu.findByIdAndDelete(id);
    
    // return json({ success: true });
    return json({ success: true, message: 'Lógica de eliminación pendiente' });
  } catch (error: unknown) {
    return json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 