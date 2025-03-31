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
 * Upload the file using /api/upload and ONLY dispatch the change.
 */
export async function handleFileUpload(
  file: File,
  restaurantId: string | null, // Need ID to dispatch
  t: (key: string) => string,
  dispatch: DispatchFunction
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

    // ONLY dispatch the changed logo URL
    if (logoUrl !== null) {
      dispatch('update', {
        id: restaurantId || undefined,
        logo: logoUrl,
      } as Partial<UpdateEvent>); // Dispatch partial update
    } else {
        // Optionally handle null URL case, maybe dispatch null?
        dispatch('update', {
            id: restaurantId || undefined,
            logo: null,
        } as Partial<UpdateEvent>);
    }

    return logoUrl; // Return the URL for local state update in component

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

/**
 * Called when the restaurant name is confirmed (e.g., checkmark clicked)
 */
export async function updateRestaurantName(
  editingRestaurantName: string,
  selectedRestaurant: string | null,
  // REMOVED other fields as they are not directly changed here
  dispatchFn: DispatchFunction,
  t: (key: string) => string,
  setLocalRestaurantName: (val: string) => void,
  setIsEditing: (val: boolean) => void
) {
  const trimmedName = editingRestaurantName.trim();
  if (!trimmedName) {
    toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
    return;
  }
  
  const currentStoreState = get(menuStore);
  const restaurantId = selectedRestaurant || currentStoreState.selectedRestaurant;

  if (!restaurantId) {
    toasts.error(t('error') + ': ' + t('noRestaurantSelected'));
    return;
  }

  try {
    const newSlug = await generateSlug(trimmedName);
    
    // Dispatch ONLY the name and slug change
    dispatchFn('update', {
      id: restaurantId,
      name: trimmedName,
      slug: newSlug,
    } as Partial<UpdateEvent>); // Dispatch partial update
    
    // update local component state
    setLocalRestaurantName(trimmedName);
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
 * Handle custom prompt input change
 */
export function handleCustomPromptInput(
  event: Event,
  selectedRestaurantId: string | null, // Need ID to dispatch
  t: (key: string) => string,
  dispatchFn: DispatchFunction
): string | null {
  const target = event.target as HTMLTextAreaElement;
  const newValue = target.value;

  try {
    // Basic validation (optional)
    if (newValue.length > 5000) { 
      toasts.info(t('customPromptTooLong'));
      // Maybe truncate or prevent further input?
      // For now, just dispatch the truncated value
      const truncatedValue = newValue.substring(0, 5000);
       dispatchFn('update', {
        id: selectedRestaurantId || undefined,
        customPrompt: truncatedValue,
      } as Partial<UpdateEvent>); // Dispatch partial update
      return truncatedValue;
    }

    // Dispatch ONLY the prompt change
    dispatchFn('update', {
      id: selectedRestaurantId || undefined,
      customPrompt: newValue,
    } as Partial<UpdateEvent>); // Dispatch partial update
    
    return newValue;

  } catch (error) {
    console.error('Error updating custom prompt:', error);
    if (error instanceof Error) {
      toasts.error(t('error') + ': ' + error.message);
    }
    return null; // Return null on error to signal failure
  }
}

/**
 * Handle deleting the logo.
 */
export function handleLogoDelete(
  selectedRestaurantId: string | null, // Need ID to dispatch
  dispatchFn: DispatchFunction
) {
  // Dispatch ONLY the logo change (setting it to null)
  dispatchFn('update', {
    id: selectedRestaurantId || undefined,
    logo: null,
  } as Partial<UpdateEvent>); // Dispatch partial update

  return null; // Return null for local state update in component
}

/**
 * Handle currency change
 */
export function handleCurrencyChange(
  value: string,
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: number | null,
  color: string | number,
  reservas: string | null,
  redes_sociales: string | null,
  dispatchFn: DispatchFunction
) {
  try {
    const currentUser = get(user);
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const cRest = get(currentRestaurant);

    // Dispatch an update event with ALL relevant current data,
    // including the NEW currency and the EXISTING color.
    dispatchFn('update', {
      id: cRest?.id || undefined, // Use current restaurant ID if available
      name: restaurantName, // Use current name
      logo: menuLogo, // Use current logo
      customPrompt: customPrompt, // Use current prompt
      phoneNumber: phoneNumber, // Use current phone number
      currency: value, // Use the NEW currency value
      color: String(color), // Use the CURRENT color value, ensure it's a string
      reservas: reservas, // Use current reservas
      redes_sociales: redes_sociales, // Use current redes sociales
      slug: cRest?.slug // Include slug if available
    });

  } catch (error) {
    console.error('Error handling currency change:', error);
    // Optionally add a user-facing toast notification here
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
      // const existingColor = cRest.color || color; // No longer needed, let updateRestaurantInfo handle it
      
      menuStore.updateRestaurantInfo(
        cRest.name,
        cRest.logo,
        cRest.customPrompt,
        cRest.slug,
        newPhoneNumber,
        // String(existingColor) // Remove explicit color
        // Pass undefined for optional args not being set here
        undefined, // reservas
        undefined, // redes_sociales
        undefined, // color
        cRest.currency // Pass existing currency
      );
      dispatchFn('update', {
        id: cRest.id,
        name: cRest.name,
        logo: cRest.logo,
        customPrompt: cRest.customPrompt,
        phoneNumber: newPhoneNumber,
        currency: cRest.currency, // Use current restaurant's currency
        color: cRest.color, // Dispatch the actual current color from store
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
        null, // slug
        newPhoneNumber,
        // String(color) // Remove explicit color
        // Pass undefined for optional args not being set here
        reservas, // Pass existing reservas if available
        redes_sociales, // Pass existing redes_sociales if available
        undefined, // color
        currency // Pass existing currency
      );
      dispatchFn('update', {
        id: undefined,
        name: restaurantName,
        logo: menuLogo,
        customPrompt: customPrompt, // Explicitly set customPrompt
        phoneNumber: newPhoneNumber,
        currency,
        // color, // Remove explicit color from dispatch for new restaurant
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

interface RestaurantState {
  restaurantName: string;
  menuLogo: string | null;
  customPrompt: string | null;
  phoneNumber: number | null;
  currency: string;
  color: string;
  reservas: string | null;
  redes_sociales: string | null;
}
/**
 * Handle menu upload success
 */
export async function handleMenuUploadSuccess(
  event: CustomEvent,
  dispatchFn: DispatchFunction,
  currentState: RestaurantState,
  t: (key: string) => string
) {
  try {
    console.log('handleMenuUploadSuccess received event:', {
      detail: event.detail,
      currentState
    });

    const cRest = get(currentRestaurant);
    console.log('Current restaurant from store:', cRest);
    
    if (cRest) {
      // Get the data potentially returned from the processing API
      const { restaurantData } = event.detail;
      const uploadedRestaurantInfo = restaurantData?.restaurant || {};
      const uploadedCategories = restaurantData?.categories || [];
      const uploadedDishes = uploadedCategories.flatMap((cat: any) => cat.dishes || []);

      // Preserve the current UI color if not provided by upload
      const existingColor = uploadedRestaurantInfo.color || currentState.color || cRest.color || '#85A3FA';

      // Merge: Prioritize uploaded data, then current component state, then store state
      const finalName = uploadedRestaurantInfo.name || currentState.restaurantName || cRest.name || t('unknownRestaurant');
      const finalLogo = uploadedRestaurantInfo.logo || currentState.menuLogo || cRest.logo;
      const finalPrompt = uploadedRestaurantInfo.customPrompt || currentState.customPrompt || cRest.customPrompt;
      const finalPhone = cleanPhoneNumber(uploadedRestaurantInfo.phoneNumber !== undefined ? uploadedRestaurantInfo.phoneNumber : currentState.phoneNumber !== undefined ? currentState.phoneNumber : cRest.phoneNumber);
      const finalCurrency = uploadedRestaurantInfo.currency || currentState.currency || cRest.currency || '€';
      const finalReservas = uploadedRestaurantInfo.reservas || currentState.reservas || cRest.reservas;
      const finalRedes = uploadedRestaurantInfo.redes_sociales || currentState.redes_sociales || cRest.redes_sociales;

      // Update the store with the merged/updated data - FOCUS ON INFO UPDATE
      // We assume the backend/upload API handles category/dish creation/update if needed
      menuStore.updateRestaurantInfo(
        finalName,
        finalLogo,
        finalPrompt,
        cRest.slug,
        finalPhone,
        String(existingColor)
      );

      // If categories/dishes were processed and returned, update the store for them too
      if (uploadedCategories.length > 0) {
        console.log('Uploaded categories data available, update menuStore if specific methods exist:', uploadedCategories);
      }

      // Need similar handling for dishes if menuStore supports it
      if (uploadedDishes.length > 0) {
        // This might need a more granular update depending on menuStore capabilities
        // e.g., menuStore.setDishes(uploadedDishes);
        // For now, just logging
        console.log('Uploaded dishes data available, consider updating menuStore if method exists:', uploadedDishes);
      }

      // Dispatch the merged UI state
      const updateData = {
        id: cRest.id,
        name: finalName,
        logo: finalLogo,
        customPrompt: finalPrompt,
        phoneNumber: finalPhone,
        currency: finalCurrency,
        color: existingColor,
        slug: cRest.slug,
        reservas: finalReservas,
        redes_sociales: finalRedes
      };
      console.log('Dispatching update for existing restaurant after upload:', updateData);
      dispatchFn('update', updateData);

    } else {
      // For a NEW restaurant being created FROM an upload
      const { restaurantData } = event.detail;
      console.log('Processing new restaurant data from upload:', restaurantData);

      if (!restaurantData || !restaurantData.restaurant) {
        console.error('Invalid restaurant data received:', restaurantData);
        throw new Error('Invalid restaurant data format');
      }

      // Extract restaurant data
      const { restaurant, categories } = restaurantData;
      console.log('Extracted categories:', categories);

      // Use placeholder if no restaurant name provided in upload or component state
      const finalName = restaurant.name || currentState.restaurantName || t('unknownRestaurant');
      console.log('Using name for new restaurant:', finalName);

      // Generate a slug for the new restaurant
      const slug = await generateSlug(finalName);

      // Extract details, prioritizing uploaded data then component state
      const finalLogo = restaurant.logo || currentState.menuLogo;
      const finalPrompt = restaurant.customPrompt || currentState.customPrompt;
      const finalPhone = cleanPhoneNumber(restaurant.phoneNumber !== undefined ? restaurant.phoneNumber : currentState.phoneNumber);
      const finalCurrency = restaurant.currency || currentState.currency || '€';
      const finalColor = restaurant.color || currentState.color || '#85A3FA';
      const finalReservas = restaurant.reservas || currentState.reservas;
      const finalRedes = restaurant.redes_sociales || currentState.redes_sociales;

      // Create the restaurant in the store first (this selects it)
      menuStore.createRestaurant(
        finalName,
        finalLogo,
        finalPrompt,
        finalPhone,
        finalReservas,
        finalRedes
      );

      // Get the newly created restaurant ID
      const storeState = get(menuStore);
      const newId = storeState.selectedRestaurant;

      if (!newId) {
        throw new Error('Failed to create restaurant');
      }

      // Update with the proper slug and other details (redundant? createRestaurant should handle most)
      // Let's ensure color and currency are set correctly if createRestaurant doesn't
      menuStore.updateRestaurantInfo(
        finalName,
        finalLogo,
        finalPrompt,
        slug,
        finalPhone,
        String(finalColor)
      );

      // Add categories and dishes from the upload
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

      // Dispatch the final state to the parent component
      const updateData = {
        id: newId,
        name: finalName,
        logo: finalLogo,
        customPrompt: finalPrompt,
        phoneNumber: finalPhone,
        currency: finalCurrency,
        color: finalColor,
        slug,
        reservas: finalReservas,
        redes_sociales: finalRedes
      };
      console.log('Dispatching update for new restaurant from upload:', updateData);
      dispatchFn('update', updateData);

    }
  } catch (error) {
    console.error('Error handling menu upload success:', error);
    toasts.error(t('errorProcessingUpload') + ': ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * Handle menu upload error
 */
export function handleMenuUploadError(event: CustomEvent, t: (key: string) => string) {
  const errorMessage = event.detail?.message || event.detail || 'Unknown upload error';
  toasts.error(t('error') + ': ' + t('menuUploadFailed') + ' - ' + errorMessage);
} 