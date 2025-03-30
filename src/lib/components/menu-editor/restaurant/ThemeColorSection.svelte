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
  export let phoneNumber: number | null = null;
  export let color: string = '#85A3FA';
  export let currency: string = '€';

  // State for controlling the custom picker UI visibility
  let showCustomPickerUI = false;
  let previousColorBeforeCustom: string | null = null;

  // Svelte event dispatcher
  const dispatch = createEventDispatcher();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  // Color options (passed to ColorPicker)
  $: colorOptions = [
    { value: 'light', label: t('colorLight') },
    { value: 'custom', label: t('colorCustom') }
  ];
  
  // Initialize showCustomPickerUI based on initial color
  $: showCustomPickerUI = color !== '#85A3FA';

  // Called when ColorPicker dispatches 'change' (radio button click)
  function onColorChange(value: string) {
    console.log('ThemeColorSection: ColorPicker changed radio to:', value);
    if (value === 'light') {
      const newColor = '#85A3FA';
      color = newColor; // Update the main color state
      showCustomPickerUI = false; // Hide custom UI
      previousColorBeforeCustom = null; // Reset previous color memory
      updateParentStore(newColor); // Update the store
    } else if (value === 'custom') {
      // Store the current color before showing the custom UI
      previousColorBeforeCustom = color;
      showCustomPickerUI = true; // Show the custom UI
      // Don't change the actual 'color' state yet
    }
  }

  // Called when ColorPicker dispatches 'accept'
  function onAcceptCustomColor(event: CustomEvent<string>) {
    const acceptedHexColor = event.detail;
    console.log('ThemeColorSection: Accepting custom color:', acceptedHexColor);
    color = acceptedHexColor; // Update the main color state
    showCustomPickerUI = true; // Keep custom UI open after accept
    previousColorBeforeCustom = null; // Reset previous color memory
    updateParentStore(acceptedHexColor); // Update the store
  }

  // Called when ColorPicker dispatches 'cancel'
  function onCancelCustomColor() {
    console.log('ThemeColorSection: Canceling custom color');
    color = previousColorBeforeCustom || '#85A3FA';
    showCustomPickerUI = false; // Hide custom UI
    previousColorBeforeCustom = null; // Reset previous color memory
    // No need to update parent store on cancel
  }
  
  // Helper to update the store via updateColorHelper
  function updateParentStore(newColorValue: string) {
     updateColorHelper(
        newColorValue,
        restaurantName,
        menuLogo,
        customPrompt,
        phoneNumber !== null ? String(phoneNumber) : null,
        currency,
        newColorValue,
        (val) => {
          // console.log('ThemeColorSection: Color callback with value:', val);
          // No need to set color = val here, already done
        },
        (evt, detail) => {
          console.log('ThemeColorSection: Dispatching update event with:', detail);
          dispatch(evt, detail);
        }
      );
  }

  // --- Event Handlers for ColorPicker --- 
  function handleChange(event: CustomEvent<string>) {
    onColorChange(event.detail);
  }
  function handleAccept(event: CustomEvent<string>) {
    onAcceptCustomColor(event);
  }
  function handleCancel() {
    onCancelCustomColor();
  }
  // -------------------------------------

</script>

<div class="space-y-4">
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">
      {t('themeColor')}
    </label>
    
    <!-- REMOVED Outer radio buttons -->
    <!-- Now directly rendering ColorPicker which contains the radio buttons -->
    
    <!-- Pass simplified props to ColorPicker -->
    <ColorPicker
      value={color}
      colorOptions={colorOptions}
      selectedRestaurant={selectedRestaurant}
      t={t}
      showCustomColorPicker={showCustomPickerUI}
      on:change={handleChange}
      on:accept={handleAccept}
      on:cancel={handleCancel}
    />
    
  </div>
</div> 