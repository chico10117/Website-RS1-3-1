<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Restaurant } from '$lib/types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';

  export let restaurantName: string;
  export let menuLogo: string;
  export let selectedRestaurant: string | null;
  export let restaurants: Restaurant[];

  const dispatch = createEventDispatcher<{
    update: { name: string; logo: string };
    select: string;
  }>();

  let isEditingRestaurant = false;
  let editingRestaurantName = '';
  let isCreatingRestaurant = false;
  let isUploading = false;

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  async function handleRestaurantNameInput() {
    if (restaurantName && !selectedRestaurant && !isCreatingRestaurant) {
      isCreatingRestaurant = true;
      try {
        // Create a temporary ID for the new restaurant
        const tempId = crypto.randomUUID();
        
        // Update cache instead of saving
        menuCache.updateRestaurant({
          id: tempId,
          name: restaurantName.trim(),
          logo: menuLogo || ''
        });

        // Dispatch both update and select events
        dispatch('update', { name: restaurantName.trim(), logo: menuLogo || '' });
        dispatch('select', tempId);
      } catch (error) {
        console.error('Error updating restaurant:', error);
        if (error instanceof Error) {
          alert(t('error') + ': ' + error.message);
        }
      } finally {
        isCreatingRestaurant = false;
      }
    }
  }

  async function updateRestaurantName() {
    if (!selectedRestaurant || !editingRestaurantName.trim()) {
      return;
    }

    try {
      // Update cache instead of saving
      menuCache.updateRestaurant({
        id: selectedRestaurant,
        name: editingRestaurantName.trim(),
        logo: menuLogo
      });
      
      dispatch('update', { 
        name: editingRestaurantName.trim(), 
        logo: menuLogo 
      });
      
      isEditingRestaurant = false;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      if (error instanceof Error) {
        alert(t('error') + ': ' + error.message);
      }
    }
  }

  async function handleLogoUpload(event: Event) {
    try {
      isUploading = true;
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Update cache with new logo
      menuCache.updateRestaurant({
        id: selectedRestaurant,
        name: restaurantName,
        logo: uploadResult.url
      });

      dispatch('update', {
        name: restaurantName,
        logo: uploadResult.url
      });

      isUploading = false;
    } catch (error) {
      console.error('Error uploading logo:', error);
      if (error instanceof Error) {
        alert(t('error') + ': ' + error.message);
      }
      isUploading = false;
    }
  }

  function handleLogoClick() {
    if (!restaurantName) {
      alert(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
      return;
    }
    const logoInput = document.getElementById('logo-input');
    if (logoInput) {
      logoInput.click();
    }
  }

  function startEditingRestaurant() {
    isEditingRestaurant = true;
    editingRestaurantName = restaurantName;
  }

  function cancelEditingRestaurant() {
    isEditingRestaurant = false;
    editingRestaurantName = '';
  }

  async function handleRestaurantEditKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await updateRestaurantName();
    } else if (event.key === 'Escape') {
      cancelEditingRestaurant();
    }
  }
</script>

<div class="mb-6">
  <label class="block text-lg font-semibold mb-3 text-gray-800">{t('restaurantName')}</label>
  <div class="flex items-center space-x-2">
    {#if isEditingRestaurant}
      <div class="flex-1 flex items-center space-x-2">
        <input
          type="text"
          class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 font-normal"
          bind:value={editingRestaurantName}
          on:keydown={handleRestaurantEditKeyPress}
          autofocus
        />
        <button 
          class="p-2 text-green-500 hover:text-green-600"
          on:click={updateRestaurantName}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
        <button 
          class="p-2 text-gray-500 hover:text-gray-600"
          on:click={cancelEditingRestaurant}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-between">
        <input
          type="text"
          class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 font-normal"
          placeholder={t('enterRestaurantName')}
          bind:value={restaurantName}
          on:blur={handleRestaurantNameInput}
          readonly={!!selectedRestaurant}
          disabled={!!selectedRestaurant}
        />
        {#if selectedRestaurant}
          <button 
            class="p-2 text-gray-500 hover:text-blue-500 ml-2"
            on:click={startEditingRestaurant}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
          </button>
        {/if}
      </div>
    {/if}
  </div>
</div>

<div class="mb-8">
  <label class="block text-lg font-semibold mb-3 text-gray-800">{t('menuLogo')}</label>
  <div class="flex items-center gap-4">
    <div class="relative group">
      <button 
        class="w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 
          {!restaurantName 
            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
            : menuLogo 
              ? 'border-transparent shadow-md hover:shadow-lg' 
              : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300'}"
        on:click={handleLogoClick}
      >
        {#if menuLogo}
          <img 
            src={menuLogo} 
            alt="Menu logo" 
            class="w-full h-full object-cover rounded-xl"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-200" />
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-sm text-blue-600 mt-2 font-medium">{t('addLogo')}</span>
        {/if}
      </button>
      <input
        id="logo-input"
        type="file"
        accept="image/*"
        class="hidden"
        on:change={handleLogoUpload}
      />
    </div>
  </div>
</div> 