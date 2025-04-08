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
      dishes: category.dishes || [] 
    });
  });
  
  const currentCategoriesMap = new Map<string, Category>();
  currentCategories.forEach(category => {
    if (!deletedCategoryIds.has(category.id)) {
      currentCategoriesMap.set(category.id, { 
        ...category,
        dishes: category.dishes || [] 
      });
    }
  });
  
  const mergedCategories: Category[] = [];
  
  dbCategoriesMap.forEach((dbCategory, dbCategoryId) => {
    if (!deletedCategoryIds.has(dbCategoryId)) {
      const currentCategory = currentCategoriesMap.get(dbCategoryId);
      if (currentCategory && changedCategoryIds.has(dbCategoryId)) {
        mergedCategories.push({
           ...currentCategory,
           dishes: (currentCategory.dishes || []).map(dish => {
               if(changedDishIds.has(dish.id)) {
                  const updatedDish = (currentCategory.dishes || []).find(d => d.id === dish.id);
                  return updatedDish || dish;
               }
               return dish;
           }).filter(dish => !deletedDishIds.has(dish.id))
        });
      } else {
        const mergedCategory = { 
          ...dbCategory,
          dishes: (dbCategory.dishes || []).map(dish => {
            if (changedDishIds.has(dish.id)) {
              const correspondingCurrentCategory = currentCategoriesMap.get(dbCategoryId);
              const currentDish = (correspondingCurrentCategory?.dishes || []).find(d => d.id === dish.id);
              return currentDish || dish;
            }
            return dish;
          }).filter(dish => !deletedDishIds.has(dish.id))
        };
        mergedCategories.push(mergedCategory);
      }
    }
  });
  
  currentCategoriesMap.forEach((category, categoryId) => {
    if (categoryId.startsWith('temp_')) {
      mergedCategories.push({ 
         ...category,
         dishes: (category.dishes || []).filter(dish => !deletedDishIds.has(dish.id))
      });
    }
  });
  
  return mergedCategories.map(cat => ({ ...cat, dishes: cat.dishes || [] }));
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
        color: state.color,
        currency: state.currency,
        reservas: state.reservas,
        redes_sociales: state.redes_sociales,
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
              dishes: dishes || []
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
      
      let categoriesToMerge = categoriesWithDishes.map(cat => ({ ...cat, dishes: cat.dishes || [] }));

      let finalCategories: Category[] = categoriesToMerge;
      let changedItems = {
        restaurant: false,
        categories: new Set<string>(),
        dishes: new Set<string>(),
        deletedCategories: new Set<string>(),
        deletedDishes: new Set<string>()
      };
      
      if (restaurantStates.has(restaurantId)) {
        const savedState = restaurantStates.get(restaurantId);
        console.log('Found saved state for restaurant:', restaurantId, savedState);
        
        finalCategories = mergeWithUnsavedChanges(
          categoriesToMerge,
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

        if (savedState.changedItems.restaurant) {
            restaurant.name = savedState.restaurantName ?? restaurant.name;
            restaurant.logo = savedState.menuLogo ?? restaurant.logo;
            restaurant.customPrompt = savedState.customPrompt ?? restaurant.customPrompt;
            restaurant.phoneNumber = savedState.phoneNumber ?? restaurant.phoneNumber;
            restaurant.color = savedState.color ?? restaurant.color;
            restaurant.currency = savedState.currency ?? restaurant.currency;
            restaurant.reservas = savedState.reservas ?? restaurant.reservas;
            restaurant.redes_sociales = savedState.redes_sociales ?? restaurant.redes_sociales;
        }
        
        console.log('Merged categories:', finalCategories);
      }
      
      finalCategories = finalCategories.map(category => ({ 
        ...category, 
        dishes: (category.dishes || []).map(dish => ({...dish}))
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
    update,
    hasUnsavedChanges,
    
    reset() {
      set(initialState);
      restaurantStates.clear();
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
      if (get({ subscribe }).selectedRestaurant) {
          restaurantStates.delete(get({ subscribe }).selectedRestaurant);
      }
    },

    async loadRestaurants() {
      try {
        console.log('Loading restaurants from menuStore...');
        update(s => ({ ...s, isLoading: true }));
        const restaurants = await restaurantService.fetchRestaurants();
        console.log('Loaded restaurants:', restaurants);
        update(state => ({ ...state, restaurants, isLoading: false }));
        return restaurants;
      } catch (error) {
        console.error('Error loading restaurants:', error);
        update(s => ({ ...s, isLoading: false }));
        throw error;
      }
    },

    async selectRestaurant(restaurantId: string) {
      console.log('selectRestaurant called with ID:', restaurantId);
      
      if (!restaurantId) {
        console.error('No restaurant ID provided to selectRestaurant');
        throw new Error('No restaurant ID provided');
      }
      
      const currentState = get({ subscribe });
      
      if (currentState.selectedRestaurant === restaurantId) {
        console.log('Already on this restaurant, no need to reload');
        return currentState.restaurants.find(r => r.id === restaurantId) || null;
      }
        
      if (currentState.selectedRestaurant) {
          saveCurrentState(); 
      }
      
      update(s => ({ ...s, isLoading: true }));
      
      try {
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
            categories: categories.map(cat => ({ ...cat, dishes: cat.dishes || [] })),
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
      
      const currentState = get({ subscribe });
      if (currentState.selectedRestaurant) {
          saveCurrentState();
      }

      update(state => {
        let currentColor = state.color || '#85A3FA'; 
        
        if (currentColor === 'light' || currentColor === '1') {
          currentColor = '#85A3FA';
        }
      
        const newRestaurant: Restaurant = {
          id: tempId,
          name,
          slug: '',
          logo,
          customPrompt,
          phoneNumber,
          userId: '',
          currency: currency,
          color: currentColor,
          createdAt: new Date(),
          updatedAt: new Date(),
          reservas,
          redes_sociales,
          categories: [],
        };
        
        return {
          ...state,
          restaurants: [...state.restaurants, newRestaurant],
          selectedRestaurant: tempId,
          restaurantName: name,
          menuLogo: logo,
          customPrompt,
          phoneNumber,
          categories: [],
          currency: currency,
          color: currentColor,
          reservas,
          redes_sociales,
          changedItems: {
            restaurant: true,
            categories: new Set<string>(),
            dishes: new Set<string>(),
            deletedCategories: new Set<string>(),
            deletedDishes: new Set<string>()
          },
          isLoading: false,
          lastSaveTime: null
        };
      });
    },

    updateRestaurantInfo(name: string, logo: string | null, customPrompt: string | null = null, slug: string | null = null, phoneNumber: number | null = null, reservas?: string | null, redes_sociales?: string | null, color: string | null = null, currency?: string | null) {
      let validatedColor = color;
      if (validatedColor && typeof validatedColor === 'string') {
        if (!validatedColor.startsWith('#') && validatedColor !== 'light' && validatedColor !== '1') {
           console.warn('Invalid color format provided to updateRestaurantInfo:', validatedColor);
           validatedColor = null;
        }
      }

      console.log('updateRestaurantInfo called with:', { name, logo, customPrompt, slug, phoneNumber, reservas, redes_sociales, color: validatedColor, currency });

      update(state => {
        if (!state.selectedRestaurant) return state;

        const currentRestaurantIndex = state.restaurants.findIndex(r => r.id === state.selectedRestaurant);
        const currentRestaurant = currentRestaurantIndex >= 0 ? state.restaurants[currentRestaurantIndex] : null;
        
        const updatedRestaurants = [...state.restaurants];
        
        const finalCurrency = currency ?? currentRestaurant?.currency ?? state.currency ?? '€';
        const finalColor = validatedColor ?? currentRestaurant?.color ?? state.color ?? '#85A3FA';

        if (currentRestaurantIndex >= 0 && currentRestaurant) {
          updatedRestaurants[currentRestaurantIndex] = {
            ...currentRestaurant,
            name: name !== undefined ? name : currentRestaurant.name,
            logo: logo !== undefined ? logo : currentRestaurant.logo,
            customPrompt: customPrompt !== undefined ? customPrompt : currentRestaurant.customPrompt,
            slug: (slug !== null ? slug : currentRestaurant.slug) || '',
            phoneNumber: phoneNumber !== undefined ? phoneNumber : currentRestaurant.phoneNumber,
            reservas: reservas !== undefined ? reservas : currentRestaurant.reservas,
            redes_sociales: redes_sociales !== undefined ? redes_sociales : currentRestaurant.redes_sociales,
            color: finalColor,
            currency: finalCurrency,
            updatedAt: new Date(),
          };
        }
        
        return {
          ...state,
          restaurantName: name !== undefined ? name : state.restaurantName,
          menuLogo: logo !== undefined ? logo : state.menuLogo,
          customPrompt: customPrompt !== undefined ? customPrompt : state.customPrompt,
          phoneNumber: phoneNumber !== undefined ? phoneNumber : state.phoneNumber,
          color: finalColor,
          currency: finalCurrency,
          reservas: reservas !== undefined ? reservas : state.reservas,
          redes_sociales: redes_sociales !== undefined ? redes_sociales : state.redes_sociales,
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
      console.log('updateReservasAndSocials called with:', { reservas, redes_sociales });
      
      update(state => {
        if (!state.selectedRestaurant) return state;
        console.log('Updating store state (reservas/socials), before:', { stateReservas: state.reservas, stateRedesSociales: state.redes_sociales });
        
        const currentRestaurantIndex = state.restaurants.findIndex(r => r.id === state.selectedRestaurant);
        const updatedRestaurants = [...state.restaurants];
        
        if (currentRestaurantIndex >= 0) {
          updatedRestaurants[currentRestaurantIndex] = {
            ...updatedRestaurants[currentRestaurantIndex],
            reservas: reservas,
            redes_sociales: redes_sociales,
            updatedAt: new Date(),
          };
        }
        
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
        console.log('State after update (reservas/socials):', { resultReservas: result.reservas, resultRedesSociales: result.redes_sociales });
        return result;
      });
    },

    updateLocalRestaurantName(name: string) {
      update(state => {
        if (!state.selectedRestaurant) return state;
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
        if (!state.selectedRestaurant) return state;

        const newCategory: Category = {
          id: tempId,
          name: name.trim(),
          restaurantId: state.selectedRestaurant,
          dishes: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const nameExists = state.categories.some(cat => cat.name.toLowerCase() === newCategory.name.toLowerCase());
        if (nameExists) {
            console.warn(`Category with name "${newCategory.name}" already exists.`);
            return state; 
        }

        return {
          ...state,
          categories: [...state.categories, newCategory],
          changedItems: {
            ...state.changedItems,
            categories: new Set([...state.changedItems.categories, tempId])
          }
        };
      });

      return tempId;
    },
    
    updateCategory(categoryId: string, name: string) {
       const trimmedName = name.trim();
       if (!trimmedName) {
           console.warn('Category name cannot be empty.');
           return;
       }

      update(state => {
        if (!state.selectedRestaurant) return state;

        const nameConflict = state.categories.some(cat => 
            cat.id !== categoryId && 
            cat.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (nameConflict) {
            console.warn(`Another category with the name "${trimmedName}" already exists. Cannot update.`);
            return state;
        }

        const updatedCategories = state.categories.map(category => 
          category.id === categoryId ? { ...category, name: trimmedName, updatedAt: new Date() } : category
        );
        
        const deletedCategories = new Set(state.changedItems.deletedCategories);
        deletedCategories.delete(categoryId);

        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            categories: new Set([...state.changedItems.categories, categoryId]),
            deletedCategories
          }
        };
      });
    },
    
    deleteCategory(categoryId: string) {
      update(state => {
        if (!state.selectedRestaurant) return state;

        const categoryToDelete = state.categories.find(cat => cat.id === categoryId);
        if (!categoryToDelete) return state;

        const updatedCategories = state.categories.filter(category => 
          category.id !== categoryId
        );
        
        const deletedCategories = new Set(state.changedItems.deletedCategories);
        if (!categoryId.startsWith('temp_')) {
             deletedCategories.add(categoryId);
        }
        
        const changedCategories = new Set(state.changedItems.categories);
        changedCategories.delete(categoryId);
        
        const deletedDishes = new Set(state.changedItems.deletedDishes);
        const changedDishes = new Set(state.changedItems.dishes);
        if (categoryToDelete.dishes) {
            categoryToDelete.dishes.forEach(dish => {
                if (!dish.id.startsWith('temp_')) {
                    deletedDishes.add(dish.id);
                }
                changedDishes.delete(dish.id);
            });
        }

        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            categories: changedCategories,
            deletedCategories,
            dishes: changedDishes,
            deletedDishes
          }
        };
      });
    },

    addDish(categoryId: string, dishData: { title: string, price: string, description: string | null, imageUrl: string | null }) {
      const tempId = createTempId();
      const trimmedTitle = dishData.title.trim();
      if (!trimmedTitle) {
          console.warn('Dish title cannot be empty.');
          return;
      }

      update(state => {
        if (!state.selectedRestaurant) return state;
        const categoryIndex = state.categories.findIndex(cat => cat.id === categoryId);
        if (categoryIndex === -1) return state;

        const newDish: Dish = {
          id: tempId,
          title: trimmedTitle,
          price: dishData.price,
          description: dishData.description?.trim() ?? null,
          imageUrl: dishData.imageUrl,
          categoryId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const updatedCategories = [...state.categories];
        const targetCategory = { ...updatedCategories[categoryIndex] };
        targetCategory.dishes = [...(targetCategory.dishes || []), newDish];
        updatedCategories[categoryIndex] = targetCategory;
        
        const deletedCategories = new Set(state.changedItems.deletedCategories);
        deletedCategories.delete(categoryId);
        const changedCategories = new Set([...state.changedItems.categories, categoryId]);

        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            categories: changedCategories,
            deletedCategories,
            dishes: new Set([...state.changedItems.dishes, tempId])
          }
        };
      });
    },
    
    updateDish(dishId: string, dishData: { title?: string, price?: string, description?: string | null, imageUrl?: string | null }) {
      const updatePayload: Partial<Dish> = {};
      if (dishData.title !== undefined) updatePayload.title = dishData.title.trim();
      if (dishData.price !== undefined) updatePayload.price = dishData.price;
      if (dishData.description !== undefined) updatePayload.description = dishData.description?.trim() ?? null;
      if (dishData.imageUrl !== undefined) updatePayload.imageUrl = dishData.imageUrl;

      if (updatePayload.title === '') return;
      if (Object.keys(updatePayload).length === 0) return;

      updatePayload.updatedAt = new Date();

      update(state => {
        if (!state.selectedRestaurant) return state;
        let categoryIdContainingDish: string | null = null;

        const updatedCategories = state.categories.map(category => {
          const currentDishes = category.dishes || [];
          const dishIndex = currentDishes.findIndex(dish => dish.id === dishId);
          if (dishIndex === -1) return category;
          
          categoryIdContainingDish = category.id;
          const updatedDishes = [...currentDishes];
          updatedDishes[dishIndex] = {
            ...updatedDishes[dishIndex],
            ...updatePayload
          };
          
          return { ...category, dishes: updatedDishes };
        });
        
        if (!categoryIdContainingDish) return state;

        const deletedDishes = new Set(state.changedItems.deletedDishes);
        deletedDishes.delete(dishId);
        const deletedCategories = new Set(state.changedItems.deletedCategories);
        deletedCategories.delete(categoryIdContainingDish);
        const changedCategories = new Set([...state.changedItems.categories, categoryIdContainingDish]);

        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            categories: changedCategories,
            deletedCategories,
            dishes: new Set([...state.changedItems.dishes, dishId]),
            deletedDishes
          }
        };
      });
    },
    
    deleteDish(dishId: string) {
      update(state => {
        if (!state.selectedRestaurant) return state;
        let categoryIdContainingDish: string | null = null;

        const updatedCategories = state.categories.map(category => {
          const currentDishes = category.dishes || [];
          const updatedDishes = currentDishes.filter(dish => dish.id !== dishId);

          if (updatedDishes.length < currentDishes.length) {
              categoryIdContainingDish = category.id;
              return { ...category, dishes: updatedDishes };
          }
          return category;
        });
        
        if (!categoryIdContainingDish) return state;

        const deletedDishes = new Set(state.changedItems.deletedDishes);
        if (!dishId.startsWith('temp_')) {
            deletedDishes.add(dishId);
        }
        
        const changedDishes = new Set(state.changedItems.dishes);
        changedDishes.delete(dishId);
        
        const changedCategories = new Set([...state.changedItems.categories, categoryIdContainingDish]);

        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            categories: changedCategories,
            dishes: changedDishes,
            deletedDishes
          }
        };
      });
    },
  };
}

export const menuStore = createMenuStore(); 