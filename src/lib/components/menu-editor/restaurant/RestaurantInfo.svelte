<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { toasts } from '$lib/stores/toast';
  import { get } from 'svelte/store';
  import type { Restaurant } from '$lib/types/menu.types';
  import MenuUploader from './MenuUploader.svelte';
  import PhoneInput from './PhoneInput.svelte';
  import ColorPicker from './ColorPicker.svelte';
  import CurrencyPicker from './CurrencyPicker.svelte';

  // Import our new helpers
  import { type UpdateEvent,
    ensureString,
    ensureStringOrNull,
    handleDrag,
    handleDrop,
    handleFileUpload,
    handleRestaurantNameInput,
    startEditingRestaurant,
    cancelEditingRestaurant,
    handleRestaurantEditKeyPress,
    updateRestaurantName,
    handleRestaurantSelect,
    handleCustomPromptInput,
    handleLogoDelete,
    handleCurrencyChange,
    handleMenuUploadSuccess,
    handleMenuUploadError,
    handlePhoneNumberChange
  } from '$lib/utils/RestaurantInfo.helpers';

  import {
    updateColor as updateColorHelper,
    onColorChange as onColorChangeHelper,
    onAcceptCustomColor as onAcceptCustomColorHelper,
    onCancelCustomColor as onCancelCustomColorHelper,
    initializeCustomColor
  } from '$lib/utils/color.helpers';

  /******************
   *   PROPERTIES   *
   ******************/
  export let restaurantName = '';
  export let menuLogo: string | null = null;
  export let selectedRestaurant: string | null = null;
  export let restaurants: Restaurant[] = [];
  export let customPrompt: string | null = null;
  export let currency: string = '€';
  export let color: string = '1';
  export let phoneNumber: string | null = null;

  /***************************
   *   COMPONENT STATE / FLAGS
   ***************************/
  let customColorValue = '';

  let isEditingRestaurant = false;
  let editingRestaurantName = '';
  let isCreatingRestaurant = false;
  let isUploading = false;
  let isDragging = false;

  let showCustomColorPicker = false;
  let customColorInput = '';
  let pickerPosition = { x: 0, y: 0 };
  let hueValue = 0;
  let tempColorValue = '';

  // Svelte event dispatcher
  const dispatch = createEventDispatcher<{
    update: UpdateEvent;
    select: string;
  }>();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  // For debugging
  $: console.log('Current restaurant state:', {
    currentRestaurant: $currentRestaurant,
    hasSlug: !!$currentRestaurant?.slug,
    slug: $currentRestaurant?.slug
  });

  // Color options
  $: colorOptions = [
    { value: 1, label: t('colorLight') },
    { value: 2, label: t('colorGreen') },
    { value: 3, label: t('colorPink') },
    { value: 4, label: t('colorDark') },
    { value: 5, label: t('colorCustom') }
  ];

  // If the 'color' prop is a hex, assume it's custom
  $: {
    if (color && typeof color === 'string' && !['1','2','3','4','5'].includes(color)) {
      customColorValue = color.toUpperCase();
      // For hex colors, we should select the custom radio button
      color = '5';
      showCustomColorPicker = true;
    }
  }

  // Called on dragenter
  function handleDragEnter(e: DragEvent) {
    const canEdit = !!selectedRestaurant || !!restaurantName;
    isDragging = handleDrag(e, canEdit, true);
  }

  // Called on dragleave
  function handleDragLeave(e: DragEvent) {
    const canEdit = !!selectedRestaurant || !!restaurantName;
    isDragging = handleDrag(e, canEdit, false);
  }

  // Called on dragover
  function handleDragOver(e: DragEvent) {
    const canEdit = !!selectedRestaurant || !!restaurantName;
    isDragging = handleDrag(e, canEdit, true);
  }

  // Called on drop
  async function handleLogoDrop(e: DragEvent) {
    const canEdit = !!selectedRestaurant || !!restaurantName;
    await handleDrop(e, canEdit, t, async (file) => {
      await handleFileUpload(
        file,
        restaurantName,
        customPrompt,
        phoneNumber,
        color,
        currency,
        (evt, detail) => dispatch(evt, detail),
        t
      );
    }, (val) => isDragging = val);
  }

  // Called on logo <input> change
  async function handleLogoUploadInput(event: Event) {
    if (!selectedRestaurant && !restaurantName) {
      toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
      return;
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    await handleFileUpload(
      file,
      restaurantName,
      customPrompt,
      phoneNumber,
      color,
      currency,
      (evt, detail) => dispatch(evt, detail),
      t
    );
  }

  // Called on <input> blur for restaurantName
  function onRestaurantNameBlur() {
    handleRestaurantNameInput(
      restaurantName,
      selectedRestaurant,
      isCreatingRestaurant,
      menuLogo,
      customPrompt,
      phoneNumber,
      color,
      currency,
      (evt, detail) => dispatch(evt, detail),
      t
    );
  }

  // Called on "Edit" button
  function onEditRestaurantClick() {
    startEditingRestaurant(
      (val) => editingRestaurantName = val,
      (val) => isEditingRestaurant = val,
      restaurantName
    );
  }

  // Called on "Cancel" button while editing
  function onCancelEdit() {
    cancelEditingRestaurant(
      (val) => editingRestaurantName = val,
      (val) => isEditingRestaurant = val,
      restaurantName
    );
  }

  // Actually update the restaurant name
  async function onUpdateRestaurantName() {
    await updateRestaurantName(
      editingRestaurantName,
      selectedRestaurant,
      menuLogo,
      customPrompt,
      phoneNumber,
      color,
      currency,
      (evt, detail) => dispatch(evt, detail),
      t,
      (val) => restaurantName = val,
      (val) => isEditingRestaurant = val
    );
  }

  // On "Enter" or "Escape"
  function onRestaurantEditKeyPress(event: KeyboardEvent) {
    handleRestaurantEditKeyPress(
      event,
      onUpdateRestaurantName,
      onCancelEdit
    );
  }

  // Called on <select> for restaurant
  function onRestaurantSelect(event: Event) {
    handleRestaurantSelect(event, (evt, val) => dispatch(evt, val));
  }

  // Called on customPrompt <textarea> input
  function onCustomPromptInput(event: Event) {
    const newVal = handleCustomPromptInput(
      event,
      selectedRestaurant,
      restaurantName,
      menuLogo,
      phoneNumber,
      color,
      currency,
      t,
      (evt, detail) => dispatch(evt, detail)
    );
    if (newVal !== null) {
      customPrompt = newVal; // keep local store in sync
    }
  }

  // Called on "delete logo" button
  function onDeleteLogo(event: MouseEvent) {
    const result = handleLogoDelete(
      event,
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber,
      color,
      currency,
      (evt, detail) => dispatch(evt, detail)
    );
    // result is the updated menuLogo (null if success)
    menuLogo = result;
  }

  // Called on color radio <input> change
  function onColorChange(value: string) {
    console.log('Color radio changed to:', value);
    
    if (value === '5') {
      showCustomColorPicker = true;
    } else {
      // For standard colors
      color = value;
      updateColorHelper(
        value,
        restaurantName,
        menuLogo,
        customPrompt,
        phoneNumber,
        currency,
        customColorValue,
        (val) => color = val,
        (evt, detail) => dispatch(evt, detail)
      );
    }
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
      (evt, detail) => dispatch(evt, detail)
    );
  }

  function onAcceptCustomColor(event: CustomEvent<string>) {
    const tempColorValue = event.detail;
    onAcceptCustomColorHelper(
      tempColorValue,
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber,
      currency,
      customColorValue,
      (val) => color = val,
      (val) => customColorValue = val,
      (val) => showCustomColorPicker = val,
      (evt, detail) => dispatch(evt, detail)
    );
  }

  function onCancelCustomColor() {
    onCancelCustomColorHelper(
      customColorValue,
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber,
      currency,
      (val) => color = val,
      (val) => showCustomColorPicker = val,
      (evt, detail) => dispatch(evt, detail)
    );
  }

  onMount(() => {
    // Load restaurant data from the currentRestaurant store if available
    const cRest = get(currentRestaurant);
    if (cRest) {
      console.log('Loading restaurant data from store:', cRest);
      
      // Load the color value from the restaurant record
      if (cRest.color) {
        console.log('Setting color from database:', cRest.color);
        
        // If it's a hex color (custom color)
        if (typeof cRest.color === 'string' && cRest.color.startsWith('#')) {
          // For custom hex colors, set color to '5' (custom option)
          color = '5';
          customColorValue = cRest.color.toUpperCase();
          tempColorValue = cRest.color.toUpperCase();
          customColorInput = cRest.color.toUpperCase();
          
          // Also show the color picker for custom colors
          showCustomColorPicker = true;
          
          console.log('Custom hex color loaded:', {
            color,
            customColorValue,
            showCustomColorPicker
          });
        } else {
          // It's a standard color (1-4) or "5" for custom color
          color = String(cRest.color);
          
          // If it's custom color option, also load the saved hex value
          if (color === '5') {
            // Show the color picker for custom colors
            showCustomColorPicker = true;
            
            // Try to load from localStorage as fallback
            initializeCustomColor(
              color,
              selectedRestaurant,
              (v) => customColorValue = v,
              (v) => tempColorValue = v,
              (v) => customColorInput = v,
              (v) => color = v,
              (v) => showCustomColorPicker = v
            );
            
            console.log('Standard color "5" loaded with color from storage:', customColorValue);
          }
        }
      }
    } else if (color === '5') {
      // No current restaurant, but custom color is selected
      // Show the color picker for custom colors
      showCustomColorPicker = true;
      
      // Try to load from localStorage as fallback
      initializeCustomColor(
        color,
        selectedRestaurant,
        (v) => customColorValue = v,
        (v) => tempColorValue = v,
        (v) => customColorInput = v,
        (v) => color = v,
        (v) => showCustomColorPicker = v
      );
    }
  });

  // Whenever customColorValue changes, store it
  $: if (customColorValue && typeof customColorValue === 'string' && typeof window !== 'undefined') {
    localStorage.setItem(`customColor_${selectedRestaurant || 'new'}`, customColorValue.toUpperCase());
  }

  // Computed for UI
  $: displayLogo = ensureString(menuLogo);
  $: displayCustomPrompt = ensureString(customPrompt);

  // Reset the custom color state when the selected restaurant changes
  $: if (selectedRestaurant) {
    // Reset only when a new restaurant is selected
    const cRest = get(currentRestaurant);
    
    // Clear the custom color values if the current restaurant doesn't have a hex color
    if (cRest && cRest.color) {
      console.log('Current restaurant color:', cRest.color);
      
      if (!cRest.color.startsWith('#') && ['1','2','3','4'].includes(cRest.color)) {
        console.log('Resetting custom color state because new restaurant has standard color:', cRest.color);
        customColorValue = '';
        tempColorValue = '';
        customColorInput = '';
        // Close the color picker if it's open
        if (showCustomColorPicker) {
          showCustomColorPicker = false;
        }
      }
    }
  }
  
  // When currentRestaurant changes, reset color values
  $: {
    const cRest = $currentRestaurant;
    // Reset only if not the initial mount (and if actual restaurant exists)
    if (cRest) {
      console.log('currentRestaurant changed, color:', cRest.color);
      
      // Reset any custom color state if switching to a restaurant with a standard color
      if (cRest.color && !cRest.color.startsWith('#') && ['1','2','3','4'].includes(cRest.color)) {
        // If it's a standard color, set it and clear custom values
        color = cRest.color;
        customColorValue = '';
        tempColorValue = '';
        customColorInput = '';
        
        // Close the custom color picker
        showCustomColorPicker = false;
      }
    }
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
          handleMenuUploadSuccess(event, (evt, detail) => dispatch(evt, detail), currency, color);
        }}
        on:error={(event) => {
          handleMenuUploadError(event, t);
        }}
      />
    </div>
  {/if}

  <!-- Restaurant Name Input -->
  <div class="space-y-2">
    {#if isEditingRestaurant}
      <div class="flex items-center gap-2 w-full">
        <input
          type="text"
          bind:value={editingRestaurantName}
          on:keydown={onRestaurantEditKeyPress}
          placeholder={t('enterRestaurantName')}
          class="flex-1"
        />
        <button
          class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          on:click={onUpdateRestaurantName}
        >
          {t('save')}
        </button>
        <button
          class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          on:click={onCancelEdit}
        >
          {t('cancel')}
        </button>
      </div>
    {:else}
      <div class="w-full">
        <div class="flex items-center gap-2">
          <input
            type="text"
            bind:value={restaurantName}
            on:blur={onRestaurantNameBlur}
            placeholder={t('enterRestaurantName')}
            class="flex-1"
            readonly={!!selectedRestaurant}
          />
          {#if selectedRestaurant}
            <button
              class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              on:click={onEditRestaurantClick}
            >
              {t('edit')}
            </button>
          {/if}
        </div>
        {#if selectedRestaurant}
          {#if isCreatingRestaurant}
            <div class="flex items-center gap-1 px-3 py-1 mt-2 text-sm text-gray-600">
              <svg
                class="animate-spin h-4 w-4 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373
                     0 0 5.373 0 12h4zm2 5.291A7.962
                     7.962 0 014 12H0c0 3.042 1.135
                     5.824 3 7.938l3-2.647z"
                />
              </svg>
              {t('generatingPreview')}
            </div>
          {:else if $currentRestaurant?.slug}
            <a
              href={`https://${$currentRestaurant.slug}.reco.restaurant`}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1 px-3 py-1 mt-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293
                         6.293a1 1 0 101.414 1.414L15
                         6.414V9a1 1 0 102 0V4a1 1
                         0 00-1-1h-5z" />
                <path
                  d="M5 5a2 2 0 00-2
                     2v8a2 2 0 002 2h8a2
                     2 0 002-2v-3a1 1
                     0 10-2 0v3H5V7h3a1
                     1 0 000-2H5z"
                />
              </svg>
              {$currentRestaurant.slug}.reco.restaurant
            </a>
          {/if}
        {/if}
      </div>
    {/if}
  </div>

  <!-- Logo Upload -->
  <div class="mb-8">
    <label class="block text-lg font-semibold mb-3 text-gray-800">
      {t('menuLogo')}
    </label>
    <div class="flex items-start gap-4">
      <div class="relative group">
        <form
          class="w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 {!restaurantName ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' : isDragging ? 'border-blue-400 bg-blue-50' : menuLogo ? 'border-transparent shadow-md hover:shadow-lg' : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300'}"
          on:submit|preventDefault={() => {
            if (!restaurantName) {
              const errorMessage = document.getElementById('logo-error');
              if (errorMessage) {
                errorMessage.textContent = t('pleaseEnterRestaurantNameFirst');
                errorMessage.classList.remove('hidden');
                setTimeout(() => {
                  errorMessage.classList.add('hidden');
                }, 3000);
              }
              return;
            }
            const logoInput = document.getElementById('logo-input');
            if (logoInput) {
              logoInput.click();
            }
          }}
          on:dragenter={handleDragEnter}
          on:dragleave={handleDragLeave}
          on:dragover={handleDragOver}
          on:drop={handleLogoDrop}
        >
          <button type="submit" class="w-full h-full flex flex-col items-center justify-center">
            {#if menuLogo}
              <div class="relative w-full h-full">
                <img
                  src={ensureString(menuLogo)}
                  alt="Menu logo"
                  class="w-full h-full object-cover rounded-xl"
                />
                <div
                  class="absolute inset-0 bg-black/0 group-hover:bg-black/10
                         rounded-xl transition-colors duration-200"
                />
                <!-- Delete button overlay -->
                <button
                  type="button"
                  class="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0
                         group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  on:click|stopPropagation={onDeleteLogo}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414
                         0L10 8.586l4.293-4.293a1 1
                         0 111.414 1.414L11.414 10l4.293
                         4.293a1 1 0 01-1.414 1.414L10
                         11.414l-4.293 4.293a1 1 0
                         01-1.414-1.414L8.586 10
                         4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            {:else}
              <div class="flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="text-sm text-blue-600 mt-2 font-medium">
                  {t('addLogo')}
                </span>
                {#if isDragging}
                  <span class="text-xs text-blue-500 mt-1">
                    {t('dropToUpload')}
                  </span>
                {:else}
                  <span class="text-xs text-gray-500 mt-1">
                    {t('dragAndDrop')}
                  </span>
                {/if}
              </div>
            {/if}
          </button>
          <input
            id="logo-input"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            class="hidden"
            on:change={handleLogoUploadInput}
          />
        </form>
      </div>
      <div
        id="logo-error"
        class="hidden text-sm text-white bg-red-500 px-4 py-2 rounded-lg shadow-lg z-50
               transition-all duration-300 ease-in-out min-w-[200px] whitespace-nowrap"
      >
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16
                 0 8 8 0 0116 0zm-7
                 4a1 1 0 11-2 0 1
                 1 0 012 0zm-1-9a1
                 1 0 00-1 1v4a1 1
                 0 102 0V6a1 1
                 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="flex-1"></span>
        </div>
      </div>
    </div>
  </div>

  <!-- Custom Prompt -->
  <div class="space-y-2">
    <label for="customPrompt" class="block text-sm font-medium text-gray-700">
      {t('customPromptLabel')}
    </label>
    <div class="relative">
      <textarea
        id="customPrompt"
        value={displayCustomPrompt}
        on:input={onCustomPromptInput}
        placeholder={t('customPromptPlaceholder')}
        class="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2
               focus:ring-blue-500 focus:border-transparent transition-all
               duration-200 ease-in-out bg-white/80 backdrop-blur-sm resize-none"
      ></textarea>
      <div class="absolute bottom-2 right-2 text-sm text-gray-500">
        {displayCustomPrompt.length}/5000
      </div>
    </div>
  </div>

  <!-- Color Selection -->
  <div class="space-y-4 mt-6 mb-12">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        {t('themeColor')}
      </label>
      
      <!-- Only show these radio buttons when not showing the color picker -->
      {#if !showCustomColorPicker}
        <div class="flex gap-4 flex-wrap">
          {#each colorOptions as option}
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="color"
                value={option.value}
                checked={color === String(option.value)}
                on:change={() => onColorChange(String(option.value))}
                class="form-radio text-blue-600"
              />
              <span class="text-sm text-gray-700">{option.label}</span>
            </label>
          {/each}
        </div>
      {/if}

      {#if showCustomColorPicker}
        <div class="mt-4 space-y-4">
          <ColorPicker
            value={color}
            customHexColor={customColorValue}
            {showCustomColorPicker}
            {colorOptions}
            {selectedRestaurant}
            {t}
            on:change={(event) => onColorChange(event.detail)}
            on:accept={(event) => onAcceptCustomColor(event)}
            on:cancel={onCancelCustomColor}
          />
        </div>
      {/if}
    </div>

    <!-- Currency Selection -->
    <CurrencyPicker 
      value={currency} 
      {t} 
      on:change={onCurrencyChange} 
    />

    <!-- Phone Number -->
    <div class="space-y-2 mb-12">
      <PhoneInput
        {phoneNumber}
        on:change={(event) => {
          const { phoneNumber: newPhoneNumber } = event.detail;
          phoneNumber = newPhoneNumber;
          handlePhoneNumberChange(
            newPhoneNumber,
            restaurantName,
            menuLogo,
            customPrompt,
            color,
            currency,
            (evt, detail) => dispatch(evt, detail)
          );
        }}
      />
    </div>
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