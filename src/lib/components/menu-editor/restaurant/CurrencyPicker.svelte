<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { language } from '$lib/stores/language';
  import { translations } from '$lib/i18n/translations';

  // Props
  export let value: string = 'EUR'; // Default to ISO code
  export let t: (key: string) => string;

  // Currency options
  const currencyOptions = [
    { value: '€', label: 'EUR (€)' },
    { value: '$', label: 'USD ($)' },
    { value: '£', label: 'GBP (£)' },
    { value: '₡', label: 'CRC (₡)' }, // Added Costa Rican Colón
    { value: '$MXN', label: 'MXN ($)' }, // Added Mexican Peso
  ];

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    change: string;
  }>();

  // Propagate changes
  function onChange(newValue: string) {
    dispatch('change', newValue);
  }

</script>

<div class="space-y-2 mb-12">
  <label class="block text-sm font-medium text-gray-700">
    {t('currency')}
  </label>
  <div class="flex gap-4 flex-wrap"> <!-- Added flex-wrap -->
    {#each currencyOptions as option (option.value)} 
      <label class="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="currency"
          class="form-radio text-blue-600"
          value={option.value}
          bind:group={value} 
          on:change={() => onChange(option.value)}
        />
        <span class="text-sm text-gray-700">{option.label}</span>
      </label>
    {/each}
  </div>
</div>

<style>
  :global(.form-radio) {
    @apply h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500;
  }
</style> 