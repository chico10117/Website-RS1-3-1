import { writable, derived, get } from 'svelte/store';
import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
import * as restaurantService from '$lib/services/restaurant.service';
import * as categoryService from '$lib/services/category.service';
import * as dishService from '$lib/services/dish.service';
import * as menuService from '$lib/services/menu.service';

export interface MenuStore {
  restaurants: Restaurant[];
  selectedRestaurant: string | null;
  restaurantName: string;
  menuLogo: string | null;
  customPrompt: string | null;
  phoneNumber: number | null;
  categories: Category[];
  color: string;
  currency: string;
  reservas: string | null;
  redes_sociales: string | null;
  
  changedItems: {
    restaurant: boolean;
    categories: Set<string>; // IDs of changed categories
    dishes: Set<string>;     // IDs of changed dishes
    deletedCategories: Set<string>; // IDs of categories to delete
    deletedDishes: Set<string>;     // IDs of dishes to delete
  };
  
  isSaving: boolean;
  lastSaveTime: Date | null;
  isLoading: boolean;
}

const createTempId = () => `temp_${Math.random().toString(36).substring(2, 11)}`;

function mergeWithUnsavedChanges(
  dbCategories: Category[], 
  currentCategories: Category[], 
  changedCategoryIds: Set<string>,
  changedDishIds: Set<string>,
  deletedCategoryIds: Set<string>,
  deletedDishIds: Set<string>
): Category[] {
  const dbCategoriesMap = new Map<string, Category>();
  dbCategories.forEach(category => {
    dbCategoriesMap.set(category.id, { 
      ...category,
      dishes: category.dishes || [] // Ensure dishes array exists
    });
  });
  
  const currentCategoriesMap = new Map<string, Category>();
  currentCategories.forEach(category => {
    if (!deletedCategoryIds.has(category.id)) {
      currentCategoriesMap.set(category.id, { 
        ...category,
        dishes: category.dishes || [] // Ensure dishes array exists
      });
    }
  });
  
  const mergedCategories: Category[] = [];
  
  dbCategories.forEach(dbCategory => {
    if (!deletedCategoryIds.has(dbCategory.id)) {
      if (changedCategoryIds.has(dbCategory.id)) {
        const currentCategory = currentCategoriesMap.get(dbCategory.id);
        if (currentCategory) {
          mergedCategories.push({
            ...currentCategory,
            dishes: currentCategory.dishes || [] // Ensure dishes array exists
          });
        }
      } else {
        const mergedCategory = { 
          ...dbCategory,
          dishes: dbCategory.dishes || [] // Ensure dishes array exists
        };
        
        if (mergedCategory.dishes && mergedCategory.dishes.length > 0) {
          mergedCategory.dishes = mergedCategory.dishes.filter(dish => !deletedDishIds.has(dish.id));
          
          mergedCategory.dishes = mergedCategory.dishes.map(dish => {
            if (changedDishIds.has(dish.id)) {
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

const restaurantStates = new Map();

function createMenuStore() {
  const initialState: MenuStore = {
    restaurants: [],
    selectedRestaurant: null,
    restaurantName: '',
    menuLogo: null,
    customPrompt: null,
    phoneNumber: null,
    categories: [],
    color: '#85A3FA',
    currency: '€',
    reservas: null,
    redes_sociales: null,
    
    changedItems: {
      restaurant: false,
      categories: new Set<string>(),
      dishes: new Set<string>(),
      deletedCategories: new Set<string>(),
      deletedDishes: new Set<string>()
    },
    
    isSaving: false,
    lastSaveTime: null,
    isLoading: false
  };

  const { subscribe, set, update } = writable<MenuStore>(initialState);

  const currentRestaurant = derived({ subscribe }, $state => 
    $state.restaurants.find(r => r.id === $state.selectedRestaurant)
  );

  const hasUnsavedChanges = derived({ subscribe }, $state => {
    return $state.changedItems.restaurant || 
           $state.changedItems.categories.size > 0 || 
           $state.changedItems.dishes.size > 0 ||
           $state.changedItems.deletedCategories.size > 0 ||
           $state.changedItems.deletedDishes.size > 0;
  });

  function saveCurrentState() {
    const state = get({ subscribe });
    if (!state.selectedRestaurant) return;
    
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
  
  async function loadAndMergeData(restaurantId: string) {
    try {
      const restaurant = await restaurantService.fetchRestaurantById(restaurantId);
      console.log('Fetched restaurant data:', restaurant);
      
      const fetchedCategories = await categoryService.fetchCategories(restaurantId);
      console.log('Found categories:', fetchedCategories);
      
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
        
        finalCategories = mergeWithUnsavedChanges(
          categoriesWithDishes,
          savedState.categories || [],
          savedState.changedItems.categories,
          savedState.changedItems.dishes,
          savedState.changedItems.deletedCategories,
          savedState.changedItems.deletedDishes
        );
        
        changedItems = {
          restaurant: savedState.changedItems.restaurant,
          categories: new Set(savedState.changedItems.categories),
          dishes: new Set(savedState.changedItems.dishes),
          deletedCategories: new Set(savedState.changedItems.deletedCategories),
          deletedDishes: new Set(savedState.changedItems.deletedDishes)
        };
        
        console.log('Merged categories:', finalCategories);
      }
      
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
    
    reset() {
      set(initialState);
    },

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

    async selectRestaurant(restaurantId: string) {
      console.log('selectRestaurant called with ID:', restaurantId);
      
      if (!restaurantId) {
        console.error('No restaurant ID provided to selectRestaurant');
        throw new Error('No restaurant ID provided');
      }
      
      try {
        const currentState = get({ subscribe });
        
        if (currentState.selectedRestaurant === restaurantId) {
          console.log('Already on this restaurant, no need to reload');
          return currentState.restaurants.find(r => r.id === restaurantId);
        }
        
        update(s => ({ ...s, isLoading: true }));
        
        saveCurrentState();
        
        const { restaurant, categories, changedItems } = await loadAndMergeData(restaurantId);
        
        let colorValue = restaurant.color || '#85A3FA';
        if (colorValue === '1' || colorValue === 'light') {
          colorValue = '#85A3FA';
        }
        
        update(s => {
          return {
            ...s,
            selectedRestaurant: restaurantId,
            restaurantName: restaurant.name,
            menuLogo: restaurant.logo,
            customPrompt: restaurant.customPrompt,
            phoneNumber: restaurant.phoneNumber,
            color: colorValue,
            currency: restaurant.currency || '€',
            reservas: restaurant.reservas || null,
            redes_sociales: restaurant.redes_sociales || null,
            categories: categories,
            isLoading: false,
            changedItems: changedItems
          };
        });
        
        return restaurant;
      } catch (error) {
        console.error('Error selecting restaurant:', error);
        update(s => ({ ...s, isLoading: false }));
        throw error;
      }
    },

    createRestaurant(name: string, logo: string | null = null, customPrompt: string | null = null, phoneNumber: number | null = null, reservas: string | null = null, redes_sociales: string | null = null, currency: string = '€') {
      const tempId = createTempId();
      
      update(state => {
        let currentColor = state.color || '#85A3FA'; 
        
        if (currentColor === 'light' || currentColor === '1') {
          currentColor = '#85A3FA';
        }
      
        const newRestaurant: Restaurant = {
          id: tempId,
          name,
          slug: '', // Will be set by the server
          logo,
          customPrompt,
          phoneNumber,
          userId: '', // Will be set by the server
          currency: currency, // Use passed currency
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
          currency: currency, // Update store state currency
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

    updateRestaurantInfo(name: string, logo: string | null, customPrompt: string | null = null, slug: string | null = null, phoneNumber: number | null = null, reservas?: string | null, redes_sociales?: string | null, color: string | null = null, currency?: string | null) {
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
        currency, // Log currency
        isUrlUpdate: {
          reservasProvided: reservas !== undefined,
          redes_socialesProvided: redes_sociales !== undefined
        }
      });

      update(state => {
        const currentRestaurantIndex = state.restaurants.findIndex(r => r.id === state.selectedRestaurant);
        const currentRestaurant = currentRestaurantIndex >= 0 ? state.restaurants[currentRestaurantIndex] : null;
        
        const updatedRestaurants = [...state.restaurants];
        
        // Determine the currency to use: passed value > current restaurant value > state value > default '€'
        const finalCurrency = currency ?? currentRestaurant?.currency ?? state.currency ?? '€';

        if (currentRestaurantIndex >= 0 && currentRestaurant) {
          updatedRestaurants[currentRestaurantIndex] = {
            ...currentRestaurant,
            name: name !== undefined ? name : currentRestaurant.name,
            logo: logo !== undefined ? logo : currentRestaurant.logo,
            customPrompt: customPrompt !== undefined ? customPrompt : currentRestaurant.customPrompt,
            slug: (slug !== undefined ? slug : currentRestaurant.slug) || '', // Ensure non-null string
            phoneNumber: phoneNumber !== undefined ? phoneNumber : currentRestaurant.phoneNumber,
            reservas: reservas !== undefined ? reservas : currentRestaurant.reservas,
            redes_sociales: redes_sociales !== undefined ? redes_sociales : currentRestaurant.redes_sociales,
            color: validatedColor || currentRestaurant.color || '#85A3FA',
            currency: finalCurrency, // Update currency in the restaurants array
            updatedAt: new Date(),
          };
        }
        
        return {
          ...state,
          restaurantName: name !== undefined ? name : state.restaurantName,
          menuLogo: logo !== undefined ? logo : state.menuLogo,
          customPrompt: customPrompt !== undefined ? customPrompt : state.customPrompt,
          phoneNumber: phoneNumber !== undefined ? phoneNumber : state.phoneNumber,
          color: validatedColor || state.color || '#85A3FA',
          currency: finalCurrency, // Update top-level store currency state
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

    updateReservasAndSocials(reservas: string | null, redes_sociales: string | null) {
      console.trace('updateReservasAndSocials TRACE');
      
      console.log('updateReservasAndSocials called with:', { 
        reservas, 
        reservasType: typeof reservas, 
        redes_sociales, 
        redes_socialesType: typeof redes_sociales 
      });
      
      update(state => {
        console.log('Updating store state, before:', { 
          stateReservas: state.reservas, 
          stateRedesSociales: state.redes_sociales 
        });
        
        const currentRestaurantIndex = state.restaurants.findIndex(r => r.id === state.selectedRestaurant);
        
        const updatedRestaurants = [...state.restaurants];
        
        if (currentRestaurantIndex >= 0) {
          updatedRestaurants[currentRestaurantIndex] = {
            ...updatedRestaurants[currentRestaurantIndex],
            reservas,
            redes_sociales,
            updatedAt: new Date(),
          };
        }
        
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
        
        console.log('State after update:', { 
          resultReservas: result.reservas, 
          resultRedesSociales: result.redes_sociales,
          changedItems: result.changedItems 
        });
        
        return result;
      });
    },

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

    addCategory(name: string) {
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
        const updatedCategories = state.categories.filter(category => 
          category.id !== categoryId
        );
        
        const deletedCategories = new Set(state.changedItems.deletedCategories);
        deletedCategories.add(categoryId);
        
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

    addDish(categoryId: string, dishData: { title: string, price: string, description: string, imageUrl: string | null }) {
      const tempId = createTempId();
      
      update(state => {
        const newDish: Dish = {
          id: tempId,
          ...dishData,
          categoryId
        };
        
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
        
        const deletedDishes = new Set(state.changedItems.deletedDishes);
        deletedDishes.add(dishId);
        
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

    addUploadedCategoriesAndDishes(restaurantId: string, uploadedCategories: any[]) {
      update(state => {
        const newCategories: Category[] = [];
        const changedCategoryIds = new Set(state.changedItems.categories);
        const changedDishIds = new Set(state.changedItems.dishes);

        uploadedCategories.forEach(uploadedCategory => {
          const categoryTempId = createTempId();
          const newDishes: Dish[] = [];

          (uploadedCategory.dishes || []).forEach((uploadedDish: any) => {
            const dishTempId = createTempId();
            newDishes.push({
              id: dishTempId,
              title: uploadedDish.title || 'Untitled Dish',
              description: uploadedDish.description || '',
              price: uploadedDish.price?.toString() || '0',
              imageUrl: uploadedDish.imageUrl || null,
              categoryId: categoryTempId // Link to the new category temp ID
            });
            changedDishIds.add(dishTempId); // Mark dish as changed
          });

          newCategories.push({
            id: categoryTempId,
            name: uploadedCategory.name || 'Untitled Category',
            restaurantId: restaurantId, 
            dishes: newDishes
          });
          changedCategoryIds.add(categoryTempId); // Mark category as changed
        });

        console.log(`Menu Store: Added ${newCategories.length} uploaded categories and their dishes.`);

        return {
          ...state,
          categories: [...state.categories, ...newCategories],
          changedItems: {
            ...state.changedItems,
            categories: changedCategoryIds,
            dishes: changedDishIds
          }
        };
      });
    },

    async saveChanges() {
      const state = get({ subscribe });
      
      // Capture the frontend order before saving
      const frontendCategoryOrder = state.categories.map(c => c.id);
      
      try {
        update(s => ({ ...s, isSaving: true }));
        
        const currentRestaurantObj = state.restaurants.find(r => r.id === state.selectedRestaurant);
        console.log('Current restaurant in store:', currentRestaurantObj);
        
        const colorValue = state.color === 'light' || state.color === '1'
          ? '#85A3FA'
          : state.color;
        
        const reservas = state.reservas !== undefined ? state.reservas : currentRestaurantObj?.reservas;
        const redes_sociales = state.redes_sociales !== undefined ? state.redes_sociales : currentRestaurantObj?.redes_sociales;
        
        console.log('Restaurant data for save:', {
          name: state.restaurantName,
          logo: state.menuLogo,
          customPrompt: state.customPrompt,
          phoneNumber: state.phoneNumber,
          currency: state.currency || '€',
          color: colorValue,
          reservas,
          redes_sociales
        });
        
        const result = await menuService.saveMenuChanges(
          {
            name: state.restaurantName,
            logo: state.menuLogo,
            customPrompt: state.customPrompt,
            phoneNumber: state.phoneNumber,
            currency: state.currency || '€',
            color: colorValue,
            reservas,
            redes_sociales,
          },
          state.selectedRestaurant
        );
        
        update(s => {
          // Re-sort the categories returned from the backend based on the frontend order
          const orderMap = new Map(frontendCategoryOrder.map((id, index) => [id, index]));
          const reorderedCategories = [...result.categories].sort((a, b) => {
            const orderA = orderMap.get(a.id);
            const orderB = orderMap.get(b.id);
            
            // Handle potential new categories not present before save
            if (orderA === undefined && orderB === undefined) return 0; 
            if (orderA === undefined) return 1; 
            if (orderB === undefined) return -1; 

            return orderA - orderB;
          });

          const restaurantIndex = s.restaurants.findIndex(r => r.id === result.restaurant.id);
          const restaurants = [...s.restaurants];
          
          if (restaurantIndex >= 0) {
            restaurants[restaurantIndex] = {
              ...result.restaurant,
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
            categories: reorderedCategories, // Use the re-sorted categories
            isSaving: false,
            lastSaveTime: new Date(),
            changedItems: {
              restaurant: false,
              categories: new Set<string>(),
              dishes: new Set<string>(),
              deletedCategories: new Set<string>(),
              deletedDishes: new Set<string>()
            },
            reservas: result.restaurant.reservas ?? s.reservas,
            redes_sociales: result.restaurant.redes_sociales ?? s.redes_sociales,
            color: result.restaurant.color || '#85A3FA',
            currency: result.restaurant.currency || '€'
          };
        });
        
        return result;
      } catch (error) {
        console.error('Error saving changes:', error);
        update(s => ({ ...s, isSaving: false }));
        throw error;
      }
    },
    //To check later
    reorderCategories(newOrderCategories: Category[]) {
      update(state => {
        if (!state.selectedRestaurant) return state;
        
        const oldOrderIds = state.categories.map(c => c.id);
        const newOrderIds = newOrderCategories.map(c => c.id);
        const orderChanged = JSON.stringify(oldOrderIds) !== JSON.stringify(newOrderIds);

        if (orderChanged) {
          return {
            ...state,
            categories: newOrderCategories,
            changedItems: {
              ...state.changedItems,
              restaurant: true // Mark restaurant as changed because category order affects it
            }
          };
        } else {
          return state; // No changes if order is the same
        }
      });
    }
  };
}

export const menuStore = createMenuStore(); 