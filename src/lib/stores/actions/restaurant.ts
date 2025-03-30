import type { Restaurant } from '$lib/types/menu.types';
import type { MenuStore, RestaurantUpdateData } from '../types';
import * as restaurantService from '$lib/services/restaurant.service';
import * as menuService from '$lib/services/menu.service';
import * as categoryService from '$lib/services/category.service';
import * as dishService from '$lib/services/dish.service';
import { createTempId, mergeWithUnsavedChanges } from '../utils';
import { get } from 'svelte/store';

export async function loadRestaurants(state: MenuStore) {
  try {
    console.log('Loading restaurants...');
    const restaurants = await restaurantService.fetchRestaurants();
    console.log('Loaded restaurants:', restaurants);
    return restaurants;
  } catch (error) {
    console.error('Error loading restaurants:', error);
    throw error;
  }
}

export function createRestaurant(state: MenuStore, name: string, logo: string | null = null, customPrompt: string | null = null, phoneNumber: number | null = null, reservas: string | null = null, redes_sociales: string | null = null, currency: string = '€') {
  const tempId = createTempId();
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
  };

  return {
    ...state,
    restaurants: [...state.restaurants, newRestaurant],
    selectedRestaurant: tempId,
    restaurantName: name,
    menuLogo: logo,
    customPrompt,
    phoneNumber,
    color: currentColor,
    currency: currency,
    changedItems: {
      ...state.changedItems,
      restaurant: true
    },
    reservas,
    redes_sociales,
  };
}

export function updateRestaurantInfo(state: MenuStore, name: string, logo: string | null, customPrompt: string | null = null, slug: string | null = null, phoneNumber: number | null = null, reservas?: string | null, redes_sociales?: string | null, color: string | null = null, currency?: string | null) {
  let validatedColor = color;
  if (validatedColor && typeof validatedColor === 'string' && !validatedColor.startsWith('#')) {
    console.warn('CRITICAL: Color value must start with #, got:', validatedColor);
    validatedColor = '#' + validatedColor;
  }

  const currentRestaurantIndex = state.restaurants.findIndex(r => r.id === state.selectedRestaurant);
  const currentRestaurant = currentRestaurantIndex >= 0 ? state.restaurants[currentRestaurantIndex] : null;
  
  const updatedRestaurants = [...state.restaurants];
  
  if (currentRestaurantIndex >= 0 && currentRestaurant) {
    updatedRestaurants[currentRestaurantIndex] = {
      ...currentRestaurant,
      name,
      logo,
      customPrompt,
      slug: slug || currentRestaurant.slug,
      phoneNumber,
      ...(reservas !== undefined ? { reservas } : {}),
      ...(redes_sociales !== undefined ? { redes_sociales } : {}),
      color: validatedColor || state.color || '#85A3FA',
      currency: currency || currentRestaurant.currency || '€',
      updatedAt: new Date(),
    };
  }
  
  return {
    ...state,
    restaurantName: name,
    menuLogo: logo,
    customPrompt,
    phoneNumber,
    color: validatedColor || state.color || '#85A3FA',
    ...(reservas !== undefined ? { reservas } : {}),
    ...(redes_sociales !== undefined ? { redes_sociales } : {}),
    currency: currency || state.currency || '€',
    restaurants: updatedRestaurants,
    changedItems: {
      ...state.changedItems,
      restaurant: true
    }
  };
}

export async function selectRestaurant(state: MenuStore, restaurantId: string) {
  try {
    const restaurant = await restaurantService.fetchRestaurantById(restaurantId);
    const fetchedCategories = await categoryService.fetchCategories(restaurantId);
    
    const categoriesWithDishes = await Promise.all(
      fetchedCategories.map(async (category) => {
        try {
          const dishes = await dishService.fetchDishes(restaurantId, category.id);
          return {
            ...category,
            dishes: dishes || []
          };
        } catch (error) {
          console.error(`Error fetching dishes for category ${category.id}:`, error);
          return {
            ...category,
            dishes: []
          };
        }
      })
    );
    
    let colorValue = restaurant.color || '#85A3FA';
    if (colorValue === '1' || colorValue === 'light') {
      colorValue = '#85A3FA';
    }
    
    return {
      ...state,
      selectedRestaurant: restaurantId,
      restaurantName: restaurant.name,
      menuLogo: restaurant.logo,
      customPrompt: restaurant.customPrompt,
      phoneNumber: restaurant.phoneNumber,
      color: colorValue,
      reservas: restaurant.reservas || null,
      redes_sociales: restaurant.redes_sociales || null,
      categories: categoriesWithDishes,
      isLoading: false,
      changedItems: {
        restaurant: false,
        categories: new Set<string>(),
        dishes: new Set<string>(),
        deletedCategories: new Set<string>(),
        deletedDishes: new Set<string>()
      }
    };
  } catch (error) {
    console.error('Error selecting restaurant:', error);
    throw error;
  }
}

export async function saveChanges(state: MenuStore) {
  try {
    const currentRestaurantObj = state.restaurants.find(r => r.id === state.selectedRestaurant);
    
    const colorValue = state.color === 'light' || state.color === '1'
      ? '#85A3FA'
      : state.color;
    
    const reservas = state.reservas ?? currentRestaurantObj?.reservas ?? null;
    const redes_sociales = state.redes_sociales ?? currentRestaurantObj?.redes_sociales ?? null;
    
    const restaurantData: RestaurantUpdateData = {
      name: state.restaurantName,
      logo: state.menuLogo,
      customPrompt: state.customPrompt,
      phoneNumber: state.phoneNumber,
      currency: state.currency || '€',
      color: colorValue,
      reservas,
      redes_sociales,
    };

    const result = await menuService.saveMenuChanges(restaurantData, state.selectedRestaurant);
    
    return result;
  } catch (error) {
    console.error('Error saving changes:', error);
    throw error;
  }
} 