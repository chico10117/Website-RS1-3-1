<script lang="ts">
  import * as pdfjsLib from 'pdfjs-dist';
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { toasts } from '$lib/stores/toast';
  import { user } from '$lib/stores/user';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { menuCache } from '$lib/stores/menu-cache';
  import { generateSlug } from '$lib/utils/slug';

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

  export let restaurantName: string;
  export let customPrompt: string | null = null;

  const dispatch = createEventDispatcher<{
    success: { restaurantData: any; fileName: string };
    error: string;
  }>();

  let images: { page: number; dataURL: string }[] = [];
  let loading = false;
  let progress = 0;
  let currentStep = '';
  let isDragging = false;

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Validate restaurant name
  $: if (restaurantName === undefined || restaurantName === null) {
    console.error('Restaurant name is undefined or null');
  }

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;

    await processFiles(files);
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (!files?.length) return;

    await processFiles(files);
  }

  async function processFiles(files: FileList) {
    try {
      loading = true;
      images = [];
      progress = 0;
      currentStep = t('processingFiles');

      for (const file of files) {
        if (file.type === 'application/pdf') {
          await processPDF(file);
        } else if (file.type.startsWith('image/')) {
          await processImage(file);
        } else {
          toasts.error(t('error') + ': ' + t('invalidFileType'));
          continue;
        }
      }

      if (images.length > 0) {
        await generateRestaurantData();
      }
    } catch (error) {
      console.error('Error processing files:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
        dispatch('error', error.message);
      }
    } finally {
      loading = false;
      progress = 0;
      currentStep = '';
    }
  }

  async function processPDF(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      currentStep = t('processingPage') + ` ${pageNum}/${pdf.numPages}`;
      progress = (pageNum / pdf.numPages) * 50;

      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not get canvas context');
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;

      const dataURL = canvas.toDataURL('image/png');
      images.push({ page: pageNum, dataURL });
    }
  }

  async function processImage(file: File) {
    const dataURL = await convertToBase64(file);
    images.push({ page: images.length + 1, dataURL });
  }

  async function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function generateRestaurantData() {
    try {
      if (!restaurantName) {
        throw new Error(t('pleaseEnterRestaurantNameFirst'));
      }

      currentStep = t('generatingRestaurantData');
      progress = 75;

      const payload = {
        prompt: customPrompt,
        images: images.map(img => ({
          page: img.page,
          base64: img.dataURL.split(',')[1]
        }))
      };

      const response = await fetch('/api/process-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to process images:', response.status, errorText);
        throw new Error(`Failed to process images: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('Process-images error:', data.error);
        throw new Error(data.error);
      }

      currentStep = t('seedingDatabase');
      progress = 90;

      // Call the seed endpoint with the generated data
      const seedResponse = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: data.savedTo,
          restaurantName,
          customPrompt
        })
      });

      if (!seedResponse.ok) {
        const errorData = await seedResponse.json();
        console.error('Failed to seed database:', errorData);
        throw new Error(errorData.error || `Failed to seed database: ${seedResponse.status}`);
      }

      const seedResult = await seedResponse.json();
      
      if (seedResult.error) {
        console.error('Seed error:', seedResult.error);
        throw new Error(seedResult.error);
      }

      progress = 100;
      currentStep = t('completed');
      
      // Dispatch success event with the processed data
      dispatch('success', {
        restaurantData: data.content,
        fileName: data.savedTo
      });

      toasts.success(t('menuUploadSuccess'));
    } catch (error) {
      console.error('Menu upload error:', error instanceof Error ? error.message : 'Unknown error');
      loading = false;
      progress = 0;
      currentStep = '';
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
        dispatch('error', error.message);
      }
      throw error;
    }
  }

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
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
    isDragging = true;
  }
</script>

<div class="space-y-4">
  <div
    class="w-full h-48 border-2 border-dashed rounded-xl transition-all duration-200 relative {isDragging ? 'border-blue-400 bg-blue-50' : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300'}"
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:dragover={handleDragOver}
    on:drop={handleDrop}
  >
    <input
      type="file"
      id="menu-file-input"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      accept="application/pdf,image/*"
      multiple
      on:change={handleFileChange}
    />
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      {#if loading}
        <div class="space-y-4 w-full max-w-md px-4">
          <div class="text-center space-y-2">
            <p class="text-sm font-medium text-gray-600">{currentStep}</p>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style="width: {progress}%"
              ></div>
            </div>
          </div>
        </div>
      {:else}
        <div class="text-center space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-blue-400 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div class="space-y-1">
            <p class="text-base font-medium text-gray-900">{t('uploadMenuFiles')}</p>
            <p class="text-sm text-gray-500">
              {isDragging ? t('dropToUpload') : t('dragAndDropOrClick')}
            </p>
            <p class="text-xs text-gray-400">{t('supportedFormats')}</p>
          </div>
        </div>
      {/if}
    </div>
  </div>

  {#if images.length > 0 && !loading}
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each images as img, index}
        <div class="relative group">
          <img
            src={img.dataURL}
            alt={`Page ${img.page}`}
            class="w-full aspect-[3/4] object-cover rounded-lg border border-gray-200"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200">
            <button
              class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              on:click={() => {
                images.splice(index, 1);
                images = [...images];
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div> 