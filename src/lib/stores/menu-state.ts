import { writable, derived, get } from 'svelte/store';
import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
import * as restaurantService from '$lib/services/restaurant.service';
import * as categoryService from '$lib/services/category.service';
import * as dishService from '$lib/services/dish.service';

export interface MenuState {
  restaurants: Restaurant[];
  selectedRestaurant: string | null;
  restaurantName: string;
  menuLogo: string;
  categories: Category[];
  isSaving: boolean;
}

function createMenuState() {
  const { subscribe, set, update } = writable<MenuState>({
    restaurants: [],
    selectedRestaurant: null,
    restaurantName: '',
    menuLogo: '',
    categories: [],
    isSaving: false
  });

  // Derived store for the current restaurant
  const currentRestaurant = derived({ subscribe }, $state => 
    $state.restaurants.find(r => r.id === $state.selectedRestaurant)
  );

  return {
    subscribe,
    
    // Load initial data
    async loadRestaurants() {
      try {
        const restaurants = await restaurantService.fetchRestaurants();
        update(state => ({ ...state, restaurants }));
      } catch (error) {
        console.error('Error loading restaurants:', error);
        throw error;
      }
    },

    // Restaurant actions
    async selectRestaurant(restaurantId: string) {
      try {
        update(state => ({ ...state, selectedRestaurant: restaurantId }));
        
        const restaurant = get(currentRestaurant);
        if (restaurant) {
          update(state => ({
            ...state,
            restaurantName: restaurant.name,
            menuLogo: restaurant.logo || ''
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

    updateRestaurantInfo(name: string, logo: string) {
      update(state => ({
        ...state,
        restaurantName: name,
        menuLogo: logo
      }));
    },

    // Category actions
    updateCategories(newCategories: Category[]) {
      update(state => ({ ...state, categories: newCategories }));
    },

    // Save state management
    setSaving(isSaving: boolean) {
      update(state => ({ ...state, isSaving }));
    },

    // Update state after save
    updateAfterSave(result: { restaurant: Restaurant; categories: Category[]; dishes: Dish[] }) {
      update(state => {
        // Update restaurants list
        const restaurantIndex = state.restaurants.findIndex(r => r.id === result.restaurant.id);
        const restaurants = [...state.restaurants];
        if (restaurantIndex >= 0) {
          restaurants[restaurantIndex] = result.restaurant;
        } else {
          restaurants.push(result.restaurant);
        }

        // Update categories with their dishes
        const categories = result.categories.map(category => {
          const dishes = result.dishes.filter(dish => dish.categoryId === category.id);
          return { ...category, dishes };
        });

        return {
          ...state,
          restaurants,
          selectedRestaurant: result.restaurant.id,
          restaurantName: result.restaurant.name,
          menuLogo: result.restaurant.logo || '',
          categories
        };
      });
    }
  };
}

export const menuState = createMenuState(); 