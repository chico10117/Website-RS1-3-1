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

  // Common country codes
  const countryCodes = [
    { code: '93', country: 'Afghanistan' },
    { code: '355', country: 'Albania' },
    { code: '213', country: 'Algeria' },
    { code: '376', country: 'Andorra' },
    { code: '244', country: 'Angola' },
    { code: '54', country: 'Argentina' },
    { code: '374', country: 'Armenia' },
    { code: '61', country: 'Australia' },
    { code: '43', country: 'Austria' },
    { code: '994', country: 'Azerbaijan' },
    { code: '973', country: 'Bahrain' },
    { code: '880', country: 'Bangladesh' },
    { code: '375', country: 'Belarus' },
    { code: '32', country: 'Belgium' },
    { code: '501', country: 'Belize' },
    { code: '229', country: 'Benin' },
    { code: '975', country: 'Bhutan' },
    { code: '591', country: 'Bolivia' },
    { code: '387', country: 'Bosnia and Herzegovina' },
    { code: '267', country: 'Botswana' },
    { code: '55', country: 'Brazil' },
    { code: '359', country: 'Bulgaria' },
    { code: '226', country: 'Burkina Faso' },
    { code: '257', country: 'Burundi' },
    { code: '855', country: 'Cambodia' },
    { code: '237', country: 'Cameroon' },
    { code: '1', country: 'Canada/USA' },
    { code: '236', country: 'Central African Republic' },
    { code: '235', country: 'Chad' },
    { code: '56', country: 'Chile' },
    { code: '86', country: 'China' },
    { code: '57', country: 'Colombia' },
    { code: '269', country: 'Comoros' },
    { code: '242', country: 'Congo' },
    { code: '506', country: 'Costa Rica' },
    { code: '385', country: 'Croatia' },
    { code: '53', country: 'Cuba' },
    { code: '357', country: 'Cyprus' },
    { code: '420', country: 'Czech Republic' },
    { code: '45', country: 'Denmark' },
    { code: '253', country: 'Djibouti' },
    { code: '593', country: 'Ecuador' },
    { code: '20', country: 'Egypt' },
    { code: '503', country: 'El Salvador' },
    { code: '240', country: 'Equatorial Guinea' },
    { code: '372', country: 'Estonia' },
    { code: '251', country: 'Ethiopia' },
    { code: '679', country: 'Fiji' },
    { code: '358', country: 'Finland' },
    { code: '33', country: 'France' },
    { code: '241', country: 'Gabon' },
    { code: '220', country: 'Gambia' },
    { code: '995', country: 'Georgia' },
    { code: '49', country: 'Germany' },
    { code: '233', country: 'Ghana' },
    { code: '30', country: 'Greece' },
    { code: '502', country: 'Guatemala' },
    { code: '224', country: 'Guinea' },
    { code: '245', country: 'Guinea-Bissau' },
    { code: '592', country: 'Guyana' },
    { code: '509', country: 'Haiti' },
    { code: '504', country: 'Honduras' },
    { code: '852', country: 'Hong Kong' },
    { code: '36', country: 'Hungary' },
    { code: '354', country: 'Iceland' },
    { code: '91', country: 'India' },
    { code: '62', country: 'Indonesia' },
    { code: '98', country: 'Iran' },
    { code: '964', country: 'Iraq' },
    { code: '353', country: 'Ireland' },
    { code: '972', country: 'Israel' },
    { code: '39', country: 'Italy' },
    { code: '81', country: 'Japan' },
    { code: '962', country: 'Jordan' },
    { code: '7', country: 'Kazakhstan' },
    { code: '254', country: 'Kenya' },
    { code: '965', country: 'Kuwait' },
    { code: '996', country: 'Kyrgyzstan' },
    { code: '856', country: 'Laos' },
    { code: '371', country: 'Latvia' },
    { code: '961', country: 'Lebanon' },
    { code: '266', country: 'Lesotho' },
    { code: '231', country: 'Liberia' },
    { code: '218', country: 'Libya' },
    { code: '423', country: 'Liechtenstein' },
    { code: '370', country: 'Lithuania' },
    { code: '352', country: 'Luxembourg' },
    { code: '853', country: 'Macau' },
    { code: '389', country: 'Macedonia' },
    { code: '261', country: 'Madagascar' },
    { code: '265', country: 'Malawi' },
    { code: '60', country: 'Malaysia' },
    { code: '960', country: 'Maldives' },
    { code: '223', country: 'Mali' },
    { code: '356', country: 'Malta' },
    { code: '222', country: 'Mauritania' },
    { code: '230', country: 'Mauritius' },
    { code: '52', country: 'Mexico' },
    { code: '373', country: 'Moldova' },
    { code: '377', country: 'Monaco' },
    { code: '976', country: 'Mongolia' },
    { code: '382', country: 'Montenegro' },
    { code: '212', country: 'Morocco' },
    { code: '258', country: 'Mozambique' },
    { code: '95', country: 'Myanmar' },
    { code: '264', country: 'Namibia' },
    { code: '977', country: 'Nepal' },
    { code: '31', country: 'Netherlands' },
    { code: '64', country: 'New Zealand' },
    { code: '505', country: 'Nicaragua' },
    { code: '227', country: 'Niger' },
    { code: '234', country: 'Nigeria' },
    { code: '850', country: 'North Korea' },
    { code: '47', country: 'Norway' },
    { code: '968', country: 'Oman' },
    { code: '92', country: 'Pakistan' },
    { code: '970', country: 'Palestine' },
    { code: '507', country: 'Panama' },
    { code: '675', country: 'Papua New Guinea' },
    { code: '595', country: 'Paraguay' },
    { code: '51', country: 'Peru' },
    { code: '63', country: 'Philippines' },
    { code: '48', country: 'Poland' },
    { code: '351', country: 'Portugal' },
    { code: '974', country: 'Qatar' },
    { code: '40', country: 'Romania' },
    { code: '7', country: 'Russia' },
    { code: '250', country: 'Rwanda' },
    { code: '966', country: 'Saudi Arabia' },
    { code: '221', country: 'Senegal' },
    { code: '381', country: 'Serbia' },
    { code: '248', country: 'Seychelles' },
    { code: '232', country: 'Sierra Leone' },
    { code: '65', country: 'Singapore' },
    { code: '421', country: 'Slovakia' },
    { code: '386', country: 'Slovenia' },
    { code: '252', country: 'Somalia' },
    { code: '27', country: 'South Africa' },
    { code: '82', country: 'South Korea' },
    { code: '211', country: 'South Sudan' },
    { code: '34', country: 'Spain' },
    { code: '94', country: 'Sri Lanka' },
    { code: '249', country: 'Sudan' },
    { code: '597', country: 'Suriname' },
    { code: '268', country: 'Swaziland' },
    { code: '46', country: 'Sweden' },
    { code: '41', country: 'Switzerland' },
    { code: '963', country: 'Syria' },
    { code: '886', country: 'Taiwan' },
    { code: '992', country: 'Tajikistan' },
    { code: '255', country: 'Tanzania' },
    { code: '66', country: 'Thailand' },
    { code: '228', country: 'Togo' },
    { code: '216', country: 'Tunisia' },
    { code: '90', country: 'Turkey' },
    { code: '993', country: 'Turkmenistan' },
    { code: '256', country: 'Uganda' },
    { code: '380', country: 'Ukraine' },
    { code: '971', country: 'United Arab Emirates' },
    { code: '44', country: 'United Kingdom' },
    { code: '598', country: 'Uruguay' },
    { code: '998', country: 'Uzbekistan' },
    { code: '58', country: 'Venezuela' },
    { code: '84', country: 'Vietnam' },
    { code: '967', country: 'Yemen' },
    { code: '260', country: 'Zambia' },
    { code: '263', country: 'Zimbabwe' }
  ].sort((a, b) => a.country.localeCompare(b.country));

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