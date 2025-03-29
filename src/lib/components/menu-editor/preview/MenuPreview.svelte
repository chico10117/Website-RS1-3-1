<script lang="ts">
  import type { Category } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { onMount } from 'svelte';
  // import { menuCache } from '$lib/stores/menu-cache'; // Removed if menu-cache was deleted
  // import { menuState } from '$lib/stores/menu-state'; // <--- REMOVED THIS LINE
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { menuStore } from '$lib/stores';

  export let restaurantName: string = '';
  export let menuLogo: string | null = null;
  export let categories: Category[] = [];
  export let currency: string = '€';

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Update restaurant data when currentRestaurant changes
  $: if ($currentRestaurant) {
    restaurantName = $currentRestaurant.name || restaurantName;
    menuLogo = $currentRestaurant.logo || menuLogo;
    currency = $currentRestaurant.currency || currency;
  }

  // Subscribe to menu store changes to get categories
  $: if ($menuStore.categories && $menuStore.categories.length > 0) {
    // Ensure each category has a dishes array
    categories = $menuStore.categories.map(category => ({
      ...category,
      dishes: category.dishes || []
    }));
  }

  // REMOVED THE REACTIVE BLOCK THAT USED menuState
  // $: {
  //   const state = $menuState;
  //   if (state) {
  //     if (state.restaurantName) restaurantName = state.restaurantName;
  //     if (state.menuLogo) menuLogo = state.menuLogo;
  //     if (state.categories) categories = state.categories;
  //   }
  // }

  // Format price as currency
  function formatPrice(price: number | string): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  }

  // We don't need to reset state on mount anymore
  // This was causing the preview to clear when navigating
  onMount(() => {
    // Only initialize if no restaurant is selected
    // if (!$currentRestaurant && !$menuStore.categories.length) {
    //   menuState.reset(); // menuState is removed, so this line is also removed
    // }
  });
</script>

<div class="bg-white/30 backdrop-blur-md rounded-xl border border-white/50 shadow-lg p-3 sm:p-6">
  <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 tracking-tight">{t('menuPreview')}</h2>

  <!-- Restaurant Info -->
  {#if restaurantName || menuLogo}
    <div class="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
      {#if menuLogo}
        <img
          src={menuLogo}
          alt="Restaurant logo"
          class="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg shadow-md"
        />
      {/if}
      {#if restaurantName}
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">{restaurantName}</h1>
      {/if}
    </div>
  {/if}

  <!-- Categories and Dishes -->
  {#if categories.length > 0}
    {#each categories as category}
      <div class="mb-6 sm:mb-8">
        <h3 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 tracking-tight">{category.name}</h3>
        {#if category.dishes && category.dishes.length > 0}
          <div class="space-y-3 sm:space-y-4">
            {#each category.dishes as dish}
              <div class="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50 hover:bg-white/50 transition-colors">
                {#if dish.imageUrl}
                  <img
                    src={dish.imageUrl}
                    alt={dish.title}
                    class="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg shadow-md"
                  />
                {/if}
                <div class="flex-1 w-full">
                  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-2">
                    <h4 class="text-base sm:text-lg font-semibold text-gray-800">{dish.title}</h4>
                    <p class="text-base sm:text-lg font-bold text-gray-800">{currency}{formatPrice(dish.price)}</p>
                  </div>
                  {#if dish.description}
                    <p class="text-sm sm:text-base text-gray-600 mt-1 font-normal">{dish.description}</p>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 italic">No dishes in this category</p>
        {/if}
      </div>
    {/each}
  {:else}
    <p class="text-gray-500 italic">No categories available</p>
  {/if}
</div>