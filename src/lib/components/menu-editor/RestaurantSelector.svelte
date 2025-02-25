<script lang="ts">
  import { onMount } from 'svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import type { Restaurant } from '$lib/types/menu.types';
  import { Button } from '$lib/components/ui/button';
  import { menuStore } from '$lib/stores/menu-store';
  import * as restaurantService from '$lib/services/restaurant.service';
  import { toasts } from '$lib/stores/toast';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';

  let restaurants: Restaurant[] = [];
  let loading = true;
  let error: string | null = null;
  let switchingRestaurant: string | null = null;
  let editingRestaurant: string | null = null;
  let deletingRestaurant: string | null = null;
  let showDeleteConfirm = false;
  let restaurantToDelete: Restaurant | null = null;

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Add subscription to menuStore to detect saves
  $: if ($menuStore.lastSaveTime) {
    // Refresh the restaurants list after successful save
    refreshRestaurants();
  }

  // Add this helper function to sort restaurants by creation date
  function sortRestaurantsByDate(restaurants: Restaurant[]) {
    return [...restaurants].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
  }

  onMount(async () => {
    try {
      loading = true;
      // Clear all state on page load
      menuStore.reset();
      currentRestaurant.set(null);
      
      // Load and sort restaurants
      const loadedRestaurants = await currentRestaurant.loadRestaurants();
      restaurants = sortRestaurantsByDate(loadedRestaurants);
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
      menuStore.reset();
      
      // Load the restaurant data
      await currentRestaurant.loadRestaurant(restaurant.id);
      
      // If this is a new restaurant that hasn't been saved yet, update the local array
      if (!restaurants.find(r => r.id === restaurant.id)) {
        restaurants = [...restaurants, restaurant];
      }
      
      // Update URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.set('restaurant', restaurant.id);
      window.history.replaceState({}, '', url.toString());
      
      console.log('Selecting restaurant in menuStore:', restaurant.id, restaurant.name);
      
      // Load the restaurant data using the store
      await menuStore.selectRestaurant(restaurant.id);
      
      console.log('Restaurant selected successfully:', {
        restaurantId: restaurant.id,
        menuStoreSelectedRestaurant: menuStore.subscribe(state => state.selectedRestaurant)
      });
      
    } catch (err) {
      console.error('Error switching restaurant:', err);
      error = err instanceof Error ? err.message : 'Failed to switch restaurant';
    } finally {
      switchingRestaurant = null;
    }
  }

  async function handleAddRestaurant() {
    // Clear current restaurant and URL parameter
    menuStore.reset();
    currentRestaurant.set(null);
    
    // Remove restaurant parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('restaurant');
    window.history.replaceState({}, '', url.toString());
  }

  async function handleEditRestaurant(restaurant: Restaurant, event: Event) {
    event.stopPropagation(); // Prevent restaurant selection
    editingRestaurant = restaurant.id;
    // Load the restaurant for editing
    await handleRestaurantSelect(restaurant);
  }

  async function handleDeleteRestaurant(restaurant: Restaurant, event: Event) {
    event.stopPropagation(); // Prevent restaurant selection
    restaurantToDelete = restaurant;
    showDeleteConfirm = true;
  }

  async function confirmDelete() {
    if (!restaurantToDelete) return;
    
    try {
      deletingRestaurant = restaurantToDelete.id;
      await restaurantService.deleteRestaurant(restaurantToDelete.id);
      
      // Refresh restaurants list
      restaurants = await currentRestaurant.loadRestaurants();
      
      // Clear state if the deleted restaurant was selected
      if ($currentRestaurant?.id === restaurantToDelete.id) {
        menuStore.reset();
        currentRestaurant.set(null);
      }
      
      toasts.success(t('restaurantDeleteSuccess'));
    } catch (err) {
      console.error('Error deleting restaurant:', err);
      toasts.error(t('error') + ': ' + (err instanceof Error ? err.message : 'Failed to delete restaurant'));
    } finally {
      deletingRestaurant = null;
      restaurantToDelete = null;
      showDeleteConfirm = false;
    }
  }

  function cancelDelete() {
    restaurantToDelete = null;
    showDeleteConfirm = false;
  }

  async function refreshRestaurants() {
    try {
      // Load fresh data and sort
      const loadedRestaurants = await currentRestaurant.loadRestaurants();
      restaurants = sortRestaurantsByDate(loadedRestaurants);
    } catch (err) {
      console.error('Error refreshing restaurants:', err);
      error = err instanceof Error ? err.message : 'Failed to refresh restaurants';
    }
  }
</script>

<div class="w-full max-w-[1200px] mx-auto">
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-gray-500 text-sm">{t('selectRestaurantManage')}</p>
      </div>
      <Button
        variant="outline"
        class="bg-white/90 text-gray-900 hover:bg-blue-500 hover:text-white border-gray-200 hover:border-blue-500 transition-all duration-200 rounded-full px-4 py-1.5 text-xs"
        on:click={handleAddRestaurant}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        {t('addRestaurant')}
      </Button>
    </div>
    
    {#if loading}
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
        <span class="ml-3 text-gray-500">{t('loading')}</span>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
        <p class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {error}
        </p>
      </div>
    {:else if restaurants.length === 0}
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <p class="text-gray-700 text-lg font-medium">{t('noRestaurantsFound')}</p>
        <p class="text-gray-500 text-sm mt-1">{t('addFirstRestaurant')}</p>
      </div>
    {:else}
      <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {#each restaurants as restaurant (restaurant.id)}
          <button
            class="group relative flex flex-col items-center justify-center p-4 rounded-xl border
                   {$currentRestaurant?.id === restaurant.id ? 
                     'bg-blue-500/90 text-white border-blue-400 shadow-sm' : 
                     'bg-white/80 text-gray-900 border-gray-100 hover:border-blue-200 hover:bg-white/90'}
                   transition-all duration-200"
            on:click={() => handleRestaurantSelect(restaurant)}
            disabled={switchingRestaurant === restaurant.id || deletingRestaurant === restaurant.id}
          >
            {#if restaurant.logo}
              <img 
                src={restaurant.logo} 
                alt={restaurant.name} 
                class="w-12 h-12 rounded-lg object-cover mb-2"
              />
            {:else}
              <div class="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
            {/if}
            
            <span class="text-sm font-medium truncate max-w-full px-1">
              {restaurant.name}
            </span>
            
            {#if switchingRestaurant === restaurant.id}
              <span class="text-xs text-gray-500 mt-1">{t('loading')}</span>
            {/if}

            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1">
              <button
                class="p-1 rounded-full hover:bg-black/5 transition-colors"
                on:click={(e) => handleEditRestaurant(restaurant, e)}
                disabled={editingRestaurant === restaurant.id}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                class="p-1 rounded-full hover:bg-red-50 transition-colors"
                on:click={(e) => handleDeleteRestaurant(restaurant, e)}
                disabled={deletingRestaurant === restaurant.id}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>

<ConfirmDialog
  message={t('confirmDeleteRestaurant')}
  show={showDeleteConfirm}
  on:confirm={confirmDelete}
  on:cancel={cancelDelete}
/> 