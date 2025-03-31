<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { 
    handleCustomPromptInput,
    ensureString
  } from '$lib/utils/RestaurantInfo.helpers';

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

  // Called on customPrompt <textarea> input
  function onCustomPromptInput(event: Event) {
    // Call the helper to dispatch the partial update
    const newVal = handleCustomPromptInput(
      event,
      selectedRestaurant,
      t,
      dispatch
    );
    // DO NOT update local state here. Rely on the prop passed down.
    // if (newVal !== null) {
    //   customPrompt = newVal; 
    // }
  }

  // No longer need displayCustomPrompt derived from local state
  // $: displayCustomPrompt = ensureString(customPrompt);
</script>

<div class="space-y-2">
  <label for="customPrompt" class="block text-sm font-medium text-gray-700">
    {t('customPromptLabel')}
  </label>
  <div class="relative">
    <textarea
      id="customPrompt"
      value={ensureString(customPrompt)}
      on:input={onCustomPromptInput}
      placeholder={t('customPromptPlaceholder')}
      class="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2
             focus:ring-blue-500 focus:border-transparent transition-all
             duration-200 ease-in-out bg-white/80 backdrop-blur-sm resize-none"
    ></textarea>
    <div class="absolute bottom-2 right-2 text-sm text-gray-500">
      {ensureString(customPrompt).length}/5000
    </div>
  </div>
</div> 