// src/lib/utils/restaurant-info-helpers.ts
import { get } from 'svelte/store';
import { currentRestaurant } from '$lib/stores/restaurant';
import { user } from '$lib/stores/user';
import { menuStore } from '$lib/stores/menu-store';
import { toasts } from '$lib/stores/toast';
import { generateSlug } from '$lib/utils/slug';
import type { Restaurant } from '$lib/types/menu.types';
import { language } from '$lib/stores/language';

export interface UpdateEvent {
  id?: string;
  name: string;
  logo: string | null;
  customPrompt: string | null;
  phoneNumber: number | null;
  color: string | number;
  currency: string;
  reservas: string | null;
  redes_sociales: string | null;
  slug?: string;
}

// For dispatch functions, accept more flexible parameter types
type DispatchFunction = {
  (event: 'update', detail: UpdateEvent): void;
  (event: 'select', detail: string): void;
  (event: string, detail: any): void;
};

/** Ensure a string for UI usage */
export function ensureString(value: string | number | null | undefined): string {
  return value == null ? '' : String(value);
}

/** Ensure a string or null (for DB usage) */
export function ensureStringOrNull(value: string | null | undefined): string | null {
  return value || null;
}

/**
 * Handle drag events for logo upload
 * (enter, over, leave can all delegate here).
 */
export function handleDrag(event: DragEvent, canEdit: boolean, isEntering: boolean): boolean {
  event.preventDefault();
  event.stopPropagation();
  if (!canEdit) return false;
  return isEntering;
}

/**
 * Called when a file is dropped; checks file type and calls handleFileUpload if valid.
 */
export async function handleDrop(
  event: DragEvent,
  canEdit: boolean,
  t: (key: string) => string,
  handleFileUploadFn: (file: File) => Promise<void>,
  setIsDragging: (val: boolean) => void
) {
  event.preventDefault();
  event.stopPropagation();
  setIsDragging(false);

  if (!canEdit) {
    toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
    return;
  }

  const file = event.dataTransfer?.files[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    toasts.error(t('error') + ': ' + t('invalidFileType'));
    return;
  }

  await handleFileUploadFn(file);
}

/**
 * Upload the file using /api/upload and update the store(s).
 */
export async function handleFileUpload(
  file: File,
  restaurantName: string,
  customPrompt: string | null,
  phoneNumber: number | null,
  color: string | number,
  currency: string,
  dispatch: DispatchFunction,
  t: (key: string) => string
) {
  let isUploading = false;
  try {
    isUploading = true;
    const currentUser = get(user);
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload logo');
    }
    const uploadResult = await uploadResponse.json();
    const logoUrl = uploadResult.url || null;

    const cRest = get(currentRestaurant);
    // If editing an existing restaurant
    if (cRest) {
      // Preserve the current color from the database
      const existingColor = cRest.color || color;
      
      // Make sure to preserve the existing customPrompt
      const existingCustomPrompt = cRest.customPrompt;
      
      menuStore.updateRestaurantInfo(
        cRest.name,
        logoUrl,
        existingCustomPrompt, // Use existing value
        cRest.slug,
        cRest.phoneNumber,
        String(existingColor)
      );
      
      dispatch('update', {
        id: cRest.id,
        name: cRest.name,
        logo: logoUrl,
        customPrompt: existingCustomPrompt, // Use existing value
        phoneNumber: cRest.phoneNumber,
        currency,
        color: existingColor,
        slug: cRest.slug,
        reservas: cRest.reservas,
        redes_sociales: cRest.redes_sociales
      });
    } else {
      // For a new restaurant
      if (!restaurantName) {
        throw new Error('Restaurant name is required');
      }

      // Generate a new slug
      const newSlug = await generateSlug(restaurantName);
      
      // Keep the customPrompt as passed in
      menuStore.createRestaurant(restaurantName, logoUrl, customPrompt, phoneNumber);

      const storeState = get(menuStore);
      const newId = storeState.selectedRestaurant;
      if (!newId) {
        throw new Error('Failed to create restaurant');
      }

      // Update the newly created restaurant with a valid slug
      // Make sure to preserve the customPrompt
      menuStore.updateRestaurantInfo(
        restaurantName,
        logoUrl,
        customPrompt, // Make sure we pass this through
        newSlug,
        phoneNumber,
        String(color)
      );

      // Get current URL values from store
      const updatedStoreState = get(menuStore);

      dispatch('update', {
        id: newId,
        name: restaurantName,
        logo: logoUrl,
        customPrompt, // Make sure we pass this through
        phoneNumber,
        currency,
        color,
        slug: newSlug,
        // Use values from store instead of null
        reservas: updatedStoreState.reservas,
        redes_sociales: updatedStoreState.redes_sociales
      });
    }
    return logoUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    if (error instanceof Error) {
      toasts.error(t('error') + ': ' + error.message);
    }
    return null;
  } finally {
    isUploading = false;
  }
}

/**
 * Called after typing in the restaurant name input (on blur).
 */
export function handleRestaurantNameInput(
  restaurantName: string,
  selectedRestaurant: string | null,
  isCreatingRestaurant: boolean,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: string | null,
  color: string | number,
  currency: string,
  dispatch: DispatchFunction,
  t: (key: string) => string
) {
  try {
    if (!restaurantName || selectedRestaurant || isCreatingRestaurant) {
      return;
    }
    // Just update the local store name, no restaurant created in DB
    menuStore.updateLocalRestaurantName(restaurantName);

    const cRest = get(currentRestaurant);
    dispatch('update', {
      id: selectedRestaurant || undefined,
      name: restaurantName,
      logo: menuLogo,
      customPrompt,
      phoneNumber: phoneNumber ? Number(phoneNumber) : null,
      currency,
      color,
      slug: cRest?.slug || '',
      reservas: cRest?.reservas,
      redes_sociales: cRest?.redes_sociales
    });
  } catch (error) {
    console.error('Error updating restaurant name:', error);
    if (error instanceof Error) {
      toasts.error(t('error') + ': ' + error.message);
    }
  }
}

export function startEditingRestaurant(setEditingName: (name: string) => void, setIsEditing: (val: boolean) => void, currentName: string) {
  setEditingName(currentName);
  setIsEditing(true);
}

export function cancelEditingRestaurant(setEditingName: (name: string) => void, setIsEditing: (val: boolean) => void, currentName: string) {
  setEditingName(currentName);
  setIsEditing(false);
}

export async function updateRestaurantName(
  editingRestaurantName: string,
  selectedRestaurant: string | null,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: string | null,
  color: string | number,
  currency: string,
  reservas: string | null,
  redes_sociales: string | null,
  dispatchFn: DispatchFunction,
  t: (key: string) => string,
  setLocalRestaurantName: (val: string) => void,
  setIsEditing: (val: boolean) => void
) {
  if (!editingRestaurantName.trim()) {
    toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
    return;
  }
  if (!selectedRestaurant) {
    toasts.error(t('error') + ': ' + t('noRestaurantSelected'));
    return;
  }
  try {
    const newSlug = await generateSlug(editingRestaurantName.trim());
    const cRest = get(currentRestaurant);
    
    // Preserve the current color from the database
    const existingColor = cRest?.color || color;
    
    // Convert phoneNumber to number for the store update
    const numericPhoneNumber = phoneNumber ? Number(phoneNumber) : null;
    
    // update store
    menuStore.updateRestaurantInfo(
      editingRestaurantName.trim(),
      menuLogo,
      customPrompt,
      newSlug,
      numericPhoneNumber,
      String(existingColor)
    );
    
    // update local name
    setLocalRestaurantName(editingRestaurantName.trim());
    
    // Dispatch update event
    dispatchFn('update', {
      id: selectedRestaurant,
      name: editingRestaurantName.trim(),
      logo: menuLogo,
      customPrompt,
      phoneNumber: numericPhoneNumber,
      currency,
      color: existingColor,
      slug: newSlug,
      reservas: reservas,
      redes_sociales: redes_sociales
    });
    
    setIsEditing(false);
  } catch (error) {
    console.error('Error updating restaurant name:', error);
    if (error instanceof Error) {
      toasts.error(t('error') + ': ' + error.message);
    }
  }
}

export function handleRestaurantEditKeyPress(event: KeyboardEvent, updateFn: () => void, cancelFn: () => void) {
  if (event.key === 'Enter') {
    updateFn();
  } else if (event.key === 'Escape') {
    cancelFn();
  }
}

/**
 * Handle restaurant selection from dropdown
 */
export function handleRestaurantSelect(event: Event, dispatchFn: (event: 'select', val: string) => void) {
  const select = event.target as HTMLSelectElement;
  
  // Clear any custom color values from local storage when switching restaurants
  // This helps prevent custom colors from persisting between restaurant switches
  if (typeof window !== 'undefined') {
    const previousRestaurantId = get(currentRestaurant)?.id || 'new';
    const newRestaurantId = select.value;
    
    if (previousRestaurantId !== newRestaurantId) {
      console.log('Restaurant changed, clearing previous custom color state');
      localStorage.removeItem(`customColor_${previousRestaurantId}`);
    }
  }
  
  try {
    dispatchFn('select', select.value);
  } catch (error) {
    console.error('Error selecting restaurant:', error);
    if (error instanceof Error) {
      toasts.error('Error: ' + error.message);
    }
  }
}

/**
 * Handle custom prompt changes
 */
export function handleCustomPromptInput(
  event: Event,
  selectedRestaurant: string | null,
  restaurantName: string,
  menuLogo: string | null,
  phoneNumber: string | null,
  color: string | number,
  currency: string,
  reservas: string | null,
  redes_sociales: string | null,
  t: (key: string) => string,
  dispatchFn: DispatchFunction
): string | null {
  if (!restaurantName && !selectedRestaurant) {
    toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
    return null;
  }

  try {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;
    
    // Check length
    if (value.length > 5000) {
      toasts.error(t('error') + ': ' + t('customPromptTooLong'));
      return null;
    }
    
    // Adjust value to null if empty or the string otherwise
    const newValue = value.trim() === '' ? null : value;
    const cRest = get(currentRestaurant);
    
    // For existing restaurant
    if (cRest) {
      // Preserve the current color from the database
      const existingColor = cRest.color || color;
      
      menuStore.updateRestaurantInfo(
        cRest.name,
        cRest.logo,
        newValue,
        cRest.slug,
        cRest.phoneNumber,
        String(existingColor)
      );
      dispatchFn('update', {
        id: cRest.id,
        name: cRest.name,
        logo: cRest.logo,
        customPrompt: newValue,
        phoneNumber: cRest.phoneNumber,
        currency,
        color: existingColor,
        slug: cRest.slug,
        reservas: cRest.reservas,
        redes_sociales: cRest.redes_sociales
      });
    } else {
      // For new local restaurant
      menuStore.updateRestaurantInfo(
        restaurantName,
        menuLogo,
        newValue,
        get(currentRestaurant)?.slug || null,
        phoneNumber,
        String(color)
      );
      dispatchFn('update', {
        name: restaurantName,
        logo: menuLogo,
        customPrompt: newValue,
        phoneNumber,
        currency,
        color,
        reservas: reservas,
        redes_sociales: redes_sociales
      });
    }
    
    return newValue;
  } catch (error) {
    console.error('Error updating custom prompt:', error);
    if (error instanceof Error) {
      toasts.error(t('error') + ': ' + error.message);
    }
    return null;
  }
}

/**
 * Handle logo deletion
 */
export function handleLogoDelete(
  event: MouseEvent,
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: string | null,
  color: string | number,
  currency: string,
  reservas: string | null,
  redes_sociales: string | null,
  dispatchFn: DispatchFunction
): string | null {
  event.preventDefault();
  event.stopPropagation();
  if (!menuLogo) return null;

  try {
    const cRest = get(currentRestaurant);
    // For existing restaurant
    if (cRest) {
      // Preserve the current color from the database
      const existingColor = cRest.color || color;

      menuStore.updateRestaurantInfo(
        cRest.name,
        null, // Remove logo
        cRest.customPrompt,
        cRest.slug,
        cRest.phoneNumber,
        String(existingColor)
      );
      dispatchFn('update', {
        id: cRest.id,
        name: cRest.name,
        logo: null,
        customPrompt: cRest.customPrompt,
        phoneNumber: cRest.phoneNumber,
        currency,
        color: existingColor,
        slug: cRest.slug,
        reservas: cRest.reservas,
        redes_sociales: cRest.redes_sociales
      });
    } else {
      // For new local restaurant
      dispatchFn('update', {
        name: restaurantName,
        logo: null,
        customPrompt,
        phoneNumber: phoneNumber ? Number(phoneNumber) : null,
        currency,
        color,
        reservas: reservas,
        redes_sociales: redes_sociales
      });
    }
    
    return null; // Update successful, return null logo
  } catch (error) {
    console.error('Error deleting logo:', error);
    return menuLogo; // Return original logo on error
  }
}

/**
 * Handle currency change
 */
export function handleCurrencyChange(
  value: string,
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: string | null,
  color: string | number,
  reservas: string | null,
  redes_sociales: string | null,
  dispatchFn: DispatchFunction
) {
  try {
    const cRest = get(currentRestaurant);
    
    // For existing restaurant
    if (cRest) {
      // Preserve the current color from the database
      const existingColor = cRest.color || color;
      
      dispatchFn('update', {
        id: cRest.id,
        name: cRest.name,
        logo: cRest.logo,
        customPrompt: cRest.customPrompt,
        phoneNumber: cRest.phoneNumber,
        currency: value,
        color: existingColor,
        slug: cRest.slug,
        reservas: cRest.reservas,
        redes_sociales: cRest.redes_sociales
      });
    } else {
      // For new local restaurant
      dispatchFn('update', {
        name: restaurantName,
        logo: menuLogo,
        customPrompt,
        phoneNumber: phoneNumber ? Number(phoneNumber) : null,
        currency: value,
        color,
        reservas: reservas,
        redes_sociales: redes_sociales
      });
    }
  } catch (error) {
    console.error('Error updating currency:', error);
  }
}

/**
 * Handle phone number change 
 */
export function handlePhoneNumberChange(
  newPhoneNumber: number | null,
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  color: string | number,
  currency: string,
  reservas: string | null,
  redes_sociales: string | null,
  dispatchFn: DispatchFunction
) {
  try {
    const cRest = get(currentRestaurant);
    
    // For existing restaurant
    if (cRest) {
      // Preserve the current color from the database
      const existingColor = cRest.color || color;
      
      menuStore.updateRestaurantInfo(
        cRest.name,
        cRest.logo,
        cRest.customPrompt,
        cRest.slug,
        newPhoneNumber,
        String(existingColor)
      );
      dispatchFn('update', {
        id: cRest.id,
        name: cRest.name,
        logo: cRest.logo,
        customPrompt: cRest.customPrompt,
        phoneNumber: newPhoneNumber,
        currency,
        color: existingColor,
        slug: cRest.slug,
        reservas: cRest.reservas,
        redes_sociales: cRest.redes_sociales
      });
    } else {
      // For new local restaurant
      menuStore.updateRestaurantInfo(
        restaurantName,
        menuLogo,
        customPrompt,
        null, // No slug for new restaurant
        newPhoneNumber,
        String(color)
      );
      dispatchFn('update', {
        name: restaurantName,
        logo: menuLogo,
        customPrompt,
        phoneNumber: newPhoneNumber,
        currency,
        color,
        reservas: reservas,
        redes_sociales: redes_sociales
      });
    }
  } catch (error) {
    console.error('Error updating phone number:', error);
  }
}

// Function to clean phone number - ensure it's a valid number without spaces
function cleanPhoneNumber(phone: any): number | null {
  if (phone === null || phone === undefined) return null;
  
  // If it's already a number, return it
  if (typeof phone === 'number') return phone;
  
  // Convert to string, remove all spaces and non-digit characters
  const cleaned = phone.toString().replace(/\s+/g, '').replace(/\D/g, '');
  
  // Convert back to number if we have digits
  if (cleaned.length > 0) {
    const numericValue = Number(cleaned);
    if (!isNaN(numericValue) && Number.isInteger(numericValue)) {
      return numericValue;
    }
  }
  return null;
}

/**
 * Handle menu upload success
 */
export async function handleMenuUploadSuccess(
  event: CustomEvent,
  dispatchFn: DispatchFunction,
  currency: string,
  color: string
) {
  try {
    console.log('handleMenuUploadSuccess received event:', {
      detail: event.detail,
      currency,
      color
    });

    const cRest = get(currentRestaurant);
    console.log('Current restaurant from store:', cRest);
    
    if (cRest) {
      // Validate required fields
      if (!cRest.name) {
        // Use placeholder instead of throwing error
        const placeholderName = get(language) === 'es' ? 'Restaurante desconocido' : 'Unknown restaurant';
        cRest.name = placeholderName;
        console.log('Using placeholder name for existing restaurant:', placeholderName);
      }

      // Preserve the current color from the database
      const existingColor = cRest.color || color;
      console.log('Using color for existing restaurant:', existingColor);
      
      // Update the dispatch with preserved color
      const updateData = {
        id: cRest.id,
        name: cRest.name,
        logo: cRest.logo,
        customPrompt: cRest.customPrompt,
        phoneNumber: cRest.phoneNumber,
        currency,
        color: existingColor,
        slug: cRest.slug,
        reservas: cRest.reservas,
        redes_sociales: cRest.redes_sociales
      };
      console.log('Dispatching update for existing restaurant:', updateData);
      dispatchFn('update', updateData);
    } else {
      // For a new restaurant
      const { restaurantData } = event.detail;
      console.log('Processing new restaurant data:', restaurantData);

      if (!restaurantData || !restaurantData.restaurant) {
        console.error('Invalid restaurant data received:', restaurantData);
        throw new Error('Invalid restaurant data format');
      }

      // Extract restaurant data
      const { restaurant, categories } = restaurantData;
      console.log('Extracted categories:', categories);
      
      // Use placeholder if no restaurant name
      const placeholderName = get(language) === 'es' ? 'Restaurante desconocido' : 'Unknown restaurant';
      const finalName = restaurant.name || placeholderName;
      console.log('Using name for new restaurant:', finalName);

      // Generate a slug for the new restaurant
      const slug = await generateSlug(finalName);

      // Create the restaurant in the store first
      menuStore.createRestaurant(
        finalName,
        restaurant.logo || null,
        restaurant.customPrompt || null,
        restaurant.phoneNumber || null,
        null, // reservas
        null  // redes_sociales
      );

      // Get the newly created restaurant ID
      const storeState = get(menuStore);
      const newId = storeState.selectedRestaurant;

      if (!newId) {
        throw new Error('Failed to create restaurant');
      }

      // Update with the proper slug and other details
      menuStore.updateRestaurantInfo(
        finalName,
        restaurant.logo || null,
        restaurant.customPrompt || null,
        slug,
        restaurant.phoneNumber || null,
        String(color)
      );

      // Add categories and dishes
      if (categories && Array.isArray(categories)) {
        console.log('Processing categories:', categories.length);
        
        for (const category of categories) {
          // Create category and get its ID
          const categoryId = menuStore.addCategory(category.name);
          console.log('Created category:', { name: category.name, id: categoryId });

          // Add dishes if they exist
          if (category.dishes && Array.isArray(category.dishes)) {
            console.log(`Processing ${category.dishes.length} dishes for category ${category.name}`);
            
            for (const dish of category.dishes) {
              const dishData = {
                title: dish.title || 'Untitled Dish',
                description: dish.description || '',
                price: dish.price?.toString() || '0',
                imageUrl: dish.imageUrl || null
              };
              console.log('Adding dish:', dishData);
              
              // Add the dish to the store
              menuStore.addDish(categoryId, dishData);
            }
          }
        }
      }

      // For new restaurant that didn't exist before, we use the passed color
      const updateData = {
        id: newId,
        name: finalName,
        logo: restaurant.logo || null,
        customPrompt: restaurant.customPrompt || null,
        phoneNumber: cleanPhoneNumber(restaurant.phoneNumber),
        currency,
        color,
        slug,
        // Get current URL values from store
        reservas: storeState.reservas,
        redes_sociales: storeState.redes_sociales
      };
      console.log('Dispatching update for new restaurant:', updateData);
      dispatchFn('update', updateData);

      // Update the current restaurant store with proper types
      currentRestaurant.set({
        id: newId,
        name: finalName,
        logo: restaurant.logo || null,
        customPrompt: restaurant.customPrompt || null,
        phoneNumber: restaurant.phoneNumber || null,
        currency,
        color,
        slug,
        // Use values from store instead of null 
        reservas: storeState.reservas,
        redes_sociales: storeState.redes_sociales,
        userId: get(user)?.id || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: categories || []
      });
    }
  } catch (error) {
    console.error('Error handling menu upload success:', error);
    throw error; // Re-throw to allow proper error handling up the chain
  }
}

/**
 * Handle menu upload error
 */
export function handleMenuUploadError(event: CustomEvent, t: (key: string) => string) {
  toasts.error(t('error') + ': ' + event.detail);
} 