<script lang="ts">
  import { menuStore } from '$lib/stores/menu-store';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { toasts } from '$lib/stores/toast';
  import * as menuService from '$lib/services/menu.service';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { generateSlug } from '$lib/utils/slug';
  import { io } from 'socket.io-client';
  import {onMount} from "svelte";
  import { triggerIframeRefresh } from '$lib/stores/iframe-refresh';
  //console.log("SERVER IO",process.env.SMART_SERVER_HOST )
  // Initialize the socket connection with user id as namespace
  const socket = io(process.env.SMART_SERVER_HOST || 'https://reco.ucontext.live');

  // Function to clean phone number - ensure it's a valid number without spaces
  function cleanPhoneNumber(phone: number | null | undefined): number | null {
    if (phone === null || phone === undefined) return null;
    
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

  // Make translations reactive with fallbacks to prevent errors
  $: currentLanguage = $language || 'en';
  $: t = (key: string): string => {
    if (!translations || !translations[key] || !translations[key][currentLanguage]) {
      return key; // Return the key itself as fallback
    }
    return translations[key][currentLanguage];
  };

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
      toasts.success(t('completedProcessingImages') || 'Images created');
    });
  })




  // Reactive variables for UI state
  $: hasUnsavedChanges = $menuStore.changedItems.restaurant || 
                         $menuStore.changedItems.categories.size > 0 || 
                         $menuStore.changedItems.dishes.size > 0 ||
                         $menuStore.changedItems.deletedCategories.size > 0 ||
                         $menuStore.changedItems.deletedDishes.size > 0;
  
  $: isSaving = $menuStore.isSaving;
  $: lastSaveTime = $menuStore.lastSaveTime;
  $: selectedRestaurant = $menuStore.selectedRestaurant;
  $: restaurantName = $menuStore.restaurantName;

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
      return t('justNow') || 'Just now';
    }
    
    // If less than an hour ago
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${minutes === 1 ? (t('minuteAgo') || 'minute ago') : (t('minutesAgo') || 'minutes ago')}`;
    }
    
    // Otherwise format as time
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  async function saveChanges() {
    if (!selectedRestaurant && !restaurantName) {
      toasts.error(t('noRestaurantSelected') || 'No restaurant selected');
      return;
    }

    // Clean the phone number before saving
    const cleanedPhoneNumber = cleanPhoneNumber($menuStore.phoneNumber);
    console.log('Cleaned phone number before save:', cleanedPhoneNumber);

    // Debug URLs and entire menuStore state to see where the issue is
    console.log('Before saving - Complete state:', {
      entireMenuStore: $menuStore,
      colorValue: $menuStore.color,
      reservas: $menuStore.reservas,
      redes_sociales: $menuStore.redes_sociales,
      phoneNumber: cleanedPhoneNumber
    });

    // Ensure color is a hex value, not 'light' or '1'
    const colorValue = $menuStore.color === 'light' || $menuStore.color === '1' 
      ? '#85A3FA' 
      : $menuStore.color;
    
    console.log('Starting save with color:', colorValue);

    try {
      // If we have a restaurant name but no selected restaurant, we need to create a new one
      if (restaurantName && !selectedRestaurant) {
        // Generate a slug for the new restaurant
        const newSlug = await generateSlug(restaurantName);
        
        console.log('Creating restaurant with color:', colorValue, 'and URLs:', {
          reservas: $menuStore.reservas,
          redes_sociales: $menuStore.redes_sociales,
          phoneNumber: cleanedPhoneNumber
        });
        
        // Create the restaurant in the store with cleaned phone number
        menuStore.createRestaurant(
          restaurantName,
          $menuStore.menuLogo,
          $menuStore.customPrompt,
          cleanedPhoneNumber,
          $menuStore.reservas,
          $menuStore.redes_sociales
        );
        
        // Get the newly created restaurant ID
        const storeState = $menuStore;
        const newId = storeState.selectedRestaurant;
        
        if (!newId) {
          throw new Error('Failed to create restaurant');
        }
        
        console.log('Updating restaurant with color:', colorValue);
        
        // Update with the proper slug and cleaned phone number
        menuStore.updateRestaurantInfo(
          restaurantName,
          $menuStore.menuLogo,
          $menuStore.customPrompt,
          newSlug,
          cleanedPhoneNumber,
          $menuStore.reservas,
          $menuStore.redes_sociales,
          colorValue
        );
        
        // Update the current restaurant store
        if ($currentRestaurant === null) {
          const newRestaurant = storeState.restaurants.find(r => r.id === newId);
          if (newRestaurant) {
            currentRestaurant.set({
              ...newRestaurant,
              slug: newSlug,
              color: colorValue,
              reservas: $menuStore.reservas,
              redes_sociales: $menuStore.redes_sociales
            });
          }
        }
      }
      
      // CRITICAL: Make absolutely sure the URL values are set before saving
      // This should not be necessary, but we're adding it as a failsafe
      let currentReservas = $menuStore.reservas; 
      let currentRedesSociales = $menuStore.redes_sociales;
      
      console.log('CRITICAL CHECK - RIGHT BEFORE SAVE:', {
        reservas: currentReservas,
        redes_sociales: currentRedesSociales
      });
      
      console.log('Calling saveChanges with color in store:', colorValue, 
        'reservas:', $menuStore.reservas, 
        'redes_sociales:', $menuStore.redes_sociales
      );
      
      // Use the menuStore's saveChanges method to save all changes
      const result = await menuStore.saveChanges();
      
      // Debug the result
      console.log('*******Save result:', {
        //logo: result.restaurant.logo,
        customPrompt: result.restaurant.customPrompt,
        color: result.restaurant.color,
        currency: result.restaurant.currency,
        phoneNumber: result.restaurant.phoneNumber,
        reservas: result.restaurant.reservas,
        redes_sociales: result.restaurant.redes_sociales,
      });
      
      const restId = $menuStore.selectedRestaurant;
      
       // Only call socket for image generation when creating a new restaurant
       if (isNewRestaurant && restId && typeof socket !== 'undefined' && socket.connected){{
        socket.emit('request-images', restId);
      }

      // Show success message
      toasts.success(t('changesSaved') || 'Changes saved');
      
      // Trigger iframe refresh
      triggerIframeRefresh();
      
    } catch (error) {
      console.error('Error saving changes:', error);
      if (error instanceof Error) {
        toasts.error((t('error') || 'Error') + ': ' + error.message);
      } else {
        toasts.error((t('error') || 'Error') + ': ' + (t('unknownError') || 'Unknown error'));
      }
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
      {t('saving') || 'Saving...'}
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      {t('save') || 'Save'}
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