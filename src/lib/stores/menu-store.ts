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
    lastSaveTime: null
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
      try {
        update(state => ({ 
          ...state, 
          selectedRestaurant: restaurantId,
          // Reset change tracking when selecting a restaurant
          changedItems: {
            restaurant: false,
            categories: new Set<string>(),
            dishes: new Set<string>(),
            deletedCategories: new Set<string>(),
            deletedDishes: new Set<string>()
          }
        }));
        
        const restaurant = get(currentRestaurant);
        if (restaurant) {
          update(state => ({
            ...state,
            restaurantName: restaurant.name,
            menuLogo: restaurant.logo || null,
            customPrompt: restaurant.customPrompt || null
          }));

          // Load categories for this restaurant
          const categories = await categoryService.fetchCategories(restaurantId);
          
          // Load dishes for each category
          const categoriesWithDishes = await Promise.all(
            categories.map(async category => {
              const dishes = await dishService.fetchDishes(restaurantId, category.id);
              return { ...category, dishes };
            })
          );

          update(state => ({ ...state, categories: categoriesWithDishes }));
        }
      } catch (error) {
        console.error('Error selecting restaurant:', error);
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
        return;
      }
      
      try {
        update(s => ({ ...s, isSaving: true }));
        
        // Prepare restaurant data
        const restaurantData = {
          name: state.restaurantName,
          logo: state.menuLogo,
          customPrompt: state.customPrompt,
          currency: 'USD', // Default or get from current restaurant
          color: 0 // Default or get from current restaurant
        };
        
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
        
        // Save changes using the existing menu service
        const result = await menuService.saveMenuChanges(
          cache,
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