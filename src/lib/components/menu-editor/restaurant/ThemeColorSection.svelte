<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import ColorPicker from './ColorPicker.svelte';
  import type { UpdateEvent } from '$lib/utils/RestaurantInfo.helpers';
  
  export let restaurantName: string;
  export let selectedRestaurant: string | null;
  export let menuLogo: string | null;
  export let customPrompt: string | null;
  export let phoneNumber: number | null;
  export let color: string = '#85A3FA';
  export let currency: string;
  export let reservas: string | null;
  export let redes_sociales: string | null;
  export let t: (key: string) => string;

  // Local state
  let showCustomColorPicker = false;
  let customColorValue = '';
  let displayColor = 'light';

  const dispatch = createEventDispatcher<{
    update: UpdateEvent;
  }>();

  $: currentLanguage = $language;
  $: t = (key: string) => translations[key]?.[currentLanguage] || translations[key]?.['es'] || key;

  $: colorOptions = [
    { value: 'light', label: t('colorLight') },
    { value: 'custom', label: t('colorCustom') }
  ];

  // Handle initial and subsequent color changes
  $: {
    if (color && typeof color === 'string') {
      if (color === '#85A3FA') {
        displayColor = 'light';
        customColorValue = '';
        showCustomColorPicker = false;
      } else if (color.startsWith('#')) {
        displayColor = 'custom';
        customColorValue = color;
        showCustomColorPicker = true;
      }
    }
  }

  function onColorAccept(event: CustomEvent<string>) {
    const newColor = event.detail;
    if (newColor) {
      displayColor = 'custom';
      customColorValue = newColor;
      showCustomColorPicker = false;
      
      dispatch('update', {
        id: selectedRestaurant || undefined,
        name: restaurantName,
        logo: menuLogo,
        customPrompt,
        phoneNumber,
        color: newColor,
        currency,
        reservas,
        redes_sociales,
      });
    }
  }

  function onRadioChange(value: string) {
    if (value === 'light') {
      showCustomColorPicker = false;
      customColorValue = '';
      dispatch('update', {
        id: selectedRestaurant || undefined,
        name: restaurantName,
        logo: menuLogo,
        customPrompt,
        phoneNumber,
        color: '#85A3FA',
        currency,
        reservas,
        redes_sociales,
      });
    } else if (value === 'custom') {
      showCustomColorPicker = true;
    }
  }

  function onColorCancel() {
    if (customColorValue && customColorValue !== '#85A3FA') {
      // Return to previous custom color
      dispatch('update', {
        id: selectedRestaurant || undefined,
        name: restaurantName,
        logo: menuLogo,
        customPrompt,
        phoneNumber,
        color: customColorValue,
        currency,
        reservas,
        redes_sociales,
      });
    } else {
      // Return to light theme
      showCustomColorPicker = false;
      displayColor = 'light';
      customColorValue = '';
      dispatch('update', {
        id: selectedRestaurant || undefined,
        name: restaurantName,
        logo: menuLogo,
        customPrompt,
        phoneNumber,
        color: '#85A3FA',
        currency,
        reservas,
        redes_sociales,
      });
    }
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
            on:change={() => onRadioChange(option.value)}
            on:click={() => {
              if (option.value === 'custom') {
                showCustomColorPicker = true;
              }
            }}
            class="form-radio text-blue-600"
          />
          <span class="text-sm text-gray-700" on:click={() => {
            if (option.value === 'custom') {
              showCustomColorPicker = true;
            }
            onRadioChange(option.value);
          }}>
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
          on:accept={onColorAccept}
          on:cancel={onColorCancel}
        />
      </div>
    {/if}
  </div>
</div> 