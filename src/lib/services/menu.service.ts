import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
import type { MenuStore } from '$lib/stores/menu-store';
import * as restaurantService from './restaurant.service';
import * as categoryService from './category.service';
import * as dishService from './dish.service';
import { menuStore } from '$lib/stores/menu-store';
import { get } from 'svelte/store';

interface SaveResult {
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
}

export async function saveMenuChanges(
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
    restaurantData,
    currentRestaurantId
  });

  // Get the store state
  const store = menuStore;
  const storeState = get(store);

  // Step 1: Save restaurant
  // If we have a currentRestaurantId, it's an update. Otherwise, it's a new restaurant.
  const isNewRestaurant = !currentRestaurantId || currentRestaurantId.startsWith('temp_');
  
  console.log('Restaurant operation type:', {
    isNewRestaurant,
    currentRestaurantId
  });

  // Find the current restaurant in the store
  const currentRestaurant = storeState.restaurants.find(r => r.id === currentRestaurantId);

  const savedRestaurant = await restaurantService.createOrUpdateRestaurant(
    {
      name: restaurantData.name,
      logo: restaurantData.logo,
      slug: restaurantData.slug || currentRestaurant?.slug,
      customPrompt: restaurantData.customPrompt ?? currentRestaurant?.customPrompt,
      currency: restaurantData.currency,
      color: restaurantData.color
    },
    isNewRestaurant ? undefined : currentRestaurantId
  );

  console.log('Restaurant saved:', savedRestaurant);
  
  const restaurantId = savedRestaurant.id;
  
  // Step 2: Get existing categories from the API
  const existingCategories = await categoryService.fetchCategories(restaurantId);
  const existingCategoryMap = new Map(existingCategories.map(cat => [cat.id, cat]));
  const existingCategoryNameMap = new Map(existingCategories.map(cat => [cat.name.toLowerCase(), cat]));
  
  const savedCategories: Category[] = [];
  const savedDishes: Dish[] = [];
  const tempToRealIdMap = new Map<string, string>();

  // Step 3: First process category deletions
  for (const deletedCategoryId of storeState.changedItems.deletedCategories) {
    // Only delete if it's not a temporary ID (starts with 'temp_')
    if (!deletedCategoryId.startsWith('temp_')) {
      await categoryService.deleteCategory(restaurantId, deletedCategoryId);
      // Remove from existingCategoryMap so it won't be considered when checking for duplicates
      existingCategoryMap.delete(deletedCategoryId);
      
      // Find and remove from existingCategoryNameMap
      for (const [name, cat] of existingCategoryNameMap.entries()) {
        if (cat.id === deletedCategoryId) {
          existingCategoryNameMap.delete(name);
          break;
        }
      }
    }
  }

  // Step 4: Process category creates and updates
  for (const categoryId of storeState.changedItems.categories) {
    // Find the category in the store
    const category = storeState.categories.find(c => c.id === categoryId);
    if (!category) continue;

    // Check if this is a temporary ID (new category)
    const isNewCategory = categoryId.startsWith('temp_');
    
    // For existing categories, verify it still exists
    if (!isNewCategory && !existingCategoryMap.has(categoryId)) {
      // If category was deleted on the server, treat this as a create
      const savedCategory = await categoryService.createOrUpdateCategory(
        restaurantId,
        { name: category.name }
      );
      savedCategories.push(savedCategory);
      tempToRealIdMap.set(categoryId, savedCategory.id);
      continue;
    }

    // Check if a category with this name already exists
    const existingCategoryWithName = existingCategoryNameMap.get(category.name.toLowerCase());
    
    if (existingCategoryWithName && existingCategoryWithName.id !== categoryId) {
      // If a category with this name already exists, use that one instead
      tempToRealIdMap.set(categoryId, existingCategoryWithName.id);
      savedCategories.push(existingCategoryWithName);
    } else {
      // Create or update the category
      const savedCategory = await categoryService.createOrUpdateCategory(
        restaurantId,
        { name: category.name },
        isNewCategory ? undefined : categoryId
      );
      savedCategories.push(savedCategory);
      
      // Map temporary ID to real ID
      if (isNewCategory) {
        tempToRealIdMap.set(categoryId, savedCategory.id);
      }
    }
  }

  // Step 5: Process dish deletions
  for (const deletedDishId of storeState.changedItems.deletedDishes) {
    // Find the dish in any category
    let categoryId: string | undefined;
    
    // Only delete if it's not a temporary ID
    if (!deletedDishId.startsWith('temp_')) {
      // Find which category this dish belongs to
      for (const category of storeState.categories) {
        if (category.dishes?.some(d => d.id === deletedDishId)) {
          categoryId = category.id;
          break;
        }
      }
      
      if (categoryId) {
        // If the category has a temporary ID, map it to the real ID
        const realCategoryId = tempToRealIdMap.get(categoryId) || categoryId;
        await dishService.deleteDish(restaurantId, realCategoryId, deletedDishId);
      }
    }
  }

  // Step 6: Process dish creates and updates
  for (const dishId of storeState.changedItems.dishes) {
    // Find the dish in any category
    let dish: Dish | undefined;
    let categoryId: string | undefined;
    
    for (const category of storeState.categories) {
      const foundDish = category.dishes?.find(d => d.id === dishId);
      if (foundDish) {
        dish = foundDish;
        categoryId = category.id;
        break;
      }
    }
    
    if (!dish || !categoryId) continue;
    
    // Check if this is a temporary ID (new dish)
    const isNewDish = dishId.startsWith('temp_');
    
    // Map category ID if it's a temporary ID
    const realCategoryId = tempToRealIdMap.get(categoryId) || categoryId;
    
    // Create or update the dish
    const savedDish = await dishService.createOrUpdateDish(
      restaurantId,
      realCategoryId,
      {
        title: dish.title,
        description: dish.description,
        price: dish.price,
        imageUrl: dish.imageUrl
      },
      isNewDish ? undefined : dishId
    );
    
    savedDishes.push(savedDish);
  }

  // Step 7: Reset the change tracking in the store
  menuStore.resetChanges();

  return {
    restaurant: savedRestaurant,
    categories: savedCategories,
    dishes: savedDishes
  };
} 