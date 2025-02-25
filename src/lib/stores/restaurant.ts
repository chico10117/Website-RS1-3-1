import { writable, get } from 'svelte/store';
import type { Restaurant } from '$lib/types/menu.types';

function createRestaurantStore() {
  const { subscribe, set } = writable<Restaurant | null>(null);
  let cachedRestaurants: Restaurant[] = [];

  return {
    subscribe,
    set,
    async loadRestaurants(): Promise<Restaurant[]> {
      try {
        console.log('Fetching restaurants from API...');
        console.log('Current auth state:', document.cookie.includes('auth_token') ? 'Auth token exists' : 'No auth token');
        
        const response = await fetch('/api/restaurants', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          console.error('Error response from API:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error details:', errorText);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API response type:', typeof data);
        console.log('API response keys:', Object.keys(data));
        console.log('API response full:', data);
        
        if (!data.success) {
          console.error('API reported failure:', data.error);
          throw new Error(data.error || 'Failed to load restaurants');
        }
        
        // Check if data.data exists and is an array
        if (!data.data) {
          console.error('API response missing data property:', data);
          return [];
        }
        
        if (!Array.isArray(data.data)) {
          console.error('API response data is not an array:', data.data);
          return [];
        }
        
        console.log(`Received ${data.data.length} restaurants from API`);
        data.data.forEach((r: Restaurant, index: number) => {
          console.log(`Restaurant ${index} from API:`, r);
          console.log(`- Name: ${r.name || 'undefined'}`);
          console.log(`- ID: ${r.id || 'undefined'}`);
          console.log(`- User ID: ${r.userId || 'undefined'}`);
        });
        
        cachedRestaurants = data.data;
        return data.data;
      } catch (error) {
        console.error('Error loading restaurants:', error);
        return [];
      }
    },
    async loadRestaurant(id: string): Promise<void> {
      try {
        const response = await fetch(`/api/restaurants?id=${id}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          console.error('Error response from API:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error details:', errorText);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to load restaurant');
        }
        
        // Update the current restaurant
        set(data.data);
        
        // Update the restaurant in the cached list if it exists
        const index = cachedRestaurants.findIndex(r => r.id === id);
        if (index !== -1) {
          cachedRestaurants[index] = data.data;
        }
      } catch (error) {
        console.error('Error loading restaurant:', error);
        set(null);
      }
    },
    async refreshCurrentRestaurant(): Promise<void> {
      const current = get(this);
      if (current?.id) {
        await this.loadRestaurant(current.id);
      }
    },
    getCachedRestaurants(): Restaurant[] {
      return cachedRestaurants;
    },
    updateCachedRestaurant(updatedRestaurant: Restaurant): void {
      const index = cachedRestaurants.findIndex(r => r.id === updatedRestaurant.id);
      if (index !== -1) {
        cachedRestaurants[index] = updatedRestaurant;
      }
      // If this is the current restaurant, update it too
      const current = get(this);
      if (current?.id === updatedRestaurant.id) {
        set(updatedRestaurant);
      }
    }
  };
}

export const currentRestaurant = createRestaurantStore(); 