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
  phoneNumber: number | null;
  categories: Category[];
  color: string;
  reservas: string | null;
  redes_sociales: string | null;
  
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

// Helper function to merge database data with unsaved changes
function mergeWithUnsavedChanges(
  dbCategories: Category[], 
  currentCategories: Category[], 
  changedCategoryIds: Set<string>,
  changedDishIds: Set<string>,
  deletedCategoryIds: Set<string>,
  deletedDishIds: Set<string>
): Category[] {
  // Create a map of database categories by ID for easy lookup
  const dbCategoriesMap = new Map<string, Category>();
  dbCategories.forEach(category => {
    dbCategoriesMap.set(category.id, { 
      ...category,
      dishes: category.dishes || [] // Ensure dishes array exists
    });
  });
  
  // Create a map of current categories by ID for easy lookup
  const currentCategoriesMap = new Map<string, Category>();
  currentCategories.forEach(category => {
    // Skip categories that are marked for deletion
    if (!deletedCategoryIds.has(category.id)) {
      currentCategoriesMap.set(category.id, { 
        ...category,
        dishes: category.dishes || [] // Ensure dishes array exists
      });
    }
  });
  
  // Start with all database categories
  const mergedCategories: Category[] = [];
  
  // Add all database categories that aren't marked for deletion
  dbCategories.forEach(dbCategory => {
    if (!deletedCategoryIds.has(dbCategory.id)) {
      // If this category has been changed, use the current version
      if (changedCategoryIds.has(dbCategory.id)) {
        const currentCategory = currentCategoriesMap.get(dbCategory.id);
        if (currentCategory) {
          mergedCategories.push({
            ...currentCategory,
            dishes: currentCategory.dishes || [] // Ensure dishes array exists
          });
        }
      } else {
        // Otherwise use the database version, but check for changed dishes
        const mergedCategory = { 
          ...dbCategory,
          dishes: dbCategory.dishes || [] // Ensure dishes array exists
        };
        
        // If the category has dishes, check for changes
        if (mergedCategory.dishes && mergedCategory.dishes.length > 0) {
          mergedCategory.dishes = mergedCategory.dishes.filter(dish => !deletedDishIds.has(dish.id));
          
          // Replace changed dishes with their current versions
          mergedCategory.dishes = mergedCategory.dishes.map(dish => {
            if (changedDishIds.has(dish.id)) {
              // Find the current version of this dish
              const currentCategory = currentCategoriesMap.get(dbCategory.id);
              if (currentCategory && currentCategory.dishes) {
                const currentDish = currentCategory.dishes.find(d => d.id === dish.id);
                if (currentDish) {
                  return currentDish;
                }
              }
            }
            return dish;
          });
        }
        
        mergedCategories.push(mergedCategory);
      }
    }
  });
  
  // Add new categories (those with temp IDs)
  currentCategories.forEach(category => {
    if (category.id.startsWith('temp_') && !dbCategoriesMap.has(category.id)) {
      mergedCategories.push({
        ...category,
        dishes: category.dishes || [] // Ensure dishes array exists
      });
    }
  });
  
  return mergedCategories;
}

// Create a persistent map to store unsaved changes across restaurant switches
const restaurantStates = new Map();

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
    color: '1',
    reservas: null,
    redes_sociales: null,
    
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

  // Helper function to save the current state before switching restaurants
  function saveCurrentState() {
    const state = get({ subscribe });
    if (!state.selectedRestaurant) return;
    
    // Only save if there are unsaved changes
    if (state.changedItems.restaurant || 
        state.changedItems.categories.size > 0 || 
        state.changedItems.dishes.size > 0 || 
        state.changedItems.deletedCategories.size > 0 || 
        state.changedItems.deletedDishes.size > 0) {
      
      restaurantStates.set(state.selectedRestaurant, {
        restaurantName: state.restaurantName,
        menuLogo: state.menuLogo,
        customPrompt: state.customPrompt,
        phoneNumber: state.phoneNumber,
        color: state.color, // Save color state 
        categories: [...state.categories],
        changedItems: {
          restaurant: state.changedItems.restaurant,
          categories: new Set(state.changedItems.categories),
          dishes: new Set(state.changedItems.dishes),
          deletedCategories: new Set(state.changedItems.deletedCategories),
          deletedDishes: new Set(state.changedItems.deletedDishes)
        }
      });
      
      console.log('Saved state for restaurant:', state.selectedRestaurant);
    }
  }
  
  // Helper function to load and merge data for a restaurant
  async function loadAndMergeData(restaurantId: string) {
    try {
      // Fetch the restaurant data
      const restaurant = await restaurantService.fetchRestaurantById(restaurantId);
      console.log('Fetched restaurant data:', restaurant);
      
      // Fetch categories for this restaurant
      const fetchedCategories = await categoryService.fetchCategories(restaurantId);
      console.log('Found categories:', fetchedCategories);
      
      // Fetch dishes for each category
      const categoriesWithDishes = await Promise.all(
        fetchedCategories.map(async (category) => {
          try {
            const dishes = await dishService.fetchDishes(restaurantId, category.id);
            console.log(`Fetched ${dishes.length} dishes for category ${category.name}`);
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
      
      // Check if we have saved state for this restaurant
      let finalCategories = categoriesWithDishes;
      let changedItems = {
        restaurant: false,
        categories: new Set<string>(),
        dishes: new Set<string>(),
        deletedCategories: new Set<string>(),
        deletedDishes: new Set<string>()
      };
      
      if (restaurantStates.has(restaurantId)) {
        const savedState = restaurantStates.get(restaurantId);
        console.log('Found saved state for restaurant:', restaurantId);
        
        // Merge the database categories with the saved changes
        finalCategories = mergeWithUnsavedChanges(
          categoriesWithDishes,
          savedState.categories || [],
          savedState.changedItems.categories,
          savedState.changedItems.dishes,
          savedState.changedItems.deletedCategories,
          savedState.changedItems.deletedDishes
        );
        
        // Restore the change tracking
        changedItems = {
          restaurant: savedState.changedItems.restaurant,
          categories: new Set(savedState.changedItems.categories),
          dishes: new Set(savedState.changedItems.dishes),
          deletedCategories: new Set(savedState.changedItems.deletedCategories),
          deletedDishes: new Set(savedState.changedItems.deletedDishes)
        };
        
        console.log('Merged categories:', finalCategories);
      }
      
      // Ensure all categories have a dishes array
      finalCategories = finalCategories.map(category => ({
        ...category,
        dishes: category.dishes || []
      }));
      
      return {
        restaurant,
        categories: finalCategories,
        changedItems
      };
    } catch (error) {
      console.error('Error loading data for restaurant:', restaurantId, error);
      throw error;
    }
  }

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
        
        // Check if we're already on this restaurant
        if (currentState.selectedRestaurant === restaurantId) {
          console.log('Already on this restaurant, no need to reload');
          return currentState.restaurants.find(r => r.id === restaurantId);
        }
        
        // First update the state to indicate we're loading
        update(s => ({ ...s, isLoading: true }));
        
        // Save the current restaurant's state if there are unsaved changes
        saveCurrentState();
        
        // Load and merge data for the selected restaurant
        const { restaurant, categories, changedItems } = await loadAndMergeData(restaurantId);
        
        // Ensure color is a hex value, not a numeric value
        let colorValue = restaurant.color || '#85A3FA';
        
        // If color is "1" (light theme), convert it to the actual hex
        if (colorValue === '1' || colorValue === 'light') {
          colorValue = '#85A3FA';
        }
        
        // Update the store with the restaurant and categories
        update(s => {
          return {
            ...s,
            selectedRestaurant: restaurantId,
            restaurantName: restaurant.name,
            menuLogo: restaurant.logo,
            customPrompt: restaurant.customPrompt,
            phoneNumber: restaurant.phoneNumber,
            color: colorValue, // Use properly converted color
            reservas: restaurant.reservas || null, // Add reservas from restaurant data
            redes_sociales: restaurant.redes_sociales || null, // Add redes_sociales from restaurant data
            categories: categories,
            isLoading: false,
            changedItems: changedItems
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
    createRestaurant(name: string, logo: string | null = null, customPrompt: string | null = null, phoneNumber: number | null = null, reservas: string | null = null, redes_sociales: string | null = null) {
      const tempId = createTempId();
      
      update(state => {
        // Get the current color value from state (or use default)
        let currentColor = state.color || '#85A3FA'; 
        
        // Ensure it's a hex color
        if (currentColor === 'light' || currentColor === '1') {
          currentColor = '#85A3FA';
        }
      
        // Create a new restaurant object
        const newRestaurant: Restaurant = {
          id: tempId,
          name,
          slug: '', // Will be set by the server
          logo,
          customPrompt,
          phoneNumber,
          userId: '', // Will be set by the server
          currency: '€', // Default
          color: currentColor, // Use the current color value
          createdAt: new Date(),
          updatedAt: new Date(),
          reservas,
          redes_sociales,
        };
        
        return {
          ...state,
          restaurants: [...state.restaurants, newRestaurant],
          selectedRestaurant: tempId,
          restaurantName: name,
          menuLogo: logo,
          customPrompt,
          phoneNumber,
          color: currentColor, // Keep the current color value
          changedItems: {
            ...state.changedItems,
            restaurant: true
          },
          reservas,
          redes_sociales,
        };
      });
    },

    // Update restaurant info
    updateRestaurantInfo(name: string, logo: string | null, customPrompt: string | null = null, slug: string | null = null, phoneNumber: number | null = null, reservas?: string | null, redes_sociales?: string | null, color: string | null = null) {
      // CRITICAL: Validate that color is actually a color value
      let validatedColor = color;
      if (validatedColor && typeof validatedColor === 'string' && !validatedColor.startsWith('#')) {
        console.warn('CRITICAL: Color value must start with #, got:', validatedColor);
        validatedColor = '#' + validatedColor;
      }

      console.log('updateRestaurantInfo called with:', {
        name,
        logo,
        customPrompt,
        slug,
        phoneNumber,
        reservas,
        redes_sociales,
        color: validatedColor,
        isUrlUpdate: {
          reservasProvided: reservas !== undefined,
          redes_socialesProvided: redes_sociales !== undefined
        }
      });

      update(state => {
        // Find the current restaurant in the state
        const currentRestaurantIndex = state.restaurants.findIndex(r => r.id === state.selectedRestaurant);
        const currentRestaurant = currentRestaurantIndex >= 0 ? state.restaurants[currentRestaurantIndex] : null;
        
        // Create a copy of the restaurants array
        const updatedRestaurants = [...state.restaurants];
        
        // Update the current restaurant (if found)
        if (currentRestaurantIndex >= 0 && currentRestaurant) {
          updatedRestaurants[currentRestaurantIndex] = {
            ...currentRestaurant,
            name,
            logo,
            customPrompt,
            slug: slug || currentRestaurant.slug,
            phoneNumber,
            // Only update URLs if they are explicitly set
            ...(reservas !== undefined ? { reservas } : {}),
            ...(redes_sociales !== undefined ? { redes_sociales } : {}),
            color: validatedColor || state.color || '#85A3FA',
            updatedAt: new Date(),
          };
        }
        
        return {
          ...state,
          restaurantName: name,
          menuLogo: logo,
          customPrompt,
          phoneNumber,
          color: validatedColor || state.color || '#85A3FA',
          // Only update URLs in state if they are explicitly set
          ...(reservas !== undefined ? { reservas } : {}),
          ...(redes_sociales !== undefined ? { redes_sociales } : {}),
          restaurants: updatedRestaurants,
          changedItems: {
            ...state.changedItems,
            restaurant: true
          }
        };
      });
    },

    // Update only reservas and redes_sociales values
    updateReservasAndSocials(reservas: string | null, redes_sociales: string | null) {
      // CRITICAL DEBUG: Add a trace to see this method being called 
      console.trace('updateReservasAndSocials TRACE');
      
      console.log('updateReservasAndSocials called with:', { 
        reservas, 
        reservasType: typeof reservas, 
        redes_sociales, 
        redes_socialesType: typeof redes_sociales 
      });
      
      update(state => {
        // CRITICAL DEBUG: Add more logging to ensure the state update is happening
        console.log('Updating store state, before:', { 
          stateReservas: state.reservas, 
          stateRedesSociales: state.redes_sociales 
        });
        
        // Find the current restaurant in the state
        const currentRestaurantIndex = state.restaurants.findIndex(r => r.id === state.selectedRestaurant);
        
        // Create a copy of the restaurants array
        const updatedRestaurants = [...state.restaurants];
        
        // Update the current restaurant (if found)
        if (currentRestaurantIndex >= 0) {
          updatedRestaurants[currentRestaurantIndex] = {
            ...updatedRestaurants[currentRestaurantIndex],
            reservas,
            redes_sociales,
            updatedAt: new Date(),
          };
        }
        
        // CRITICAL: Force the changedItems.restaurant to true
        console.log('Updating store state with:', { reservas, redes_sociales });
        
        const result = {
          ...state,
          reservas,
          redes_sociales,
          restaurants: updatedRestaurants,
          changedItems: {
            ...state.changedItems,
            restaurant: true
          }
        };
        
        // CRITICAL DEBUG: Log the result to ensure values are correctly set
        console.log('State after update:', { 
          resultReservas: result.reservas, 
          resultRedesSociales: result.redes_sociales,
          changedItems: result.changedItems 
        });
        
        return result;
      });
    },

    // Update only the restaurant name without creating a restaurant yet
    updateLocalRestaurantName(name: string) {
      update(state => {
        return {
          ...state,
          restaurantName: name,
          changedItems: {
            ...state.changedItems,
            restaurant: true
          }
        };
      });
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

      return tempId; // Return the temporary ID
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
      
      try {
        update(s => ({ ...s, isSaving: true }));
        
        // Get the current restaurant to access its properties
        const currentRestaurantObj = state.restaurants.find(r => r.id === state.selectedRestaurant);
        console.log('Current restaurant in store:', currentRestaurantObj);
        
        // Use the state's color value directly, ensuring it's a hex value
        const colorValue = state.color === 'light' || state.color === '1'
          ? '#85A3FA'
          : state.color;
        
        // CRITICAL: Preserve existing URLs if they're not being updated
        const reservas = state.reservas !== undefined ? state.reservas : currentRestaurantObj?.reservas;
        const redes_sociales = state.redes_sociales !== undefined ? state.redes_sociales : currentRestaurantObj?.redes_sociales;
        
        console.log('Restaurant data for save:', {
          name: state.restaurantName,
          logo: state.menuLogo,
          customPrompt: state.customPrompt,
          phoneNumber: state.phoneNumber,
          currency: currentRestaurantObj?.currency || '€',
          color: colorValue,
          reservas,
          redes_sociales,
          currentUrls: {
            stateReservas: state.reservas,
            stateRedesSociales: state.redes_sociales,
            currentRestaurantReservas: currentRestaurantObj?.reservas,
            currentRestaurantRedesSociales: currentRestaurantObj?.redes_sociales
          }
        });
        
        // Save changes using the existing menu service
        const result = await menuService.saveMenuChanges(
          {
            name: state.restaurantName,
            logo: state.menuLogo,
            customPrompt: state.customPrompt,
            phoneNumber: state.phoneNumber,
            currency: currentRestaurantObj?.currency || '€',
            color: colorValue,
            reservas,
            redes_sociales,
          },
          state.selectedRestaurant
        );
        
        // Update state with saved data
        update(s => {
          // Update restaurants list
          const restaurantIndex = s.restaurants.findIndex(r => r.id === result.restaurant.id);
          const restaurants = [...s.restaurants];
          
          if (restaurantIndex >= 0) {
            restaurants[restaurantIndex] = {
              ...result.restaurant,
              // CRITICAL: Preserve URLs if they exist in the result
              reservas: result.restaurant.reservas ?? restaurants[restaurantIndex].reservas,
              redes_sociales: result.restaurant.redes_sociales ?? restaurants[restaurantIndex].redes_sociales
            };
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
            phoneNumber: result.restaurant.phoneNumber,
            color: result.restaurant.color,
            categories: result.categories,
            isSaving: false,
            lastSaveTime: new Date(),
            changedItems: {
              restaurant: false,
              categories: new Set<string>(),
              dishes: new Set<string>(),
              deletedCategories: new Set<string>(),
              deletedDishes: new Set<string>()
            },
            // CRITICAL: Preserve URLs if they exist in the result
            reservas: result.restaurant.reservas ?? s.reservas,
            redes_sociales: result.restaurant.redes_sociales ?? s.redes_sociales,
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