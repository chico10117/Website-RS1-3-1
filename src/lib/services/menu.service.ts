import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
import type { MenuCache, CacheChange } from '$lib/stores/menu-cache';
import * as restaurantService from './restaurant.service';
import * as categoryService from './category.service';
import * as dishService from './dish.service';
import { menuCache } from '$lib/stores/menu-cache';

interface SaveResult {
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
}

export async function saveMenuChanges(
  cache: MenuCache,
  restaurantData: { name: string; logo: string | null; slug?: string },
  currentRestaurantId: string | null
): Promise<SaveResult> {
  // Step 1: Save restaurant
  const savedRestaurant = await restaurantService.createOrUpdateRestaurant(
    {
      ...restaurantData,
      ...(cache.restaurant || {}),
      // Ensure slug is generated if not present
      slug: cache.restaurant?.slug || restaurantData.name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '')
    },
    currentRestaurantId || undefined
  );
  
  const restaurantId = savedRestaurant.id;
  
  // Step 2: Get existing categories
  const existingCategories = await categoryService.fetchCategories(restaurantId);
  const existingCategoryMap = new Map(existingCategories.map(cat => [cat.id, cat]));
  const existingCategoryNameMap = new Map(existingCategories.map(cat => [cat.name.toLowerCase(), cat]));
  
  const savedCategories: Category[] = [];
  const savedDishes: Dish[] = [];
  const tempToRealIdMap = new Map<string, string>();

  // Step 3: First process deletions
  for (const [tempId, categoryChange] of Object.entries(cache.categories)) {
    const change = categoryChange as CacheChange<Category>;
    
    if (change.action === 'delete') {
      await categoryService.deleteCategory(restaurantId, tempId);
      // Remove from existingCategoryMap so it won't be considered when checking for duplicates
      existingCategoryMap.delete(tempId);
      existingCategoryNameMap.delete(change.data.name.toLowerCase());
    }
  }

  // Step 4: Process creates and updates
  for (const [tempId, categoryChange] of Object.entries(cache.categories)) {
    const change = categoryChange as CacheChange<Category>;
    
    // Skip if this was a deletion
    if (change.action === 'delete') {
      continue;
    }

    // For updates, verify the category still exists
    if (change.action === 'update') {
      const existingCategory = existingCategoryMap.get(tempId);
      if (!existingCategory) {
        // If category was deleted, treat this as a create
        change.action = 'create';
      }
    }

    // Check if a category with this name already exists
    const existingCategoryWithName = existingCategoryNameMap.get(change.data.name.toLowerCase());
    
    if (existingCategoryWithName && change.action === 'create') {
      // If we're trying to create a category that already exists, just use the existing one
      savedCategories.push(existingCategoryWithName);
      tempToRealIdMap.set(tempId, existingCategoryWithName.id);
      continue;
    }

    // Create or update the category
    if (change.action === 'create' || change.action === 'update') {
      const savedCategory = await categoryService.createOrUpdateCategory(
        restaurantId,
        { name: change.data.name },
        change.action === 'update' ? tempId : undefined
      );
      savedCategories.push({ ...savedCategory, dishes: [] });
      
      // Store the mapping between temporary and real IDs
      tempToRealIdMap.set(tempId, savedCategory.id);
      
      // Update the name map
      existingCategoryNameMap.set(savedCategory.name.toLowerCase(), savedCategory);
    }
  }

  // Step 5: Save dishes
  for (const [tempId, dishChange] of Object.entries(cache.dishes)) {
    const change = dishChange as CacheChange<Dish>;
    
    // Handle deletion
    if (change.action === 'delete') {
      if (tempId.length !== 36) {  // Only delete if it's not a temporary ID
        await dishService.deleteDish(restaurantId, change.data.categoryId, tempId);
      }
      continue;
    }

    // Map the temporary category ID to the real one if needed
    const realCategoryId = tempToRealIdMap.get(change.data.categoryId) || change.data.categoryId;

    // For updates, use the existing ID
    const dishId = change.action === 'update' ? tempId : undefined;
    
    const savedDish = await dishService.createOrUpdateDish(
      restaurantId,
      realCategoryId,
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

  // Step 6: Fetch final state
  const finalCategories = await categoryService.fetchCategories(restaurantId);
  const categoriesWithDishes = await Promise.all(
    finalCategories.map(async category => {
      const dishes = await dishService.fetchDishes(restaurantId, category.id);
      return { ...category, dishes };
    })
  );

  // Step 7: Clear the cache since everything is saved
  menuCache.clearCache();

  return {
    restaurant: savedRestaurant,
    categories: categoriesWithDishes,
    dishes: savedDishes
  };
} 