<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { 
    startEditingRestaurant,
    cancelEditingRestaurant,
    handleRestaurantEditKeyPress,
    updateRestaurantName,
    handleRestaurantNameInput
  } from '$lib/utils/RestaurantInfo.helpers';
  import QRCode from './QRCode.svelte';

  export let restaurantName = '';
  export let menuLogo: string | null = null;
  export let selectedRestaurant: string | null = null;
  export let isCreatingRestaurant = false;
  export let customPrompt: string | null = null;
  export let phoneNumber: number | null = null;
  export let color: string = '#85A3FA';
  export let currency: string = '€';
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;
  
  let isEditingRestaurant = false;
  let editingRestaurantName = '';

  // Svelte event dispatcher
  const dispatch = createEventDispatcher();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  // Called on "Edit" button
  function onEditRestaurantClick() {
    startEditingRestaurant(
      (val) => editingRestaurantName = val,
      (val) => isEditingRestaurant = val,
      restaurantName
    );
  }

  // Called on "Cancel" button while editing
  function onCancelEdit() {
    cancelEditingRestaurant(
      (val) => editingRestaurantName = val,
      (val) => isEditingRestaurant = val,
      restaurantName
    );
  }

  // Actually update the restaurant name
  async function onUpdateRestaurantName() {
    await updateRestaurantName(
      editingRestaurantName,
      selectedRestaurant,
      dispatch,
      t,
      (val: string) => restaurantName = val,
      (val: boolean) => isEditingRestaurant = val
    );
  }

  // On "Enter" or "Escape"
  function onRestaurantEditKeyPress(event: KeyboardEvent) {
    handleRestaurantEditKeyPress(
      event,
      onUpdateRestaurantName,
      onCancelEdit
    );
  }

  // Called on <input> blur for restaurantName
  function onRestaurantNameBlur() {
    handleRestaurantNameInput(
      restaurantName,
      selectedRestaurant,
      isCreatingRestaurant,
      menuLogo,
      customPrompt,
      phoneNumber?.toString() || null,
      color,
      currency,
      dispatch,
      t
    );
  }
</script>

<div class="space-y-2">
  {#if isEditingRestaurant}
    <div class="flex items-center gap-2 w-full">
      <input
        type="text"
        bind:value={editingRestaurantName}
        on:keydown={onRestaurantEditKeyPress}
        placeholder={t('enterRestaurantName')}
        class="flex-1"
      />
      <button
        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        on:click={onUpdateRestaurantName}
      >
        {t('save')}
      </button>
      <button
        class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        on:click={onCancelEdit}
      >
        {t('cancel')}
      </button>
    </div>
  {:else}
    <div class="w-full">
      <div class="flex items-center gap-2">
        <input
          type="text"
          bind:value={restaurantName}
          on:blur={onRestaurantNameBlur}
          placeholder={t('enterRestaurantName')}
          class="flex-1"
          readonly={!!selectedRestaurant}
        />
        {#if selectedRestaurant}
          <button
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={onEditRestaurantClick}
          >
            {t('edit')}
          </button>
        {/if}
      </div>
      {#if selectedRestaurant}
        {#if isCreatingRestaurant}
          <div class="flex items-center gap-1 px-3 py-1 mt-2 text-sm text-gray-600">
            <svg
              class="animate-spin h-4 w-4 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373
                   0 0 5.373 0 12h4zm2 5.291A7.962
                   7.962 0 014 12H0c0 3.042 1.135
                   5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t('generatingPreview')}
          </div>
        {:else if $currentRestaurant?.slug}
          <div class="flex items-center justify-between w-full mt-2">
            <a
              href={`https://${$currentRestaurant.slug}.reco.restaurant`}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293
                         6.293a1 1 0 101.414 1.414L15
                         6.414V9a1 1 0 102 0V4a1 1
                         0 00-1-1h-5z" />
                <path
                  d="M5 5a2 2 0 00-2
                     2v8a2 2 0 002 2h8a2
                     2 0 002-2v-3a1 1
                     0 10-2 0v3H5V7h3a1
                     1 0 000-2H5z"
                />
              </svg>
              {$currentRestaurant.slug}.reco.restaurant
            </a>
            <QRCode url={`https://${$currentRestaurant.slug}.reco.restaurant`} />
          </div>
        {/if}
      {/if}
    </div>
  {/if}
</div> 