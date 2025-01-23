<script lang="ts">
  import type { Category } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { onMount } from 'svelte';
  import { menuCache } from '$lib/stores/menu-cache';
  import { menuState } from '$lib/stores/menu-state';
  import { currentRestaurant } from '$lib/stores/restaurant';

  export let restaurantName: string = '';
  export let menuLogo: string | null = null;
  export let categories: Category[] = [];

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Format price as currency
  function formatPrice(price: number | string): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  }

  onMount(() => {
    // Clear all caches and state when component mounts
    menuCache.clearCache();
    menuState.updateRestaurantInfo('', null);
    menuState.updateCategories([]);
    currentRestaurant.set(null);
    
    // Reset menu state
    menuState.reset();
  });
</script>

<div class="bg-white/30 backdrop-blur-md rounded-xl border border-white/50 shadow-lg p-6">
  <h2 class="text-2xl font-bold mb-6 text-gray-800 tracking-tight">{t('menuPreview')}</h2>
  
  <!-- Restaurant Info -->
  {#if restaurantName || menuLogo}
    <div class="flex items-center space-x-4 mb-8">
      {#if menuLogo}
        <img 
          src={menuLogo} 
          alt="Restaurant logo" 
          class="w-16 h-16 object-cover rounded-lg shadow-md"
        />
      {/if}
      {#if restaurantName}
        <h1 class="text-3xl font-bold text-gray-800 tracking-tight">{restaurantName}</h1>
      {/if}
    </div>
  {/if}

  <!-- Categories and Dishes -->
  {#if categories.length > 0}
    {#each categories as category}
      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 tracking-tight">{category.name}</h3>
        {#if category.dishes && category.dishes.length > 0}
          <div class="space-y-4">
            {#each category.dishes as dish}
              <div class="flex items-start space-x-4 p-4 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50 hover:bg-white/50 transition-colors">
                {#if dish.imageUrl}
                  <img 
                    src={dish.imageUrl} 
                    alt={dish.title}
                    class="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                {/if}
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <h4 class="text-lg font-semibold text-gray-800">{dish.title}</h4>
                    <p class="text-lg font-bold text-gray-800">${formatPrice(dish.price)}</p>
                  </div>
                  <p class="text-gray-600 mt-1 font-normal">{dish.description}</p>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div> 