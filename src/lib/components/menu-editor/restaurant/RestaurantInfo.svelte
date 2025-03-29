<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { menuStore } from '$lib/stores';
  import { get } from 'svelte/store';
  import type { Restaurant } from '$lib/types/menu.types';
  
  // Import extracted components
  import MenuUploader from './MenuUploader.svelte';
  import RestaurantNameInput from './RestaurantNameInput.svelte';
  import LogoUploader from './LogoUploader.svelte';
  import CustomPromptInput from './CustomPromptInput.svelte';
  import ThemeColorSection from './ThemeColorSection.svelte';
  import PhoneInput from './PhoneInput.svelte';
  import CurrencyPicker from './CurrencyPicker.svelte';
  import UrlInputSection from './UrlInputSection.svelte';

  // Import our helpers
  import { type UpdateEvent, 
    handleRestaurantSelect,
    handleCurrencyChange,
    handleMenuUploadSuccess, 
    handleMenuUploadError,
    handlePhoneNumberChange
  } from '$lib/utils/RestaurantInfo.helpers';

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

  function handlePhoneChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const phoneValue = input.value || null;
    const numericPhone = phoneValue ? parseInt(phoneValue.replace(/\D/g, ''), 10) : null;
    
    menuStore.updateRestaurantInfo(
      restaurantName,
      menuLogo,
      customPrompt,
      null,
      numericPhone,
      reservas,
      redes_sociales,
      color
    );

    // Dispatch update event
    dispatch('update', {
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber: numericPhone,
      color,
      currency,
      reservas,
      redes_sociales
    });
  }

  // Watch for changes in the currentRestaurant store
  $: if ($currentRestaurant) {
    // When the current restaurant changes, update the component state
    console.log('Current restaurant updated:', $currentRestaurant);
    
    // Update color from restaurant
    if ($currentRestaurant.color) {
      console.log('Setting color from database:', $currentRestaurant.color);
      color = $currentRestaurant.color;
    }
    
    // Update phone number from restaurant
    if ($currentRestaurant.phoneNumber !== undefined) {
      console.log('Setting phone number from database:', $currentRestaurant.phoneNumber);
      phoneNumber = $currentRestaurant.phoneNumber;
    }
    
    // Update URLs from restaurant
    if ($currentRestaurant.reservas !== undefined) {
      console.log('Setting reservas URL from database:', $currentRestaurant.reservas);
      reservas = $currentRestaurant.reservas;
    }
    
    if ($currentRestaurant.redes_sociales !== undefined) {
      console.log('Setting social media URL from database:', $currentRestaurant.redes_sociales);
      redes_sociales = $currentRestaurant.redes_sociales;
    }
  }

  // Watch for changes in menuStore selectedRestaurant
  $: if ($menuStore.selectedRestaurant) {
    // Ensure we're getting the latest values from menuStore
    console.log('MenuStore selected restaurant updated:', $menuStore);
    
    // Syncing component state with menuStore
    phoneNumber = $menuStore.phoneNumber;
    color = $menuStore.color;
    reservas = $menuStore.reservas;
    redes_sociales = $menuStore.redes_sociales;
  }

  onMount(() => {
    // Add detailed debugging of component mount
    console.log('RestaurantInfo component mounted with initial values:', {
      reservas,
      redes_sociales,
      color,
      phoneNumber
    });

    // Load restaurant data from the currentRestaurant store if available
    const cRest = get(currentRestaurant);
    if (cRest) {
      console.log('Loading restaurant data from store:', cRest);
      
      // Load the color value from the restaurant record
      if (cRest.color) {
        console.log('Setting color from database:', cRest.color);
        color = cRest.color;
      }
      
      // Load the phone number from the restaurant record
      if (cRest.phoneNumber !== undefined) {
        console.log('Setting phone number from database:', cRest.phoneNumber);
        phoneNumber = cRest.phoneNumber;
      }
      
      // Load URLs from the restaurant record
      if (cRest.reservas !== undefined) {
        console.log('Setting reservas URL from database:', cRest.reservas);
        reservas = cRest.reservas;
      }
      
      if (cRest.redes_sociales !== undefined) {
        console.log('Setting social media URL from database:', cRest.redes_sociales);
        redes_sociales = cRest.redes_sociales;
      }
    }
  });
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