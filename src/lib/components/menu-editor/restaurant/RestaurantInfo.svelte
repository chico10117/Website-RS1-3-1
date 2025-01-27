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

  interface UpdateEvent {
    id?: string;
    name: string;
    logo: string | null;
  }

  const dispatch = createEventDispatcher<{
    update: UpdateEvent;
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
      const slug = restaurantName.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
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
        logo: menuLogo
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
        logo: menuLogo // Keep existing logo
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
          id: $currentRestaurant.id, // Use the ID from currentRestaurant store
          name: $currentRestaurant.name,
          logo: uploadResult.url || null
        });
      } else {
        // For new restaurant
        const slug = restaurantName.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
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
          slug,
          userId,
          createdAt: now,
          updatedAt: now
        });

        // Dispatch update event for new restaurant
        dispatch('update', {
          id: newId,
          name: restaurantName,
          logo: uploadResult.url || null
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
        {#if selectedRestaurant}
          <!-- For existing restaurant: show name and edit button -->
          <div class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg font-normal">
            {restaurantName}
          </div>
          <button 
            class="p-2 text-gray-500 hover:text-blue-500 ml-2"
            on:click={startEditingRestaurant}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
          </button>
        {:else}
          <!-- For new restaurant: show editable input -->
          <input
            type="text"
            class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 font-normal"
            placeholder={t('enterRestaurantName')}
            bind:value={restaurantName}
            on:blur={handleRestaurantNameInput}
            on:keydown={handleRestaurantNameKeyPress}
          />
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
        class="w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 {!restaurantName ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' : menuLogo ? 'border-transparent shadow-md hover:shadow-lg' : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300'}"
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