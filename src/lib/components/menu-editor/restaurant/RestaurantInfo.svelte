<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Restaurant } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';
  import { toasts } from '$lib/stores/toast';
  import { user } from '$lib/stores/user';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { generateSlug } from '$lib/utils/slug';

  export let restaurantName = '';
  export let menuLogo: string | null = null;
  export let selectedRestaurant: string | null = null;
  export let restaurants: Restaurant[] = [];
  export let customPrompt: string | null = null;
  export let currency: string = '€';
  export let color: number = 1;

  interface UpdateEvent {
    id?: string;
    name: string;
    logo: string | null;
    customPrompt: string | null;
    currency: string;
    color: number;
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

  const colorOptions = [
    { value: 1, label: 'Light' },
    { value: 2, label: 'Dark' },
    { value: 3, label: 'Blue' },
    { value: 4, label: 'Green' },
    { value: 5, label: 'Red' },
  ];

  const currencyOptions = [
    { value: '€', label: '€' },
    { value: '$', label: '$' },
    { value: '£', label: '£' }
  ];

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
          customPrompt: $currentRestaurant.customPrompt,
          currency,
          color
        });
      } else {
        // For new restaurant, generate slug first
        const slug = await generateSlug(restaurantName);
        const now = new Date();
        const newId = crypto.randomUUID();
        
        const newRestaurant = {
          id: newId,
          name: restaurantName,
          logo: uploadResult.url || null,
          customPrompt: customPrompt,
          slug,
          userId,
          createdAt: now,
          updatedAt: now,
          currency,
          color
        };

        console.log('Creating new restaurant:', newRestaurant);

        // Create new restaurant in cache
        menuCache.updateRestaurant(newRestaurant);

        // Dispatch update event
        dispatch('update', {
          id: newId,
          name: restaurantName,
          logo: uploadResult.url || null,
          customPrompt: customPrompt,
          currency,
          color
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
      if (!restaurantName || selectedRestaurant || isCreatingRestaurant) {
        return;
      }

      isCreatingRestaurant = true;

      const userId = $user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Generate slug first
      const slug = await generateSlug(restaurantName);
      const newId = crypto.randomUUID();
      const now = new Date();
      
      const newRestaurant = {
        id: newId,
        name: restaurantName,
        logo: menuLogo,
        customPrompt: customPrompt,
        slug,
        userId,
        createdAt: now,
        updatedAt: now,
        currency,
        color
      };

      // Update cache with new restaurant
      console.log('Creating new restaurant:', newRestaurant);
      menuCache.updateRestaurant(newRestaurant);
      
      // Dispatch update event
      dispatch('update', {
        id: newId,
        name: restaurantName,
        logo: menuLogo,
        customPrompt: customPrompt,
        currency,
        color
      });

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
        customPrompt: customPrompt, // Keep existing custom prompt
        currency,
        color
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

  async function handleCustomPromptInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    // Limit to 5000 characters yeah
    if (textarea.value.length > 5000) {
      textarea.value = textarea.value.slice(0, 5000);
    }
    customPrompt = textarea.value || null;

    // Only update if we have a restaurant
    if (selectedRestaurant || restaurantName) {
      const userId = $user?.id;
      if (!userId) {
        toasts.error(t('error') + ': ' + 'User not authenticated');
        return;
      }

      try {
        const currentRestaurantData = $currentRestaurant;
        let restaurantData;

        if (currentRestaurantData) {
          restaurantData = {
            ...currentRestaurantData,
            customPrompt: customPrompt,
            updatedAt: new Date()
          };
        } else {
          // For new restaurant, generate slug
          const slug = await generateSlug(restaurantName);
          restaurantData = {
            id: crypto.randomUUID(),
            name: restaurantName.trim(),
            logo: menuLogo,
            customPrompt: customPrompt,
            slug,
            userId,
            createdAt: new Date(),
            updatedAt: new Date()
          };
        }

        // Update cache with new custom prompt
        menuCache.updateRestaurant(restaurantData);

        // Dispatch update event
        dispatch('update', {
          id: selectedRestaurant || undefined,
          name: restaurantName,
          logo: menuLogo,
          customPrompt: customPrompt,
          currency,
          color
        });
      } catch (error) {
        console.error('Error updating custom prompt:', error);
        if (error instanceof Error) {
          toasts.error(t('error') + ': ' + error.message);
        }
      }
    }
  }

  async function handleLogoDelete(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    try {
      // Get the current user ID
      const userId = $user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // For existing restaurant, use the ID from the currentRestaurant store
      if ($currentRestaurant) {
        // Update cache with null logo
        menuCache.updateRestaurant({
          ...$currentRestaurant,
          logo: null,
          updatedAt: new Date()
        });

        // Dispatch update event with the correct ID
        dispatch('update', {
          id: $currentRestaurant.id,
          name: $currentRestaurant.name,
          logo: null,
          customPrompt: $currentRestaurant.customPrompt,
          currency,
          color
        });
      } else if (restaurantName) {
        // For new restaurant
        const now = new Date();
        const newId = crypto.randomUUID();
        const slug = await generateSlug(restaurantName);
        
        // Create new restaurant in cache
        menuCache.updateRestaurant({
          id: newId,
          name: restaurantName,
          logo: null,
          customPrompt: customPrompt,
          slug,
          userId,
          createdAt: now,
          updatedAt: now,
          currency,
          color
        });

        // Dispatch update event
        dispatch('update', {
          id: newId,
          name: restaurantName,
          logo: null,
          customPrompt: customPrompt,
          currency,
          color
        });
      }

      // Update local state
      menuLogo = null;
    } catch (error) {
      console.error('Error deleting logo:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  function handleColorChange(value: number) {
    color = value;
    if ($currentRestaurant) {
      menuCache.updateRestaurant({
        ...$currentRestaurant,
        color: value,
        updatedAt: new Date()
      });
    }
    dispatch('update', {
      id: selectedRestaurant || undefined,
      name: restaurantName,
      logo: menuLogo,
      customPrompt: customPrompt,
      currency,
      color: value
    });
  }

  function handleCurrencyChange(value: string) {
    currency = value;
    if ($currentRestaurant) {
      menuCache.updateRestaurant({
        ...$currentRestaurant,
        currency: value,
        updatedAt: new Date()
      });
      // Update the current restaurant store immediately
      currentRestaurant.set({
        ...$currentRestaurant,
        currency: value
      });
    }
    dispatch('update', {
      id: selectedRestaurant || undefined,
      name: restaurantName,
      logo: menuLogo,
      customPrompt: customPrompt,
      currency: value,
      color
    });
  }
</script>

<div class="space-y-4">
  <!-- Restaurant Name Input -->
  <div class="flex items-center gap-2">
    {#if isEditingRestaurant}
      <div class="flex items-center gap-2 w-full">
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
      <div class="flex items-center gap-2 w-full">
        <input
          type="text"
          bind:value={restaurantName}
          on:input={handleRestaurantNameInput}
          placeholder={t('enterRestaurantName')}
          class="flex-1"
          readonly={!!selectedRestaurant}
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
  </div>

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
              <div class="relative w-full h-full">
                <img 
                  src={ensureString(menuLogo)} 
                  alt="Menu logo" 
                  class="w-full h-full object-cover rounded-xl"
                />
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-200" />
                <!-- Delete button overlay -->
                <button
                  type="button"
                  class="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  on:click|stopPropagation={handleLogoDelete}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
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
        {displayCustomPrompt.length}/5000
      </div>
    </div>
  </div>

  <!-- Color Selection -->
  <div class="space-y-4 mt-6 mb-12">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        {t('themeColor')}
      </label>
      <div class="flex gap-4 flex-wrap">
        {#each colorOptions as option}
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="color"
              value={option.value}
              checked={color === option.value}
              on:change={() => handleColorChange(option.value)}
              class="form-radio text-blue-600"
            />
            <span class="text-sm text-gray-700">{option.label}</span>
          </label>
        {/each}
      </div>
    </div>

    <!-- Currency Selection -->
    <div class="space-y-2 mb-12">
      <label class="block text-sm font-medium text-gray-700">
        {t('currency')}
      </label>
      <div class="flex gap-4">
        {#each currencyOptions as option}
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="currency"
              value={option.value}
              checked={currency === option.value}
              on:change={() => handleCurrencyChange(option.value)}
              class="form-radio text-blue-600"
            />
            <span class="text-sm text-gray-700">{option.label}</span>
          </label>
        {/each}
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

  :global(.form-radio) {
    @apply h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500;
  }
</style> 