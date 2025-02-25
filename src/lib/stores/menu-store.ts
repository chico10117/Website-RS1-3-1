import { writable, derived, get } from 'svelte/store';
import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
import * as restaurantService from '$lib/services/restaurant.service';
import * as categoryService from '$lib/services/category.service';
import * as dishService from '$lib/services/dish.service';
import * as menuService from '$lib/services/menu.service';

export interface MenuStore {
  // Current data
  restaurants: Restaurant[];
  selectedRestaurant: string | null;
  restaurantName: string;
  menuLogo: string | null;
  customPrompt: string | null;
  phoneNumber: string | null;
  categories: Category[];
  
  // Tracking changes
  changedItems: {
    restaurant: boolean;
    categories: Set<string>; // IDs of changed categories
    dishes: Set<string>;     // IDs of changed dishes
    deletedCategories: Set<string>; // IDs of categories to delete
    deletedDishes: Set<string>;     // IDs of dishes to delete
  };
  
  // UI state
  isSaving: boolean;
  lastSaveTime: Date | null;
  isLoading: boolean;
}

// Helper to create a new ID for temporary items
const createTempId = () => `temp_${Math.random().toString(36).substring(2, 11)}`;

function createMenuStore() {
  const initialState: MenuStore = {
    // Current data
    restaurants: [],
    selectedRestaurant: null,
    restaurantName: '',
    menuLogo: null,
    customPrompt: null,
    phoneNumber: null,
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
    isLoading: false
  };

  const { subscribe, set, update } = writable<MenuStore>(initialState);

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
    hasUnsavedChanges,
    
    // Reset state to initial values
    reset() {
      set(initialState);
    },

    // Reset change tracking without resetting the data
    resetChanges() {
      update(state => ({
        ...state,
        changedItems: {
          restaurant: false,
          categories: new Set<string>(),
          dishes: new Set<string>(),
          deletedCategories: new Set<string>(),
          deletedDishes: new Set<string>()
        },
        lastSaveTime: new Date()
      }));
    },

    // Load initial data
    async loadRestaurants() {
      try {
        console.log('Loading restaurants from menuStore...');
        const restaurants = await restaurantService.fetchRestaurants();
        console.log('Loaded restaurants:', restaurants);
        update(state => ({ ...state, restaurants }));
        return restaurants;
      } catch (error) {
        console.error('Error loading restaurants:', error);
        throw error;
      }
    },

    // Restaurant actions
    async selectRestaurant(restaurantId: string) {
      console.log('selectRestaurant called with ID:', restaurantId);
      
      if (!restaurantId) {
        console.error('No restaurant ID provided to selectRestaurant');
        throw new Error('No restaurant ID provided');
      }
      
      try {
        // Log the current state
        const currentState = get({ subscribe });
        console.log('Current state before selecting restaurant:', {
          selectedRestaurant: currentState.selectedRestaurant,
          restaurantName: currentState.restaurantName
        });
        
        // First update the state to indicate we're loading
        update(s => ({ ...s, isLoading: true }));
        
        // Fetch the restaurant data using the service
        const restaurant = await restaurantService.fetchRestaurantById(restaurantId);
        console.log('Fetched restaurant data:', restaurant);
        
        // Fetch categories for this restaurant using the service
        console.log('Fetching categories for restaurant:', restaurantId);
        const categories = await categoryService.fetchCategories(restaurantId);
        console.log('Found categories:', categories);
        
        // Update the store with the restaurant and categories
        update(s => {
          // Make sure we're setting the selectedRestaurant
          return {
            ...s,
            selectedRestaurant: restaurantId,
            restaurantName: restaurant.name,
            menuLogo: restaurant.logo,
            customPrompt: restaurant.customPrompt,
            categories: categories,
            isLoading: false,
            // Reset change tracking when selecting a new restaurant
            changedItems: {
              restaurant: false,
              categories: new Set<string>(),
              dishes: new Set<string>(),
              deletedCategories: new Set<string>(),
              deletedDishes: new Set<string>()
            }
          };
        });
        
        // Log the updated state
        const updatedState = get({ subscribe });
        console.log('State after selecting restaurant:', {
          selectedRestaurant: updatedState.selectedRestaurant,
          restaurantName: updatedState.restaurantName,
          categoriesCount: updatedState.categories.length
        });
        
        return restaurant;
      } catch (error) {
        console.error('Error selecting restaurant:', error);
        update(s => ({ ...s, isLoading: false }));
        throw error;
      }
    },

    // Create a new restaurant
    createRestaurant(name: string, logo: string | null = null, customPrompt: string | null = null) {
      const tempId = createTempId();
      
      update(state => {
        // Create a temporary restaurant
        const newRestaurant: Restaurant = {
          id: tempId,
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          logo,
          customPrompt,
          userId: '', // Will be set by the server
          currency: 'USD', // Default
          color: 0, // Default
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return {
          ...state,
          restaurants: [...state.restaurants, newRestaurant],
          selectedRestaurant: tempId,
          restaurantName: name,
          menuLogo: logo,
          customPrompt,
          changedItems: {
            ...state.changedItems,
            restaurant: true
          }
        };
      });
    },

    // Update restaurant info
    updateRestaurantInfo(name: string, logo: string | null, customPrompt: string | null = null) {
      update(state => ({
        ...state,
        restaurantName: name,
        menuLogo: logo,
        customPrompt,
        changedItems: {
          ...state.changedItems,
          restaurant: true
        }
      }));
    },

    // Category actions
    addCategory(name: string) {
      const tempId = createTempId();
      
      update(state => {
        const newCategory: Category = {
          id: tempId,
          name,
          restaurantId: state.selectedRestaurant || '',
          dishes: []
        };
        
        // Add to categories and mark as changed
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
    
    deleteCategory(categoryId: string) {
      update(state => {
        // Filter out the category
        const updatedCategories = state.categories.filter(category => 
          category.id !== categoryId
        );
        
        // Add to deleted categories set
        const deletedCategories = new Set(state.changedItems.deletedCategories);
        deletedCategories.add(categoryId);
        
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

    // Dish actions
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
    
    updateDish(dishId: string, dishData: { title?: string, price?: string, description?: string, imageUrl?: string | null }) {
      update(state => {
        // Find and update the dish in its category
        const updatedCategories = state.categories.map(category => {
          if (!category.dishes) return category;
          
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
    
    deleteDish(dishId: string) {
      update(state => {
        // Find and remove the dish from its category
        const updatedCategories = state.categories.map(category => {
          if (!category.dishes) return category;
          
          const dishIndex = category.dishes.findIndex(dish => dish.id === dishId);
          if (dishIndex === -1) return category;
          
          const updatedDishes = category.dishes.filter(dish => dish.id !== dishId);
          
          return {
            ...category,
            dishes: updatedDishes
          };
        });
        
        // Add to deleted dishes set
        const deletedDishes = new Set(state.changedItems.deletedDishes);
        deletedDishes.add(dishId);
        
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

    // Save all changes
    async saveChanges() {
      const state = get({ subscribe });
      
      if (!state.selectedRestaurant && !state.changedItems.restaurant) {
        console.error('No restaurant selected and no restaurant changes to save');
        throw new Error('No restaurant selected and no restaurant changes to save');
      }
      
      // Log the current state for debugging
      console.log('SaveChanges state:', {
        selectedRestaurant: state.selectedRestaurant,
        restaurantName: state.restaurantName,
        changedItems: {
          restaurant: state.changedItems.restaurant,
          categories: Array.from(state.changedItems.categories),
          dishes: Array.from(state.changedItems.dishes),
          deletedCategories: Array.from(state.changedItems.deletedCategories),
          deletedDishes: Array.from(state.changedItems.deletedDishes)
        }
      });
      
      try {
        update(s => ({ ...s, isSaving: true }));
        
        // Get the current restaurant to access its properties
        const currentRestaurantObj = state.restaurants.find(r => r.id === state.selectedRestaurant);
        
        // Prepare restaurant data with valid color and currency values
        const restaurantData = {
          name: state.restaurantName,
          logo: state.menuLogo,
          customPrompt: state.customPrompt,
          currency: currentRestaurantObj?.currency || 'EUR', // Use current value or default to EUR
          color: (currentRestaurantObj?.color && currentRestaurantObj.color > 0) ? currentRestaurantObj.color : 1 // Ensure color is at least 1
        };
        
        console.log('Restaurant data for save:', restaurantData);
        
        // Prepare cache-like structure for the menu service
        const cache: {
          restaurant: Restaurant | null;
          categories: Record<string, { action: 'create' | 'update' | 'delete'; data: Category }>;
          dishes: Record<string, { action: 'create' | 'update' | 'delete'; data: Dish }>;
          hasUnsavedChanges: boolean;
        } = {
          restaurant: state.selectedRestaurant ? 
            state.restaurants.find(r => r.id === state.selectedRestaurant) || null : 
            null,
          categories: {},
          dishes: {},
          hasUnsavedChanges: true
        };
        
        // Add changed categories to cache
        state.categories.forEach(category => {
          if (state.changedItems.categories.has(category.id)) {
            cache.categories[category.id] = {
              action: category.id.startsWith('temp_') ? 'create' : 'update',
              data: category
            };
          }
        });
        
        // Add deleted categories to cache
        state.changedItems.deletedCategories.forEach(categoryId => {
          // Find the category in the original data if possible
          const category = state.categories.find(c => c.id === categoryId);
          if (category) {
            cache.categories[categoryId] = {
              action: 'delete',
              data: category
            };
          }
        });
        
        // Add changed dishes to cache
        state.categories.forEach(category => {
          if (!category.dishes) return;
          
          category.dishes.forEach(dish => {
            if (state.changedItems.dishes.has(dish.id)) {
              cache.dishes[dish.id] = {
                action: dish.id.startsWith('temp_') ? 'create' : 'update',
                data: dish
              };
            }
          });
        });
        
        // Add deleted dishes to cache
        state.changedItems.deletedDishes.forEach(dishId => {
          // We need to find the dish data, which might be tricky if it's deleted
          // For simplicity, we'll create a minimal dish object
          cache.dishes[dishId] = {
            action: 'delete',
            data: {
              id: dishId,
              title: '',
              description: '',
              price: '',
              imageUrl: null,
              categoryId: '' // This will be filled by the service
            }
          };
        });
        
        console.log('Saving changes with:', {
          restaurantData,
          currentRestaurantId: state.selectedRestaurant,
          hasChanges: {
            restaurant: state.changedItems.restaurant,
            categories: state.changedItems.categories.size > 0,
            dishes: state.changedItems.dishes.size > 0,
            deletedCategories: state.changedItems.deletedCategories.size > 0,
            deletedDishes: state.changedItems.deletedDishes.size > 0
          }
        });
        
        // Save changes using the existing menu service
        const result = await menuService.saveMenuChanges(
          restaurantData,
          state.selectedRestaurant
        );
        
        // Update state with saved data
        update(s => {
          // Update restaurants list
          const restaurantIndex = s.restaurants.findIndex(r => r.id === result.restaurant.id);
          const restaurants = [...s.restaurants];
          
          if (restaurantIndex >= 0) {
            restaurants[restaurantIndex] = result.restaurant;
          } else {
            restaurants.push(result.restaurant);
          }
          
          return {
            ...s,
            restaurants,
            selectedRestaurant: result.restaurant.id,
            restaurantName: result.restaurant.name,
            menuLogo: result.restaurant.logo,
            customPrompt: result.restaurant.customPrompt,
            categories: result.categories,
            isSaving: false,
            lastSaveTime: new Date(),
            // Reset change tracking
            changedItems: {
              restaurant: false,
              categories: new Set<string>(),
              dishes: new Set<string>(),
              deletedCategories: new Set<string>(),
              deletedDishes: new Set<string>()
            }
          };
        });
        
        return result;
      } catch (error) {
        console.error('Error saving changes:', error);
        update(s => ({ ...s, isSaving: false }));
        throw error;
      }
    }
  };
}

export const menuStore = createMenuStore(); 