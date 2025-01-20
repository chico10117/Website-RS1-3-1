<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Restaurant } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';
  import { user } from '$lib/stores/user';

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

  // Make user store reactive
  $: userName = $user.name;

  async function handleRestaurantNameInput() {
    if (restaurantName && !selectedRestaurant && !isCreatingRestaurant) {
      isCreatingRestaurant = true;
      try {
        // Create a temporary ID for the new restaurant
        const tempId = crypto.randomUUID();
        const slug = restaurantName.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '');
        
        // Update cache instead of saving
        menuCache.updateRestaurant({
          id: tempId,
          name: restaurantName.trim(),
          logo: menuLogo || '',
          slug
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
      const slug = editingRestaurantName.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '');
      
      // Update cache instead of saving
      menuCache.updateRestaurant({
        id: selectedRestaurant,
        name: editingRestaurantName.trim(),
        logo: menuLogo,
        slug
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
    if (!selectedRestaurant && !restaurantName) {
      alert(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
      return;
    }

    try {
      isUploading = true;
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (!file) {
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(t('error') + ': ' + t('invalidFileType'));
        return;
      }

      // Validate file size (max 4MB)
      const maxSize = 4 * 1024 * 1024; // 4MB in bytes
      if (file.size > maxSize) {
        alert(t('error') + ': ' + t('fileTooLarge'));
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      let uploadResult;
      try {
        uploadResult = await uploadResponse.json();
      } catch (parseError) {
        console.error('Error parsing upload response:', parseError);
        throw new Error(t('invalidServerResponse'));
      }
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || t('fileUploadError'));
      }

      // Update cache with new logo
      if (selectedRestaurant) {
        const slug = restaurantName.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '');
        menuCache.updateRestaurant({
          id: selectedRestaurant,
          name: restaurantName,
          logo: uploadResult.url,
          slug
        });
      }

      dispatch('update', {
        name: restaurantName,
        logo: uploadResult.url
      });

    } catch (error) {
      console.error('Error uploading logo:', error);
      if (error instanceof Error) {
        alert(t('error') + ': ' + error.message);
      } else {
        alert(t('error') + ': ' + t('fileUploadError'));
      }
    } finally {
      isUploading = false;
      // Reset the file input
      const input = event.target as HTMLInputElement;
      input.value = '';
    }
  }

  function handleLogoClick() {
    if (!selectedRestaurant && !restaurantName) {
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

<div class="mb-8">
  <label class="block text-lg font-semibold mb-3 text-gray-800">{t('restaurantName')}</label>
  <input
    type="text"
    bind:value={restaurantName}
    placeholder={t('enterRestaurantName')}
    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
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