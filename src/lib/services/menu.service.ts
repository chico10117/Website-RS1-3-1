import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
import type { MenuCache, CacheChange } from '$lib/stores/menu-cache';
import * as restaurantService from './restaurant.service';
import * as categoryService from './category.service';
import * as dishService from './dish.service';

interface SaveResult {
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
}

export async function saveMenuChanges(
  cache: MenuCache,
  restaurantData: { name: string; logo: string },
  currentRestaurantId: string | null
): Promise<SaveResult> {
  // Step 1: Save restaurant
  const savedRestaurant = await restaurantService.createOrUpdateRestaurant(
    {
      ...restaurantData,
      ...(cache.restaurant || {})
    },
    currentRestaurantId || undefined
  );
  
  const restaurantId = savedRestaurant.id;
  
  // Step 2: Get existing categories
  const existingCategories = await categoryService.fetchCategories(restaurantId);
  const existingCategoryMap = new Map(existingCategories.map(cat => [cat.name, cat]));
  
  const savedCategories: Category[] = [];
  const savedDishes: Dish[] = [];

  // Step 3: Process categories
  for (const [tempId, categoryChange] of Object.entries(cache.categories)) {
    const change = categoryChange as CacheChange<Category>;
    
    // Handle deletion
    if (change.action === 'delete') {
      if (tempId.length < 30) {
        await categoryService.deleteCategory(restaurantId, tempId);
      }
      continue;
    }

    // Check if category already exists
    const existingCategory = existingCategoryMap.get(change.data.name);
    
    if (existingCategory) {
      // Use existing category
      savedCategories.push({ ...existingCategory, dishes: [] });
      continue;
    }

    // Create new category only if it doesn't exist
    if (change.action === 'create' || change.action === 'update') {
      const savedCategory = await categoryService.createOrUpdateCategory(
        restaurantId,
        { name: change.data.name },
        tempId.length > 30 ? undefined : tempId
      );
      savedCategories.push({ ...savedCategory, dishes: [] });
    }
  }

  // Step 4: Save dishes
  for (const [tempId, dishChange] of Object.entries(cache.dishes)) {
    const change = dishChange as CacheChange<Dish>;
    
    // Handle deletion
    if (change.action === 'delete') {
      if (tempId.length < 30) {  // Only delete if it's a real ID
        await dishService.deleteDish(restaurantId, change.data.categoryId, tempId);
      }
      continue;
    }

    // For updates, use the existing ID
    const dishId = change.action === 'update' ? tempId : undefined;
    
    const savedDish = await dishService.createOrUpdateDish(
      restaurantId,
      change.data.categoryId,
      { 
        title: change.data.title,
        price: change.data.price,
        description: change.data.description,
        imageUrl: change.data.imageUrl
      },
      dishId
    );

    savedDishes.push(savedDish);
  }

  // Step 5: Fetch final state
  const finalCategories = await categoryService.fetchCategories(restaurantId);
  const categoriesWithDishes = await Promise.all(
    finalCategories.map(async category => {
      const dishes = await dishService.fetchDishes(restaurantId, category.id);
      return { ...category, dishes };
    })
  );

  return {
    restaurant: savedRestaurant,
    categories: categoriesWithDishes,
    dishes: savedDishes
  };
} 