<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { get } from 'svelte/store';
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
    // console.trace('handleReservasChange called');

    // Convert empty string to null
    const newReservasValue = event.detail === "" ? null : event.detail;
    reservas = newReservasValue; // Update local prop binding

    // Log the value being set
    // console.log('Setting reservas value:', { /* ... */ });

    const cRest = get(currentRestaurant);
    const restName = restaurantName || cRest?.name || '';
    const restLogo = menuLogo !== undefined ? menuLogo : cRest?.logo;
    const restPrompt = customPrompt !== undefined ? customPrompt : cRest?.customPrompt;
    const restSlug = cRest?.slug || null;
    const restPhone = phoneNumber !== undefined ? phoneNumber : cRest?.phoneNumber;
    const restColor = color || cRest?.color || null;

    // Use updateRestaurantInfo instead
    menuStore.updateRestaurantInfo(
      restName,
      restLogo,
      restPrompt,
      restSlug,
      restPhone,
      newReservasValue, // Pass updated value
      redes_sociales,   // Pass current value for other field
      restColor
    );

    // Dispatch update event - Make sure to include all fields for UpdateEvent type
    dispatch('update', {
      id: selectedRestaurant || undefined, // Include id if available
      name: restName,
      logo: restLogo,
      customPrompt: restPrompt,
      phoneNumber: restPhone,
      color: restColor,
      currency: currency,
      reservas: newReservasValue,
      redes_sociales: redes_sociales === undefined ? null : redes_sociales, // Explicitly handle undefined
      slug: restSlug
    });
  }

  // Function to handle redes_sociales URL input
  function handleRedesSocialesChange(event: CustomEvent<string | null>) {
    // console.trace('handleRedesSocialesChange called');

    // Convert empty string to null
    const newRedesValue = event.detail === "" ? null : event.detail;
    redes_sociales = newRedesValue; // Update local prop binding

    // Log the value being set
    // console.log('Setting redes_sociales value:', { /* ... */ });

    const cRest = get(currentRestaurant);
    const restName = restaurantName || cRest?.name || '';
    const restLogo = menuLogo !== undefined ? menuLogo : cRest?.logo;
    const restPrompt = customPrompt !== undefined ? customPrompt : cRest?.customPrompt;
    const restSlug = cRest?.slug || null;
    const restPhone = phoneNumber !== undefined ? phoneNumber : cRest?.phoneNumber;
    const restColor = color || cRest?.color || null;

    // Use updateRestaurantInfo instead
    menuStore.updateRestaurantInfo(
      restName,
      restLogo,
      restPrompt,
      restSlug,
      restPhone,
      reservas,         // Pass current value for other field
      newRedesValue,    // Pass updated value
      restColor
    );

    // Dispatch update event - Make sure to include all fields for UpdateEvent type
    dispatch('update', {
      id: selectedRestaurant || undefined, // Include id if available
      name: restName,
      logo: restLogo,
      customPrompt: restPrompt,
      phoneNumber: restPhone,
      color: restColor,
      currency: currency,
      reservas: reservas === undefined ? null : reservas, // Explicitly handle undefined
      redes_sociales: newRedesValue,
      slug: restSlug
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