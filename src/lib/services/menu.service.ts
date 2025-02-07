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
  restaurantData: {
    name: string;
    logo: string | null;
    slug?: string;
    customPrompt?: string | null;
    currency: string;
    color: number;
  },
  currentRestaurantId: string | null
): Promise<SaveResult> {
  console.log('Starting saveMenuChanges with:', {
    cache,
    restaurantData,
    currentRestaurantId,
    cacheRestaurant: cache.restaurant
  });

  // Step 1: Save restaurant
  // If we have a currentRestaurantId, it's an update. Otherwise, it's a new restaurant.
  const isNewRestaurant = !currentRestaurantId;
  
  console.log('Restaurant operation type:', {
    isNewRestaurant,
    currentRestaurantId,
    cacheRestaurantId: cache.restaurant?.id
  });

  const savedRestaurant = await restaurantService.createOrUpdateRestaurant(
    {
      ...(isNewRestaurant && cache.restaurant?.id && { id: cache.restaurant.id }),
      name: restaurantData.name,
      logo: restaurantData.logo,
      slug: restaurantData.slug || cache.restaurant?.slug,
      customPrompt: restaurantData.customPrompt ?? cache.restaurant?.customPrompt,
      currency: restaurantData.currency,
      color: restaurantData.color
    },
    isNewRestaurant ? undefined : currentRestaurantId
  );

  console.log('Restaurant saved:', savedRestaurant);
  
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
      try {
        await dishService.deleteDish(restaurantId, change.data.categoryId, tempId);
      } catch (error) {
        console.error('Error deleting dish:', error);
        // Continue with other operations even if one deletion fails
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