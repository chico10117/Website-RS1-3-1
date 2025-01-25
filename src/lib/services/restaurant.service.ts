import type { Restaurant } from '$lib/types';

export async function fetchRestaurants(): Promise<Restaurant[]> {
  const response = await fetch('/api/restaurants');
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to load restaurants');
  }
  
  return data.data;
}

export async function createOrUpdateRestaurant(
  restaurantData: { id?: string; name: string; logo: string | null; slug?: string }, 
  restaurantId?: string
): Promise<Restaurant> {
  const method = restaurantId ? 'PUT' : 'POST';
  const url = restaurantId ? `/api/restaurants/${restaurantId}` : '/api/restaurants';
  
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...restaurantData,
      id: restaurantId || restaurantData.id // Ensure ID is passed for updates
    })
  });

  if (!response.ok) {
    // If update fails because restaurant doesn't exist, create a new one
    if (response.status === 404 && restaurantId) {
      return createOrUpdateRestaurant(restaurantData);
    }
    throw new Error(`Failed to ${restaurantId ? 'update' : 'create'} restaurant: ${await response.text()}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || `Failed to ${restaurantId ? 'update' : 'create'} restaurant`);
  }

  return result.data;
}

export async function deleteRestaurant(restaurantId: string): Promise<void> {
  const response = await fetch(`/api/restaurants/${restaurantId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete restaurant: ${await response.text()}`);
  }
} 