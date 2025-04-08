// src/lib/services/menu.service.ts
import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
// Removed server imports: db, schema, operators
import { menuStore } from '$lib/stores/menu-store'; // Keep store import
import { get } from 'svelte/store'; // Keep store import
// Keep other service imports if needed elsewhere, but not for saveMenuChanges's core logic
// import * as restaurantService from './restaurant.service';
// import * as categoryService from './category.service';
// import * as dishService from './dish.service';

// Define the result type expected from the API response (the full restaurant state)
interface SaveApiResponse {
	success: boolean;
	data: Restaurant; // Assuming the API returns the full restaurant object with nested categories/dishes
	error?: string;
}


export async function saveMenuChanges(
  // This function now primarily gathers data from the store and sends it to the API
  restaurantData: {
    name: string;
    logo: string | null;
    slug?: string | null; // Slug might be generated/checked just before calling this
    customPrompt?: string | null;
    phoneNumber?: number | null;
    currency: string;
    color: string;
    reservas?: string | null;
    redes_sociales?: string | null;
  },
  currentRestaurantId: string | null // The ID the store currently holds
): Promise<Restaurant> { // Return the final Restaurant object

  console.log('Service: saveMenuChanges called. Preparing API request.');
  const storeState = get(menuStore);

  // Prepare the payload for the API
  const payload = {
    restaurantData,
    currentRestaurantId, // Pass the ID the store knows
    changedItems: { // Convert Sets to Arrays for JSON serialization
      restaurant: storeState.changedItems.restaurant,
      categories: Array.from(storeState.changedItems.categories),
      dishes: Array.from(storeState.changedItems.dishes),
      deletedCategories: Array.from(storeState.changedItems.deletedCategories),
      deletedDishes: Array.from(storeState.changedItems.deletedDishes),
    },
    categories: storeState.categories, // Send the current frontend state of categories/dishes
  };

  try {
    console.log('Service: Sending request to /api/menu/save');
    const response = await fetch('/api/menu/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include', // Send cookies for authentication
    });

    // Use the defined interface for the parsed result
    const result: SaveApiResponse = await response.json();

    if (!response.ok || !result.success) {
      console.error('Service: API call failed.', { status: response.status, error: result.error });
      throw new Error(result.error || `Failed to save menu changes (Status: ${response.status})`);
    }

    console.log('Service: Save successful. Received final state from API.');

    // The caller (e.g., SaveButton.svelte or menuStore itself) will handle updating the store with this data.
    // Return only the final restaurant state data
    return result.data;

  } catch (error) {
    console.error('Service: Error in saveMenuChanges:', error);
    // Re-throw the error so the calling component can handle it (e.g., show toast)
    throw error;
  }
}