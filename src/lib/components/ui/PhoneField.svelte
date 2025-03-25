<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { validatePhone } from '$lib/utils/validation';
  import FormField from './FormField.svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  
  export let id: string = '';
  export let name: string = '';
  export let label: string = '';
  export let value: string | null = null;
  export let placeholder: string = '';
  export let error: string | null = null;
  export let touched: boolean = false;
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let helpText: string = '';
  export let autoValidate: boolean = true;
  export let showCountrySelector: boolean = true;
  
  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];
  
  // Prioritized country codes list
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
    { code: '86', country: 'China' },
    { code: '82', country: 'South Korea' },
    { code: '61', country: 'Australia' },
    { code: '41', country: 'Switzerland' },
    { code: '31', country: 'Netherlands' },
    // Add more as needed
  ];
  
  // Country selector state
  let selectedCountryCode = '34'; // Default to Spain
  let phoneNumberWithoutCode = '';
  let searchTerm = '+34 (Spain)';
  let showDropdown = false;
  let filteredCountries = countryCodes;
  
  // Use null safety for the UI
  let inputValue = value || '';
  
  // Initialize from prop
  $: if (value && showCountrySelector) {
    // Find matching country code
    const matchingCode = countryCodes.find(cc => value?.startsWith(cc.code));
    if (matchingCode) {
      selectedCountryCode = matchingCode.code;
      searchTerm = `+${matchingCode.code} (${matchingCode.country})`;
      phoneNumberWithoutCode = value.slice(matchingCode.code.length);
    } else {
      phoneNumberWithoutCode = value;
      inputValue = value;
    }
  } else if (value && !showCountrySelector) {
    inputValue = value;
  }
  
  // When external value changes
  $: if (value !== inputValue && !showCountrySelector && (value !== null || inputValue !== '')) {
    inputValue = value || '';
  }
  
  const dispatch = createEventDispatcher<{
    change: string | null;
    blur: string | null;
    focus: string | null;
    validate: string | null;
  }>();
  
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
  
  function formatPhoneNumber(value: string): string {
    // Basic phone number formatting: keep only digits, spaces, plus, parentheses, and dashes
    return value.replace(/[^\d\s\+\-\(\)\.]/g, '');
  }
  
  function handleInput(event: Event) {
    if (!showCountrySelector) {
      const target = event.target as HTMLInputElement;
      // Format the phone number
      const formattedValue = formatPhoneNumber(target.value);
      inputValue = formattedValue;
      
      // Update the input value if it was changed by formatting
      if (target.value !== formattedValue) {
        target.value = formattedValue;
      }
      
      // Convert empty strings to null for the model
      const valueToEmit = inputValue.trim() === '' ? null : inputValue;
      
      // Perform validation if autoValidate is enabled
      if (autoValidate) {
        error = validatePhone(valueToEmit);
      }
      
      dispatch('change', valueToEmit);
    }
  }
  
  function handlePhoneNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    phoneNumberWithoutCode = input.value;
    validateAndDispatch();
  }
  
  function validateAndDispatch() {
    // Remove all non-numeric characters for validation
    const cleanNumber = phoneNumberWithoutCode.replace(/[^0-9]/g, '');
    
    if (cleanNumber.length < 6) {
      error = t('phoneNumberTooShort') || 'Phone number is too short';
      return;
    }
    
    if (cleanNumber.length > 15) {
      error = t('phoneNumberTooLong') || 'Phone number is too long';
      return;
    }

    error = null;
    const fullNumber = selectedCountryCode + cleanNumber;
    dispatch('change', fullNumber);
  }
  
  function handleBlur() {
    // Mark as touched on blur
    touched = true;
    
    // Always validate on blur
    if (!showCountrySelector) {
      error = validatePhone(inputValue || null);
      dispatch('validate', error);
      dispatch('blur', inputValue === '' ? null : inputValue);
    } else {
      dispatch('blur', selectedCountryCode + phoneNumberWithoutCode);
    }
    
    // Hide dropdown
    showDropdown = false;
  }
  
  function handleFocus() {
    if (!showCountrySelector) {
      dispatch('focus', inputValue === '' ? null : inputValue);
    } else {
      dispatch('focus', selectedCountryCode + phoneNumberWithoutCode);
    }
  }
</script>

<FormField {id} {label} {error} {touched} {required} {helpText}>
  {#if !showCountrySelector}
    <!-- Simple phone field -->
    <input
      {id}
      {name}
      type="tel"
      value={inputValue}
      {placeholder}
      {disabled}
      {required}
      class:error={error && touched}
      on:input={handleInput}
      on:blur={handleBlur}
      on:focus={handleFocus}
    />
  {:else}
    <!-- International phone field with country selector -->
    <div class="flex gap-2">
      <div class="relative w-1/3">
        <input
          type="text"
          value={searchTerm}
          on:input={handleSearchInput}
          on:focus={() => showDropdown = true}
          on:blur={handleBlur}
          placeholder="+34 (Spain)"
          disabled={disabled}
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
        id={id}
        name={name}
        value={phoneNumberWithoutCode}
        on:input={handlePhoneNumberInput}
        on:blur={handleBlur}
        on:focus={handleFocus}
        placeholder={placeholder || t('enterPhoneNumber') || "Enter phone number"}
        disabled={disabled}
        required={required}
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out bg-white/80 backdrop-blur-sm"
        class:error={error && touched}
      />
    </div>
  {/if}
</FormField>

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