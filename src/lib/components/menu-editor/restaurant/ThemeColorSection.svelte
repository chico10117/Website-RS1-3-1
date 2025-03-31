<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import ColorPicker from './ColorPicker.svelte';
  import {
    updateColorToLight,
    onAcceptCustomColor,
    onCancelCustomColor
  } from '$lib/utils/color.helpers';
  
  export let restaurantName = '';
  export let selectedRestaurant: string | null = null;
  export let menuLogo: string | null = null;
  export let customPrompt: string | null = null;
  export let phoneNumber: number | null = null;
  export let color: string = '#85A3FA';
  export let currency: string = '€';
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;

  let showCustomColorPicker = false;
  let customColorValue = (color && typeof color === 'string' && color !== '#85A3FA') ? color.toUpperCase() : '';
  let displayColor = (color && typeof color === 'string' && color === '#85A3FA') ? 'light' : 'custom';

  const dispatch = createEventDispatcher<{
    update: any;
  }>();

  $: currentLanguage = $language;
  $: t = (key: string) => translations[key]?.[currentLanguage] || translations[key]?.['es'] || key;

  $: colorOptions = [
    { value: 'light', label: t('colorLight') },
    { value: 'custom', label: t('colorCustom') }
  ];

  $: {
    if (color && typeof color === 'string') {
      if (color === '#85A3FA') {
        displayColor = 'light';
        customColorValue = '';
      } else if (!['light', 'custom'].includes(color)) {
        customColorValue = color.toUpperCase();
        displayColor = 'custom';
      }
    } else {
      displayColor = 'light';
      customColorValue = '';
      showCustomColorPicker = false;
    }
    console.log("ThemeColorSection: Prop 'color' changed", { color, displayColor, customColorValue, showCustomColorPicker });
  }

  function onColorChange(value: string) {
    console.log('ThemeColorSection: Color radio changed to:', value);
    displayColor = value;

    if (value === 'custom') {
      showCustomColorPicker = true;
    } else if (value === 'light') {
      showCustomColorPicker = false;
      customColorValue = '';
      updateColorToLight(
        restaurantName,
        menuLogo,
        customPrompt,
        phoneNumber,
        currency,
        reservas,
        redes_sociales,
        selectedRestaurant,
        (evt, detail) => dispatch(evt, detail)
      );
    }
  }

  function handleAcceptCustomColor(event: CustomEvent<string>) {
    const acceptedHexColor = event.detail.toUpperCase();
    console.log('ThemeColorSection: Accepting custom color:', acceptedHexColor);
    customColorValue = acceptedHexColor;
    displayColor = 'custom';
    showCustomColorPicker = false;

    onAcceptCustomColor(
      acceptedHexColor,
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber,
      currency,
      reservas,
      redes_sociales,
      selectedRestaurant,
      (evt, detail) => dispatch(evt, detail)
    );
  }

  function handleCancelCustomColor() {
    console.log('ThemeColorSection: Custom color cancelled.');
    showCustomColorPicker = false;

    if (color === '#85A3FA') {
      displayColor = 'light';
    } else {
      displayColor = 'custom';
    }
    onCancelCustomColor();
  }
</script>

<div class="space-y-4">
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">
      {t('themeColor')}
    </label>
    
    <div class="flex gap-4 flex-wrap mb-4">
      {#each colorOptions as option}
        <label class="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="color-theme-selector"
            value={option.value}
            checked={displayColor === option.value}
            on:change={() => onColorChange(option.value)}
            class="form-radio text-blue-600"
          />
          <span class="text-sm text-gray-700 ">
            {option.label}
          </span>
        </label>
      {/each}
    </div>

    {#if showCustomColorPicker}
      <div class="mt-4 space-y-4 border-t pt-4 border-gray-200">
        <ColorPicker
          value={color}
          customHexColor={customColorValue}
          {showCustomColorPicker}
          colorOptions={[]}
          {selectedRestaurant}
          {t}
          on:accept={handleAcceptCustomColor}
          on:cancel={handleCancelCustomColor}
        />
      </div>
    {/if}
  </div>
</div> 