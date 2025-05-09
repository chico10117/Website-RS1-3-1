import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
// Importing types and services related to menu management
// import type { MenuStore } from '$lib/stores/menu-store'; // Type for menu store state
// import * as restaurantService from './restaurant.service'; // Service for restaurant operations
// import * as categoryService from './category.service'; // Service for category operations
// import * as dishService from './dish.service'; // Service for dish operations
// import { menuStore } from '$lib/stores/menu-store'; // Menu store instance
// import { get } from 'svelte/store'; // Svelte store utility for accessing store values

interface SaveResult {
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
}

// Define the BulkSavePayload interface mirroring the one in the server endpoint
interface DishPayload {
  id?: string;
  title: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  order?: number;
}

interface CategoryPayload {
  id?: string;
  name: string;
  dishes: DishPayload[];
  order?: number;
}

export interface BulkSavePayload {
  restaurant: {
    id?: string;
    name: string;
    logo: string | null;
    customPrompt: string | null;
    phoneNumber: number | null;
    currency: string;
    color: string;
    reservas: string | null;
    redes_sociales: string | null;
    slug?: string;
  };
  categories: CategoryPayload[];
  deletedCategoryIds: string[];
  deletedDishIds: string[];
  orderedCategoryIds: string[];
}

/**
 * Save the entire menu (restaurant, categories, dishes) in a single bulk operation
 */
export async function saveMenuBulk(payload: BulkSavePayload): Promise<any> {
  console.log('Sending bulk save payload to /api/menu/bulk-save:', payload);

  const response = await fetch('/api/menu/bulk-save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include', // Important for cookies/auth
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    console.error('Bulk save failed:', result.error, result.details);
    throw new Error(result.error || 'Failed to save menu changes via bulk endpoint');
  }

  console.log('Bulk save successful, result data:', result.data);
  return result.data;
}

/**
 * Legacy function to save menu changes using individual API calls
 * This is kept for reference but is no longer in use - use saveMenuBulk instead
 */
/* 
export async function saveMenuChanges(
  restaurantData: any,
  restaurantId: string | null,
  storeState: any
): Promise<any> {
  console.log('saveMenuChanges called, consider using saveMenuBulk for better performance');
  
  // Restaurant save
  const savedRestaurant = await restaurantService.createOrUpdateRestaurant(
    restaurantData,
    restaurantId
  );

  // Get existing categories to avoid duplication
  const existingCategories = await categoryService.fetchCategories(
    savedRestaurant.id
  );

  // Handle category deletions
  if (storeState.changedItems.deletedCategories.size > 0) {
    const categoryDeletionPromises = Array.from(
      storeState.changedItems.deletedCategories
    ).map(async (categoryId: string) => {
      if (!categoryId.startsWith('temp_')) {
        await categoryService.deleteCategory(savedRestaurant.id, categoryId);
      }
    });

    await Promise.all(categoryDeletionPromises);
  }

  // Handle dish deletions
  if (storeState.changedItems.deletedDishes.size > 0) {
    const dishDeletionPromises = Array.from(
      storeState.changedItems.deletedDishes
    ).map(async (dishId: string) => {
      if (!dishId.startsWith('temp_')) {
        // Find the category this dish belongs to
        const category = storeState.categories.find((c: any) =>
          c.dishes?.some((d: any) => d.id === dishId)
        );
        if (category && !category.id.startsWith('temp_')) {
          await dishService.deleteDish(
            savedRestaurant.id,
            category.id,
            dishId
          );
        }
      }
    });

    await Promise.all(dishDeletionPromises);
  }

  // Tracking temporary to real IDs for foreign key relationships
  const tempToPermanentIds: Record<string, string> = {};

  // Handle category creations and updates
  const categoryPromises = storeState.categories.map(async (category: any) => {
    let categoryId = category.id;
    let savedCategory;

    // If the category has changed or is new (temp_id)
    if (
      storeState.changedItems.categories.has(category.id) ||
      category.id.startsWith('temp_')
    ) {
      // Check if a category with this name already exists
      const existingCategory = existingCategories.find(
        (ec: any) => ec.name === category.name
      );

      if (existingCategory && category.id.startsWith('temp_')) {
        // Use the existing category instead of creating a new one
        savedCategory = existingCategory;
        tempToPermanentIds[category.id] = existingCategory.id;
      } else {
        // Create or update the category
        savedCategory = await categoryService.createOrUpdateCategory(
          savedRestaurant.id,
          {
            id: category.id.startsWith('temp_') ? undefined : category.id,
            name: category.name,
          }
        );

        if (category.id.startsWith('temp_')) {
          tempToPermanentIds[category.id] = savedCategory.id;
        }
      }
    } else {
      savedCategory = { id: category.id, name: category.name };
    }

    return savedCategory;
  });

  const savedCategories = await Promise.all(categoryPromises);

  // Handle dish creations and updates
  let allDishes: any[] = [];

  for (const category of storeState.categories) {
    const realCategoryId = tempToPermanentIds[category.id] || category.id;
    
    if (category.dishes && category.dishes.length > 0) {
      const dishPromises = category.dishes.map(async (dish: any) => {
        if (
          storeState.changedItems.dishes.has(dish.id) ||
          dish.id.startsWith('temp_')
        ) {
          const dishPayload = {
            title: dish.title,
            description: dish.description,
            price: dish.price,
            imageUrl: dish.imageUrl,
          };

          const savedDish = await dishService.createOrUpdateDish(
            savedRestaurant.id,
            realCategoryId,
            dish.id.startsWith('temp_') ? undefined : dish.id,
            dishPayload
          );

          if (dish.id.startsWith('temp_')) {
            tempToPermanentIds[dish.id] = savedDish.id;
          }

          return { ...savedDish, categoryId: realCategoryId };
        }
        
        return { ...dish, categoryId: realCategoryId };
      });

      const categoryDishes = await Promise.all(dishPromises);
      allDishes = [...allDishes, ...categoryDishes];
    }
  }

  // Get the final state with proper ordering
  const finalCategories = await categoryService.fetchCategories(
    savedRestaurant.id
  );

  // Get dishes for each category
  const categoriesWithDishes = await Promise.all(
    finalCategories.map(async (category: any) => {
      const dishes = await dishService.fetchDishes(
        savedRestaurant.id,
        category.id
      );
      return { ...category, dishes };
    })
  );

  return {
    restaurant: savedRestaurant,
    categories: categoriesWithDishes,
  };
}
*/ 