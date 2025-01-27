<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Restaurant } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';
  import { toasts } from '$lib/stores/toast';
  import { user } from '$lib/stores/user';
  import { currentRestaurant } from '$lib/stores/restaurant';

  export let restaurantName = '';
  export let menuLogo: string | null = null;
  export let selectedRestaurant: string | null = null;
  export let restaurants: Restaurant[] = [];
  export let customPrompt: string | null = null;

  interface UpdateEvent {
    id?: string;
    name: string;
    logo: string | null;
    customPrompt: string | null;
  }

  const dispatch = createEventDispatcher<{
    update: UpdateEvent;
    select: string;
  }>();

  let isEditingRestaurant = false;
  let editingRestaurantName = '';
  let isCreatingRestaurant = false;
  let isUploading = false;
  let isDragging = false;

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Make user store reactive
  $: userName = $user?.name;

  // Helper function to ensure string for UI
  function ensureString(value: string | null | undefined): string {
    return value || '';
  }

  // Helper function to ensure string or null for database
  function ensureStringOrNull(value: string | null | undefined): string | null {
    return value || null;
  }

  // Computed value for logo display
  $: displayLogo = ensureString(menuLogo);
  $: displayCustomPrompt = ensureString(customPrompt);

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedRestaurant && !restaurantName) return;
    isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedRestaurant && !restaurantName) return;
    isDragging = true;
  }

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;
    
    if (!selectedRestaurant && !restaurantName) {
      toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
      return;
    }

    const file = e.dataTransfer?.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toasts.error(t('error') + ': ' + t('invalidFileType'));
      return;
    }

    await handleFileUpload(file);
  }

  async function handleFileUpload(file: File) {
    try {
      isUploading = true;
      
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload logo');
      }

      const uploadResult = await uploadResponse.json();
      console.log('Logo uploaded:', uploadResult);

      // Get the current user ID
      const userId = $user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // For existing restaurant, use the ID from the currentRestaurant store
      if ($currentRestaurant) {
        console.log('Updating existing restaurant:', {
          id: $currentRestaurant.id,
          name: $currentRestaurant.name,
          logo: uploadResult.url
        });

        // Update cache with new logo
        menuCache.updateRestaurant({
          ...$currentRestaurant,
          logo: uploadResult.url || null,
          updatedAt: new Date()
        });

        // Dispatch update event with the correct ID
        dispatch('update', {
          id: $currentRestaurant.id,
          name: $currentRestaurant.name,
          logo: uploadResult.url || null,
          customPrompt: $currentRestaurant.customPrompt
        });
      } else {
        // For new restaurant
        const slug = restaurantName.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '');
        const now = new Date();
        const newId = crypto.randomUUID();
        
        console.log('Creating new restaurant:', {
          id: newId,
          name: restaurantName,
          logo: uploadResult.url
        });

        // Create new restaurant in cache
        menuCache.updateRestaurant({
          id: newId,
          name: restaurantName,
          logo: uploadResult.url || null,
          customPrompt: customPrompt,
          slug,
          userId,
          createdAt: now,
          updatedAt: now
        });

        // Dispatch update event
        dispatch('update', {
          id: newId,
          name: restaurantName,
          logo: uploadResult.url || null,
          customPrompt: customPrompt
        });
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    } finally {
      isUploading = false;
    }
  }

  async function handleLogoUpload(event: Event) {
    if (!selectedRestaurant && !restaurantName) {
      toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    await handleFileUpload(file);
  }

  async function handleRestaurantNameInput() {
    try {
      // Skip if restaurant name is empty or if we already have a restaurant selected/being created
      if (!restaurantName.trim() || selectedRestaurant || isCreatingRestaurant) {
        return;
      }

      isCreatingRestaurant = true;

      // Get the current user ID
      const userId = $user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Create a new restaurant ID
      const newId = crypto.randomUUID();
      const slug = restaurantName.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '');
      const now = new Date();
      
      console.log('Creating new restaurant with:', {
        newId,
        restaurantName: restaurantName.trim(),
        slug,
        userId
      });

      // Create the new restaurant object
      const newRestaurant = {
        id: newId,
        name: restaurantName.trim(),
        logo: menuLogo,
        customPrompt: customPrompt,
        slug,
        userId,
        createdAt: now,
        updatedAt: now
      };

      // Update the cache first
      console.log('Updating cache with new restaurant:', newRestaurant);
      menuCache.updateRestaurant(newRestaurant);
      
      // Dispatch update event with the new ID
      const updateEvent = { 
        id: newId,
        name: restaurantName.trim(), 
        logo: menuLogo,
        customPrompt: customPrompt
      };
      console.log('Dispatching update event:', updateEvent);
      dispatch('update', updateEvent);

      // Clear the input if we're not in edit mode
      if (!selectedRestaurant) {
        restaurantName = '';
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    } finally {
      isCreatingRestaurant = false;
    }
  }

  function startEditingRestaurant() {
    editingRestaurantName = restaurantName;
    isEditingRestaurant = true;
  }

  function cancelEditingRestaurant() {
    editingRestaurantName = restaurantName;
    isEditingRestaurant = false;
  }

  function handleRestaurantEditKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      updateRestaurantName();
    } else if (event.key === 'Escape') {
      cancelEditingRestaurant();
    }
  }

  async function updateRestaurantName() {
    if (!editingRestaurantName.trim()) {
      toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
      return;
    }

    try {
      if (!selectedRestaurant) {
        toasts.error(t('error') + ': ' + t('noRestaurantSelected'));
        return;
      }

      // Only update the name in the cache
      menuCache.updateRestaurant({
        ...$currentRestaurant!, // Keep all existing restaurant data
        name: editingRestaurantName.trim(), // Only update the name
        updatedAt: new Date() // Update the modification date
      });

      // Update local state
      restaurantName = editingRestaurantName.trim();
      
      // Dispatch update event with only the necessary fields
      dispatch('update', {
        id: selectedRestaurant,
        name: editingRestaurantName.trim(),
        logo: menuLogo, // Keep existing logo
        customPrompt: customPrompt // Keep existing custom prompt
      });

      // Exit edit mode
      isEditingRestaurant = false;
    } catch (error) {
      console.error('Error updating restaurant name:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
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

  async function handleRestaurantNameKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await handleRestaurantNameInput();
      (event.target as HTMLInputElement)?.blur();
    }
  }

  function handleCustomPromptInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    // Limit to 500 characters
    if (textarea.value.length > 500) {
      textarea.value = textarea.value.slice(0, 500);
    }
    customPrompt = textarea.value || null;

    // Only update if we have a restaurant
    if (selectedRestaurant || restaurantName) {
      const userId = $user?.id;
      if (!userId) {
        toasts.error(t('error') + ': ' + 'User not authenticated');
        return;
      }

      const currentRestaurantData = $currentRestaurant || {
        id: crypto.randomUUID(),
        name: restaurantName.trim(),
        logo: menuLogo,
        slug: restaurantName.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-'),
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Update cache with new custom prompt
      menuCache.updateRestaurant({
        ...currentRestaurantData,
        customPrompt: customPrompt,
        updatedAt: new Date()
      });

      // Dispatch update event
      dispatch('update', {
        id: selectedRestaurant || undefined,
        name: restaurantName,
        logo: menuLogo,
        customPrompt: customPrompt
      });
    }
  }
</script>

<div class="space-y-4">
  <!-- Restaurant Name Input -->
  {#if isEditingRestaurant}
    <div class="flex items-center gap-2">
      <input
        type="text"
        bind:value={editingRestaurantName}
        on:keydown={handleRestaurantEditKeyPress}
        placeholder={t('enterRestaurantName')}
        class="flex-1"
      />
      <button
        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        on:click={updateRestaurantName}
      >
        {t('save')}
      </button>
      <button
        class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        on:click={cancelEditingRestaurant}
      >
        {t('cancel')}
      </button>
    </div>
  {:else}
    <div class="flex items-center gap-2">
      <input
        type="text"
        bind:value={restaurantName}
        on:input={handleRestaurantNameInput}
        placeholder={t('enterRestaurantName')}
        class="flex-1"
      />
      {#if selectedRestaurant}
        <button
          class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          on:click={startEditingRestaurant}
        >
          {t('edit')}
        </button>
      {/if}
    </div>
  {/if}

  <!-- Logo Upload -->
  <div class="mb-8">
    <label class="block text-lg font-semibold mb-3 text-gray-800">{t('menuLogo')}</label>
    <div class="flex items-start gap-4">
      <div class="relative group">
        <form 
          class="w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 {!restaurantName ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' : isDragging ? 'border-blue-400 bg-blue-50' : menuLogo ? 'border-transparent shadow-md hover:shadow-lg' : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300'}"
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
          on:dragenter={handleDragEnter}
          on:dragleave={handleDragLeave}
          on:dragover={handleDragOver}
          on:drop={handleDrop}
        >
          <button type="submit" class="w-full h-full flex flex-col items-center justify-center">
            {#if menuLogo}
              <img 
                src={ensureString(menuLogo)} 
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
                {#if isDragging}
                  <span class="text-xs text-blue-500 mt-1">{t('dropToUpload')}</span>
                {:else}
                  <span class="text-xs text-gray-500 mt-1">{t('dragAndDrop')}</span>
                {/if}
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

  <!-- Custom Prompt -->
  <div class="space-y-2">
    <label for="customPrompt" class="block text-sm font-medium text-gray-700">
      {t('customPromptLabel')}
    </label>
    <div class="relative">
      <textarea
        id="customPrompt"
        value={displayCustomPrompt}
        on:input={handleCustomPromptInput}
        placeholder={t('customPromptPlaceholder')}
        class="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out bg-white/80 backdrop-blur-sm resize-none"
      ></textarea>
      <div class="absolute bottom-2 right-2 text-sm text-gray-500">
        {displayCustomPrompt.length}/500
      </div>
    </div>
  </div>
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