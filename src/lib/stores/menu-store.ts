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
    }
  }
  
  async function loadAndMergeData(restaurantId: string) {
    try {
      const restaurant = await restaurantService.fetchRestaurantById(restaurantId);
      
      const fetchedCategories = await categoryService.fetchCategories(restaurantId);
      
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
        const restaurants = await restaurantService.fetchRestaurants();
        update(state => ({ ...state, restaurants }));
        return restaurants;
      } catch (error) {
        console.error('Error loading restaurants:', error);
        throw error;
      }
    },

    async selectRestaurant(restaurantId: string) {
      if (!restaurantId) {
        console.error('No restaurant ID provided to selectRestaurant');
        throw new Error('No restaurant ID provided');
      }
      
      try {
        const currentState = get({ subscribe });
        
        if (currentState.selectedRestaurant === restaurantId) {
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
        currency,
        isUrlUpdate: {
          reservasProvided: reservas !== undefined,
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
      update(state => {
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
        
        return {
          ...state,
          reservas,
          redes_sociales,
          restaurants: updatedRestaurants,
          changedItems: {
            ...state.changedItems,
            restaurant: true
          }
        };
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
      if (!state.restaurantName && !state.selectedRestaurant) {
        throw new Error("Cannot save without a restaurant name or a selected restaurant.");
      }

      update(s => ({ ...s, isSaving: true }));

      try {
        const restaurantPayload = {
          id: state.selectedRestaurant || undefined, // Will be temp_ or actual ID
          name: state.restaurantName,
          logo: state.menuLogo,
          customPrompt: state.customPrompt,
          phoneNumber: state.phoneNumber,
          currency: state.currency || '€',
          color: (state.color === 'light' || state.color === '1') ? '#85A3FA' : state.color,
          reservas: state.reservas,
          redes_sociales: state.redes_sociales,
          slug: state.restaurants.find(r => r.id === state.selectedRestaurant)?.slug // Pass current slug if available
        };

        const categoriesPayload = state.categories.map((cat, catIndex) => ({
          id: cat.id, // temp_ or actual ID
          name: cat.name,
          order: (cat as any).order !== undefined ? (cat as any).order : catIndex, // Ensure order is passed
          dishes: (cat.dishes || []).map((dish, dishIndex) => ({
            id: dish.id, // temp_ or actual ID
            title: dish.title,
            description: dish.description,
            price: dish.price,
            imageUrl: dish.imageUrl,
            order: (dish as any).order !== undefined ? (dish as any).order : dishIndex, // Ensure order is passed
          })),
        }));

        const bulkPayload = {
          restaurant: restaurantPayload,
          categories: categoriesPayload,
          deletedCategoryIds: Array.from(state.changedItems.deletedCategories),
          deletedDishIds: Array.from(state.changedItems.deletedDishes),
          orderedCategoryIds: state.categories.map(c => c.id), // Send current order of all categories
        };
        
        // Call the new bulk save method
        const result = await menuService.saveMenuBulk(bulkPayload);

        // The result structure is now:
        // { 
        //   ...finalRestaurant, 
        //   categories: categoriesWithDishes 
        // }

        // Create a Restaurant object without the nested categories for the array
        const restaurantForArray = { ...result };
        // @ts-ignore // categories is part of the result type, but not strictly Restaurant type
        delete restaurantForArray.categories;

        update(s => {
          const updatedRestaurantsArray = s.restaurants.filter(r => !r.id.startsWith('temp_'));
          const existingIndex = updatedRestaurantsArray.findIndex(r => r.id === result.id);

          if (existingIndex > -1) {
            updatedRestaurantsArray[existingIndex] = restaurantForArray;
          } else {
            updatedRestaurantsArray.push(restaurantForArray);
          }

          return {
            ...s,
            restaurants: updatedRestaurantsArray,
            selectedRestaurant: result.id,
            restaurantName: result.name,
            menuLogo: result.logo,
            customPrompt: result.customPrompt,
            phoneNumber: result.phoneNumber,
            categories: result.categories || [], // these include dishes
            color: result.color || '#85A3FA',
            currency: result.currency || '€',
            reservas: result.reservas,
            redes_sociales: result.redes_sociales,
            isSaving: false,
            lastSaveTime: new Date(),
            changedItems: { // Reset changes
              restaurant: false,
              categories: new Set<string>(),
              dishes: new Set<string>(),
              deletedCategories: new Set<string>(),
              deletedDishes: new Set<string>()
            }
          };
        });

        // Now return the result in the expected format for SaveButton
        return {
          restaurant: restaurantForArray
        };
      } catch (error) {
        console.error('Error saving changes in menuStore:', error);
        update(s => ({ ...s, isSaving: false }));
        throw error; // Re-throw to be caught by UI
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
    },
    reorderDishes(categoryId: string, reorderedDishes: Dish[]) {
      update(state => {
        const categories = state.categories.map(category => {
          if (category.id === categoryId) {
            // Update the order property on each dish and ensure dishes array exists
            const updatedDishes = (reorderedDishes || []).map((dish, index) => ({
              ...dish,
              order: index // Set the order based on the new array index
            }));
            return { ...category, dishes: updatedDishes };
          }
          return category;
        });

        // Mark the category as changed because its dish order changed.
        const changedCategories = new Set(state.changedItems.categories);
        changedCategories.add(categoryId);

        return {
          ...state,
          categories,
          changedItems: {
            ...state.changedItems,
            categories: changedCategories
          }
        };
      });
    },
  };
}

export const menuStore = createMenuStore();