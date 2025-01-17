<script lang="ts">
  import { onMount } from 'svelte';
  import type { Category } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';
  import { menuState } from '$lib/stores/menu-state';
  import * as menuService from '$lib/services/menu.service';
  import LanguageSwitch from '$lib/components/LanguageSwitch.svelte';
  import RestaurantInfo from './restaurant/RestaurantInfo.svelte';
  import CategoryList from './categories/CategoryList.svelte';
  import MenuPreview from './preview/MenuPreview.svelte';
  import { toasts } from '$lib/stores/toast';
  import Toast from '$lib/components/ui/Toast.svelte';

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Debug cache changes
  $: console.log('Cache state:', $menuCache);
  $: console.log('Has unsaved changes:', $menuCache.hasUnsavedChanges);

  onMount(async () => {
    try {
      await menuState.loadRestaurants();
    } catch (error) {
      console.error('Error loading restaurants:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  });

  // Event handlers
  async function handleRestaurantUpdate(event: CustomEvent<{ name: string; logo: string }>) {
    const { name, logo } = event.detail;
    menuState.updateRestaurantInfo(name, logo);
    menuCache.updateRestaurant({ 
      id: $menuState.selectedRestaurant || crypto.randomUUID(),
      name,
      logo,
      slug: name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '')
    });
  }

  function handleCategoriesUpdate(event: CustomEvent<Category[]>) {
    menuState.updateCategories(event.detail);
  }

  async function handleRestaurantSelect(event: CustomEvent<string>) {
    try {
      await menuState.selectRestaurant(event.detail);
      // Clear cache when selecting a new restaurant
      menuCache.clearCache();
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
      
      const result = await menuService.saveMenuChanges(
        $menuCache,
        {
          name: $menuState.restaurantName,
          logo: $menuState.menuLogo
        },
        $menuState.selectedRestaurant
      );
      
      // Update the state with saved data
      menuState.updateAfterSave(result);
      menuCache.clearCache();
      
      // Reload the current restaurant data to ensure frontend is in sync with database
      if ($menuState.selectedRestaurant) {
        await menuState.selectRestaurant($menuState.selectedRestaurant);
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
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 font-sans relative">
  <Toast />
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold text-gray-800 tracking-tight">{t('appTitle')}</h1>
      <LanguageSwitch />
    </div>
    
    <div class="flex gap-8">
      <!-- Left Section - Menu Editor -->
      <div class="flex-1 p-8 rounded-xl bg-white/30 backdrop-blur-md border border-white/50 shadow-lg">
        <RestaurantInfo
          restaurantName={$menuState.restaurantName}
          menuLogo={$menuState.menuLogo}
          selectedRestaurant={$menuState.selectedRestaurant}
          restaurants={$menuState.restaurants}
          on:update={handleRestaurantUpdate}
          on:select={handleRestaurantSelect}
        />

        <CategoryList
          categories={$menuState.categories}
          selectedRestaurant={$menuState.selectedRestaurant}
          on:update={handleCategoriesUpdate}
        />
      </div>

      <!-- Vertical Divider -->
      <div class="w-px bg-white/30"></div>

      <!-- Right Section - Preview -->
      <div class="flex-1 p-8">
        <MenuPreview
          restaurantName={$menuState.restaurantName}
          menuLogo={$menuState.menuLogo}
          categories={$menuState.categories}
        />
      </div>
    </div>

    <!-- Save Menu Button (Fixed to bottom right) -->
    {#if $menuCache.hasUnsavedChanges}
      <div class="fixed bottom-8 right-8 z-50">
        <button
          class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-lg"
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