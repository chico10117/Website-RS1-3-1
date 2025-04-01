<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { get } from 'svelte/store';
  import {
    handleCustomColorSelect,
    handleCustomColorInputValidation as handleCustomColorInputChange,
    saveCustomColorToStorage
  } from '$lib/utils/color.helpers';
  
  // Props
  export let value: string = '';
  export let showCustomColorPicker: boolean = false;
  export let colorOptions: { value: string | number, label: string }[] = [];
  export let selectedRestaurant: string | null = null;
  export let t: (key: string) => string;
  export let customHexColor: string = '';
  
  // Component state
  let customColorValue = '';
  let customColorInput = '';
  let tempColorValue = '';
  
  // Simplified color palette with just 10 vibrant colors in 2 rows
  const colorPalette = [
    // Row 1 - Primary colors
    '#FF0000', '#FF9900', '#FFFF00', '#33CC33', '#3399FF',
    // Row 2 - Secondary and neutral colors
    '#9933CC', '#FF3399', '#663300', '#333333', '#FFFFFF'
  ];
  
  // Event dispatcher
  const dispatch = createEventDispatcher<{
    change: string;
    accept: string;
    cancel: void;
  }>();
  
  // Reset values when value changes to a standard color
  $: if (value && value === '#85A3FA') {
    // If the value is the light theme color, reset custom color values
    customColorValue = '';
    tempColorValue = '';
    customColorInput = '';
  }
  
  // If customHexColor is provided, use it
  $: {
    if (customHexColor && typeof customHexColor === 'string' && customHexColor.startsWith('#')) {
      if (customHexColor !== '#85A3FA') {
        customColorValue = customHexColor.toUpperCase();
        tempColorValue = customColorValue;
        customColorInput = customColorValue;
      }
    }
  }
  
  // If the 'value' prop is a hex, assume it's custom
  $: {
    if (value && typeof value === 'string' && value.startsWith('#')) {
      if (value !== '#85A3FA') {
        customColorValue = value.toUpperCase();
        tempColorValue = customColorValue;
        customColorInput = customColorValue;
        // For custom colors, dispatch a change event to set the color to 'custom'
        dispatch('change', 'custom');
      }
    }
  }
  
  // Whenever customColorValue changes, store it
  $: saveCustomColorToStorage(customColorValue, selectedRestaurant);

  onMount(() => {
    // Check if there's a color in the currentRestaurant store
    const cRest = get(currentRestaurant);
    if (cRest && cRest.color) {
      if (typeof cRest.color === 'string' && cRest.color.startsWith('#')) {
        // Use the color from the database (hex value)
        const dbColor = cRest.color.toUpperCase();
        if (dbColor === '#85A3FA') {
          // If it's the light theme color, dispatch 'light'
          dispatch('change', 'light');
        } else {
          customColorValue = dbColor;
          tempColorValue = dbColor;
          customColorInput = dbColor;
          // For custom hex colors, dispatch 'custom'
          dispatch('change', 'custom');
          showCustomColorPicker = true;
        }
        console.log('ColorPicker: Loaded hex color from database:', dbColor);
      }
    } else {
      // No color in store, use default light theme
      dispatch('change', 'light');
    }
  });
  
  // Event handlers
  function onColorChange(newValue: string | number) {
    dispatch('change', String(newValue));
  }
  
  function onPaletteSelect(hexColor: string) {
    // Use the helper to update temp value
    handleCustomColorSelect(
      hexColor,
      (v) => tempColorValue = v // Call with 2 arguments
    );
    // Set the input directly here
    customColorInput = hexColor.toUpperCase();
  }
  
  function onHexInputChange() {
    handleCustomColorInputChange(
      customColorInput,
      (v) => tempColorValue = v // Pass the setTempColorValue callback
    );
  }
  
  function onAcceptCustomColor() {
    if (tempColorValue) {
      dispatch('accept', tempColorValue);
    }
  }
  
  function onCancelCustomColor() {
    dispatch('cancel');
  }
  
  // Check if the current color is a hex color (for radio button selection)
  $: isHexColor = value && typeof value === 'string' && value.startsWith('#') ? true : false;
</script>

<div class="space-y-4">
  <div class="space-y-2">
    <div class="flex gap-4 flex-wrap">
      {#each colorOptions as option}
        <label class="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="color"
            value={option.value}
            checked={value === String(option.value) || (isHexColor && String(option.value) === '5')}
            on:change={() => onColorChange(option.value)}
            class="form-radio text-blue-600"
          />
          <span class="text-sm text-gray-700">{option.label}</span>
        </label>
      {/each}
    </div>

    {#if showCustomColorPicker}
      <div class="mt-4 space-y-4">
        <!-- Simple 10-color palette in 2 rows -->
        <div class="grid grid-cols-5 gap-3 max-w-[300px]">
          {#each colorPalette as hexColor}
            <button
              class="w-12 h-12 rounded-lg transition-transform hover:scale-110 shadow-sm border border-gray-200 active:scale-95 touch-manipulation"
              style="background-color: {hexColor}"
              on:click={() => onPaletteSelect(hexColor)}
              aria-label="Color swatch"
            />
          {/each}
        </div>

        <!-- Color input and preview -->
        <div class="flex items-center gap-2 mt-4">
          <input
            type="text"
            bind:value={customColorInput}
            placeholder="#000000"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            on:input={onHexInputChange}
            aria-label="Enter hex color code"
          />
          <div
            class="w-12 h-12 rounded-lg border border-gray-300 shadow-sm"
            style="background-color: {tempColorValue}"
            aria-label="Color preview"
          />
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end gap-3 mt-4">
          <button
            class="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors touch-manipulation active:scale-95"
            on:click={onCancelCustomColor}
          >
            {t('cancel')}
          </button>
          <button
            class="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors touch-manipulation active:scale-95"
            on:click={onAcceptCustomColor}
          >
            {t('save')}
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(.form-radio) {
    @apply h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500;
  }
</style> 