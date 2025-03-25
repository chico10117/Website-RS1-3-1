<script lang="ts">
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { restaurantStore } from '$lib/stores/restaurant-store';
  import { toasts } from '$lib/stores/toast';
  import MenuUploader from './MenuUploader.svelte';
  import { useForm } from '$lib/hooks/use-form';
  import { validateUrl, validatePhone, validateColor } from '$lib/utils/validation';
  
  // Import smart form components
  import TextField from '../../ui/TextField.svelte';
  import UrlField from '../../ui/UrlField.svelte';
  import PhoneField from '../../ui/PhoneField.svelte';
  import ColorField from '../../ui/ColorField.svelte';
  
  // Export props that are passed from MenuEditor
  export let restaurantName: string = '';
  export let menuLogo: string | null = null;
  export let customPrompt: string | null = null;
  export let selectedRestaurant: string | null = null;
  export let restaurants: any[] = [];
  export let currency: string = '€';
  export let color: string = 'light';
  export let phoneNumber: string | null = null;
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;
  
  // Create event dispatcher
  const dispatch = createEventDispatcher();
  
  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => {
    if (!translations || !translations[key] || !translations[key][currentLanguage]) {
      // Return the key as fallback if translation is missing
      return key;
    }
    return translations[key][currentLanguage];
  };
  
  // Get current restaurant and unsaved changes state
  $: currentRestaurant = $restaurantStore.currentRestaurant;
  $: hasUnsavedChanges = $restaurantStore.hasUnsavedChanges;
  $: fields = $restaurantStore.fields || {
    name: '',
    logo: null,
    customPrompt: null,
    slug: null,
    phoneNumber: null,
    color: 'light',
    currency: '€',
    reservas: null,
    redes_sociales: null,
  };
  $: errors = $restaurantStore.errors || {};
  
  // Color options
  $: colorOptions = [
    { value: 'light', label: t('colorLight') || "Light", hex: '#85A3FA' },
    { value: 'custom', label: t('colorCustom') || "Custom", hex: '' }
  ];
  
  // Form setup for validation
  const { touched, isSubmitting, isValid, handleSubmit } = useForm(
    fields, 
    {
      name: (value) => !value || value.trim() === '' ? (t('nameRequired') || "Restaurant name is required") : null,
      reservas: (value) => validateUrl(value),
      redes_sociales: (value) => validateUrl(value),
      phoneNumber: (value) => validatePhone(value),
      color: (value) => validateColor(value)
    },
    saveChanges,
    (field, value) => {
      // Update the store when form values change
      restaurantStore.updateField(field, value);
    }
  );
  
  // Handle restaurant name change
  function handleNameChange(event: Event) {
    if (!event || !event.target) return;
    const target = event.target as HTMLInputElement;
    const value = target.value;
    restaurantStore.updateField('name', value);
    
    // Also dispatch update event for parent component
    dispatch('update', { field: 'restaurantName', value });
  }
  
  // Handle restaurant URL updates
  function handleUrlChange(field: string, event: { detail: any }) {
    if (!event || !event.detail) return;
    const value = event.detail;
    restaurantStore.updateField(field as any, value);
    
    // Also dispatch update event for parent component
    dispatch('update', { field, value });
  }
  
  // Save changes
  async function saveChanges() {
    try {
      await restaurantStore.saveChanges();
      toasts.success(t('changesSaved'));
    } catch (error) {
      toasts.error(t('errorSaving'));
    }
  }
  
  // Handle menu upload success
  function handleMenuUploadSuccess(event: CustomEvent<{ restaurantData: any }>) {
    const restaurant = event.detail.restaurantData?.restaurant;
    
    if (restaurant) {
      restaurantStore.selectRestaurant(restaurant.id);
      toasts.success(t('menuUploaded'));
      // Dispatch update event
      dispatch('update', { field: 'selectedRestaurant', value: restaurant.id });
    }
  }
  
  // Handle menu upload error
  function handleMenuUploadError(event: CustomEvent<string>) {
    toasts.error(t('errorUploading') + ': ' + event.detail);
  }
  
  // Handle text area input
  function handleTextAreaInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    restaurantStore.updateField('customPrompt', target.value || null);
  }
  
  onMount(async () => {
    // Initialize the restaurant store
    await restaurantStore.initialize();
    
    // If there's a selected restaurant, load it
    if (selectedRestaurant) {
      await restaurantStore.selectRestaurant(selectedRestaurant);
    }
  });
</script>

<div class="space-y-6">
  {#if !selectedRestaurant}
    <!-- Menu Uploader (for new restaurants) -->
    <div class="space-y-2 mb-6">
      <h2 class="text-lg font-semibold mb-3 text-gray-800">
        {t('uploadMenu')}
      </h2>
      <MenuUploader
        restaurantName={fields.name || ''}
        customPrompt={fields.customPrompt}
        restaurantId={currentRestaurant?.id || null}
        on:success={handleMenuUploadSuccess}
        on:error={handleMenuUploadError}
      />
    </div>
  {/if}

  <!-- Restaurant Info Form -->
  <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
    <!-- Restaurant Name -->
    <TextField
      id="restaurantName"
      name="name"
      label={t('restaurantName') || "Restaurant Name"}
      value={fields.name}
      error={errors.name}
      touched={$touched.name}
      required={true}
      helpText={t('restaurantNameHelp') || "Enter the name of your restaurant"}
      on:change={handleNameChange}
    />
    
    <!-- Restaurant Logo Preview -->
    {#if fields.logo}
      <div class="mt-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">{t('currentLogo')}</h3>
        <div class="flex items-center space-x-2">
          <img 
            src={fields.logo} 
            alt={t('restaurantLogo')} 
            class="h-16 w-16 object-contain rounded-md border border-gray-200"
          />
          <button
            type="button"
            class="text-sm text-red-600 hover:text-red-700"
            on:click={() => restaurantStore.updateField('logo', null)}
          >
            {t('remove')}
          </button>
        </div>
      </div>
    {/if}
    
    <!-- Restaurant Color -->
    <ColorField
      id="restaurantColor"
      name="color"
      label={t('themeColor')}
      value={fields.color}
      error={errors.color}
      touched={$touched.color}
      colorOptions={colorOptions}
      on:change={(e) => restaurantStore.updateField('color', e.detail)}
    />
    
    <!-- Restaurant Phone Number -->
    <PhoneField
      id="phoneNumber"
      name="phoneNumber"
      label={t('phoneNumber')}
      value={fields.phoneNumber}
      error={errors.phoneNumber}
      touched={$touched.phoneNumber}
      placeholder={t('phoneNumberPlaceholder')}
      showCountrySelector={true}
      helpText={t('phoneNumberHelp') || "Include country code for international calls"}
      on:change={(e) => handleUrlChange('phoneNumber', e)}
    />

    <!-- Restaurant Prompt -->
    <div class="space-y-1">
      <label for="customPrompt" class="block text-sm font-medium text-gray-700">
        {t('customPrompt')}
      </label>
      <textarea
        id="customPrompt"
        rows="3"
        class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={t('customPromptPlaceholder')}
        value={fields.customPrompt || ''}
        on:input={handleTextAreaInput}
      ></textarea>
      <p class="text-sm text-gray-500">{t('customPromptHelp')}</p>
    </div>
    
    <!-- Reservations URL -->
    <UrlField
      id="reservas"
      name="reservas"
      label={t('reservasLabel') || "Reservations URL"}
      placeholder={t('reservasPlaceholder') || "https://reservations.example.com"}
      value={fields.reservas}
      error={errors.reservas}
      touched={$touched.reservas}
      on:change={(e) => handleUrlChange('reservas', e)}
    />
    
    <!-- Social Media URL -->
    <UrlField
      id="redes_sociales"
      name="redes_sociales"
      label={t('redesSocialesLabel') || "Social Media URL"}
      placeholder={t('redesSocialesPlaceholder') || "https://instagram.com/yourrestaurant"}
      value={fields.redes_sociales}
      error={errors.redes_sociales} 
      touched={$touched.redes_sociales}
      on:change={(e) => handleUrlChange('redes_sociales', e)}
    />
    
    <!-- Save Button (only show if there are changes) -->
    {#if $hasUnsavedChanges}
      <div class="mt-6">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={$isSubmitting || !$isValid}
        >
          {$isSubmitting ? t('saving') : t('saveChanges')}
        </button>
      </div>
    {/if}
  </form>
</div>