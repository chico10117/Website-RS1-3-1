<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category } from '$lib/types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { toasts } from '$lib/stores/toast';

  export let selectedRestaurant: string | null;

  const dispatch = createEventDispatcher<{
    add: Category;
  }>();

  let newCategory = '';

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  async function addCategory() {
    if (newCategory.trim() && selectedRestaurant) {
      try {
        // Create a new category object
        const category: Category = {
          id: crypto.randomUUID(), // Generate a temporary ID
          name: newCategory.trim(),
          dishes: [],
          restaurantId: selectedRestaurant
        };

        dispatch('add', category);
        newCategory = '';
      } catch (error) {
        console.error('Error adding category:', error);
        if (error instanceof Error) {
          toasts.error(t('error') + ': ' + error.message);
        }
      }
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      addCategory();
    }
  }
</script>

<div class="flex items-center space-x-2">
  <input
    type="text"
    class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 font-normal"
    placeholder={t('categoryName')}
    bind:value={newCategory}
    on:keydown={handleKeyPress}
  />
  <button 
    class="px-4 py-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600/80 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
    on:click={addCategory}
    disabled={!selectedRestaurant}
  >
    {t('add')}
  </button>
</div> 