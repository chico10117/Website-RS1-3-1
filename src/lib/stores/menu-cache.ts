import { writable, get } from 'svelte/store';
import type { Restaurant, Category, Dish } from '$lib/types/menu.types';

export type CacheAction = 'create' | 'update' | 'delete';

export interface CacheChange<T> {
  action: CacheAction;
  data: T;
}

export interface MenuCache {
  restaurant: Restaurant | null;
  categories: Record<string, CacheChange<Category>>;
  dishes: Record<string, CacheChange<Dish>>;
  hasUnsavedChanges: boolean;
}

function createMenuCache() {
  const { subscribe, set, update } = writable<MenuCache>({
    restaurant: null,
    categories: {},
    dishes: {},
    hasUnsavedChanges: false
  });

  return {
    subscribe,
    clearCache() {
      set({
        restaurant: null,
        categories: {},
        dishes: {},
        hasUnsavedChanges: false
      });
    },
    updateRestaurant(restaurant: Restaurant) {
      update(cache => {
        // If we already have this restaurant in cache, update it
        if (cache.restaurant?.id === restaurant.id) {
          return {
            ...cache,
            restaurant: {
              ...cache.restaurant,
              ...restaurant
            },
            hasUnsavedChanges: true
          };
        }
        // Otherwise set it as new
        return {
          ...cache,
          restaurant,
          hasUnsavedChanges: true
        };
      });
    },
    updateCategory: (id: string, action: CacheAction, data: Category) => {
      update(cache => {
        cache.categories[id] = { action, data };
        cache.hasUnsavedChanges = true;
        return cache;
      });
    },
    updateDish: (id: string, action: CacheAction, data: Dish) => {
      update(cache => {
        cache.dishes[id] = { action, data };
        cache.hasUnsavedChanges = true;
        return cache;
      });
    }
  };
}

export const menuCache = createMenuCache(); 