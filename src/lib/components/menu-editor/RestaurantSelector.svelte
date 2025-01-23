<script lang="ts">
  import { onMount } from 'svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import type { Restaurant, Category } from '$lib/types/menu.types';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { menuCache } from '$lib/stores/menu-cache';
  import { menuState } from '$lib/stores/menu-state';
  import * as categoryService from '$lib/services/category.service';
  import * as dishService from '$lib/services/dish.service';
  import * as restaurantService from '$lib/services/restaurant.service';
  import { toasts } from '$lib/stores/toast';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';

  let restaurants: Restaurant[] = [];
  let loading = true;
  let error: string | null = null;
  let switchingRestaurant: string | null = null;
  let editingRestaurant: string | null = null;
  let deletingRestaurant: string | null = null;

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  onMount(async () => {
    try {
      loading = true;
      // Clear all state on page load
      menuCache.clearCache();
      menuState.reset();
      menuState.updateRestaurantInfo('', null);
      menuState.updateCategories([]);
      currentRestaurant.set(null);
      
      // Load restaurants
      restaurants = await currentRestaurant.loadRestaurants();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load restaurants';
    } finally {
      loading = false;
    }
  });

  async function handleRestaurantSelect(restaurant: Restaurant) {
    try {
      switchingRestaurant = restaurant.id;
      
      // Clear previous state
      menuCache.clearCache();
      menuState.reset();
      
      // Load the restaurant data
      await currentRestaurant.loadRestaurant(restaurant.id);
      
      // Update URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.set('restaurant', restaurant.id);
      window.history.replaceState({}, '', url.toString());
      
      // Load categories and dishes
      const categories = await categoryService.fetchCategories(restaurant.id);
      const categoriesWithDishes = await Promise.all(
        categories.map(async (category: Category) => {
          const dishes = await dishService.fetchDishes(restaurant.id, category.id);
          return { ...category, dishes };
        })
      );
      
      // Update menu state
      menuState.updateRestaurantInfo(restaurant.name, restaurant.logo);
      menuState.updateCategories(categoriesWithDishes);
      
    } catch (err) {
      console.error('Error switching restaurant:', err);
      error = err instanceof Error ? err.message : 'Failed to switch restaurant';
    } finally {
      switchingRestaurant = null;
    }
  }

  async function handleAddRestaurant() {
    // Clear current restaurant
    menuCache.clearCache();
    menuState.reset();
    menuState.updateRestaurantInfo('', null);
    menuState.updateCategories([]);
    currentRestaurant.set(null);
  }

  async function handleEditRestaurant(restaurant: Restaurant, event: Event) {
    event.stopPropagation(); // Prevent restaurant selection
    editingRestaurant = restaurant.id;
    // Load the restaurant for editing
    await handleRestaurantSelect(restaurant);
  }

  async function handleDeleteRestaurant(restaurant: Restaurant, event: Event) {
    event.stopPropagation(); // Prevent restaurant selection
    try {
      deletingRestaurant = restaurant.id;
      if (confirm(t('confirmDeleteRestaurant'))) {
        await restaurantService.deleteRestaurant(restaurant.id);
        // Refresh restaurants list
        restaurants = await currentRestaurant.loadRestaurants();
        // Clear state if the deleted restaurant was selected
        if ($currentRestaurant?.id === restaurant.id) {
          menuCache.clearCache();
          menuState.reset();
          menuState.updateRestaurantInfo('', null);
          menuState.updateCategories([]);
          currentRestaurant.set(null);
        }
        toasts.success(t('restaurantDeleteSuccess'));
      }
    } catch (err) {
      console.error('Error deleting restaurant:', err);
      toasts.error(t('error') + ': ' + (err instanceof Error ? err.message : 'Failed to delete restaurant'));
    } finally {
      deletingRestaurant = null;
    }
  }
</script>

<div class="w-full max-w-screen-xl mx-auto mt-8 px-4">
  <div class="bg-black/30 backdrop-blur-md rounded-lg border border-white/10 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-white">Your Restaurants</h2>
      <Button
        variant="outline"
        class="bg-white/5 text-white hover:bg-white/10 hover:text-white"
        on:click={handleAddRestaurant}
      >
        Add Restaurant
      </Button>
    </div>
    
    {#if loading}
      <p class="text-white/70">Loading restaurants...</p>
    {:else if error}
      <p class="text-red-400">{error}</p>
    {:else if restaurants.length === 0}
      <p class="text-white/70">No restaurants found</p>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each restaurants as restaurant (restaurant.id)}
          <div class="relative group">
            <Button
              variant="ghost"
              class="w-full justify-start text-white hover:text-white hover:bg-white/10 h-auto py-4"
              on:click={() => handleRestaurantSelect(restaurant)}
              disabled={switchingRestaurant === restaurant.id || deletingRestaurant === restaurant.id}
            >
              <div class="flex items-center gap-3">
                {#if restaurant.logo}
                  <img 
                    src={restaurant.logo} 
                    alt={restaurant.name} 
                    class="w-10 h-10 rounded-full object-cover"
                  />
                {:else}
                  <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <span class="text-lg font-medium text-white">
                      {restaurant.name[0].toUpperCase()}
                    </span>
                  </div>
                {/if}
                <span class="truncate font-medium flex-1">
                  {restaurant.name}
                  {#if switchingRestaurant === restaurant.id}
                    <span class="ml-2 text-sm opacity-70">Loading...</span>
                  {/if}
                </span>
                <!-- Edit and Delete buttons -->
                <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    class="p-1.5 text-white/70 hover:text-blue-400 transition-colors"
                    on:click={(e) => handleEditRestaurant(restaurant, e)}
                    disabled={editingRestaurant === restaurant.id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    class="p-1.5 text-white/70 hover:text-red-400 transition-colors"
                    on:click={(e) => handleDeleteRestaurant(restaurant, e)}
                    disabled={deletingRestaurant === restaurant.id}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </Button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div> 