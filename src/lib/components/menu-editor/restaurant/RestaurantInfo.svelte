<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Restaurant } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores/menu-store';
  import { toasts } from '$lib/stores/toast';
  import { user } from '$lib/stores/user';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { generateSlug } from '$lib/utils/slug';
  import { get } from 'svelte/store';
  import type { Category } from '$lib/types/menu.types';
  import MenuUploader from './MenuUploader.svelte';

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
    phoneNumber?: string;
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

  $: colorOptions = [
    { value: 1, label: t('colorLight') },
    { value: 2, label: t('colorGreen') },
    { value: 3, label: t('colorPink') },
    { value: 4, label: t('colorDark') }
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
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
        body: formData,
        credentials: 'include'
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

        // Update store with new logo
        menuStore.updateRestaurantInfo(
          $currentRestaurant.name,
          uploadResult.url || null,
          $currentRestaurant.customPrompt
        );

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
        // For new restaurant, create it in the store
        if (!restaurantName) {
          throw new Error('Restaurant name is required');
        }
        
        // Create new restaurant in store
        menuStore.createRestaurant(
          restaurantName,
          uploadResult.url || null,
          customPrompt
        );

        // Get the newly created restaurant ID from the store
        const storeState = $menuStore;
        const newId = storeState.selectedRestaurant;

        if (!newId) {
          throw new Error('Failed to create restaurant');
        }

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

      // Create restaurant in the new store
      menuStore.createRestaurant(
        restaurantName,
        menuLogo,
        customPrompt
      );

      // Get the newly created restaurant ID from the store
      const storeState = $menuStore;
      const newId = storeState.selectedRestaurant;

      if (!newId) {
        throw new Error('Failed to create restaurant');
      }

      // Update the currentRestaurant store for compatibility
      if ($currentRestaurant === null) {
        const newRestaurant = storeState.restaurants.find(r => r.id === newId);
        if (newRestaurant) {
          currentRestaurant.set(newRestaurant);
        }
      }
      
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

      // Update restaurant name in the store
      menuStore.updateRestaurantInfo(
        editingRestaurantName.trim(),
        menuLogo,
        customPrompt
      );

      // Update local state
      restaurantName = editingRestaurantName.trim();
      
      // Dispatch update event with only the necessary fields
      dispatch('update', {
        id: selectedRestaurant,
        name: editingRestaurantName.trim(),
        logo: menuLogo,
        customPrompt: customPrompt,
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
    // Limit to 5000 characters
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
        // Update restaurant info in the store
        menuStore.updateRestaurantInfo(
          restaurantName,
          menuLogo,
          customPrompt
        );

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

      // Update restaurant info in the store with null logo
      menuStore.updateRestaurantInfo(
        restaurantName,
        null,
        customPrompt
      );

      // Dispatch update event
      dispatch('update', {
        id: selectedRestaurant || undefined,
        name: restaurantName,
        logo: null,
        customPrompt: customPrompt,
        currency,
        color
      });

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
    
    // Update restaurant info in the store
    if (restaurantName) {
      menuStore.updateRestaurantInfo(
        restaurantName,
        menuLogo,
        customPrompt
      );
      
      // Update the current restaurant store for compatibility
      if ($currentRestaurant) {
        currentRestaurant.set({
          ...$currentRestaurant,
          color: value
        });
      }
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
    
    // Update restaurant info in the store
    if (restaurantName) {
      menuStore.updateRestaurantInfo(
        restaurantName,
        menuLogo,
        customPrompt
      );
      
      // Update the current restaurant store for compatibility
      if ($currentRestaurant) {
        currentRestaurant.set({
          ...$currentRestaurant,
          currency: value
        });
      }
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
  <!-- Check if restaurant is not selected -->
    {#if !selectedRestaurant}
  <!-- Menu Uploader -->
    <div class="space-y-2 mb-12">
    <label class="block text-lg font-semibold mb-3 text-gray-800">
      {t('uploadMenu')}
    </label>
    <MenuUploader
            {restaurantName}
            {customPrompt}
            restaurantId={$currentRestaurant?.id || null}
            on:success={async (event) => {
        try {

          let restaurantData = event.detail.restaurantData;
          // Update the current restaurant with the new data
          if ($currentRestaurant) {
            const updatedRestaurant = {
              ...$currentRestaurant,
              ...restaurantData.restaurant, // Use all the data from the seed response
              updatedAt: new Date()
            };
            // Update the store with the complete restaurant data
            menuStore.updateRestaurantInfo(
              updatedRestaurant.name,
              updatedRestaurant.logo,
              updatedRestaurant.customPrompt
            );
            // Update the current restaurant store
            currentRestaurant.set(updatedRestaurant);
          }

          // Dispatch update event with the updated data
          dispatch('update', {
            id: restaurantData.restaurant.id, // Use the ID from the seed response
            name: restaurantData.restaurant.name,
            logo: restaurantData.restaurant.logo,
            customPrompt: restaurantData.restaurant.customPrompt,
            currency: restaurantData.restaurant.currency,
            phoneNumber: restaurantData.restaurant.phoneNumber,
            color
          });
          
          if(restaurantData.categories && restaurantData.categories.length > 0) {
            // Process each category from the uploaded data
            const categoryIdMap = new Map(); // Map to store original category IDs to new ones
            
            for (const category of restaurantData.categories) {
              // Add the category to the menuStore and get the new ID
              menuStore.addCategory(category.name);
              
              // Get the latest state to find the newly created category
              const storeState = get(menuStore);
              const newCategory = storeState.categories.find(c => 
                c.name === category.name && c.id.startsWith('temp_')
              );
              
              if (newCategory) {
                // Store the mapping from original ID to new ID
                categoryIdMap.set(category.id, newCategory.id);
                
                // If the category has dishes, add them too
                if (category.dishes && category.dishes.length > 0) {
                  for (const dish of category.dishes) {
                    // Add each dish with the correct parameter structure and the new category ID
                    menuStore.addDish(newCategory.id, {
                      title: dish.title,
                      description: dish.description || '',
                      price: dish.price?.toString() || '0',
                      imageUrl: dish.imageUrl || null
                    });
                  }
                }
              }
            }
          }

        } catch (error) {
          console.error('Error handling menu upload success:', error);
          if (error instanceof Error) {
            toasts.error(t('error') + ': ' + error.message);
          }
        }
      }}
            on:error={(event) => {
        toasts.error(t('error') + ': ' + event.detail);
      }}
    />
  </div>
    {/if}
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
          on:blur={handleRestaurantNameInput}
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
          {#if isCreatingRestaurant}
            <div class="flex items-center gap-1 px-3 py-1 text-sm text-gray-600">
              <svg class="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('generatingPreview')}
            </div>
          {:else if $currentRestaurant?.slug}
            <a
              href={`https://${$currentRestaurant.slug}.reco.restaurant`}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              {$currentRestaurant.slug}.reco.restaurant
            </a>
          {/if}
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
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
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