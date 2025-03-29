import { writable, derived, get } from 'svelte/store';
import type { MenuStore } from './types';
import * as restaurantActions from './actions/restaurant';
import * as categoryActions from './actions/category';
import * as dishActions from './actions/dish';

function createMenuStore() {
  const initialState: MenuStore = {
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

  return {
    subscribe,
    hasUnsavedChanges,
    
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
        const result = await restaurantActions.selectRestaurant(get({ subscribe }), restaurantId);
        update(s => result);
        return result.restaurant;
      } catch (error) {
        update(s => ({ ...s, isLoading: false }));
        throw error;
      }
    },

    createRestaurant: (name: string, logo: string | null = null, customPrompt: string | null = null, phoneNumber: number | null = null, reservas: string | null = null, redes_sociales: string | null = null) => {
      update(state => restaurantActions.createRestaurant(state, name, logo, customPrompt, phoneNumber, reservas, redes_sociales));
    },

    updateRestaurantInfo: (name: string, logo: string | null, customPrompt: string | null = null, slug: string | null = null, phoneNumber: number | null = null, reservas?: string | null, redes_sociales?: string | null, color: string | null = null) => {
      update(state => restaurantActions.updateRestaurantInfo(state, name, logo, customPrompt, slug, phoneNumber, reservas, redes_sociales, color));
    },

    updateReservasAndSocials: (reservas: string | null, redes_sociales: string | null) => {
      update(state => {
        console.log('Updating reservas and socials in store:', { reservas, redes_sociales });
        
        const currentState = get({ subscribe });
        const name = currentState.restaurantName;
        const logo = currentState.menuLogo;
        const customPrompt = currentState.customPrompt;
        const phoneNumber = currentState.phoneNumber;
        const color = currentState.color;
        
        return restaurantActions.updateRestaurantInfo(
          state,
          name,
          logo,
          customPrompt,
          null,
          phoneNumber,
          reservas,
          redes_sociales,
          color
        );
      });
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

export const menuStore = createMenuStore();
export type { MenuStore, MenuStoreActions } from './types'; 