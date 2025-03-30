<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';

  export let phoneNumber: number | null = null;

  const dispatch = createEventDispatcher<{
    change: number | null; // Expect to dispatch number or null
  }>();

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => {
    // Safety check to prevent errors with missing translation keys
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][currentLanguage] || key;
  };

  // Local state for the input value (string)
  let inputValue: string = '';

  // Sync input value from prop when it changes externally
  $: inputValue = phoneNumber !== null ? phoneNumber.toString() : '';

  // Handle input, parse, and dispatch the processed value
  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    inputValue = input.value; // Keep local string state

    const cleanedValue = input.value.replace(/\D/g, ''); // Remove non-digits
    let numericValue: number | null = null;

    if (cleanedValue) {
      const parsed = parseInt(cleanedValue, 10);
      if (!isNaN(parsed)) {
        numericValue = parsed;
      }
    }
    
    // Dispatch the processed number or null
    dispatch('change', numericValue);
  }
</script>

<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    {t('phoneNumber')}
  </label>
  <div class="flex gap-2">
    <input
      type="tel"
      value={inputValue}
      on:input={handleInput}
      placeholder={t('enterPhoneNumber')}
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out bg-white/80 backdrop-blur-sm"
    />
  </div>
</div>

<style>
  /* Add smooth scrollbar for the dropdown */
  div :global(.overflow-auto) {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
  
  div :global(.overflow-auto::-webkit-scrollbar) {
    width: 6px;
  }
  
  div :global(.overflow-auto::-webkit-scrollbar-track) {
    background: transparent;
  }
  
  div :global(.overflow-auto::-webkit-scrollbar-thumb) {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
</style> 