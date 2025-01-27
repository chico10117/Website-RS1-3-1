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
  restaurantData: { 
    id?: string; 
    name: string; 
    logo: string | null; 
    slug?: string;
    customPrompt?: string | null;
  }, 
  restaurantId?: string
): Promise<Restaurant> {
  // For updates, we use the explicit restaurantId parameter
  const isUpdate = !!restaurantId;
  
  const url = isUpdate ? `/api/restaurants/${restaurantId}` : '/api/restaurants';
  
  try {
    // For POST (new restaurant), include all data including the generated ID
    // For PUT (update), don't include id in body since it's in URL
    const bodyData = isUpdate 
      ? { 
          name: restaurantData.name, 
          logo: restaurantData.logo, 
          slug: restaurantData.slug,
          customPrompt: restaurantData.customPrompt 
        }
      : { 
          ...(restaurantData.id && { id: restaurantData.id }), 
          name: restaurantData.name, 
          logo: restaurantData.logo,
          slug: restaurantData.slug,
          customPrompt: restaurantData.customPrompt
        };
    
    console.log('Restaurant operation:', {
      method: isUpdate ? 'PUT' : 'POST',
      url,
      bodyData,
      isUpdate,
      restaurantId,
      providedId: restaurantData.id
    });

    const response = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      console.error('Restaurant operation failed:', { 
        status: response.status, 
        result, 
        isUpdate,
        restaurantId,
        bodyData
      });
      throw new Error(result.error || `Failed to ${isUpdate ? 'update' : 'create'} restaurant`);
    }

    return result.data;
  } catch (error) {
    console.error('Restaurant operation failed:', error);
    throw error;
  }
}

export async function deleteRestaurant(restaurantId: string): Promise<void> {
  const response = await fetch(`/api/restaurants/${restaurantId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete restaurant: ${await response.text()}`);
  }
} 