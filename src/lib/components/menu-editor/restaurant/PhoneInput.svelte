<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';

  export let phoneNumber: number | null = null;

  const dispatch = createEventDispatcher<{
    change: { phoneNumber: number | null };
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

  let localPhoneNumber = phoneNumber?.toString() || '';

  // Initialize from prop AND REACT TO CHANGES
  $: {
    // This needs to handle the case where phoneNumber becomes null
    if (phoneNumber !== undefined && phoneNumber !== null) {
      localPhoneNumber = phoneNumber.toString();
    } else {
      // Explicitly clear localPhoneNumber if the prop is null/undefined
      localPhoneNumber = '';
    }
  }

  function handlePhoneNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    localPhoneNumber = input.value;
    
    // Process phone number: remove ALL spaces and non-digit characters and convert to number
    let processed: number | null = null;
    if (localPhoneNumber.trim()) {
      // First remove all spaces, then remove any remaining non-digit characters
      const noSpaces = localPhoneNumber.replace(/\s+/g, '');
      const digitsOnly = noSpaces.replace(/\D/g, '');
      
      // Only set the phone number if it's a valid number
      if (digitsOnly.length > 0) {
        try {
          // Convert to number to validate it's a valid integer
          const numericValue = Number(digitsOnly);
          if (!isNaN(numericValue) && Number.isInteger(numericValue)) {
            processed = numericValue;  // Store as number instead of string
            console.log('Processed phone number:', processed); // Debug log
          }
        } catch (e) {
          console.error('Error converting phone number to integer:', e);
        }
      }
    }
    
    dispatch('change', { phoneNumber: processed });
  }
</script>

<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    {t('phoneNumber')}
  </label>
  <div class="flex gap-2">
    <input
      type="tel"
      value={localPhoneNumber}
      on:input={handlePhoneNumberInput}
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