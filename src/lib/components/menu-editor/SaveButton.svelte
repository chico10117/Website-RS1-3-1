<script lang="ts">
  import { menuStore, type MenuStore } from '$lib/stores/menu-store';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { toasts } from '$lib/stores/toast';
  import * as menuService from '$lib/services/menu.service';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { generateSlug } from '$lib/utils/slug';
  import { io } from 'socket.io-client';
  import {onMount} from "svelte";
  import { triggerIframeRefresh } from '$lib/stores/iframe-refresh';
  import { getContext } from 'svelte';
  import { get } from 'svelte/store';
  import type { Writable } from 'svelte/store';
  import type { Restaurant } from '$lib/types/menu.types';
  //console.log("SERVER IO",process.env.SMART_SERVER_HOST )
  // Initialize the socket connection with user id as namespace
  const socket = io(process.env.SMART_SERVER_HOST || 'https://reco.ucontext.live');

  // Type for translation function
  type TFunction = (key: string, fallback?: string) => string;
  // Get context, provide a fallback function that returns the key or a default string
  const tContext = getContext<TFunction>('t');
  const t: TFunction = tContext || ((key: string, fallback?: string) => fallback || key);

  // Reactive variables from store
  let selectedRestaurant: string | null;
  let restaurantName = '';
  let menuLogo: string | null = null;
  let customPrompt: string | null = null;
  let phoneNumber: number | null = null;
  let currency = '€';
  let color = '#85A3FA';
  let reservas: string | null = null;
  let redes_sociales: string | null = null;
  let isSaving = false;

  // Subscribe to store values
  menuStore.subscribe(value => {
      selectedRestaurant = value.selectedRestaurant;
      restaurantName = value.restaurantName;
      menuLogo = value.menuLogo;
      customPrompt = value.customPrompt;
      phoneNumber = value.phoneNumber;
      currency = value.currency;
      color = value.color;
      reservas = value.reservas;
      redes_sociales = value.redes_sociales;
      isSaving = value.isSaving;
  });

    // Current Restaurant store (used for initial slug/name check)
    let currentRestaurantValue: { id: string; name: string; slug: string; } | null = null;
    currentRestaurant.subscribe(value => {
        currentRestaurantValue = value;
    });

  // Function to clean phone number - ensure it's a valid number without spaces
  function cleanPhoneNumber(phone: number | string | null | undefined): number | null {
    if (phone === null || phone === undefined) return null;
    if (typeof phone === 'number') return phone; // Already a number
    const cleaned = phone.toString().replace(/\s+/g, '').replace(/\D/g, ''); // Remove spaces and non-digits
    if (cleaned.length > 0) {
      const numericValue = Number(cleaned);
      if (!isNaN(numericValue) && Number.isInteger(numericValue)) {
        return numericValue;
      }
    }
    return null;
  }

  onMount(()=> {

    socket.on('connect', () => {
      console.log('Connected to server', $menuStore);
    })
    socket.emit('check', 'Hello from the client');

    socket.on('images-generating', () => {
      console.log('Procesando imagenes');
    });
    socket.on('image-generated', () => {
      console.log('Imagen Generada');
    });
    socket.on('queue-finished', () => {
      console.log('Queue finished');
      toasts.success(t('completedProcessingImages', 'Images created'));
    });
  })

  // Make translations reactive with fallbacks
  $: currentLanguage = $language || 'en';

  // Reactive variables for UI state
  $: hasUnsavedChanges = $menuStore.changedItems.restaurant || 
                         $menuStore.changedItems.categories.size > 0 || 
                         $menuStore.changedItems.dishes.size > 0 ||
                         $menuStore.changedItems.deletedCategories.size > 0 ||
                         $menuStore.changedItems.deletedDishes.size > 0;
  
  $: isSaving = $menuStore.isSaving;
  $: lastSaveTime = $menuStore.lastSaveTime;

  // For debugging
  $: console.log('Save button state:', {
    selectedRestaurant,
    restaurantName,
    restaurantChanged: $menuStore.changedItems.restaurant,
    categoriesChanged: $menuStore.changedItems.categories.size,
    dishesChanged: $menuStore.changedItems.dishes.size,
    deletedCategories: $menuStore.changedItems.deletedCategories.size,
    deletedDishes: $menuStore.changedItems.deletedDishes.size,
    hasUnsavedChanges,
    currentLanguage,
    reservas: $menuStore.reservas,
    redes_sociales: $menuStore.redes_sociales
  });

  // Format the last save time
  function formatLastSaveTime(date: Date | null): string {
    if (!date) return '';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If less than a minute ago
    if (diff < 60000) {
      return t('justNow', 'Just now');
    }
    
    // If less than an hour ago
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${minutes === 1 ? (t('minuteAgo', 'minute ago') || 'minute ago') : (t('minutesAgo', 'minutes ago') || 'minutes ago')}`;
    }
    
    // Otherwise format as time
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  async function saveChanges() {
    // Use local variables derived from store subscriptions
    if (!selectedRestaurant && !restaurantName) {
      // Use fallback text if t doesn't work
      toasts.error(t('noRestaurantSelected', 'No restaurant selected')); 
      return;
    }

    // Mark as saving in the store
    menuStore.update((s: MenuStore) => ({ ...s, isSaving: true }));

    const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber);
    const colorValue = color === 'light' || color === '1'
      ? '#85A3FA' // Assuming '1' maps to the default blue
      : color;

    let slugToSave = currentRestaurantValue?.slug || null;
    const isNewRestaurant = !selectedRestaurant || selectedRestaurant.startsWith('temp_');

    try {
       const storeState = get(menuStore);
       if (isNewRestaurant || (storeState.changedItems.restaurant && restaurantName !== currentRestaurantValue?.name)) {
           if (restaurantName) {
               slugToSave = await generateSlug(restaurantName);
               console.log("Generated/validated slug:", slugToSave);
           } else {
               menuStore.update((s: MenuStore) => ({ ...s, isSaving: false }));
               // Use fallback text if t doesn't work
               throw new Error(t('cannotSaveWithoutName', "Cannot save without a restaurant name.")); 
           }
       } else if (!slugToSave && !isNewRestaurant && currentRestaurantValue?.slug) {
           slugToSave = currentRestaurantValue.slug;
       }

       if (isNewRestaurant && !slugToSave) {
           menuStore.update((s: MenuStore) => ({ ...s, isSaving: false }));
            // Use fallback text if t doesn't work
           throw new Error(t('failedToGenerateSlug', "Failed to generate a slug for the new restaurant."));
       }

      const restaurantDataForApi = {
        name: restaurantName,
        logo: menuLogo,
        slug: slugToSave,
        customPrompt: customPrompt,
        phoneNumber: cleanedPhoneNumber,
        currency: currency,
        color: colorValue,
        reservas: reservas,
        redes_sociales: redes_sociales,
      };

      console.log('SaveButton: Calling menuService.saveMenuChanges with:', {
          restaurantDataForApi,
          selectedRestaurant
      });

      const finalState: Restaurant = await menuService.saveMenuChanges(
        restaurantDataForApi,
        selectedRestaurant
      );

      console.log('SaveButton: Received final state from service:', { /* limited logging */ restaurantId: finalState.id });

      // Update the store AFTER successful save
      menuStore.update((s: MenuStore) => ({
          ...s,
          restaurants: s.restaurants.map((r: Restaurant) => r.id === finalState.id ? finalState : r.id === selectedRestaurant ? finalState : r)
                                     .filter((r: Restaurant, index: number, self: Restaurant[]) => index === self.findIndex((t: Restaurant) => t.id === r.id)),
          selectedRestaurant: finalState.id,
          restaurantName: finalState.name,
          menuLogo: finalState.logo,
          customPrompt: finalState.customPrompt,
          phoneNumber: finalState.phoneNumber,
          currency: finalState.currency,
          color: finalState.color,
          reservas: finalState.reservas,
          redes_sociales: finalState.redes_sociales,
          categories: finalState.categories || [],
          isSaving: false,
          lastSaveTime: new Date(),
          changedItems: {
              restaurant: false,
              categories: new Set<string>(),
              dishes: new Set<string>(),
              deletedCategories: new Set<string>(),
              deletedDishes: new Set<string>()
          }
      }));

      currentRestaurant.set(finalState);

      if (isNewRestaurant && typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('restaurant', finalState.id);
          window.history.replaceState({}, '', url.toString());
      }

       const restId = finalState.id;
       // Only call socket for image generation when creating a new restaurant
       if (isNewRestaurant && restId && typeof socket !== 'undefined' && socket.connected){
         socket.emit('request-images', restId);
       }

      // Use fallback text if t doesn't work
      toasts.success(t('changesSaved', 'Changes saved')); 
      triggerIframeRefresh();

    } catch (error) {
      console.error('Error saving changes:', error);
       // Use fallback text if t doesn't work
      const errorMsg = error instanceof Error ? error.message : t('unknownError', 'Unknown error');
      toasts.error(t('error', 'Error') + ': ' + errorMsg);
      menuStore.update((s: MenuStore) => ({ ...s, isSaving: false }));
    }
  }
</script>

<div class="flex items-center gap-4">
  <button
    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
    on:click={saveChanges}
    disabled={(!selectedRestaurant && !restaurantName) || (!hasUnsavedChanges && !$menuStore.changedItems.restaurant) || isSaving}
  >
    {#if isSaving}
      <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {t('saving', 'Saving...')}
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      {t('save', 'Save')}
    {/if}
  </button>
  
  <!-- {#if lastSaveTime}
    <span class="text-sm text-gray-500">
      {(t('lastSaved') || 'Last saved')}: {formatLastSaveTime(lastSaveTime)}
    </span>
  {/if} -->
</div>

<style>
  button {
    min-width: 100px;
  }
</style> 