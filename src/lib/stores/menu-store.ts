import { writable, derived, get } from 'svelte/store';
import type { MenuStore, MenuStoreActions } from './types';
import * as restaurantActions from './actions/restaurant';
import * as categoryActions from './actions/category';
import * as dishActions from './actions/dish';

const restaurantStates = new Map();

function createMenuStore(): MenuStoreActions {
  const initialState: MenuStore = {
    restaurants: [],
    selectedRestaurant: null,
    restaurantName: '',
    menuLogo: null,
    customPrompt: null,
    phoneNumber: null,
    currency: '€',
    categories: [],
    color: '1',
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

  return {
    subscribe,
    
    reset: () => set(initialState),
    
    resetChanges: () => update(state => ({
      ...state,
      changedItems: {
        restaurant: false,
        categories: new Set<string>(),
        dishes: new Set<string>(),
        deletedCategories: new Set<string>(),
        deletedDishes: new Set<string>()
      },
      lastSaveTime: new Date()
    })),

    loadRestaurants: async () => {
      const restaurants = await restaurantActions.loadRestaurants(get({ subscribe }));
      update(state => ({ ...state, restaurants }));
      return restaurants;
    },

    selectRestaurant: async (restaurantId: string) => {
      update(s => ({ ...s, isLoading: true }));
      
      try {
        saveCurrentState();
        const result = await restaurantActions.selectRestaurant(get({ subscribe }), restaurantId);
        update(s => result);
        return result.restaurants.find(r => r.id === restaurantId)!;
      } catch (error) {
        update(s => ({ ...s, isLoading: false }));
        throw error;
      }
    },

    createRestaurant: (name: string, logo: string | null = null, customPrompt: string | null = null, phoneNumber: number | null = null, reservas: string | null = null, redes_sociales: string | null = null, currency: string = '€') => {
      update(state => restaurantActions.createRestaurant(state, name, logo, customPrompt, phoneNumber, reservas, redes_sociales, currency));
    },

    updateRestaurantInfo: (name: string, logo: string | null, customPrompt: string | null = null, slug: string | null = null, phoneNumber: number | null = null, reservas?: string | null, redes_sociales?: string | null, color: string | null = null, currency?: string | null) => {
      update(state => restaurantActions.updateRestaurantInfo(state, name, logo, customPrompt, slug, phoneNumber, reservas, redes_sociales, color, currency));
    },

    addCategory: (name: string) => {
      let tempId = '';
      update(state => {
        const result = categoryActions.addCategory(state, name);
        tempId = result.tempId;
        return result.state;
      });
      return tempId;
    },

    updateCategory: (categoryId: string, name: string) => {
      update(state => categoryActions.updateCategory(state, categoryId, name));
    },

    deleteCategory: (categoryId: string) => {
      update(state => categoryActions.deleteCategory(state, categoryId));
    },

    addDish: (categoryId: string, dishData: { title: string, price: string, description: string, imageUrl: string | null }) => {
      update(state => dishActions.addDish(state, categoryId, dishData));
    },

    updateDish: (dishId: string, dishData: { title?: string, price?: string, description?: string, imageUrl?: string | null }) => {
      update(state => dishActions.updateDish(state, dishId, dishData));
    },

    deleteDish: (dishId: string) => {
      update(state => dishActions.deleteDish(state, dishId));
    },

    saveChanges: async () => {
      update(s => ({ ...s, isSaving: true }));
      
      try {
        const result = await restaurantActions.saveChanges(get({ subscribe }));
        
        update(s => ({
          ...s,
          restaurants: s.restaurants.map(r => 
            r.id === result.restaurant.id ? result.restaurant : r
          ),
          selectedRestaurant: result.restaurant.id,
          restaurantName: result.restaurant.name,
          menuLogo: result.restaurant.logo,
          customPrompt: result.restaurant.customPrompt,
          phoneNumber: result.restaurant.phoneNumber,
          color: result.restaurant.color,
          currency: result.restaurant.currency,
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
          reservas: result.restaurant.reservas ?? s.reservas,
          redes_sociales: result.restaurant.redes_sociales ?? s.redes_sociales,
        }));
        
        return result;
      } catch (error) {
        update(s => ({ ...s, isSaving: false }));
        throw error;
      }
    }
  };
}

const menuStore = createMenuStore();
export { menuStore }; 