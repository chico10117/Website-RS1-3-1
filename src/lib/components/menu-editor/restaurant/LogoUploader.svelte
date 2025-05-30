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
  export let phoneNumber: number | null = null;
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
          
          // Then use the helper to dispatch the event with the correct signature
          const updatedUrl = await handleFileUpload(
            file,
            selectedRestaurant,
            t,
            dispatch
          );
          
          // Optional: Update local menuLogo again if handleFileUpload modified the URL (it shouldn't now)
          // if (updatedUrl && updatedUrl !== logoUrl) { 
          //   menuLogo = updatedUrl;
          // }
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
        
        // Then use the helper to dispatch the event with the correct signature
        const updatedUrl = await handleFileUpload(
          file,
          selectedRestaurant,
          t,
          dispatch
        );

        // Optional: Update local menuLogo again if handleFileUpload modified the URL (it shouldn't now)
        // if (updatedUrl && updatedUrl !== logoUrl) { 
        //   menuLogo = updatedUrl;
        // }
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
    
    // Call helper with updated signature
    const result = handleLogoDelete(
      selectedRestaurant,
      dispatch
    );
    
    // Update local state
    menuLogo = result;
    
    // No need to manually dispatch here anymore, handleLogoDelete does it.
  }
</script>

<div class="mb-8">
  <label class="block text-lg font-semibold mb-3 text-gray-800">
    {t('menuLogo')}
  </label>
  <div class="flex items-start gap-4">
    <div class="relative group">
      <form
        class="border border-gray-200 rounded-lg flex flex-col items-center justify-center transition-all duration-200 bg-white {!restaurantName ? 'opacity-50 cursor-not-allowed' : isDragging ? 'border-blue-400 bg-blue-50' : menuLogo ? 'shadow-md hover:shadow-lg' : 'hover:border-blue-300'} {!menuLogo ? 'w-24 h-24' : 'max-w-32 max-h-24'}"
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
        <button type="submit" class="w-full h-full flex flex-col items-center justify-center p-2">
          {#if menuLogo}
            <div class="relative">
              <img
                src={ensureString(menuLogo)}
                alt="Menu logo"
                class="block max-w-full max-h-full object-contain rounded-lg"
              />
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/10
                       rounded-lg transition-colors duration-200"
              />
              <!-- Delete button overlay -->
              <button
                type="button"
                class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0
                       group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                on:click|stopPropagation={onDeleteLogo}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          {:else if isUploading}
            <div class="flex flex-col items-center justify-center">
              <svg
                class="animate-spin h-6 w-6 text-blue-500"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span class="text-xs text-blue-600 mt-1 font-medium">
                {t('uploading')}
              </span>
            </div>
          {:else if uploadError}
            <div class="flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-red-500"
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
              <span class="text-xs text-red-600 mt-1 font-medium">
                {t('error')}
              </span>
              <span class="text-[10px] text-gray-500">
                {t('tryAgain')}
              </span>
            </div>
          {:else}
            <div class="flex flex-col items-center justify-center text-center">
              <div class="w-8 h-8 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-xs font-medium text-gray-900">
                {t('addLogo')}
              </span>
              <span class="text-[10px] text-gray-500">
                {isDragging ? t('dropToUpload') : t('dragAndDrop')}
              </span>
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