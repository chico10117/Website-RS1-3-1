<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import ColorPicker from './ColorPicker.svelte';
  import {
    updateColor as updateColorHelper,
    onAcceptCustomColor as onAcceptCustomColorHelper,
    onCancelCustomColor as onCancelCustomColorHelper,
    initializeCustomColor
  } from '$lib/utils/color.helpers';
  
  export let restaurantName = '';
  export let selectedRestaurant: string | null = null;
  export let menuLogo: string | null = null;
  export let customPrompt: string | null = null;
  export let phoneNumber: string | null = null;
  export let color: string = '#85A3FA';
  export let currency: string = '€';

  let showCustomColorPicker = false;
  let customColorValue = '';
  let tempColorValue = '';
  let customColorInput = '';
  let displayColor = color; // For UI display only

  // Svelte event dispatcher
  const dispatch = createEventDispatcher();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  // Color options
  $: colorOptions = [
    { value: 'light', label: t('colorLight') },
    { value: 'custom', label: t('colorCustom') }
  ];

  // If the 'color' prop is a hex, assume it's custom
  $: {
    if (color && typeof color === 'string') {
      if (color === '#85A3FA') {
        // If it's the light theme color, set displayColor to 'light' for UI
        displayColor = 'light';
      } else if (!['light', 'custom'].includes(color)) {
        // For any other hex color, treat as custom
        customColorValue = color.toUpperCase();
        displayColor = 'custom';
        showCustomColorPicker = true;
      } else {
        // Keep displayColor in sync with color for other values
        displayColor = color;
      }
    }
  }

  // Called on color radio <input> change
  function onColorChange(value: string) {
    console.log('Color radio changed to:', value);
    
    if (value === 'custom') {
      displayColor = 'custom';
      showCustomColorPicker = true;
    } else if (value === 'light') {
      // For light theme, save as #85A3FA
      const newColor = '#85A3FA';
      color = newColor;
      displayColor = 'light';
      updateColorHelper(
        newColor,
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

  function onAcceptCustomColor(event: CustomEvent<string>) {
    const tempColorValue = event.detail;
    displayColor = 'custom'; // Update displayColor
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
      dispatch
    );
  }

  function onCancelCustomColor() {
    // If we're canceling and the current color is #85A3FA, set displayColor back to 'light'
    if (color === '#85A3FA') {
      displayColor = 'light';
    }
    onCancelCustomColorHelper(
      customColorValue,
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber,
      currency,
      (val) => color = val,
      (val) => showCustomColorPicker = val,
      dispatch
    );
  }

  // Whenever customColorValue changes, store it
  $: if (customColorValue && typeof customColorValue === 'string' && typeof window !== 'undefined') {
    localStorage.setItem(`customColor_${selectedRestaurant || 'new'}`, customColorValue.toUpperCase());
  }
</script>

<div class="space-y-4">
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
              checked={displayColor === String(option.value)}
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
</div> 