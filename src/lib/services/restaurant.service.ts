import type { Restaurant } from '$lib/types/menu.types';
import type { RestaurantFieldUpdate } from '$lib/types/restaurant.types';
import { generateSlug } from '$lib/utils/slug';
import { normalizeUrl, ensureStringOrNull } from '$lib/utils/validation';

/**
 * Fetch all restaurants for the authenticated user
 */
export async function fetchRestaurants(): Promise<Restaurant[]> {
  const response = await fetch('/api/restaurants', {
    credentials: 'include'
  });
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to load restaurants');
  }
  
  return data.data;
}

/**
 * Fetch a single restaurant by ID
 */
export async function fetchRestaurantById(restaurantId: string): Promise<Restaurant> {
  console.log('Fetching restaurant by ID:', restaurantId);
  
  const response = await fetch(`/api/restaurants?id=${restaurantId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch restaurant: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to load restaurant');
  }
  
  return data.data;
}

/**
 * Create or update a restaurant using the fields-as-objects pattern
 */
export async function createOrUpdateRestaurant(
  restaurantData: RestaurantFieldUpdate, 
  restaurantId?: string
): Promise<Restaurant> {
  try {
    // For updates, we use the explicit restaurantId parameter
    // Don't use restaurantId if it's a temporary ID
    const isUpdate = !!restaurantId && !restaurantId.startsWith('temp_');
    
    const url = isUpdate ? `/api/restaurants/${restaurantId}` : '/api/restaurants';
    
    // Only generate slug for new restaurants when no slug is provided
    const slug = isUpdate ? restaurantData.slug : (restaurantData.slug || await generateSlug(restaurantData.name || ''));
    
    // Normalize URL values
    const normalizedData = {
      ...restaurantData,
      slug: ensureStringOrNull(slug),
      reservas: normalizeUrl(restaurantData.reservas),
      redes_sociales: normalizeUrl(restaurantData.redes_sociales)
    };
    
    // Ensure color is properly handled
    const color = normalizedData.color === 'light' || normalizedData.color === '1' 
      ? '#85A3FA' 
      : normalizedData.color;
    
    // For POST (new restaurant), include all data EXCEPT temporary IDs
    // For PUT (update), don't include id in body since it's in URL
    const bodyData = isUpdate 
      ? { 
          ...normalizedData,
          color
        }
      : { 
          ...normalizedData,
          color,
          // Only include ID if it's not a temporary ID
          ...(restaurantData.id && !restaurantData.id.startsWith('temp_') ? { id: restaurantData.id } : {})
        };
    
    console.log('Restaurant API request:', {
      method: isUpdate ? 'PUT' : 'POST',
      url,
      bodyData,
    });
    
    const response = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || `Failed to ${isUpdate ? 'update' : 'create'} restaurant`);
    }
    
    return result.data;
  } catch (error) {
    console.error('Restaurant operation failed:', error);
    throw error;
  }
}

/**
 * Delete a restaurant by ID
 */
export async function deleteRestaurant(restaurantId: string): Promise<void> {
  const response = await fetch(`/api/restaurants/${restaurantId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete restaurant: ${await response.text()}`);
  }
} 