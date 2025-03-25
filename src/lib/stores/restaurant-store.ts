import { writable, derived, get } from 'svelte/store';
import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
import type { 
  RestaurantStoreState, 
  RestaurantField, 
  RestaurantFieldUpdate, 
  RestaurantValidationErrors 
} from '$lib/types/restaurant.types';
import * as restaurantService from '$lib/services/restaurant.service';
import * as categoryService from '$lib/services/category.service';
import * as dishService from '$lib/services/dish.service';
import { validateUrl, validateColor, validatePhone, normalizeUrl, ensureStringOrNull } from '$lib/utils/validation';
import { toasts } from './toast';

// Helper to create a new ID for temporary items
const createTempId = () => `temp_${Math.random().toString(36).substring(2, 11)}`;

function createRestaurantStore() {
  // Create initial state
  const initialState: RestaurantStoreState = {
    // Current data
    restaurants: [],
    selectedRestaurant: null,
    fields: {
      name: '',
      logo: null,
      customPrompt: null,
      slug: null,
      phoneNumber: null,
      color: 'light',
      currency: '€',
      reservas: null,
      redes_sociales: null,
    },
    categories: [],
    
    // Tracking changes
    changedItems: {
      restaurant: false,
      categories: new Set<string>(),
      dishes: new Set<string>(),
      deletedCategories: new Set<string>(),
      deletedDishes: new Set<string>()
    },
    
    // UI state
    isSaving: false,
    lastSaveTime: null,
    isLoading: false,
    errors: {}
  };

  // Create the writable store
  const { subscribe, set, update } = writable<RestaurantStoreState>(initialState);

  // Derived store for the current restaurant
  const currentRestaurant = derived({ subscribe }, $state => 
    $state.restaurants.find(r => r.id === $state.selectedRestaurant)
  );

  // Derived store for whether there are unsaved changes
  const hasUnsavedChanges = derived({ subscribe }, $state => {
    return $state.changedItems.restaurant || 
           $state.changedItems.categories.size > 0 || 
           $state.changedItems.dishes.size > 0 ||
           $state.changedItems.deletedCategories.size > 0 ||
           $state.changedItems.deletedDishes.size > 0;
  });

  return {
    subscribe,
    currentRestaurant,
    hasUnsavedChanges,

    /**
     * Initialize the store and load restaurants
     */
    async initialize() {
      try {
        update(state => ({ ...state, isLoading: true }));
        
        const restaurants = await restaurantService.fetchRestaurants();
        
        update(state => ({
          ...state,
          restaurants,
          isLoading: false
        }));
        
        return restaurants;
      } catch (error) {
        console.error('Error initializing restaurant store:', error);
        update(state => ({ ...state, isLoading: false }));
        return [];
      }
    },

    /**
     * Select a restaurant by ID and load its data
     */
    async selectRestaurant(restaurantId: string) {
      try {
        update(state => ({ ...state, isLoading: true }));
        
        // Fetch the restaurant data
        const restaurant = await restaurantService.fetchRestaurantById(restaurantId);
        
        // Fetch categories for this restaurant
        const fetchedCategories = await categoryService.fetchCategories(restaurantId);
        
        // Fetch dishes for each category
        const categoriesWithDishes = await Promise.all(
          fetchedCategories.map(async (category) => {
            try {
              const dishes = await dishService.fetchDishes(restaurantId, category.id);
              return {
                ...category,
                dishes
              } as Category;
            } catch (error) {
              console.error(`Error fetching dishes for category ${category.id}:`, error);
              return {
                ...category,
                dishes: []
              } as Category;
            }
          })
        );
        
        // Update the store with the loaded data
        update(state => ({
          ...state,
          selectedRestaurant: restaurantId,
          fields: {
            name: restaurant.name,
            logo: restaurant.logo,
            customPrompt: restaurant.customPrompt,
            slug: restaurant.slug,
            phoneNumber: restaurant.phoneNumber,
            color: restaurant.color || 'light',
            currency: restaurant.currency || '€',
            reservas: restaurant.reservas,
            redes_sociales: restaurant.redes_sociales,
          },
          categories: categoriesWithDishes,
          restaurants: state.restaurants.map(r => 
            r.id === restaurantId ? restaurant : r
          ),
          isLoading: false,
          changedItems: {
            restaurant: false,
            categories: new Set<string>(),
            dishes: new Set<string>(),
            deletedCategories: new Set<string>(),
            deletedDishes: new Set<string>()
          }
        }));
        
        return restaurant;
      } catch (error) {
        console.error('Error selecting restaurant:', error);
        update(state => ({ ...state, isLoading: false }));
        toasts.error('Failed to load restaurant data');
        throw error;
      }
    },

    /**
     * Create a new restaurant
     */
    createRestaurant(name: string) {
      if (!name.trim()) {
        return;
      }
      
      update(state => ({
        ...state,
        selectedRestaurant: null,
        fields: {
          name,
          logo: null,
          customPrompt: null,
          slug: null,
          phoneNumber: null,
          color: 'light',
          currency: '€',
          reservas: null,
          redes_sociales: null,
        },
        categories: [],
        changedItems: {
          ...state.changedItems,
          restaurant: true
        }
      }));
    },

    /**
     * Update a single field in the restaurant
     */
    updateField(field: RestaurantField, value: any) {
      update(state => {
        // Validate the field
        const error = this.validateField(field, value);
        
        // Update errors
        const errors = {
          ...state.errors,
          [field]: error
        };
        
        // If there's a validation error, don't update the field
        if (error) {
          return {
            ...state,
            errors
          };
        }
        
        // Create a copy of the current restaurant for updating
        const currentRestaurantIndex = state.restaurants.findIndex(
          r => r.id === state.selectedRestaurant
        );
        
        let updatedRestaurants = [...state.restaurants];
        
        // Only update the restaurants array if we have a valid restaurant ID
        if (state.selectedRestaurant && currentRestaurantIndex >= 0) {
          // Type casting to avoid incompatible type errors, as restaurant properties
          // might have stricter types than our field values
          const updatedRestaurant = {
            ...updatedRestaurants[currentRestaurantIndex],
            [field]: value,
            updatedAt: new Date()
          } as Restaurant;
          
          updatedRestaurants[currentRestaurantIndex] = updatedRestaurant;
        }
        
        // Update the field in the fields object
        const fields = {
          ...state.fields,
          [field]: value
        };
        
        return {
          ...state,
          fields,
          restaurants: updatedRestaurants,
          changedItems: {
            ...state.changedItems,
            restaurant: true
          },
          errors
        };
      });
    },

    /**
     * Update multiple fields at once
     */
    updateFields(fieldUpdates: RestaurantFieldUpdate) {
      update(state => {
        // Create a copy for tracking validation errors
        const errors: RestaurantValidationErrors = { ...state.errors };
        
        // Validate each field
        for (const [field, value] of Object.entries(fieldUpdates)) {
          const error = this.validateField(field as RestaurantField, value);
          if (error) {
            errors[field as keyof RestaurantValidationErrors] = error;
          }
        }
        
        // Create a copy of the current restaurant for updating
        const currentRestaurantIndex = state.restaurants.findIndex(
          r => r.id === state.selectedRestaurant
        );
        
        let updatedRestaurants = [...state.restaurants];
        
        // Only update the restaurants array if we have a valid restaurant ID
        if (state.selectedRestaurant && currentRestaurantIndex >= 0) {
          // Type casting to avoid incompatible type errors
          const updatedRestaurant = {
            ...updatedRestaurants[currentRestaurantIndex],
            ...fieldUpdates,
            updatedAt: new Date()
          } as Restaurant;
          
          updatedRestaurants[currentRestaurantIndex] = updatedRestaurant;
        }
        
        // Update the fields object with the new values
        const fields = {
          ...state.fields,
          ...fieldUpdates
        };
        
        return {
          ...state,
          fields,
          restaurants: updatedRestaurants,
          changedItems: {
            ...state.changedItems,
            restaurant: true
          },
          errors
        };
      });
    },

    /**
     * Add a new category
     */
    addCategory(name: string) {
      if (!name.trim()) return;
      
      const tempId = createTempId();
      
      update(state => {
        const newCategory: Category = {
          id: tempId,
          name,
          restaurantId: state.selectedRestaurant || '',
          dishes: []
        };
        
        return {
          ...state,
          categories: [...state.categories, newCategory],
          changedItems: {
            ...state.changedItems,
            categories: new Set([...state.changedItems.categories, tempId])
          }
        };
      });
    },
    
    /**
     * Update an existing category
     */
    updateCategory(categoryId: string, name: string) {
      update(state => {
        const updatedCategories = state.categories.map(category => 
          category.id === categoryId ? { ...category, name } : category
        );
        
        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            categories: new Set([...state.changedItems.categories, categoryId])
          }
        };
      });
    },
    
    /**
     * Delete a category
     */
    deleteCategory(categoryId: string) {
      update(state => {
        // Filter out the category
        const updatedCategories = state.categories.filter(category => 
          category.id !== categoryId
        );
        
        // Add to deleted categories set if it's not a temporary ID
        const deletedCategories = new Set(state.changedItems.deletedCategories);
        if (!categoryId.startsWith('temp_')) {
          deletedCategories.add(categoryId);
        }
        
        // Remove from changed categories if it was there
        const changedCategories = new Set(state.changedItems.categories);
        changedCategories.delete(categoryId);
        
        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            categories: changedCategories,
            deletedCategories
          }
        };
      });
    },
    
    /**
     * Add a new dish to a category
     */
    addDish(categoryId: string, dishData: { title: string, price: string, description: string, imageUrl: string | null }) {
      const tempId = createTempId();
      
      update(state => {
        const newDish: Dish = {
          id: tempId,
          ...dishData,
          categoryId
        };
        
        // Add dish to the appropriate category
        const updatedCategories = state.categories.map(category => {
          if (category.id === categoryId) {
            return {
              ...category,
              dishes: [...(category.dishes || []), newDish]
            };
          }
          return category;
        });
        
        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            dishes: new Set([...state.changedItems.dishes, tempId])
          }
        };
      });
    },
    
    /**
     * Update an existing dish
     */
    updateDish(dishId: string, dishData: { title?: string, price?: string, description?: string, imageUrl?: string | null }) {
      update(state => {
        // Find and update the dish in its category
        const updatedCategories = state.categories.map(category => {
          if (!category.dishes) return { ...category, dishes: [] };
          
          const dishIndex = category.dishes.findIndex(dish => dish.id === dishId);
          if (dishIndex === -1) return category;
          
          const updatedDishes = [...category.dishes];
          updatedDishes[dishIndex] = {
            ...updatedDishes[dishIndex],
            ...dishData
          };
          
          return {
            ...category,
            dishes: updatedDishes
          };
        });
        
        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            dishes: new Set([...state.changedItems.dishes, dishId])
          }
        };
      });
    },
    
    /**
     * Delete a dish
     */
    deleteDish(dishId: string) {
      update(state => {
        // Find and remove the dish from its category
        const updatedCategories = state.categories.map(category => {
          if (!category.dishes) return { ...category, dishes: [] };
          
          const dishIndex = category.dishes.findIndex(dish => dish.id === dishId);
          if (dishIndex === -1) return category;
          
          const updatedDishes = category.dishes.filter(dish => dish.id !== dishId);
          
          return {
            ...category,
            dishes: updatedDishes
          };
        });
        
        // Add to deleted dishes set if it's not a temporary ID
        const deletedDishes = new Set(state.changedItems.deletedDishes);
        if (!dishId.startsWith('temp_')) {
          deletedDishes.add(dishId);
        }
        
        // Remove from changed dishes if it was there
        const changedDishes = new Set(state.changedItems.dishes);
        changedDishes.delete(dishId);
        
        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            dishes: changedDishes,
            deletedDishes
          }
        };
      });
    },

    /**
     * Validate a field value
     */
    validateField(field: RestaurantField, value: any): string | null {
      switch (field) {
        case 'name':
          return !value || value.trim() === '' ? 'Name is required' : null;
        case 'reservas':
        case 'redes_sociales':
          return validateUrl(value);
        case 'phoneNumber':
          return validatePhone(value);
        case 'color':
          return validateColor(value);
        default:
          return null;
      }
    },

    /**
     * Reset all form errors
     */
    resetErrors() {
      update(state => ({
        ...state,
        errors: {}
      }));
    },

    /**
     * Reset change tracking after successful save
     */
    resetChanges() {
      update(state => ({
        ...state,
        changedItems: {
          restaurant: false,
          categories: new Set<string>(),
          dishes: new Set<string>(),
          deletedCategories: new Set<string>(),
          deletedDishes: new Set<string>()
        }
      }));
    },

    /**
     * Save all changes to the restaurant
     */
    async saveChanges() {
      const state = get({ subscribe });
      
      // Ensure we have a restaurant to save
      if (!state.selectedRestaurant && !state.changedItems.restaurant) {
        toasts.error('No restaurant selected and no changes to save');
        return;
      }
      
      // Check for validation errors before saving
      const errors: RestaurantValidationErrors = {};
      let hasErrors = false;
      
      for (const [field, value] of Object.entries(state.fields)) {
        const error = this.validateField(field as RestaurantField, value);
        if (error) {
          errors[field as keyof RestaurantValidationErrors] = error;
          hasErrors = true;
        }
      }
      
      if (hasErrors) {
        update(s => ({ ...s, errors }));
        toasts.error('Please fix validation errors before saving');
        return;
      }
      
      try {
        update(s => ({ ...s, isSaving: true }));
        
        // Get the current restaurant from the store
        const restaurant = state.restaurants.find(r => r.id === state.selectedRestaurant);
        
        // Normalize URL values before saving
        const normalizedFields = {
          ...state.fields,
          // Ensure URL fields are properly normalized and typed
          reservas: normalizeUrl(state.fields.reservas),
          redes_sociales: normalizeUrl(state.fields.redes_sociales)
        };
        
        // Save restaurant changes
        const result = await restaurantService.createOrUpdateRestaurant(
          {
            // Ensure required fields have values and optional fields are properly typed
            name: normalizedFields.name || '',
            logo: normalizedFields.logo,
            slug: ensureStringOrNull(normalizedFields.slug),
            customPrompt: ensureStringOrNull(normalizedFields.customPrompt),
            phoneNumber: ensureStringOrNull(normalizedFields.phoneNumber),
            currency: normalizedFields.currency || '€',
            color: normalizedFields.color || 'light',
            reservas: normalizedFields.reservas,
            redes_sociales: normalizedFields.redes_sociales,
          },
          state.selectedRestaurant || undefined
        );
        
        // Update state with saved data
        update(s => {
          // Update restaurants list
          const restaurantIndex = s.restaurants.findIndex(r => r.id === result.id);
          const restaurants = [...s.restaurants];
          
          if (restaurantIndex >= 0) {
            restaurants[restaurantIndex] = result;
          } else {
            restaurants.push(result);
          }
          
          return {
            ...s,
            restaurants,
            selectedRestaurant: result.id,
            fields: {
              name: result.name,
              logo: result.logo,
              customPrompt: result.customPrompt,
              slug: result.slug,
              phoneNumber: result.phoneNumber,
              color: result.color,
              currency: result.currency,
              reservas: result.reservas,
              redes_sociales: result.redes_sociales,
            },
            isSaving: false,
            lastSaveTime: new Date(),
            changedItems: {
              restaurant: false,
              categories: new Set<string>(),
              dishes: new Set<string>(),
              deletedCategories: new Set<string>(),
              deletedDishes: new Set<string>()
            }
          };
        });
        
        toasts.success('Restaurant saved successfully');
        return result;
      } catch (error) {
        console.error('Error saving restaurant:', error);
        update(s => ({ ...s, isSaving: false }));
        toasts.error('Failed to save restaurant');
        throw error;
      }
    }
  };
}

export const restaurantStore = createRestaurantStore(); 