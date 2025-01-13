import { writable } from 'svelte/store';
import type { Restaurant, Category, Dish } from '$lib/types/menu.types';

export type CacheAction = 'create' | 'update' | 'delete';

export interface CacheChange<T> {
  action: CacheAction;
  data: T;
}

export interface MenuCache {
  categories: Record<string, CacheChange<Category>>;
  dishes: Record<string, CacheChange<Dish>>;
  hasUnsavedChanges: boolean;
}

function createMenuCache() {
  const { subscribe, set, update } = writable<MenuCache>({
    categories: {},
    dishes: {},
    hasUnsavedChanges: false
  });

  return {
    subscribe,
    updateRestaurant: (restaurant: Restaurant) => {
      update(cache => {
        cache.hasUnsavedChanges = true;
        return cache;
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
    },
    clearCache: () => {
      set({
        categories: {},
        dishes: {},
        hasUnsavedChanges: false
      });
    }
  };
}

export const menuCache = createMenuCache(); 