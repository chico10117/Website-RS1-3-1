<script lang="ts">
  import { menuStore } from '$lib/stores';
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
  import SaveButton from './SaveButton.svelte';
  import { type UpdateEvent } from '$lib/utils/RestaurantInfo.helpers';

  const isRestaurantSelectorMinimized = writable(false);

  // Make translations reactive - ensure default values to prevent undefined errors
  $: currentLanguage = $language || 'en';
  $: t = (key: string): string => {
    if (!translations || !translations[key] || !translations[key][currentLanguage]) {
      return key; // Return the key itself as fallback
    }
    return translations[key][currentLanguage];
  };

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
      
      // Check for restaurant ID in URL
      const restaurantId = $page.url.searchParams.get('restaurant');
      if (restaurantId) {
        try {
          // Load the restaurant data using the store
          await menuStore.selectRestaurant(restaurantId);
          await currentRestaurant.loadRestaurant(restaurantId);
        } catch (err) {
          console.error('Error loading restaurant data:', err);
          error = err instanceof Error ? err.message : 'Failed to load menu data';
          
          // Remove URL parameter if loading fails
          const url = new URL(window.location.href);
          url.searchParams.delete('restaurant');
          window.history.replaceState({}, '', url.toString());
        }
      } else {
        // Remove any URL parameters
        const url = new URL(window.location.href);
        url.searchParams.delete('restaurant');
        window.history.replaceState({}, '', url.toString());
      }
      
      // Load restaurants
      await refreshRestaurants();
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load restaurant';
    } finally {
      loading = false;
    }
  });

  // Event handlers
  async function handleRestaurantUpdate(event: CustomEvent<{ 
    id?: string; 
    name: string; 
    logo: string | null; 
    customPrompt: string | null; 
    phoneNumber: string | null;
    currency: string; 
    color: string | number;
    reservas: string | null;
    redes_sociales: string | null;
  }>) {
    const { 
      id, 
      name, 
      logo, 
      customPrompt, 
      phoneNumber, 
      currency, 
      color,
      reservas,
      redes_sociales
    } = event.detail;
    
    console.log('Extracted color from event:', color, 'type:', typeof color);
    
    // Validate required fields
    if (!name || typeof name !== 'string') {
      console.error('Invalid or missing restaurant name');
      toasts.error(t('error') + ': Missing restaurant name');
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      console.error('Restaurant name cannot be empty');
      toasts.error(t('error') + ': Restaurant name cannot be empty');
      return;
    }

    // Get the current user ID
    const userId = $user?.id;
    if (!userId) {
      console.error('Authentication error: No user ID available');
      toasts.error(t('error') + ': ' + 'User not authenticated');
      return;
    }

    // Ensure color is a string
    const colorValue = String(color);
    console.log('Converted color to string:', colorValue);

    if (id) {
      // Update existing restaurant
      console.log('Updating restaurant with all values:', { name, logo, customPrompt, slug: $currentRestaurant?.slug, phoneNumber, colorValue, reservas, redes_sociales });
      
      // Convert phoneNumber to number if it's a string
      const numericPhoneNumber = phoneNumber ? Number(phoneNumber) : null;
      
      // Use the parameters correctly - explicitly pass color as the last parameter
      menuStore.updateRestaurantInfo(
        name, 
        logo, 
        customPrompt, 
        $currentRestaurant?.slug || null, 
        numericPhoneNumber,
        reservas,
        redes_sociales,
        colorValue  // Explicitly pass color here
      );
      
      // Force an explicit update to the URL values to ensure they're set correctly
      if (reservas !== undefined || redes_sociales !== undefined) {
        console.log('Explicitly updating URL values:', { reservas, redes_sociales });
        menuStore.updateReservasAndSocials(reservas, redes_sociales);
      }
    } else {
      // Create new restaurant
      console.log('Creating restaurant with all values:', { name, logo, customPrompt, phoneNumber, colorValue, reservas, redes_sociales });
      
      // Create the restaurant
      menuStore.createRestaurant(
        name, 
        logo, 
        customPrompt, 
        phoneNumber, 
        reservas,
        redes_sociales
      );
      
      // Force an explicit update to the URL values to ensure they're set correctly
      if (reservas !== undefined || redes_sociales !== undefined) {
        console.log('Explicitly updating URL values:', { reservas, redes_sociales });
        menuStore.updateReservasAndSocials(reservas, redes_sociales);
      }
      
      // Update the current restaurant store
      const newRestaurant = $menuStore.restaurants.find(r => r.name === name);
      if (newRestaurant) {
        currentRestaurant.set({
          ...newRestaurant,
          color: colorValue
        });
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

<div class="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
  {#if loading}
    <div class="text-center text-gray-600">
      Loading restaurants...
    </div>
  {:else if error}
    <div class="text-center text-red-500">
      {error}
    </div>
  {:else}
    <div class="glass rounded-3xl p-3 sm:p-8">
      <!-- Title and save button -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-3">
          <img src="/recologo.svg" alt="Reco Logo" class="h-6 sm:h-8 w-auto" />
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{t('appTitle')}</h1>
        </div>
      </div>
      <!-- Restaurant selector -->
      <div class="mb-4 sm:mb-8">
        <RestaurantSelector 
          on:select={handleRestaurantSelect}
          on:toggleMinimized={() => isRestaurantSelectorMinimized.set(false)}
        />
      </div>

      <!-- Main content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <!-- Left column: Restaurant info and categories -->
        <div>
          <div class="bg-white/30 backdrop-blur-md rounded-xl border border-white/50 shadow-lg p-4 sm:p-6">
            <RestaurantInfo 
              restaurantName={$menuStore.restaurantName}
              menuLogo={$menuStore.menuLogo}
              customPrompt={$menuStore.customPrompt}
              selectedRestaurant={$menuStore.selectedRestaurant}
              restaurants={$menuStore.restaurants}
              currency={$currentRestaurant?.currency || '€'}
              color={$currentRestaurant?.color || '#85A3FA'}
              phoneNumber={$currentRestaurant?.phoneNumber || null}
              reservas={$currentRestaurant?.reservas || null}
              redes_sociales={$currentRestaurant?.redes_sociales || null}
              on:update={handleRestaurantUpdate}
            />
          
            <div class="mt-4 sm:mt-8">
              <CategoryList 
                categories={$menuStore.categories}
                selectedRestaurant={$menuStore.selectedRestaurant}
                restaurantName={$menuStore.restaurantName}
                currency={$currentRestaurant?.currency || '€'}
                on:update={handleCategoriesUpdate}
              />
            </div>
          </div>
        </div>
        
        <!-- Right column: Menu preview -->
        <div>
          <MenuPreview 
            restaurantName={$menuStore.restaurantName}
            menuLogo={$menuStore.menuLogo}
            categories={$menuStore.categories}
            currency={$currentRestaurant?.currency || '€'}
          />
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Sticky save button that moves with scroll -->
<div class="sticky bottom-4 sm:bottom-8 float-right mr-2 sm:mr-8 z-50">
  <SaveButton />
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