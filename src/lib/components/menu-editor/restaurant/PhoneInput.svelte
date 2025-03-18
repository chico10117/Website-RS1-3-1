<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';

  export let phoneNumber: string | null = null;

  const dispatch = createEventDispatcher<{
    change: { phoneNumber: string | null };
  }>();

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Prioritized and reduced country codes list
  const countryCodes = [
    // Priority countries first
    { code: '34', country: 'Spain' },
    { code: '52', country: 'Mexico' },
    { code: '1', country: 'USA/Canada' },
    { code: '506', country: 'Costa Rica' },
    // Other countries ordered by economic purchasing power
    { code: '44', country: 'UK' },
    { code: '49', country: 'Germany' },
    { code: '33', country: 'France' },
    { code: '81', country: 'Japan' },
    { code: '39', country: 'Italy' },
    { code: '1', country: 'Canada' },
    { code: '86', country: 'China' },
    { code: '82', country: 'South Korea' },
    { code: '61', country: 'Australia' },
    { code: '41', country: 'Switzerland' },
    { code: '31', country: 'Netherlands' },
    { code: '46', country: 'Sweden' },
    { code: '32', country: 'Belgium' },
    { code: '43', country: 'Austria' },
    { code: '47', country: 'Norway' },
    { code: '971', country: 'UAE' },
    { code: '45', country: 'Denmark' },
    { code: '358', country: 'Finland' },
    { code: '64', country: 'New Zealand' },
    { code: '966', country: 'Saudi Arabia' },
    { code: '351', country: 'Portugal' },
    { code: '48', country: 'Poland' },
    { code: '420', country: 'Czech Republic' },
    { code: '30', country: 'Greece' },
    { code: '36', country: 'Hungary' },
    { code: '91', country: 'India' },
    { code: '7', country: 'Russia' },
    { code: '380', country: 'Ukraine' },
    { code: '27', country: 'South Africa' },
    { code: '20', country: 'Egypt' },
    { code: '212', country: 'Morocco' },
    // Latin American countries (after the priority ones)
    { code: '54', country: 'Argentina' },
    { code: '55', country: 'Brazil' },
    { code: '56', country: 'Chile' },
    { code: '57', country: 'Colombia' },
    { code: '593', country: 'Ecuador' },
    { code: '502', country: 'Guatemala' },
    { code: '504', country: 'Honduras' },
    { code: '51', country: 'Peru' },
    { code: '58', country: 'Venezuela' }
  ];

  let selectedCountryCode = '34'; // Default to Spain
  let phoneNumberWithoutCode = '';
  let error: string | null = null;
  let searchTerm = '';
  let showDropdown = false;
  let filteredCountries = countryCodes;

  // Initialize from prop
  $: if (phoneNumber) {
    // Find matching country code
    const matchingCode = countryCodes.find(cc => phoneNumber?.startsWith(cc.code));
    if (matchingCode) {
      selectedCountryCode = matchingCode.code;
      searchTerm = `+${matchingCode.code} (${matchingCode.country})`;
      phoneNumberWithoutCode = phoneNumber.slice(matchingCode.code.length);
    } else {
      phoneNumberWithoutCode = phoneNumber;
    }
  }

  // Filter countries based on search term
  function filterCountries(term: string) {
    const search = term.toLowerCase().replace(/[^a-z0-9]/g, '');
    return countryCodes.filter(country => 
      country.country.toLowerCase().includes(search) || 
      country.code.includes(search)
    );
  }

  function handleSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    searchTerm = input.value;
    
    // If input starts with +, remove it for searching
    const searchValue = searchTerm.startsWith('+') ? searchTerm.slice(1) : searchTerm;
    
    filteredCountries = filterCountries(searchValue);
    showDropdown = true;

    // If the input is a valid country code, update the selection
    const matchingCountry = countryCodes.find(cc => searchTerm === `+${cc.code} (${cc.country})`);
    if (matchingCountry) {
      selectedCountryCode = matchingCountry.code;
      validateAndDispatch();
    }
  }

  function selectCountry(country: { code: string; country: string }) {
    selectedCountryCode = country.code;
    searchTerm = `+${country.code} (${country.country})`;
    showDropdown = false;
    validateAndDispatch();
  }

  function validateAndDispatch() {
    // Remove all non-numeric characters
    const cleanNumber = phoneNumberWithoutCode.replace(/[^0-9]/g, '');
    
    if (cleanNumber.length < 6) {
      error = t('phoneNumberTooShort');
      return;
    }
    
    if (cleanNumber.length > 15) {
      error = t('phoneNumberTooLong');
      return;
    }

    error = null;
    const fullNumber = selectedCountryCode + cleanNumber;
    dispatch('change', { phoneNumber: fullNumber });
  }

  function handlePhoneNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    phoneNumberWithoutCode = input.value;
    validateAndDispatch();
  }
</script>

<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    {t('phoneNumber')}
  </label>
  <div class="flex gap-2">
    <div class="relative w-64">
      <input
        type="text"
        value={searchTerm}
        on:input={handleSearchInput}
        on:focus={() => showDropdown = true}
        placeholder="+34 (Spain)"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out bg-white/80 backdrop-blur-sm"
      />
      {#if showDropdown}
        <div 
          class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          on:mouseleave={() => showDropdown = false}
        >
          {#each filteredCountries as country}
            <button
              class="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              on:click={() => selectCountry(country)}
            >
              +{country.code} ({country.country})
            </button>
          {/each}
        </div>
      {/if}
    </div>
    <input
      type="tel"
      value={phoneNumberWithoutCode}
      on:input={handlePhoneNumberInput}
      placeholder={t('enterPhoneNumber')}
      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out bg-white/80 backdrop-blur-sm"
    />
  </div>
  {#if error}
    <p class="text-sm text-red-500">{error}</p>
  {/if}
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