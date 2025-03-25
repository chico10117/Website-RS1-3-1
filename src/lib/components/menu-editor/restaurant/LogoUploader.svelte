<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { toasts } from '$lib/stores/toast';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { get } from 'svelte/store';
  import { 
    handleDrag,
    handleDrop,
    handleFileUpload,
    handleLogoDelete,
    ensureString,
    type UpdateEvent
  } from '$lib/utils/RestaurantInfo.helpers';

  export let restaurantName = '';
  export let menuLogo: string | null = null;
  export let selectedRestaurant: string | null = null;
  export let customPrompt: string | null = null;
  export let phoneNumber: string | null = null;
  export let color: string = '#85A3FA';
  export let currency: string = '€';
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;

  let isUploading = false;
  let isDragging = false;
  let uploadError: string | null = null;

  // Properly typed event dispatcher
  const dispatch = createEventDispatcher<{
    update: UpdateEvent;
  }>();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => {
    // Default to 'es' if language or translation is not available
    if (!translations[key] || !currentLanguage || !translations[key][currentLanguage]) {
      return translations[key]?.['es'] || key;
    }
    return translations[key][currentLanguage];
  };

  // Called on dragenter
  function handleDragEnter(e: DragEvent) {
    const canEdit = !!selectedRestaurant || !!restaurantName;
    isDragging = handleDrag(e, canEdit, true);
  }

  // Called on dragleave
  function handleDragLeave(e: DragEvent) {
    const canEdit = !!selectedRestaurant || !!restaurantName;
    isDragging = handleDrag(e, canEdit, false);
  }

  // Called on dragover
  function handleDragOver(e: DragEvent) {
    const canEdit = !!selectedRestaurant || !!restaurantName;
    isDragging = handleDrag(e, canEdit, true);
  }

  // Direct upload function
  async function uploadFile(file: File): Promise<string | null> {
    console.log('Starting file upload process', { fileName: file.name, fileSize: file.size });
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Sending upload request to /api/upload');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      console.log('Upload response received', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }
      
      const result = await response.json();
      console.log('Upload successful', { resultUrl: result.url });
      return result.url || null;
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error instanceof Error) {
        uploadError = error.message;
        toasts.error(t('error') + ': ' + error.message);
      }
      return null;
    }
  }

  // Called on drop
  async function handleLogoDrop(e: DragEvent) {
    console.log('File dropped', { hasRestaurantName: !!restaurantName, hasSelectedRestaurant: !!selectedRestaurant });
    const canEdit = !!selectedRestaurant || !!restaurantName;
    await handleDrop(e, canEdit, t, async (file) => {
      console.log('Processing dropped file', { fileName: file.name, fileType: file.type });
      isUploading = true;
      uploadError = null;
      
      try {
        // First upload the file directly to get the URL
        const logoUrl = await uploadFile(file);
        console.log('Logo URL received from upload', { logoUrl });
        
        if (logoUrl) {
          // Update our local state
          menuLogo = logoUrl;
          console.log('Local state updated with new logo URL');
          
          // Then use the helper to update stores and dispatch event
          const updatedUrl = await handleFileUpload(
            file,
            restaurantName,
            customPrompt,
            phoneNumber,
            color,
            currency,
            dispatch,
            t
          );
          
          if (updatedUrl) {
            menuLogo = updatedUrl;
          }
        }
      } finally {
        isUploading = false;
      }
    }, (val) => isDragging = val);
  }

  // Called on logo <input> change
  async function handleLogoUploadInput(event: Event) {
    console.log('Logo input change triggered', { hasRestaurantName: !!restaurantName, hasSelectedRestaurant: !!selectedRestaurant });
    if (!selectedRestaurant && !restaurantName) {
      console.warn('Upload attempted without restaurant name');
      toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
      return;
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      console.warn('No file selected');
      return;
    }

    console.log('Processing selected file', { fileName: file.name, fileType: file.type });
    isUploading = true;
    uploadError = null;
    
    try {
      // First upload the file directly to get the URL
      const logoUrl = await uploadFile(file);
      console.log('Logo URL received from upload', { logoUrl });
      
      if (logoUrl) {
        // Update our local state
        menuLogo = logoUrl;
        console.log('Local state updated with new logo URL');
        
        // Then use the helper to update stores and dispatch event
        const updatedUrl = await handleFileUpload(
          file,
          restaurantName,
          customPrompt,
          phoneNumber,
          color,
          currency,
          dispatch,
          t
        );
        
        if (updatedUrl) {
          menuLogo = updatedUrl;
        }
      }
    } finally {
      isUploading = false;
    }
  }

  // Called on "delete logo" button
  function onDeleteLogo(event: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    const result = handleLogoDelete(
      event,
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber,
      color,
      currency,
      reservas,
      redes_sociales,
      dispatch
    );
    
    // Update local state
    menuLogo = result;
    
    // Also manually dispatch an update event
    dispatch('update', {
      id: selectedRestaurant || undefined,
      name: restaurantName,
      logo: menuLogo,
      customPrompt,
      phoneNumber,
      color,
      currency,
      reservas,
      redes_sociales,
      slug: ''
    });
  }
</script>

<div class="mb-8">
  <label class="block text-lg font-semibold mb-3 text-gray-800">
    {t('menuLogo')}
  </label>
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
        on:drop={handleLogoDrop}
      >
        <button type="submit" class="w-full h-full flex flex-col items-center justify-center">
          {#if menuLogo}
            <div class="relative w-full h-full">
              <img
                src={ensureString(menuLogo)}
                alt="Menu logo"
                class="w-full h-full object-cover rounded-xl"
              />
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/10
                       rounded-xl transition-colors duration-200"
              />
              <!-- Delete button overlay -->
              <button
                type="button"
                class="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0
                       group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                on:click|stopPropagation={onDeleteLogo}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414
                       0L10 8.586l4.293-4.293a1 1
                       0 111.414 1.414L11.414 10l4.293
                       4.293a1 1 0 01-1.414 1.414L10
                       11.414l-4.293 4.293a1 1 0
                       01-1.414-1.414L8.586 10
                       4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          {:else if isUploading}
            <div class="flex flex-col items-center justify-center">
              <svg
                class="animate-spin h-8 w-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373
                     0 0 5.373 0 12h4zm2 5.291A7.962
                     7.962 0 014 12H0c0 3.042 1.135
                     5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span class="text-sm text-blue-600 mt-2 font-medium">
                {t('uploading')}
              </span>
            </div>
          {:else if uploadError}
            <div class="flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-sm text-red-600 mt-2 font-medium">
                {t('error')}
              </span>
              <span class="text-xs text-gray-500 mt-1">
                {t('tryAgain')}
              </span>
            </div>
          {:else}
            <div class="flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="text-sm text-blue-600 mt-2 font-medium">
                {t('addLogo')}
              </span>
              {#if isDragging}
                <span class="text-xs text-blue-500 mt-1">
                  {t('dropToUpload')}
                </span>
              {:else}
                <span class="text-xs text-gray-500 mt-1">
                  {t('dragAndDrop')}
                </span>
              {/if}
            </div>
          {/if}
        </button>
        <input
          id="logo-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          class="hidden"
          on:change={handleLogoUploadInput}
        />
      </form>
    </div>
    <div
      id="logo-error"
      class="hidden text-sm text-white bg-red-500 px-4 py-2 rounded-lg shadow-lg z-50
             transition-all duration-300 ease-in-out min-w-[200px] whitespace-nowrap"
    >
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16
               0 8 8 0 0116 0zm-7
               4a1 1 0 11-2 0 1
               1 0 012 0zm-1-9a1
               1 0 00-1 1v4a1 1
               0 102 0V6a1 1
               0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="flex-1"></span>
      </div>
    </div>
  </div>
</div> 