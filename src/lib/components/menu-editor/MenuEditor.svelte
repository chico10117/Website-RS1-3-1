<script lang="ts">
  import { menuStore } from '$lib/stores/menu-store';
  import { language } from '$lib/stores/language';
  import { translations } from '$lib/i18n/translations';
  import { onMount } from 'svelte';
  import RestaurantInfo from './restaurant/RestaurantInfo.svelte';
  import MenuPreview from './preview/MenuPreview.svelte';
  import { toasts } from '$lib/stores/toast';
  import Toast from '$lib/components/ui/Toast.svelte';
  import CategoryList from './categories/CategoryList.svelte';
  import type { Category, Restaurant } from '$lib/types/menu.types';
  import { page } from '$app/stores';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import RestaurantSelector from './RestaurantSelector.svelte';
  import { user } from '$lib/stores/user';
  import { writable, derived, get } from 'svelte/store';
  import { generateSlug } from '$lib/utils/slug';
  import { goto } from '$app/navigation';

  const isRestaurantSelectorMinimized = writable(false);

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Create derived stores for UI state
  const hasUnsavedChanges = derived(menuStore, $state => {
    return $state.changedItems.restaurant || 
           $state.changedItems.categories.size > 0 || 
           $state.changedItems.dishes.size > 0 ||
           $state.changedItems.deletedCategories.size > 0 ||
           $state.changedItems.deletedDishes.size > 0;
  });
  
  const isSaving = derived(menuStore, $state => $state.isSaving);

  // Debug store changes
  $: console.log('Has unsaved changes:', $hasUnsavedChanges);

  let loading = true;
  let error: string | null = null;

  // Load restaurant data when currentRestaurant changes
  $: if ($currentRestaurant && $page.url.searchParams.get('restaurant')) {
    const restaurantId = $page.url.searchParams.get('restaurant');
    // Only load data if there's a restaurant ID in the URL and it matches
    if (restaurantId === $currentRestaurant.id) {
      loadRestaurantData($currentRestaurant);
    } else {
      // Clear state if no match
      menuStore.reset();
      currentRestaurant.set(null);
      
      // Remove URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('restaurant');
      window.history.replaceState({}, '', url.toString());
    }
  }

  async function loadRestaurantData(restaurant: Restaurant) {
    try {
      loading = true;
      console.log('Loading restaurant data:', restaurant);
      
      const restaurantId = $page.url.searchParams.get('restaurant');
      // Only load if there's a matching restaurant ID in the URL
      if (restaurantId === restaurant.id) {
        // Update restaurant info in menu store
        menuStore.updateRestaurantInfo(restaurant.name, restaurant.logo, restaurant.customPrompt);
        
        // Load the restaurant data using the store
        await menuStore.selectRestaurant(restaurant.id);
      }
    } catch (err) {
      console.error('Error loading restaurant data:', err);
      error = err instanceof Error ? err.message : 'Failed to load menu data';
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    try {
      loading = true;
      
      // Check if user is authenticated
      if (!$user || !$user.id) {
        console.log('User not authenticated, redirecting to login');
        error = 'User not authenticated. Please log in.';
        // Redirect to login page
        goto('/login?redirect=' + encodeURIComponent($page.url.pathname));
        return;
      }
      
      // Clear all state on page load
      menuStore.reset();
      currentRestaurant.set(null);
      
      // Remove any URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('restaurant');
      window.history.replaceState({}, '', url.toString());
      
      // Load restaurants
      await refreshRestaurants();
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load restaurant';
    } finally {
      loading = false;
    }
  });

  // Event handlers
  async function handleRestaurantUpdate(event: CustomEvent<{ id?: string; name: string; logo: string | null; customPrompt: string | null; currency: string; color: number }>) {
    console.log('handleRestaurantUpdate called with event:', event.detail);
    
    const { id, name, logo, customPrompt } = event.detail;
    
    if (!name.trim()) {
      console.error('No restaurant name provided');
      toasts.error(t('error') + ': Missing restaurant name');
      return;
    }

    // Get the current user ID
    const userId = $user?.id;
    if (!userId) {
      console.error('Authentication error: No user ID available');
      toasts.error(t('error') + ': ' + 'User not authenticated');
      return;
    }

    if (id) {
      // Update existing restaurant
      menuStore.updateRestaurantInfo(name, logo, customPrompt);
    } else {
      // Create new restaurant
      menuStore.createRestaurant(name, logo, customPrompt);
      
      // Update the current restaurant store
      const newRestaurant = $menuStore.restaurants.find(r => r.name === name);
      if (newRestaurant) {
        currentRestaurant.set(newRestaurant);
      }
    }
  }

  function handleCategoriesUpdate(event: CustomEvent<Category[]>) {
    // This will be handled differently with the new store
    // Each category will be updated individually through the store methods
    console.log('Categories updated:', event.detail);
  }

  async function handleRestaurantSelect(event: CustomEvent<string>) {
    try {
      // Load the restaurant data
      const restaurantId = event.detail;
      await menuStore.selectRestaurant(restaurantId);
      await currentRestaurant.loadRestaurant(restaurantId);
    } catch (error) {
      console.error('Error selecting restaurant:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  async function saveAllChanges() {
    try {
      console.log('Starting save operation...');
      
      const result = await menuStore.saveChanges();
      
      // Reload the current restaurant data to ensure frontend is in sync with database
      if (result && result.restaurant.id) {
        await menuStore.selectRestaurant(result.restaurant.id);
        await refreshRestaurants();
      }
      
      toasts.success(t('saveSuccess'));
    } catch (error) {
      console.error('Error saving changes:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  // Add this function to refresh restaurants
  async function refreshRestaurants() {
    try {
      // Check if user is authenticated
      if (!$user || !$user.id) {
        console.error('User not authenticated, cannot refresh restaurants');
        error = 'User not authenticated. Please log in.';
        return;
      }
      
      const restaurants = await currentRestaurant.loadRestaurants();
      if (restaurants) {
        // Update the restaurants in the store
        await menuStore.loadRestaurants();
        console.log(`Loaded ${restaurants.length} restaurants`);
      } else {
        console.log('No restaurants found or error loading restaurants');
      }
    } catch (error) {
      console.error('Error refreshing restaurants:', error);
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  {#if loading}
    <div class="text-center text-gray-600">
      Loading restaurants...
    </div>
  {:else if error}
    <div class="text-center text-red-500">
      {error}
    </div>
  {:else}
    <div class="glass rounded-3xl p-8">
      <!-- Restaurant selector -->
      <div class="mb-8">
        <RestaurantSelector 
          on:select={handleRestaurantSelect}
          minimized={$isRestaurantSelectorMinimized}
          on:toggleMinimized={() => isRestaurantSelectorMinimized.set(false)}
        />
      </div>

      <!-- Main content -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left column: Restaurant info and categories -->
        <div>
          <RestaurantInfo 
            restaurantName={$menuStore.restaurantName}
            menuLogo={$menuStore.menuLogo}
            customPrompt={$menuStore.customPrompt}
            selectedRestaurant={$menuStore.selectedRestaurant}
            restaurants={$menuStore.restaurants}
            currency="€"
            color={1}
            on:update={handleRestaurantUpdate}
          />
          
          <div class="mt-8">
            <CategoryList 
              categories={$menuStore.categories}
              selectedRestaurant={$menuStore.selectedRestaurant}
              restaurantName={$menuStore.restaurantName}
              on:update={handleCategoriesUpdate}
            />
          </div>
        </div>
        
        <!-- Right column: Menu preview -->
        <div>
          <MenuPreview 
            restaurantName={$menuStore.restaurantName}
            menuLogo={$menuStore.menuLogo}
            categories={$menuStore.categories}
            currency="€"
          />
        </div>
      </div>
      
      <!-- Save button -->
      <div class="mt-8 flex justify-end">
        <button 
          class="btn btn-primary" 
          disabled={!$hasUnsavedChanges || $isSaving}
          on:click={saveAllChanges}
        >
          {#if $isSaving}
            {t('saving')}...
          {:else}
            {t('save')}
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div>

<!-- Toast notifications -->
<Toast />

<style>
  :global(input[type="text"]) {
    @apply border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out bg-white/80 backdrop-blur-sm;
  }
  
  :global(input[type="text"]::placeholder) {
    @apply text-gray-400;
  }

  span {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style> 