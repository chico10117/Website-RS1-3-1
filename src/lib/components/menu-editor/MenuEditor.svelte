<script lang="ts">
  import { menuState } from '$lib/stores/menu-state';
  import { menuCache } from '$lib/stores/menu-cache';
  import { language } from '$lib/stores/language';
  import { translations } from '$lib/i18n/translations';
  import * as menuService from '$lib/services/menu.service';
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
  import * as categoryService from '$lib/services/category.service';
  import * as dishService from '$lib/services/dish.service';
  import { user } from '$lib/stores/user';
  import { writable } from 'svelte/store';
  import { generateSlug } from '$lib/utils/slug';

  const isRestaurantSelectorMinimized = writable(false);

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Debug cache changes
  $: console.log('Cache state:', $menuCache);
  $: console.log('Has unsaved changes:', $menuCache.hasUnsavedChanges);

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
      menuCache.clearCache();
      menuState.reset();
      menuState.updateRestaurantInfo('', null, null);
      menuState.updateCategories([]);
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
        // Update restaurant info in menu state
        menuState.updateRestaurantInfo(restaurant.name, restaurant.logo, restaurant.customPrompt);
        
        // Update cache with restaurant data including customPrompt
        menuCache.updateRestaurant({
          ...restaurant,
          updatedAt: new Date()
        });
        
        // Load categories and dishes
        const categories = await categoryService.fetchCategories(restaurant.id);
        const categoriesWithDishes = await Promise.all(
          categories.map(async category => {
            const dishes = await dishService.fetchDishes(restaurant.id, category.id);
            return { ...category, dishes };
          })
        );
        
        // Update menu state with loaded data
        menuState.updateCategories(categoriesWithDishes);
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
      
      // Clear all state and cache on page load - same as Add Restaurant button
      menuCache.clearCache();
      menuState.reset();
      menuState.updateRestaurantInfo('', null, null);
      menuState.updateCategories([]);
      currentRestaurant.set(null);
      
      // Remove any URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('restaurant');
      window.history.replaceState({}, '', url.toString());
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load restaurant';
    } finally {
      loading = false;
    }
  });

  // Event handlers
  async function handleRestaurantUpdate(event: CustomEvent<{ id?: string; name: string; logo: string | null; customPrompt: string | null; currency: string; color: number }>) {
    console.log('handleRestaurantUpdate called with event:', event.detail);
    
    const { id, name, logo, customPrompt, currency, color } = event.detail;
    
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

    // Update menu state
    menuState.updateRestaurantInfo(name, logo, customPrompt);

    // Generate slug
    const slug = await generateSlug(name);

    // Update cache with complete restaurant data
    const restaurantData = { 
      id: id || crypto.randomUUID(), // Use existing ID if available, otherwise generate new
      name,
      logo,
      customPrompt,
      slug,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      currency,
      color
    };
    console.log('Updating restaurant cache with:', restaurantData);
    menuCache.updateRestaurant(restaurantData);

    // If this is a new restaurant, update the current restaurant store
    if (!id) {
      currentRestaurant.set(restaurantData);
    }
  }

  function handleCategoriesUpdate(event: CustomEvent<Category[]>) {
    menuState.updateCategories(event.detail);
  }

  async function handleRestaurantSelect(event: CustomEvent<string>) {
    try {
      // Clear cache when selecting a new restaurant
      menuCache.clearCache();
      
      // Load the restaurant data
      const restaurantId = event.detail;
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
      menuState.setSaving(true);
      console.log('Starting save operation...');
      
      // For new restaurants, we should not pass a currentRestaurantId
      const result = await menuService.saveMenuChanges(
        $menuCache,
        {
          name: $menuState.restaurantName,
          logo: $menuState.menuLogo,
          // Include slug from cache if available
          ...(($menuCache.restaurant?.slug) && { slug: $menuCache.restaurant.slug }),
          // Include customPrompt from cache
          customPrompt: $menuCache.restaurant?.customPrompt,
          currency: $menuCache.restaurant?.currency || '€',
          // Use the current color from cache or currentRestaurant, fallback to 1 only if both are undefined
          color: $menuCache.restaurant?.color ?? $currentRestaurant?.color ?? 1
        },
        // Only pass currentRestaurantId if we're updating an existing restaurant
        $menuState.selectedRestaurant
      );
      
      // Update the state with saved data
      menuState.updateAfterSave(result);
      menuCache.clearCache();
      
      // Reload the current restaurant data to ensure frontend is in sync with database
      if (result.restaurant.id) {
        await menuState.selectRestaurant(result.restaurant.id);
        await refreshRestaurants();
      }
      
      toasts.success(t('saveSuccess'));
    } catch (error) {
      console.error('Error saving changes:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    } finally {
      menuState.setSaving(false);
    }
  }

  // Add this function to refresh restaurants
  async function refreshRestaurants() {
    try {
      const restaurants = await currentRestaurant.loadRestaurants();
      menuState.updateRestaurants(restaurants);
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
      <Toast />
      <div class="space-y-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <img src="/recologo.svg" alt="Reco Logo" class="h-8 w-auto" />
            <h1 class="text-3xl font-bold text-gray-900 tracking-tight">{t('appTitle')}</h1>
          </div>
        </div>

        <!-- Restaurant Selector with glass effect -->
        <div class="glass-hover rounded-xl p-4">
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-2xl font-bold text-gray-900">{t('yourRestaurants')}</h2>
            <button
              class="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
              on:click={() => $isRestaurantSelectorMinimized = !$isRestaurantSelectorMinimized}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transform transition-transform {$isRestaurantSelectorMinimized ? 'rotate-180' : ''}"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          {#if !$isRestaurantSelectorMinimized}
            <RestaurantSelector />
          {/if}
        </div>
        
        <div class="flex gap-8">
          <!-- Left Section - Menu Editor -->
          <div class="flex-1 p-8 rounded-3xl bg-white/70 backdrop-blur-lg border border-white/50 shadow-xl">
            <div class="space-y-8">
              <RestaurantInfo
                restaurantName={$menuState.restaurantName}
                menuLogo={$menuState.menuLogo}
                selectedRestaurant={$menuState.selectedRestaurant}
                restaurants={$menuState.restaurants}
                customPrompt={$currentRestaurant?.customPrompt ?? null}
                currency={$currentRestaurant?.currency || '€'}
                color={$currentRestaurant?.color || 1}
                on:update={handleRestaurantUpdate}
                on:select={handleRestaurantSelect}
              />

              <CategoryList
                categories={$menuState.categories}
                selectedRestaurant={$menuState.selectedRestaurant}
                restaurantName={$menuState.restaurantName}
                on:update={handleCategoriesUpdate}
              />
            </div>
          </div>

          <!-- Vertical Divider -->
          <div class="w-px bg-white/50 backdrop-blur-sm"></div>

          <!-- Right Section - Preview -->
          <div class="flex-1 p-8 bg-white/70 backdrop-blur-lg rounded-3xl border border-white/50 shadow-xl">
            <MenuPreview
              restaurantName={$menuState.restaurantName}
              menuLogo={$menuState.menuLogo}
              categories={$menuState.categories}
              currency={$currentRestaurant?.currency || '€'}
            />
          </div>
        </div>

        <!-- Save Menu Button (Fixed to viewport) -->
        {#if $menuCache.hasUnsavedChanges}
          <div class="sticky bottom-8 left-0 right-0 flex justify-end px-8 z-50 pointer-events-none">
            <button
              class="px-6 py-3 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-xl pointer-events-auto"
              on:click={saveAllChanges}
              disabled={$menuState.isSaving}
            >
              {#if $menuState.isSaving}
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              {/if}
              {t('saveMenu')}
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

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