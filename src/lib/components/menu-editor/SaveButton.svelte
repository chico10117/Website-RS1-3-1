<script lang="ts">
  import { menuStore } from '$lib/stores/menu-store';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { toasts } from '$lib/stores/toast';
  import * as menuService from '$lib/services/menu.service';
  import { currentRestaurant } from '$lib/stores/restaurant';

  // Make translations reactive with fallbacks to prevent errors
  $: currentLanguage = $language || 'en';
  $: t = (key: string): string => {
    if (!translations || !translations[key] || !translations[key][currentLanguage]) {
      return key; // Return the key itself as fallback
    }
    return translations[key][currentLanguage];
  };

  // Reactive variables for UI state
  $: hasUnsavedChanges = $menuStore.changedItems.restaurant || 
                         $menuStore.changedItems.categories.size > 0 || 
                         $menuStore.changedItems.dishes.size > 0 ||
                         $menuStore.changedItems.deletedCategories.size > 0 ||
                         $menuStore.changedItems.deletedDishes.size > 0;
  
  $: isSaving = $menuStore.isSaving;
  $: lastSaveTime = $menuStore.lastSaveTime;
  $: selectedRestaurant = $menuStore.selectedRestaurant;

  // For debugging
  $: console.log('Save button state:', {
    selectedRestaurant,
    restaurantChanged: $menuStore.changedItems.restaurant,
    categoriesChanged: $menuStore.changedItems.categories.size,
    dishesChanged: $menuStore.changedItems.dishes.size,
    deletedCategories: $menuStore.changedItems.deletedCategories.size,
    deletedDishes: $menuStore.changedItems.deletedDishes.size,
    hasUnsavedChanges,
    currentLanguage
  });

  // Format the last save time
  function formatLastSaveTime(date: Date | null): string {
    if (!date) return '';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If less than a minute ago
    if (diff < 60000) {
      return t('justNow') || 'Just now';
    }
    
    // If less than an hour ago
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${minutes === 1 ? (t('minuteAgo') || 'minute ago') : (t('minutesAgo') || 'minutes ago')}`;
    }
    
    // Otherwise format as time
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  async function saveChanges() {
    if (!selectedRestaurant) {
      toasts.error(t('noRestaurantSelected') || 'No restaurant selected');
      return;
    }
    
    if (!hasUnsavedChanges) {
      toasts.info(t('noChangesToSave') || 'No changes to save');
      return;
    }
    
    try {
      // Use the menuStore's saveChanges method directly
      await menuStore.saveChanges();
      
      // Show success message
      toasts.success(t('changesSaved') || 'Changes saved');
      
    } catch (error) {
      console.error('Error saving changes:', error);
      if (error instanceof Error) {
        toasts.error((t('error') || 'Error') + ': ' + error.message);
      } else {
        toasts.error((t('error') || 'Error') + ': ' + (t('unknownError') || 'Unknown error'));
      }
    }
  }
</script>

<div class="flex items-center gap-4">
  <button
    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
    on:click={saveChanges}
    disabled={!selectedRestaurant || (!hasUnsavedChanges && !$menuStore.changedItems.restaurant) || isSaving}
  >
    {#if isSaving}
      <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {t('saving') || 'Saving...'}
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      {t('save') || 'Save'}
    {/if}
  </button>
  
  {#if lastSaveTime}
    <span class="text-sm text-gray-500">
      {(t('lastSaved') || 'Last saved')}: {formatLastSaveTime(lastSaveTime)}
    </span>
  {/if}
</div>

<style>
  button {
    min-width: 100px;
  }
</style> 