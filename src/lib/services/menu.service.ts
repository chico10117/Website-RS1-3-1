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
    restaurantData,
    currentRestaurantId || undefined
  );
  
  const restaurantId = savedRestaurant.id;
  const categoryIdMap = new Map<string, string>();
  const savedCategories: Category[] = [];
  const savedDishes: Dish[] = [];

  // Step 2: Process category deletions
  for (const [tempId, categoryChange] of Object.entries(cache.categories)) {
    const change = categoryChange as CacheChange<Category>;
    if (change.action === 'delete' && tempId.length < 30) {
      await categoryService.deleteCategory(restaurantId, tempId);
    }
  }

  // Step 3: Process category creates/updates
  for (const [tempId, categoryChange] of Object.entries(cache.categories)) {
    const change = categoryChange as CacheChange<Category>;
    if (change.action === 'delete') continue;

    const savedCategory = await categoryService.createOrUpdateCategory(
      restaurantId,
      { name: change.data.name },
      tempId.length > 30 ? undefined : tempId
    );

    categoryIdMap.set(tempId, savedCategory.id);
    savedCategories.push(savedCategory);
  }

  // Step 4: Process dish deletions
  for (const [tempId, dishChange] of Object.entries(cache.dishes)) {
    const change = dishChange as CacheChange<Dish>;
    if (change.action === 'delete') {
      const realCategoryId = categoryIdMap.get(change.data.categoryId) || change.data.categoryId;
      await dishService.deleteDish(restaurantId, realCategoryId, tempId);
    }
  }

  // Step 5: Process dish creates/updates
  for (const [tempId, dishChange] of Object.entries(cache.dishes)) {
    const change = dishChange as CacheChange<Dish>;
    if (change.action === 'delete') continue;

    const realCategoryId = categoryIdMap.get(change.data.categoryId) || change.data.categoryId;
    const { title, price, description, imageUrl } = change.data;

    const savedDish = await dishService.createOrUpdateDish(
      restaurantId,
      realCategoryId,
      { title, price, description, imageUrl },
      tempId.length > 30 ? undefined : tempId
    );

    savedDishes.push(savedDish);
  }

  return {
    restaurant: savedRestaurant,
    categories: savedCategories,
    dishes: savedDishes
  };
} 