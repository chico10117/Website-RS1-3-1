<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { restaurantStore } from '$lib/stores/restaurant-store';
  import { toasts } from '$lib/stores/toast';
  import { browser } from '$app/environment';
  
  export let variant: 'primary' | 'secondary' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let className: string = '';

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];
  
  // Subscribe to store state
  $: isSaving = $restaurantStore.isSaving;
  $: lastSaveTime = $restaurantStore.lastSaveTime;
  $: hasUnsavedChanges = $restaurantStore.hasUnsavedChanges;

  // Format last save time
  $: formattedSaveTime = lastSaveTime ? formatTime(lastSaveTime) : null;

  // Format time for display
  function formatTime(date: Date): string {
    return new Intl.DateTimeFormat(currentLanguage, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).format(date);
  }
  
  // Determine button classes based on props
  $: buttonClasses = [
    'font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    variant === 'primary' 
      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
    size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base',
    className
  ].join(' ');
        
  // Save restaurant data
  async function saveRestaurant() {
    if (isSaving || !hasUnsavedChanges) return;
    
    try {
      await restaurantStore.saveChanges();
      toasts.success(t('saveSuccess'));
    } catch (error) {
      console.error('Error saving restaurant data:', error);
      toasts.error(t('saveError'));
    }
  }
  
  // Handle keyboard shortcut
  function handleKeydown(event: KeyboardEvent) {
    // Save on Ctrl+S or Cmd+S
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      saveRestaurant();
    }
  }
  
  onMount(() => {
    if (browser) {
      document.addEventListener('keydown', handleKeydown);
    }
  });
  
  onDestroy(() => {
    if (browser) {
      document.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

<div class="save-button">
  <button
    type="button"
    class={buttonClasses}
    disabled={isSaving || !hasUnsavedChanges}
    on:click={saveRestaurant}
  >
    {#if isSaving}
      <span class="flex items-center space-x-2">
        <svg class="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
        <span>{t('saving')}</span>
      </span>
    {:else}
      {t('save')}
    {/if}
  </button>
  
  {#if formattedSaveTime}
    <div class="mt-1 text-xs text-gray-500">
      {t('lastSaved')}: {formattedSaveTime}
    </div>
  {/if}
</div>

<style>
  .save-button {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style> 