<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores/menu-store';
  import UrlInput from './UrlInput.svelte';

  export let restaurantName = '';
  export let selectedRestaurant: string | null = null;
  export let menuLogo: string | null = null;
  export let customPrompt: string | null = null;
  export let phoneNumber: number | null = null;
  export let color: string = '#85A3FA';
  export let currency: string = '€';
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;

  // Svelte event dispatcher
  const dispatch = createEventDispatcher();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  // Function to handle reservas URL input
  function handleReservasChange(event: CustomEvent<string | null>) {
    console.trace('handleReservasChange called');
    
    // Convert empty string to null
    reservas = event.detail === "" ? null : event.detail;
    
    // Log the value being set
    console.log('Setting reservas value:', {
      value: reservas,
      type: typeof reservas,
      eventDetail: event.detail,
      eventDetailType: typeof event.detail
    });
    
    // Force a store update to mark data as changed
    menuStore.updateReservasAndSocials(reservas, redes_sociales);
    
    // Update restaurant info
    dispatch('update', {
      id: selectedRestaurant,
      name: restaurantName,
      logo: menuLogo,
      customPrompt,
      phoneNumber,
      color,
      currency,
      reservas,
      redes_sociales
    });
  }

  // Function to handle redes_sociales URL input
  function handleRedesSocialesChange(event: CustomEvent<string | null>) {
    console.trace('handleRedesSocialesChange called');
    
    // Convert empty string to null
    redes_sociales = event.detail === "" ? null : event.detail;
    
    // Log the value being set
    console.log('Setting redes_sociales value:', {
      value: redes_sociales,
      type: typeof redes_sociales,
      eventDetail: event.detail,
      eventDetailType: typeof event.detail
    });
    
    // Force a store update to mark data as changed
    menuStore.updateReservasAndSocials(reservas, redes_sociales);
    
    // Update restaurant info
    dispatch('update', {
      id: selectedRestaurant,
      name: restaurantName,
      logo: menuLogo,
      customPrompt,
      phoneNumber,
      color,
      currency,
      reservas,
      redes_sociales
    });
  }
</script>

<div class="space-y-4">
  <!-- Reservas URL -->
  <UrlInput
    id="reservas"
    label={t('reservasLabel') || "Reservations URL"}
    placeholder={t('reservasPlaceholder') || "https://reservations.example.com"}
    value={reservas}
    on:change={handleReservasChange}
  />

  <!-- Redes Sociales URL -->
  <UrlInput
    id="redes_sociales"
    label={t('redesSocialesLabel') || "Social Media URL"}
    placeholder={t('redesSocialesPlaceholder') || "https://instagram.com/yourrestaurant"}
    value={redes_sociales}
    on:change={handleRedesSocialesChange}
  />
</div> 