// src/lib/utils/restaurant-info-helpers.ts
import { get } from 'svelte/store';
import { currentRestaurant } from '$lib/stores/restaurant';
import { user } from '$lib/stores/user';
import { menuStore } from '$lib/stores/menu-store';
import { toasts } from '$lib/stores/toast';
import { generateSlug } from '$lib/utils/slug';
import type { Restaurant } from '$lib/types/menu.types';

export interface UpdateEvent {
  id?: string;
  name: string;
  logo: string | null;
  customPrompt: string | null;
  phoneNumber: string | null;
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
  phoneNumber: string | null,
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
      
      menuStore.updateRestaurantInfo(
        cRest.name,
        logoUrl,
        cRest.customPrompt,
        cRest.slug,
        cRest.phoneNumber,
        String(existingColor)
      );
      dispatch('update', {
        id: cRest.id,
        name: cRest.name,
        logo: logoUrl,
        customPrompt: cRest.customPrompt,
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
      menuStore.createRestaurant(restaurantName, logoUrl, customPrompt, phoneNumber);

      const storeState = get(menuStore);
      const newId = storeState.selectedRestaurant;
      if (!newId) {
        throw new Error('Failed to create restaurant');
      }

      // Update the newly created restaurant with a valid slug
      menuStore.updateRestaurantInfo(
        restaurantName,
        logoUrl,
        customPrompt,
        newSlug,
        phoneNumber,
        String(color)
      );

      dispatch('update', {
        id: newId,
        name: restaurantName,
        logo: logoUrl,
        customPrompt,
        phoneNumber,
        currency,
        color,
        slug: newSlug,
        reservas: null,
        redes_sociales: null
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
      phoneNumber,
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
    
    // update store
    menuStore.updateRestaurantInfo(
      editingRestaurantName.trim(),
      menuLogo,
      customPrompt,
      newSlug,
      phoneNumber,
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
      phoneNumber,
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
        phoneNumber,
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
        phoneNumber,
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
  newPhoneNumber: string | null,
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
    const cRest = get(currentRestaurant);
    
    if (cRest) {
      // Preserve the current color from the database
      const existingColor = cRest.color || color;
      
      // Update the dispatch with preserved color
      dispatchFn('update', {
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
      });
    } else {
      // For a new restaurant
      const { restaurantName, logo, customPrompt, phoneNumber, slug, id } = event.detail;
      // For new restaurant that didn't exist before, we use the passed color
      dispatchFn('update', {
        id,
        name: restaurantName,
        logo,
        customPrompt,
        phoneNumber,
        currency,
        color,
        slug,
        reservas: null,
        redes_sociales: null
      });
    }
  } catch (error) {
    console.error('Error handling menu upload success:', error);
  }
}

/**
 * Handle menu upload error
 */
export function handleMenuUploadError(event: CustomEvent, t: (key: string) => string) {
  toasts.error(t('error') + ': ' + event.detail);
} 