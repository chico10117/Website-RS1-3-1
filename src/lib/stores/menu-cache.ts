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
        // Always update if we have a restaurant with an ID
        if (restaurant.id) {
          return {
            ...cache,
            restaurant: {
              ...restaurant,
              // Preserve any fields from cache that aren't in the update
              ...(cache.restaurant && { 
                createdAt: cache.restaurant.createdAt,
                updatedAt: cache.restaurant.updatedAt,
                userId: cache.restaurant.userId,
                // Only keep slug if not provided in update
                ...(restaurant.slug === undefined && { slug: cache.restaurant.slug })
              })
            },
            hasUnsavedChanges: true
          };
        }
        
        // For new restaurants (no ID), only set if cache is empty
        if (!cache.restaurant) {
          return {
            ...cache,
            restaurant,
            hasUnsavedChanges: true
          };
        }

        // If we have a restaurant in cache but no ID in update, preserve the cache
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
    }
  };
}

export const menuCache = createMenuCache(); 