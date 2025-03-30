<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { get } from 'svelte/store';
  import {
    handleCustomColorSelect,
    onCustomColorInput as handleCustomColorInputChange,
    saveCustomColorToStorage
  } from '$lib/utils/color.helpers';
  
  // Props
  export let value: string = ''; // This will now be the actual hex color (#85A3FA or custom)
  export let showCustomColorPicker: boolean = false;
  export let colorOptions: { value: string | number, label: string }[] = [];
  export let selectedRestaurant: string | null = null;
  export let t: (key: string) => string;
  
  // Determine the effective hex color directly from value prop
  $: effectiveHexColor = (value && value.startsWith('#')) ? value.toUpperCase() : '#85A3FA';
  
  // Component state derived reactively from props
  $: customColorValue = effectiveHexColor;
  $: customColorInput = showCustomColorPicker ? effectiveHexColor : '';
  $: tempColorValue = showCustomColorPicker ? effectiveHexColor : '';
  
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
  
  // Whenever customColorValue changes, store it
  $: saveCustomColorToStorage(customColorValue, selectedRestaurant);

  onMount(() => {
    // Initialization is now handled by reactive declarations above.
    // We can just log the initial state if needed.
    console.log('ColorPicker Mounted Initial Props:', { value, showCustomColorPicker }); 
    console.log('ColorPicker Initial Derived State:', { effectiveHexColor, customColorValue, customColorInput, tempColorValue });
  });
  
  // Event handlers
  function onColorChange(newValue: string | number) {
    dispatch('change', String(newValue));
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
            checked={(
              (String(option.value) === 'light') && effectiveHexColor === '#85A3FA'
            ) || (
              (String(option.value) === 'custom') && effectiveHexColor !== '#85A3FA'
            )}
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