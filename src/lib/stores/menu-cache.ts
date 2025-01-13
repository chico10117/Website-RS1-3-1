import { writable, derived, type Readable, type Writable } from 'svelte/store';
import type { Restaurant, Category, Dish } from '$lib/types';

interface CachedChanges {
  restaurant: {
    id: string | null;
    name: string;
    logo: string;
  };
  categories: {
    [id: string]: {
      action: 'create' | 'update' | 'delete';
      data: Category;
    };
  };
  dishes: {
    [id: string]: {
      action: 'create' | 'update' | 'delete';
      data: Dish;
    };
  };
  hasUnsavedChanges: boolean;
}

interface MenuCacheStore extends Writable<CachedChanges> {
  updateRestaurant: (data: Partial<CachedChanges['restaurant']>) => void;
  updateCategory: (id: string, action: CachedChanges['categories'][string]['action'], data: Category) => void;
  updateDish: (id: string, action: CachedChanges['dishes'][string]['action'], data: Dish) => void;
  clearCache: () => void;
}

const initialCache: CachedChanges = {
  restaurant: {
    id: null,
    name: '',
    logo: ''
  },
  categories: {},
  dishes: {},
  hasUnsavedChanges: false
};

function createMenuCache(): MenuCacheStore {
  const { subscribe, set, update } = writable<CachedChanges>(initialCache);
  
  // Create a derived store for tracking unsaved changes
  const hasChanges = derived({ subscribe }, $cache => {
    const hasRestaurantChanges = 
      $cache.restaurant.id !== null && 
      ($cache.restaurant.name !== '' || $cache.restaurant.logo !== '');
    
    const hasCategoryChanges = Object.keys($cache.categories).length > 0;
    const hasDishChanges = Object.keys($cache.dishes).length > 0;
    
    return hasRestaurantChanges || hasCategoryChanges || hasDishChanges;
  });

  // Subscribe to changes and update the hasUnsavedChanges flag
  hasChanges.subscribe(value => {
    update(cache => ({ ...cache, hasUnsavedChanges: value }));
  });
  
  const store = {
    subscribe,
    set,
    update,
    updateRestaurant: (data: Partial<CachedChanges['restaurant']>) => 
      update(cache => {
        const newCache = {
          ...cache,
          restaurant: { ...cache.restaurant, ...data }
        };
        console.log('Updated restaurant cache:', newCache);
        return newCache;
      }),
    
    updateCategory: (id: string, action: CachedChanges['categories'][string]['action'], data: Category) =>
      update(cache => {
        const newCache = {
          ...cache,
          categories: {
            ...cache.categories,
            [id]: { action, data }
          }
        };
        console.log('Updated categories cache:', newCache);
        return newCache;
      }),
    
    updateDish: (id: string, action: CachedChanges['dishes'][string]['action'], data: Dish) =>
      update(cache => {
        const newCache = {
          ...cache,
          dishes: {
            ...cache.dishes,
            [id]: { action, data }
          }
        };
        console.log('Updated dishes cache:', newCache);
        return newCache;
      }),
    
    clearCache: () => {
      console.log('Clearing cache');
      set(initialCache);
    }
  };

  return store;
}

export const menuCache = createMenuCache(); 