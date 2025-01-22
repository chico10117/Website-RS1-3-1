<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Restaurant } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';
  import { toasts } from '$lib/stores/toast';
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
        const slug = restaurantName.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
        
        // Update cache instead of saving
        menuCache.updateRestaurant({
          id: tempId,
          name: restaurantName.trim(),
          logo: menuLogo || '',
          slug
        });

        // Only dispatch the update event, don't select the restaurant yet
        dispatch('update', { name: restaurantName.trim(), logo: menuLogo || '' });
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
        id: selectedRestaurant || '',
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
      toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
      return;
    }

    try {
      isUploading = true;
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        const errorDiv = document.getElementById('logo-error');
        const errorText = errorDiv?.querySelector('span');
        if (errorDiv && errorText) {
          errorText.textContent = t('invalidFileType') + ' (JPEG, PNG, WebP)';
          errorDiv.classList.remove('hidden');
          setTimeout(() => {
            errorDiv.classList.add('hidden');
          }, 3000);
        }
        return;
      }

      // Validate file size (max 4MB)
      const maxSize = 4 * 1024 * 1024; // 4MB in bytes
      if (file.size > maxSize) {
        const errorDiv = document.getElementById('logo-error');
        const errorText = errorDiv?.querySelector('span');
        if (errorDiv && errorText) {
          errorText.textContent = t('fileTooLarge') + ' (max 4MB)';
          errorDiv.classList.remove('hidden');
          setTimeout(() => {
            errorDiv.classList.add('hidden');
          }, 3000);
        }
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
      const errorDiv = document.getElementById('logo-error');
      const errorText = errorDiv?.querySelector('span');
      if (errorDiv && errorText) {
        errorText.textContent = error instanceof Error ? error.message : t('fileUploadError');
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
          errorDiv.classList.add('hidden');
        }, 3000);
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

  async function handleRestaurantSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    try {
      dispatch('select', select.value);
    } catch (error) {
      console.error('Error selecting restaurant:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  async function saveRestaurantChanges() {
    if (!editingRestaurantName.trim()) {
      toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
      return;
    }

    try {
      const slug = editingRestaurantName.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '');
      
      if (!selectedRestaurant) {
        toasts.error(t('error') + ': ' + t('noRestaurantSelected'));
        return;
      }

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
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  async function handleRestaurantNameKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await handleRestaurantNameInput();
      (event.target as HTMLInputElement)?.blur();
    }
  }
</script>

<div class="mb-8">
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
          on:keydown={handleRestaurantNameKeyPress}
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
  <div class="flex items-start gap-4">
    <div class="relative group">
      <form 
        class="w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 
          {!restaurantName 
            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
            : menuLogo 
              ? 'border-transparent shadow-md hover:shadow-lg' 
              : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300'}"
        on:submit|preventDefault={() => {
          if (!restaurantName) {
            const errorMessage = document.getElementById('logo-error');
            if (errorMessage) {
              errorMessage.textContent = t('pleaseEnterRestaurantNameFirst');
              errorMessage.classList.remove('hidden');
              setTimeout(() => {
                errorMessage.classList.add('hidden');
              }, 3000);
            }
            return;
          }
          const logoInput = document.getElementById('logo-input');
          if (logoInput) {
            logoInput.click();
          }
        }}
      >
        <button type="submit" class="w-full h-full flex flex-col items-center justify-center">
          {#if menuLogo}
            <img 
              src={menuLogo} 
              alt="Menu logo" 
              class="w-full h-full object-cover rounded-xl"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-200" />
          {:else}
            <div class="flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-sm text-blue-600 mt-2 font-medium">{t('addLogo')}</span>
            </div>
          {/if}
        </button>
        <input
          id="logo-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          on:change={handleLogoUpload}
        />
      </form>
    </div>
    <div id="logo-error" class="hidden text-sm text-white bg-red-500 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out min-w-[200px] whitespace-nowrap">
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span class="flex-1"></span>
      </div>
    </div>
  </div>
</div> 