import type { Restaurant, Category } from './menu.types';

/**
 * Type for updating a specific field in a restaurant
 */
export type RestaurantField = 
  | 'name'
  | 'logo'
  | 'customPrompt'
  | 'slug'
  | 'phoneNumber'
  | 'reservas'
  | 'redes_sociales'
  | 'color'
  | 'currency';

/**
 * Type-safe field update object for restaurants
 */
export interface RestaurantFieldUpdate {
  id?: string;
  name?: string;
  logo?: string | null;
  customPrompt?: string | null;
  slug?: string | null;
  phoneNumber?: string | null;
  reservas?: string | null;
  redes_sociales?: string | null;
  color?: string;
  currency?: string;
}

/**
 * Type for tracking restaurant changes
 */
export interface RestaurantChanges {
  restaurant: boolean;
  categories: Set<string>; // IDs of changed categories
  dishes: Set<string>;     // IDs of changed dishes
  deletedCategories: Set<string>; // IDs of categories to delete
  deletedDishes: Set<string>;     // IDs of dishes to delete
}

/**
 * Type for restaurant form validation errors
 */
export interface RestaurantValidationErrors {
  name?: string;
  reservas?: string;
  redes_sociales?: string;
  phoneNumber?: string;
  color?: string;
}

/**
 * State for the restaurant store
 */
export interface RestaurantStoreState {
  // Current data
  restaurants: Restaurant[];
  selectedRestaurant: string | null;
  fields: RestaurantFieldUpdate;
  categories: Category[]; // All categories for the current restaurant
  
  // Tracking changes
  changedItems: RestaurantChanges;
  
  // UI state
  isSaving: boolean;
  lastSaveTime: Date | null;
  isLoading: boolean;
  errors: RestaurantValidationErrors;
} 