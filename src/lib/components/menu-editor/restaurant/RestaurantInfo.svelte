<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { toasts } from '$lib/stores/toast';
  import type { Restaurant } from '$lib/types/menu.types';
  import MenuUploader from './MenuUploader.svelte';
  import PhoneInput from './PhoneInput.svelte';

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
    handleColorChange,
    handleCustomColorSelect,
    handleCustomColorInput,
    acceptCustomColor,
    cancelCustomColor,
    updateRestaurantColor,
    updateColorFromPosition,
    handleColorPickerInteraction,
    handleColorPickerTouchInteraction,
    handleHueInteraction,
    handleHueTouchInteraction
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

  // Computed for UI
  $: displayLogo = ensureString(menuLogo);
  $: displayCustomPrompt = ensureString(customPrompt);

  // Color options
  $: colorOptions = [
    { value: 1, label: t('colorLight') },
    { value: 2, label: t('colorGreen') },
    { value: 3, label: t('colorPink') },
    { value: 4, label: t('colorDark') },
    { value: 5, label: t('colorCustom') }
  ];

  const currencyOptions = [
    { value: '€', label: '€' },
    { value: '$', label: '$' },
    { value: '£', label: '£' }
  ];

  const colorPalette = [
    '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FFD700',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
  ];

  // If the 'color' prop is a hex, assume it's custom
  $: {
    if (color && typeof color === 'string' && !['1','2','3','4','5'].includes(color)) {
      customColorValue = color.toUpperCase();
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
  function onColorChange(value: number) {
    if (value === 5) {
      // If selecting custom color option, update the UI but don't change the color value yet
      showCustomColorPicker = true;
      if (customColorValue) {
        tempColorValue = customColorValue;
        customColorInput = customColorValue;
      }
    } else {
      // For standard colors, immediately update the color value
      color = String(value); // Update the local color prop
      updateRestaurantColor(
        String(value),
        restaurantName,
        menuLogo,
        customPrompt,
        phoneNumber,
        color,
        currency,
        customColorValue,
        (evt: 'update', detail: UpdateEvent) => dispatch(evt, detail)
      );
    }
  }

  // Actually update the color in store
  function updateColor(val: string) {
    console.log('updateColor called with:', val);
    
    // Safely handle both numeric and hex color values
    if (typeof val === 'string' && val.startsWith('#')) {
      // For hex colors, ensure they're capitalized
      color = val.toUpperCase();
    } else {
      // For standard color numbers, keep as is
      color = val;
    }
    
    console.log('Local color prop updated to:', color);
    
    updateRestaurantColor(
      val,
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber,
      color,
      currency,
      customColorValue,
      (evt: 'update', detail: UpdateEvent) => {
        console.log('Dispatching color update event with color:', detail.color);
        dispatch(evt, detail);
      }
    );
  }

  // Called on currency <input> change
  function onCurrencyChange(value: string) {
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

  // Called on custom color palette click
  function onCustomColorSelect(hexColor: string) {
    const capitalizedHexColor = hexColor.toUpperCase();
    handleCustomColorSelect(capitalizedHexColor, (v: string) => tempColorValue = v, (v: string) => customColorInput = v);
  }

  function onCustomColorInput() {
    const capitalizedInput = customColorInput.toUpperCase();
    customColorInput = capitalizedInput;
    handleCustomColorInput(capitalizedInput, (v: string) => tempColorValue = v);
  }

  function onAcceptCustomColor() {
    console.log('Accepting custom color:', tempColorValue);
    color = tempColorValue; // Update the local color prop directly
    
    acceptCustomColor(
      tempColorValue,
      (v: string) => {
        console.log('Setting customColorValue to:', v);
        customColorValue = v;
      },
      (val: string) => {
        console.log('Calling updateColor with:', val);
        updateColor(val);
      },
      (v: boolean) => showCustomColorPicker = v
    );
  }

  function onCancelCustomColor() {
    cancelCustomColor(
      customColorValue,
      (v: boolean) => showCustomColorPicker = v,
      (v: string) => color = v,
      updateColor
    );
  }

  // Color picker XY
  function onPickerMouseDown(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    const { rect, x, y } = handleColorPickerInteraction(
      event, 
      target, 
      (x: number, y: number) => pickerPosition = { x, y },
      (x: number, y: number, hue: number) => updateColorFromPosition(x, y, hue, (v: string) => tempColorValue = v, (v: string) => customColorInput = v),
      hueValue
    );

    const handleMouseMove = (e: MouseEvent) => {
      const { x: newX, y: newY } = handleColorPickerInteraction(
        e, 
        target, 
        (x: number, y: number) => pickerPosition = { x, y },
        (x: number, y: number, hue: number) => updateColorFromPosition(x, y, hue, (v: string) => tempColorValue = v, (v: string) => customColorInput = v),
        hueValue
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function onPickerTouchStart(event: TouchEvent) {
    event.preventDefault();
    const target = event.target as HTMLDivElement;
    handleColorPickerTouchInteraction(
      event,
      target,
      (x: number, y: number) => pickerPosition = { x, y },
      (x: number, y: number, hue: number) => updateColorFromPosition(x, y, hue, (v: string) => tempColorValue = v, (v: string) => customColorInput = v),
      hueValue
    );

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleColorPickerTouchInteraction(
        e,
        target,
        (x: number, y: number) => pickerPosition = { x, y },
        (x: number, y: number, hue: number) => updateColorFromPosition(x, y, hue, (v: string) => tempColorValue = v, (v: string) => customColorInput = v),
        hueValue
      );
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }

  function onHueChange(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    handleHueInteraction(
      event,
      target,
      (value: number) => hueValue = value,
      (x: number, y: number, hue: number) => updateColorFromPosition(x, y, hue, (v: string) => tempColorValue = v, (v: string) => customColorInput = v),
      pickerPosition
    );
  }

  function onHueTouchStart(event: TouchEvent) {
    event.preventDefault();
    const target = event.target as HTMLDivElement;
    handleHueTouchInteraction(
      event,
      target,
      (value: number) => hueValue = value,
      (x: number, y: number, hue: number) => updateColorFromPosition(x, y, hue, (v: string) => tempColorValue = v, (v: string) => customColorInput = v),
      pickerPosition
    );

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleHueTouchInteraction(
        e,
        target,
        (value: number) => hueValue = value,
        (x: number, y: number, hue: number) => updateColorFromPosition(x, y, hue, (v: string) => tempColorValue = v, (v: string) => customColorInput = v),
        pickerPosition
      );
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }

  onMount(() => {
    // If color === '5', try to load from localStorage
    if (color === '5' && typeof window !== 'undefined') {
      const savedColor = localStorage.getItem(`customColor_${selectedRestaurant || 'new'}`);
      if (savedColor) {
        customColorValue = savedColor;
        tempColorValue = savedColor;
        customColorInput = savedColor;
      }
    }
  });

  // Whenever customColorValue changes, store it
  $: if (customColorValue && typeof customColorValue === 'string' && typeof window !== 'undefined') {
    localStorage.setItem(`customColor_${selectedRestaurant || 'new'}`, customColorValue.toUpperCase());
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
      <div class="flex gap-4 flex-wrap">
        {#each colorOptions as option}
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="color"
              value={option.value}
              checked={color === String(option.value)}
              on:change={() => onColorChange(option.value)}
              class="form-radio text-blue-600"
            />
            <span class="text-sm text-gray-700">{option.label}</span>
          </label>
        {/each}
      </div>

      {#if showCustomColorPicker}
        <div class="mt-4 space-y-4">
          <!-- Color spectrum picker -->
          <div
            class="relative w-full max-w-[200px] h-[200px] cursor-crosshair rounded-lg overflow-hidden
                   touch-manipulation"
            style="background: linear-gradient(to right, #fff, hsl({hueValue}, 100%, 50%));"
            on:mousedown={onPickerMouseDown}
            on:touchstart={onPickerTouchStart}
          >
            <div
              class="absolute inset-0"
              style="background: linear-gradient(to bottom, transparent, #000);"
            >
              <div
                class="absolute w-5 h-5 border-2 border-white rounded-full shadow-md transform
                       -translate-x-1/2 -translate-y-1/2"
                style="left: {pickerPosition.x}%; top: {pickerPosition.y}%; background-color: {tempColorValue};"
              />
            </div>
          </div>

          <!-- Hue slider -->
          <div
            class="relative w-full max-w-[200px] h-8 cursor-pointer rounded-lg overflow-hidden
                   touch-manipulation"
            style="background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);"
            on:mousedown={onHueChange}
            on:touchstart={onHueTouchStart}
          >
            <div
              class="absolute w-2 h-full bg-white border border-gray-300 shadow-md"
              style="left: {hueValue / 3.6}%"
            />
          </div>

          <!-- Preset colors grid -->
          <div class="grid grid-cols-4 sm:grid-cols-8 gap-3 max-w-[240px]">
            {#each colorPalette as hexColor}
              <button
                class="w-8 h-8 rounded-lg transition-transform hover:scale-110 shadow-sm
                       border border-gray-100 active:scale-95 touch-manipulation"
                style="background-color: {hexColor}"
                on:click={() => onCustomColorSelect(hexColor)}
                aria-label="Color swatch"
              />
            {/each}
          </div>

          <!-- Color input and preview -->
          <div class="flex items-center gap-2">
            <input
              type="text"
              bind:value={customColorInput}
              placeholder="#000000"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2
                     focus:ring-blue-500 focus:border-transparent"
              on:input={onCustomColorInput}
              aria-label="Enter hex color code"
            />
            <div
              class="w-12 h-12 rounded-lg border border-gray-300 shadow-sm"
              style="background-color: {tempColorValue}"
              aria-label="Color preview"
            />
          </div>

          <!-- Action buttons -->
          <div class="flex justify-end gap-3 mt-2">
            <button
              class="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors
                     touch-manipulation active:scale-95"
              on:click={onCancelCustomColor}
            >
              {t('cancel')}
            </button>
            <button
              class="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors
                     touch-manipulation active:scale-95"
              on:click={onAcceptCustomColor}
            >
              {t('save')}
            </button>
          </div>
        </div>
      {/if}
    </div>

    <!-- Currency Selection -->
    <div class="space-y-2 mb-12">
      <label class="block text-sm font-medium text-gray-700">
        {t('currency')}
      </label>
      <div class="flex gap-4">
        {#each currencyOptions as option}
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="currency"
              value={option.value}
              checked={currency === option.value}
              on:change={() => onCurrencyChange(option.value)}
              class="form-radio text-blue-600"
            />
            <span class="text-sm text-gray-700">{option.label}</span>
          </label>
        {/each}
      </div>
    </div>

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