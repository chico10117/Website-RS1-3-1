import type { Restaurant } from '$lib/types';
import { generateSlug } from '$lib/utils/slug';

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

export async function fetchRestaurantById(restaurantId: string): Promise<Restaurant> {
  //console.log('Fetching restaurant by ID:', restaurantId);
  
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

export async function createOrUpdateRestaurant(
  restaurantData: { 
    id?: string; 
    name: string; 
    logo: string | null; 
    slug?: string;
    customPrompt?: string | null;
    phoneNumber?: number | null;
    userId?: string;
    currency: string;
    color: string;
    reservas?: string | null;
    redes_sociales?: string | null;
  }, 
  restaurantId?: string
): Promise<Restaurant> {
  // Debug URL values
  console.log('createOrUpdateRestaurant - URL values:', {
    reservas: restaurantData.reservas,
    redes_sociales: restaurantData.redes_sociales
  });

  // Ensure reservas and redes_sociales are strings or null, not undefined
  const reservas = restaurantData.reservas === undefined ? null : restaurantData.reservas;
  const redes_sociales = restaurantData.redes_sociales === undefined ? null : restaurantData.redes_sociales;

  // For updates, we use the explicit restaurantId parameter
  // Don't use restaurantId if it's a temporary ID
  const isUpdate = !!restaurantId && !restaurantId.startsWith('temp_');
  
  const url = isUpdate ? `/api/restaurants/${restaurantId}` : '/api/restaurants';
  
  // Only generate slug for new restaurants when no slug is provided
  const slug = isUpdate ? restaurantData.slug : (restaurantData.slug || await generateSlug(restaurantData.name));
  
  try {
    // Ensure color is always a hex value
    const color = restaurantData.color === 'light' || restaurantData.color === '1' 
      ? '#85A3FA' 
      : restaurantData.color;
    
    // CRITICAL FIX: Validate URL values - prevent color values from being stored in URL fields
    let validatedReservas = reservas;
    let validatedRedesSociales = redes_sociales;
    
    // Check if reservas accidentally got the color value
    if (reservas && typeof reservas === 'string' && reservas.startsWith('#')) {
      console.warn('CRITICAL: Detected color value in reservas field, using null instead');
      validatedReservas = null;
    }
    
    // Check if redes_sociales accidentally got the color value  
    if (redes_sociales && typeof redes_sociales === 'string' && redes_sociales.startsWith('#')) {
      console.warn('CRITICAL: Detected color value in redes_sociales field, using null instead');
      validatedRedesSociales = null;
    }
    
    // Debug body data
    console.log('Restaurant operation - preparing body data with URLs:', {
      originalReservas: reservas,
      validatedReservas,
      originalRedesSociales: redes_sociales,
      validatedRedesSociales,
    });

    // CRITICAL: Ensure these fields are definitely included in the request
    console.log('Explicitly checking URL values before creating bodyData:', {
      reservas: validatedReservas,
      redes_sociales: validatedRedesSociales,
      restaurantDataReservas: restaurantData.reservas,
      restaurantDataRedesSociales: restaurantData.redes_sociales,
    });

    // For POST (new restaurant), include all data EXCEPT temporary IDs
    // For PUT (update), don't include id in body since it's in URL
    const bodyData = isUpdate 
      ? { 
          name: restaurantData.name, 
          logo: restaurantData.logo, 
          customPrompt: restaurantData.customPrompt,
          phoneNumber: restaurantData.phoneNumber,
          currency: restaurantData.currency,
          color, // Use modified color value
          reservas: validatedReservas, // Use normalized value
          redes_sociales: validatedRedesSociales, // Use normalized value
        }
      : { 
          // Only include ID if it's not a temporary ID
          ...(restaurantData.id && !restaurantData.id.startsWith('temp_') ? { id: restaurantData.id } : {}), 
          name: restaurantData.name, 
          logo: restaurantData.logo,
          slug,
          customPrompt: restaurantData.customPrompt,
          phoneNumber: restaurantData.phoneNumber,
          currency: restaurantData.currency,
          color, // Use modified color value
          reservas: validatedReservas, // Use normalized value
          redes_sociales: validatedRedesSociales, // Use normalized value
        };

    // CRITICAL: Check if the URL values are in the bodyData
    console.log('FINAL BODY DATA CHECK:', {
      bodyHasReservas: 'reservas' in bodyData,
      bodyReservas: bodyData.reservas,
      bodyHasRedesSociales: 'redes_sociales' in bodyData,
      bodyRedesSociales: bodyData.redes_sociales,
    });

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

    const result = await response.json();
    
    // Debug response
    console.log('Restaurant API response:', {
      success: result.success,
      urlValues: {
        reservas: result.data?.reservas,
        redes_sociales: result.data?.redes_sociales
      }
    });
    
    if (!response.ok || !result.success) {
      console.error('Restaurant operation failed:', { 
        status: response.status, 
        result 
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
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete restaurant: ${await response.text()}`);
  }
} 