<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    handleCustomColorSelect,
    setupColorPickerMouseInteraction,
    setupColorPickerTouchInteraction,
    updateColorFromPosition,
    onCustomColorInput as handleCustomColorInputChange,
    saveCustomColorToStorage
  } from '$lib/utils/color.helpers';
  
  // Props
  export let value: string = '';
  export let showCustomColorPicker: boolean = false;
  export let colorOptions: { value: number, label: string }[] = [];
  export let selectedRestaurant: string | null = null;
  export let t: (key: string) => string;
  
  // Component state
  let customColorValue = '';
  let customColorInput = '';
  let pickerPosition = { x: 50, y: 50 };
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
  
  // If the 'value' prop is a hex, assume it's custom
  $: {
    if (value && typeof value === 'string' && value.startsWith('#')) {
      customColorValue = value.toUpperCase();
      tempColorValue = customColorValue;
      customColorInput = customColorValue;
    }
  }
  
  // Whenever customColorValue changes, store it
  $: saveCustomColorToStorage(customColorValue, selectedRestaurant);
  
  // Event handlers
  function onColorChange(newValue: number) {
    dispatch('change', String(newValue));
  }
  
  function onPickerMouseDown(event: MouseEvent) {
    setupColorPickerMouseInteraction(
      event,
      event.target as HTMLDivElement,
      (x: number, y: number) => pickerPosition = { x, y },
      (x: number, y: number, hue: number) => updateColorFromPosition(x, y, hue, 
        (v: string) => tempColorValue = v, 
        (v: string) => customColorInput = v
      ),
      0
    );
  }

  function onPickerTouchStart(event: TouchEvent) {
    setupColorPickerTouchInteraction(
      event,
      event.target as HTMLDivElement,
      (x: number, y: number) => pickerPosition = { x, y },
      (x: number, y: number, hue: number) => updateColorFromPosition(x, y, hue, 
        (v: string) => tempColorValue = v, 
        (v: string) => customColorInput = v
      ),
      0
    );
  }
  
  function onCustomColorSelect(hexColor: string) {
    const capitalizedHexColor = hexColor.toUpperCase();
    handleCustomColorSelect(
      capitalizedHexColor, 
      (v: string) => tempColorValue = v, 
      (v: string) => customColorInput = v
    );
  }
  
  function onCustomColorInput() {
    handleCustomColorInputChange(
      customColorInput,
      (val: string) => customColorInput = val,
      (val: string) => tempColorValue = val
    );
  }
  
  function onAcceptCustomColor() {
    dispatch('accept', tempColorValue);
  }
  
  function onCancelCustomColor() {
    dispatch('cancel');
  }
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
            checked={value === String(option.value)}
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
              on:click={() => onCustomColorSelect(hexColor)}
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