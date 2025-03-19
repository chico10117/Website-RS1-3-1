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
  currency: string;
  color: string | number;
  slug?: string;
}

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
  color: string,
  currency: string,
  dispatchFn: (event: 'update', detail: UpdateEvent) => void,
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

    const cRest = get(currentRestaurant);
    // If editing an existing restaurant
    if (cRest) {
      menuStore.updateRestaurantInfo(
        cRest.name,
        uploadResult.url || null,
        cRest.customPrompt,
        cRest.slug,
        cRest.phoneNumber,
        cRest.color
      );
      dispatchFn('update', {
        id: cRest.id,
        name: cRest.name,
        logo: uploadResult.url || null,
        customPrompt: cRest.customPrompt,
        phoneNumber: cRest.phoneNumber,
        currency,
        color,
        slug: cRest.slug
      });
    } else {
      // For a new restaurant
      if (!restaurantName) {
        throw new Error('Restaurant name is required');
      }

      // Generate a new slug
      const newSlug = await generateSlug(restaurantName);
      menuStore.createRestaurant(restaurantName, uploadResult.url || null, customPrompt, phoneNumber);

      const storeState = get(menuStore);
      const newId = storeState.selectedRestaurant;
      if (!newId) {
        throw new Error('Failed to create restaurant');
      }

      // Update the newly created restaurant with a valid slug
      menuStore.updateRestaurantInfo(
        restaurantName,
        uploadResult.url || null,
        customPrompt,
        newSlug,
        phoneNumber,
        color
      );

      dispatchFn('update', {
        id: newId,
        name: restaurantName,
        logo: uploadResult.url || null,
        customPrompt,
        phoneNumber,
        currency,
        color,
        slug: newSlug
      });
    }
  } catch (error) {
    console.error('Error uploading logo:', error);
    if (error instanceof Error) {
      toasts.error(t('error') + ': ' + error.message);
    }
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
  color: string,
  currency: string,
  dispatchFn: (event: 'update', detail: UpdateEvent) => void,
  t: (key: string) => string
) {
  try {
    if (!restaurantName || selectedRestaurant || isCreatingRestaurant) {
      return;
    }
    // Just update the local store name, no restaurant created in DB
    menuStore.updateLocalRestaurantName(restaurantName);

    const cRest = get(currentRestaurant);
    dispatchFn('update', {
      id: selectedRestaurant || undefined,
      name: restaurantName,
      logo: menuLogo,
      customPrompt,
      phoneNumber,
      currency,
      color,
      slug: cRest?.slug || ''
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
  color: string,
  currency: string,
  dispatchFn: (event: 'update', detail: UpdateEvent) => void,
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
    // update store
    menuStore.updateRestaurantInfo(
      editingRestaurantName.trim(),
      menuLogo,
      customPrompt,
      newSlug,
      phoneNumber,
      color
    );
    // update current store
    const cRest = get(currentRestaurant);
    if (cRest) {
      currentRestaurant.set({
        ...cRest,
        name: editingRestaurantName.trim(),
        slug: newSlug,
        color
      });
    }
    // update local Svelte state
    setLocalRestaurantName(editingRestaurantName.trim());
    dispatchFn('update', {
      id: selectedRestaurant,
      name: editingRestaurantName.trim(),
      logo: menuLogo,
      customPrompt,
      phoneNumber,
      currency,
      color,
      slug: newSlug
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

export function handleRestaurantSelect(event: Event, dispatchFn: (event: 'select', val: string) => void) {
  const select = event.target as HTMLSelectElement;
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
  color: string,
  currency: string,
  t: (key: string) => string,
  dispatchFn: (event: 'update', detail: UpdateEvent) => void
): string | null {
  const target = event.target as HTMLTextAreaElement;
  const newPrompt = target.value || null;
  
  try {
    // Update store
    menuStore.updateRestaurantInfo(
      restaurantName,
      menuLogo,
      newPrompt,
      get(currentRestaurant)?.slug || null,
      phoneNumber,
      color
    );
    
    // Update current restaurant
    const cRest = get(currentRestaurant);
    if (cRest) {
      currentRestaurant.set({
        ...cRest,
        customPrompt: newPrompt
      });
    }
    
    // Dispatch update event
    dispatchFn('update', {
      id: selectedRestaurant || undefined,
      name: restaurantName,
      logo: menuLogo,
      customPrompt: newPrompt,
      phoneNumber,
      currency,
      color,
      slug: get(currentRestaurant)?.slug || ''
    });
    
    return newPrompt;
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
  color: string,
  currency: string,
  dispatchFn: (event: 'update', detail: UpdateEvent) => void
): string | null {
  event.preventDefault();
  event.stopPropagation();
  
  // Update store with null logo
  menuStore.updateRestaurantInfo(
    restaurantName,
    null,
    customPrompt,
    get(currentRestaurant)?.slug || null,
    phoneNumber,
    color
  );
  
  // Update current restaurant if exists
  const cRest = get(currentRestaurant);
  if (cRest) {
    currentRestaurant.set({
      ...cRest,
      logo: null
    });
  }
  
  // Dispatch update event
  dispatchFn('update', {
    id: get(currentRestaurant)?.id,
    name: restaurantName,
    logo: null,
    customPrompt,
    phoneNumber,
    currency,
    color,
    slug: get(currentRestaurant)?.slug || ''
  });
  
  return null;
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
  color: string,
  dispatchFn: (event: 'update', detail: UpdateEvent) => void
) {
  const cRest = get(currentRestaurant);
  dispatchFn('update', {
    id: cRest?.id,
    name: restaurantName,
    logo: menuLogo,
    customPrompt,
    phoneNumber,
    currency: value,
    color,
    slug: cRest?.slug || ''
  });
}

/**
 * Handle phone number change 
 */
export function handlePhoneNumberChange(
  newPhoneNumber: string | null,
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  color: string,
  currency: string,
  dispatchFn: (event: 'update', detail: UpdateEvent) => void
) {
  // Update store with new phone number
  menuStore.updateRestaurantInfo(
    restaurantName,
    menuLogo,
    customPrompt,
    get(currentRestaurant)?.slug || null,
    newPhoneNumber,
    color
  );
  
  // Update current restaurant if exists
  const cRest = get(currentRestaurant);
  if (cRest) {
    currentRestaurant.set({
      ...cRest,
      phoneNumber: newPhoneNumber
    });
  }
  
  // Dispatch update event
  dispatchFn('update', {
    id: cRest?.id,
    name: restaurantName,
    logo: menuLogo,
    customPrompt,
    phoneNumber: newPhoneNumber,
    currency,
    color,
    slug: cRest?.slug || ''
  });
}

/**
 * Handle menu upload success
 */
export async function handleMenuUploadSuccess(
  event: CustomEvent,
  dispatchFn: (event: 'update', detail: UpdateEvent) => void,
  currency: string,
  color: string
) {
  try {
    let restaurantData = event.detail.restaurantData;

    // If there's an existing restaurant, merge with new data
    if (get(currentRestaurant)) {
      const updatedRestaurant = {
        ...get(currentRestaurant),
        ...restaurantData.restaurant,
        updatedAt: new Date()
      };
      menuStore.updateRestaurantInfo(
        updatedRestaurant.name,
        updatedRestaurant.logo,
        updatedRestaurant.customPrompt,
        updatedRestaurant.slug,
        updatedRestaurant.phoneNumber,
        updatedRestaurant.color || '1'
      );
      currentRestaurant.set(updatedRestaurant);
    }

    // Dispatch "update"
    dispatchFn('update', {
      id: restaurantData.restaurant.id,
      name: restaurantData.restaurant.name,
      logo: restaurantData.restaurant.logo,
      customPrompt: restaurantData.restaurant.customPrompt,
      phoneNumber: restaurantData.restaurant.phoneNumber,
      currency,
      color,
      slug: get(currentRestaurant)?.slug || ''
    });

    // If categories exist, add them to menuStore
    if (restaurantData.categories && restaurantData.categories.length > 0) {
      const categoryIdMap = new Map();
      for (const category of restaurantData.categories) {
        menuStore.addCategory(category.name);
        const storeState = get(menuStore);
        const newCategory = storeState.categories.find(
          (c) => c.name === category.name && c.id.startsWith('temp_')
        );
        if (newCategory) {
          categoryIdMap.set(category.id, newCategory.id);
          if (category.dishes && category.dishes.length > 0) {
            for (const dish of category.dishes) {
              menuStore.addDish(newCategory.id, {
                title: dish.title,
                description: dish.description || '',
                price: dish.price?.toString() || '0',
                imageUrl: dish.imageUrl || null
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error handling menu upload success:', error);
    if (error instanceof Error) {
      toasts.error('Error: ' + error.message);
    }
  }
}

/**
 * Handle menu upload error
 */
export function handleMenuUploadError(event: CustomEvent, t: (key: string) => string) {
  toasts.error(t('error') + ': ' + event.detail);
} 