<script lang="ts">
  import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { menuStore } from '$lib/stores';
  import { get } from 'svelte/store';
  import type { Restaurant } from '$lib/types/menu.types';
  import type { UpdateEvent } from '$lib/stores/types';
  
  // Import extracted components
  import MenuUploader from './MenuUploader.svelte';
  import RestaurantNameInput from './RestaurantNameInput.svelte';
  import LogoUploader from './LogoUploader.svelte';
  import CustomPromptInput from './CustomPromptInput.svelte';
  import ThemeColorSection from './ThemeColorSection.svelte';
  import CurrencyPicker from './CurrencyPicker.svelte';
  import UrlInputSection from './UrlInputSection.svelte';
  import PhoneInput from './PhoneInput.svelte';

  // Import our helpers
  import {
    handleRestaurantSelect,
    handleCurrencyChange,
    handleMenuUploadSuccess,
    handleMenuUploadError
  } from '$lib/utils/RestaurantInfo.helpers';

  import { cleanPhoneNumber } from '$lib/utils/cleanphoneNumber_helper';

  /******************
   *   PROPERTIES   *
   ******************/
  export let restaurantName = '';
  export let menuLogo: string | null = null;
  export let selectedRestaurant: string | null = null;
  export let restaurants: Restaurant[] = [];
  export let customPrompt: string | null = null;
  export let currency: string = '€';
  export let color: string = '#85A3FA';
  export let phoneNumber: number | null = null;
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;

  /***************************
   *   COMPONENT STATE / FLAGS
   ***************************/
  let isCreatingRestaurant = false;

  // Svelte event dispatcher
  const dispatch = createEventDispatcher<{
    update: UpdateEvent;
    select: string;
  }>();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  // Called on <select> for restaurant
  function onRestaurantSelect(event: Event) {
    handleRestaurantSelect(event, (evt, val) => dispatch(evt, val));
  }

  // Called on currency <input> change
  function onCurrencyChange(e: CustomEvent<string>) {
    const value = e.detail;
    currency = value;
    handleCurrencyChange(
      value,
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber,
      color,
      reservas,
      redes_sociales,
      dispatch
    );
  }

  // Handle phone number changes locally
  function handlePhoneChange(event: CustomEvent<number | null>) {
    const newValue = event.detail;
    console.log('!!! RestaurantInfo: handlePhoneChange received:', newValue);
    phoneNumber = newValue; // Update local state ONLY

    // REMOVED: Direct call to menuStore.updateRestaurantInfo
    /*
    menuStore.updateRestaurantInfo(
      restaurantName,
      menuLogo,
      customPrompt,
      null,
      phoneNumber,
      reservas,
      redes_sociales,
      color,
      currency
    );
    */

    // REMOVED: Direct dispatch call
    /*
    dispatch('update', {
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber: phoneNumber,
      color,
      currency,
      reservas,
      redes_sociales
    });
    */
  }

  onMount(() => {
    // Add detailed debugging of component mount
    console.log('RestaurantInfo component mounted with initial values:', {
      restaurantName, menuLogo, selectedRestaurant, customPrompt, currency, color, phoneNumber, reservas, redes_sociales
    });

    // Load restaurant data from the currentRestaurant store if available
    const cRest = get(currentRestaurant);
    if (cRest) {
      console.log('Loading initial restaurant data from store:', cRest);
      updateLocalStateFromRestaurant(cRest);
    }
  });

  // Helper function to update local state from a Restaurant object
  function updateLocalStateFromRestaurant(restaurantData: Restaurant) {
    console.log('Updating local state from restaurant:', restaurantData);
    restaurantName = restaurantData.name;
    menuLogo = restaurantData.logo;
    customPrompt = restaurantData.customPrompt;
    phoneNumber = restaurantData.phoneNumber ? parseInt(restaurantData.phoneNumber.toString().replace(/\D/g, ''), 10) : null;
    color = restaurantData.color || '#85A3FA';
    currency = restaurantData.currency || '€';
    reservas = restaurantData.reservas;
    redes_sociales = restaurantData.redes_sociales;
    currentRestaurant.set(restaurantData);
  }

  // Reactive statement to update fields when selectedRestaurant changes
  $: if (selectedRestaurant && restaurants.length > 0) {
    const restaurantData = restaurants.find(r => r.id === selectedRestaurant);
    if (restaurantData) {
      updateLocalStateFromRestaurant(restaurantData);
    } else {
      console.warn(`[RestaurantInfo] Restaurant with ID ${selectedRestaurant} not found in restaurants list.`);
    }
  } else if (!selectedRestaurant) {
    console.log('[RestaurantInfo] No restaurant selected. State potentially reset or retained based on logic.');
  }

  // Reactive update when currency changes
  $: if ($menuStore.selectedRestaurant && currency !== $menuStore.currency) {
    const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber); // Need current cleaned phone
    menuStore.updateRestaurantInfo(
      restaurantName,
      menuLogo,
      customPrompt,
      null, 
      cleanedPhoneNumber, 
      reservas,
      redes_sociales,
      color,
      currency 
    );
  }

  // Reactive update when phone number changes
  $: {
    if ($menuStore.selectedRestaurant) {
      const localPhoneNumberState = phoneNumber; // Use temporary variable for clarity in logs
      const cleanedLocalPhoneNumber = cleanPhoneNumber(localPhoneNumberState);
      const storePhoneNumber = $menuStore.phoneNumber;
      
      console.log('!!! RestaurantInfo: Reactive block check:', {
        localPhoneNumberState,
        cleanedLocalPhoneNumber,
        storePhoneNumber
      });

      if (cleanedLocalPhoneNumber !== storePhoneNumber) {
        console.log('!!! RestaurantInfo: Phone number changed, attempting store update...');
        menuStore.updateRestaurantInfo(
          restaurantName,
          menuLogo,
          customPrompt,
          null, 
          cleanedLocalPhoneNumber, 
          reservas,
          redes_sociales,
          color,
          currency
        );
      }
    }
  }

  // Reactive update for name
  $: if (restaurantName !== $menuStore.restaurantName) {
    menuStore.updateRestaurantInfo(
      restaurantName,
      menuLogo,
      customPrompt,
      null,
      phoneNumber,
      reservas,
      redes_sociales,
      color,
      currency
    );
  }
</script>

<div class="space-y-4">
  {#if !selectedRestaurant}
    <!-- Menu Uploader -->
    <div class="space-y-2 mb-12">
      <label class="block text-lg font-semibold mb-3 text-gray-800">
        {t('uploadMenu')}
      </label>
      <MenuUploader
        {restaurantName}
        {customPrompt}
        restaurantId={$currentRestaurant?.id || null}
        on:success={async (event) => {
          handleMenuUploadSuccess(event, dispatch, currency, color);
        }}
        on:error={(event) => {
          handleMenuUploadError(event, t);
        }}
      />
    </div>
  {/if}

  <!-- Restaurant Name Input -->
  <RestaurantNameInput
    bind:restaurantName
    bind:menuLogo
    bind:selectedRestaurant
    bind:isCreatingRestaurant
    bind:customPrompt
    bind:phoneNumber
    bind:color
    bind:currency
    bind:reservas
    bind:redes_sociales
    on:update={(event) => dispatch('update', event.detail)}
  />

  <!-- Logo Upload -->
  <LogoUploader
    bind:restaurantName
    bind:menuLogo
    bind:selectedRestaurant
    bind:customPrompt
    bind:phoneNumber
    bind:color
    bind:currency
    bind:reservas
    bind:redes_sociales
    on:update={(event) => dispatch('update', event.detail)}
  />

  <!-- Custom Prompt -->
  <CustomPromptInput
    bind:restaurantName
    bind:selectedRestaurant
    bind:menuLogo
    bind:customPrompt
    bind:phoneNumber
    bind:color
    bind:currency
    bind:reservas
    bind:redes_sociales
    on:update={(event) => dispatch('update', event.detail)}
  />

  <!-- Color and Settings Sections -->
  <div class="space-y-4 mt-6 mb-12">
    <ThemeColorSection
      bind:restaurantName
      bind:selectedRestaurant
      bind:menuLogo
      bind:customPrompt
      bind:phoneNumber
      bind:color
      bind:currency
      on:update={(event) => dispatch('update', event.detail)}
    />

    <!-- Currency Selection -->
    <CurrencyPicker
      value={currency}
      {t}
      on:change={onCurrencyChange}
    />

    <!-- Phone Number -->
    <div class="space-y-2 mb-12">
      <PhoneInput
        phoneNumber={phoneNumber}
        on:change={handlePhoneChange}
      />
    </div>

    <!-- URL Inputs -->
    <UrlInputSection
      bind:restaurantName
      bind:selectedRestaurant
      bind:menuLogo
      bind:customPrompt
      bind:phoneNumber
      bind:color
      bind:currency
      bind:reservas
      bind:redes_sociales
      on:update={(event) => dispatch('update', event.detail)}
    />
  </div>
</div>

<style>
  :global(input[type="text"]) {
    @apply border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2
      focus:ring-blue-500 focus:border-transparent transition-all
      duration-200 ease-in-out bg-white/80 backdrop-blur-sm;
  }

  :global(input[type="text"]::placeholder) {
    @apply text-gray-400;
  }

  span {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(.form-radio) {
    @apply h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500;
  }
</style>