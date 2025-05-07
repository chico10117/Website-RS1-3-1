<script lang="ts">
  import * as pdfjsLib from 'pdfjs-dist';
  import { createEventDispatcher, onMount } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { toasts } from '$lib/stores/toast';
  import { uploaderStore } from '$lib/stores/uploaderStore';

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

  export let restaurantName: string;
  export let customPrompt: string | null = null;
  export let restaurantId: string | null = null;

  // Configuration constants (optimizations)
  const MAX_FILE_SIZE_MB = 20; // Maximum file size in MB
  const MAX_PDF_PAGES = 10; // Maximum number of PDF pages to process
  const IMAGE_QUALITY = 1; // PNG quality (0-1)
  const MAX_IMAGE_DIMENSION = 1800; // Maximum width/height for images
  const PDF_SCALE_FACTOR = 1.5; // Scale factor for PDF rendering (lower = smaller)

  const dispatch = createEventDispatcher<{
    success: { restaurantData: any;};
    error: string;
  }>();

  let images: { page: number; dataURL: string }[] = [];
  let isDragging = false;
  let totalUploadSizeMB = 0; // Track the total upload size
  let isMobile = false; // Mobile detection

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => {
    // Safely access translations with a fallback for missing keys
    if (!translations[key]) {
      console.warn(`Missing translation key: ${key}`);
      return key; // Return the key itself as fallback
    }
    return translations[key][currentLanguage];
  }

  onMount(() => {
    // Check if device is mobile
    isMobile = window.innerWidth < 768;
    
    // Listen for resize events to update mobile status
    const handleResize = () => {
      isMobile = window.innerWidth < 768;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  // Reset component state when restaurantId changes to null (new restaurant)
  $: if (restaurantId === null) {
    console.log('Resetting MenuUploader state - new restaurant');
    images = [];
    uploaderStore.reset();
    isDragging = false;
    totalUploadSizeMB = 0;
  }

  // Reset component state when restaurantId changes
  $: if (restaurantId) {
    console.log('Resetting MenuUploader state - changing restaurant');
    images = [];
    uploaderStore.reset();
    isDragging = false;
    totalUploadSizeMB = 0;
  }

  // Validate restaurant name
  $: if (restaurantName === undefined || restaurantName === null) {
    console.error('Restaurant name is undefined or null');
  }

  // Check if we have a valid restaurant name (either from manual input or from upload)
  $: hasValidRestaurantName = restaurantName && restaurantName.trim() !== '';

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;

    await processFiles(files);
    // No reseteamos el input aquí para permitir subir el mismo archivo nuevamente si es necesario
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (!files?.length) return;

    await processFiles(files);
  }

  // Check file size limit
  function validateFileSize(file: File): boolean {
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      toasts.error(`${t('error')}: ${file.name} ${t('fileTooLarge')} (${fileSizeMB.toFixed(1)}MB > ${MAX_FILE_SIZE_MB}MB)`);
      return false;
    }
    
    totalUploadSizeMB += fileSizeMB;
    console.log(`File size: ${fileSizeMB.toFixed(1)}MB, Total: ${totalUploadSizeMB.toFixed(1)}MB`);
    return true;
  }

  // Compress an image to a reasonable size
  async function compressImage(imageDataURL: string, quality: number = IMAGE_QUALITY): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        // Resize if either dimension exceeds MAX_IMAGE_DIMENSION
        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          if (width > height) {
            height = Math.round(height * (MAX_IMAGE_DIMENSION / width));
            width = MAX_IMAGE_DIMENSION;
          } else {
            width = Math.round(width * (MAX_IMAGE_DIMENSION / height));
            height = MAX_IMAGE_DIMENSION;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Always use PNG for better text quality
        resolve(canvas.toDataURL('image/png', quality));
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageDataURL;
    });
  }

  async function processFiles(files: FileList) {
    try {
      images = [];
      totalUploadSizeMB = 0;
      uploaderStore.setLoading(true, t('processingFiles'), 0);

      // Count total files to process
      let validFiles = 0;
      for (const file of files) {
        if ((file.type === 'application/pdf' || file.type.startsWith('image/')) && validateFileSize(file)) {
          validFiles++;
        }
      }

      if (validFiles === 0) {
        uploaderStore.reset();
        return;
      }

      let processedFiles = 0;
      for (const file of files) {
        if (!validateFileSize(file)) continue;

        if (file.type === 'application/pdf') {
          await processPDF(file);
        } else if (file.type.startsWith('image/')) {
          const progress = Math.round((processedFiles / validFiles) * 40);
          uploaderStore.updateProgress(`${t('processingImage')} ${file.name}`, progress);
          await processImage(file);
        } else {
          toasts.error(t('error') + ': ' + t('invalidFileType'));
          continue;
        }
        processedFiles++;
      }

      if (images.length > 0) {
        console.log('Images ready for upload:', images.length);
        uploaderStore.updateProgress(t('preparingToUpload'), 50);
        await generateRestaurantData();
      } else {
        uploaderStore.reset();
      }
    } catch (error) {
      console.error('Error processing files:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
        dispatch('error', error.message);
      }
      uploaderStore.reset();
    }
  }

  async function processPDF(file: File) {
    try {
      console.log(`Processing PDF: ${file.name}, Size: ${file.size} bytes`);
      const arrayBuffer = await file.arrayBuffer();
      uploaderStore.updateProgress(t('loadingPdf'), 10);
      
      const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
      console.log(`PDF loaded: ${pdf.numPages} pages`);
      
      // Limit the number of pages to process
      const pagesToProcess = Math.min(pdf.numPages, MAX_PDF_PAGES);
      if (pdf.numPages > MAX_PDF_PAGES) {
        toasts.warning(`${t('warning')}: ${t('processingFirstPages')} ${MAX_PDF_PAGES} ${t('of')} ${pdf.numPages}`);
      }

      for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
        const step = t('processingPage') + ` ${pageNum}/${pagesToProcess}`;
        const progress = 10 + ((pageNum / pagesToProcess) * 30); // 10-40% of the overall process
        uploaderStore.updateProgress(step, progress);
        console.log(`Rendering page ${pageNum}`);

        try {
          const page = await pdf.getPage(pageNum);
          
          // Optimize viewport scale based on target dimensions
          const viewport = page.getViewport({ scale: 1 });
          const scaleFactor = Math.min(
            MAX_IMAGE_DIMENSION / viewport.width,
            MAX_IMAGE_DIMENSION / viewport.height,
            PDF_SCALE_FACTOR // Cap at the maximum scale factor (quality vs. size tradeoff)
          );
          
          const scaledViewport = page.getViewport({ scale: scaleFactor });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            throw new Error(`Could not get canvas context for page ${pageNum}`);
          }

          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          await page.render({ canvasContext: context, viewport: scaledViewport }).promise;

          // Use PNG for better text quality
          const dataURL = canvas.toDataURL('image/png', IMAGE_QUALITY);
          const compressedDataURL = await compressImage(dataURL);
          
          console.log(`Page ${pageNum}: Original size: ${dataURL.length}, Compressed: ${compressedDataURL.length}`);
          images.push({ page: pageNum, dataURL: compressedDataURL });
        } catch (pageError) {
          console.error(`Error rendering page ${pageNum}:`, pageError);
          toasts.error(t('errorProcessingPage') + ` ${pageNum}`);
        }
      }
    } catch (pdfError) {
      console.error('Error processing PDF file:', pdfError);
      if (pdfError instanceof Error) {
         toasts.error(t('error') + ': ' + pdfError.message);
         dispatch('error', pdfError.message);
      } else {
         toasts.error(t('errorProcessingPdf'));
         dispatch('error', t('errorProcessingPdf'));
      }
      uploaderStore.reset();
      throw pdfError;
    }
  }

  async function processImage(file: File) {
    try {
      const dataURL = await convertToBase64(file);
      const compressedDataURL = await compressImage(dataURL);
      console.log(`Image ${file.name}: Original size: ${dataURL.length}, Compressed: ${compressedDataURL.length}`);
      images.push({ page: images.length + 1, dataURL: compressedDataURL });
    } catch (error) {
      console.error(`Error processing image ${file.name}:`, error);
      toasts.error(`${t('error')}: ${t('errorProcessingImage')} ${file.name}`);
    }
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
      uploaderStore.updateProgress(t('uploadingImages'), 60);

      // Calculate and log total upload size
      let totalBase64Length = 0;
      for (const img of images) {
        totalBase64Length += img.dataURL.length;
      }
      console.log(`Uploading ${images.length} images, total size: ${(totalBase64Length / (1024 * 1024)).toFixed(2)}MB`);

      // Prepare the images for the API
      const payload = {
        prompt: customPrompt,
        images: images.map(img => ({
          page: img.page,
          base64: img.dataURL.split(',')[1]
        }))
      };

      uploaderStore.updateProgress(t('waitingForAI'), 70);
      
      const aiStartTime = Date.now();
      let lastProgressUpdate = Date.now();
      let isWaitingLong = false;
      
      // Set up a timer to show incremental progress during long waits
      const progressTimer = setInterval(() => {
        const elapsedSecs = (Date.now() - aiStartTime) / 1000;
        
        // After 5 seconds of waiting, start showing incremental progress
        if (elapsedSecs > 5 && !isWaitingLong) {
          isWaitingLong = true;
          uploaderStore.updateProgress(t('stillAnalyzing'), 75);
        }
        
        // Every 8 seconds, update the progress message if no backend updates
        if (Date.now() - lastProgressUpdate > 8000) {
          lastProgressUpdate = Date.now();
          
          // Increase progress by a small amount each update, max at 85%
          // (leaving room for backend progress messages to take us to 95%)
          const currentProgress = $uploaderStore.progress;
          const newProgress = Math.min(85, currentProgress + (currentProgress < 80 ? 3 : 1));
          
          if (elapsedSecs > 30) {
            uploaderStore.updateProgress(t('processingLargeMenu'), newProgress);
          } else if (elapsedSecs > 15) {
            uploaderStore.updateProgress(t('analyzingMenuItems'), newProgress);
          } else {
            uploaderStore.updateProgress(t('extractingData'), newProgress);
          }
        }
      }, 1000);

      const response = await fetch('/api/process-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!response.body) {
        clearInterval(progressTimer);
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        // Process different message types from the backend
        if (chunk.includes('[START]')) {
          console.log("AI processing started");
          lastProgressUpdate = Date.now();
          uploaderStore.updateProgress(t('aiProcessingStarted'), 75);
        } 
        else if (chunk.includes('[PROGRESS]')) {
          lastProgressUpdate = Date.now();
          try {
            const progressMessage = chunk.split('[PROGRESS]')[1].trim();
            console.log(`Progress update: ${progressMessage}`);
            // No translation needed - just use the message directly
            const currentProgress = $uploaderStore.progress;
            // Increment progress slowly, up to 90%
            const newProgress = Math.min(90, currentProgress + 1);
            uploaderStore.updateProgress(progressMessage, newProgress);
          } catch (error) {
            console.error('Error parsing progress message:', error);
            // Keep the process going, don't throw
          }
        }
        else if (chunk.includes('[ERROR]')) {
          clearInterval(progressTimer);
          const errorData = chunk.split('[ERROR]')[1].trim();
          console.error("Error from backend:", errorData);
          toasts.error(t('error') + ': ' + t('aiProcessingError'));
          uploaderStore.reset();
          return;
        }
        else if (chunk.includes('[DONE]')) {
          console.log("Stream finalizado. Procesando la respuesta...");
          const totalTime = ((Date.now() - aiStartTime) / 1000).toFixed(1);
          console.log(`Total OpenAI API processing time: ${totalTime} seconds`);
          console.log(`AI processing took ${((Date.now() - aiStartTime) / 1000).toFixed(1)} seconds`);
          clearInterval(progressTimer);

          // Extract the JSON data after the [DONE] marker
          const jsonData = fullResponse.split('[DONE]')[1].trim();

          try {
            const parsedData = JSON.parse(jsonData);
            console.log('Parsed data:', parsedData);

            // Ensure parsedData.restaurant is an object
            let restaurantFromAI: { name?: string, [key: string]: any } = {};
            if (parsedData && typeof parsedData.restaurant === 'object' && parsedData.restaurant !== null) {
              restaurantFromAI = parsedData.restaurant;
            } else if (parsedData && typeof parsedData.restaurant === 'string') {
              // If AI returned just a string, use it as the name
              restaurantFromAI = { name: parsedData.restaurant };
            }
            // Ensure we have a base restaurant object in parsedData
            parsedData.restaurant = restaurantFromAI;
            
            // Prioritize existing restaurantName prop if available
            if (restaurantName && restaurantName.trim() !== '') {
              console.log(`Preserving existing frontend restaurant name: ${restaurantName}`);
              parsedData.restaurant.name = restaurantName;
            } else if (!parsedData.restaurant.name) {
              // If no name from prop and no name from AI, use a placeholder
              const placeholderName = currentLanguage === 'es' ? 'Restaurante sin nombre' : 'Untitled Restaurant';
              console.warn('No restaurant name found, using placeholder:', placeholderName);
              parsedData.restaurant.name = placeholderName;
            }
            
            saveRestaurantData(parsedData);
          } catch (error) {
            console.error("Error al procesar la respuesta del stream:", error);
            toasts.error(t('error') + ': Error procesando la respuesta del chatbot');
            uploaderStore.reset();
          }

          break;
        }
      }
    } catch (error) {
      console.error('Error en la carga del menú:', error);
      uploaderStore.reset();
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
        dispatch('error', error.message);
      }
    }
  }

  // ✅ Función para guardar la respuesta final y actualizar el estado del menú
  async function saveRestaurantData(result: any) {
    try {
      console.log('saveRestaurantData received result:', result);
      
      // Validate the structure of the response
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format');
      }

      // --- Start Restructured Extraction ---
      const extractedCategories: any[] = []; // Initialize empty array

      if (result.menu && typeof result.menu === 'object') {
        // Case 1: AI returned { menu: { CategoryName: { DishName: Price } } }
        console.log('Found menu object from AI, processing object structure...');
        console.log('Inspecting result.menu object:', JSON.stringify(result.menu, null, 2));
        for (const categoryName in result.menu) {
          if (Object.prototype.hasOwnProperty.call(result.menu, categoryName)) {
            const categoryContent = result.menu[categoryName];
            const dishes: any[] = [];
            if (typeof categoryContent === 'object' && categoryContent !== null && !Array.isArray(categoryContent)) {
              for (const dishName in categoryContent) {
                if (Object.prototype.hasOwnProperty.call(categoryContent, dishName)) {
                  const priceValue = categoryContent[dishName];
                  const priceString = priceValue?.toString() || '0';
                  const cleanedPriceString = priceString.replace(/[€$£]/g, '').trim();
                  const priceAsNumber = parseFloat(cleanedPriceString);
                  const finalPriceString = !isNaN(priceAsNumber) ? priceAsNumber.toString() : '0';
                  dishes.push({
                    title: dishName,
                    description: '',
                    price: finalPriceString
                  });
                }
              }
            }
            // Only add category if it has dishes
            if (dishes.length > 0) {
              extractedCategories.push({
                name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
                dishes: dishes
              });
            }
          }
        }
      } else if (result.categories && Array.isArray(result.categories)) {
        // Case 2: AI returned { categories: [ { name: ..., dishes: [...] } ] }
        console.log('Found categories array from AI, processing array structure...');
        result.categories.forEach((category: any) => {
          if (!category || typeof category !== 'object') return; // Skip invalid category entries
          const dishes: any[] = [];
          if (Array.isArray(category.dishes)) {
            category.dishes.forEach((dish: any) => {
              if (!dish || typeof dish !== 'object') return; // Skip invalid dish entries
              console.log('AI Dish Object structure (from categories array):', dish);
              const priceString = dish.precio?.toString() || dish.price?.toString() || '0';
              const cleanedPriceString = priceString.replace(/[€$£]/g, '').trim();
              const priceAsNumber = parseFloat(cleanedPriceString);
              const finalPriceString = !isNaN(priceAsNumber) ? priceAsNumber.toString() : '0';
              dishes.push({
                title: dish.name || dish.nombre || dish.title || 'Untitled Dish',
                description: dish.descripcion || dish.description || '',
                price: finalPriceString
              });
            });
          }
          // Only add category if it has dishes
           if (dishes.length > 0) {
             extractedCategories.push({
               name: category.name || 'Untitled Category',
               dishes: dishes
             });
           }
        });
      } else {
        // Case 3: No menu data found
        console.log('No menu object or categories array found in AI response.');
        // extractedCategories remains empty
      }

      // IMPORTANT: Overwrite result.categories with the processed data
      result.categories = extractedCategories;
      console.log('Final extracted categories after processing:', result.categories);
      // --- End Restructured Extraction ---

      // Get placeholder name based on language
      const placeholderName = currentLanguage === 'es' ? 'Restaurante desconocido' : 'Unknown restaurant';
      
      console.log('Current restaurant name:', restaurantName);
      console.log('Using placeholder name if needed:', placeholderName);

      // Ensure restaurant data exists and has a name
      if (!result.restaurant || typeof result.restaurant !== 'object') {
        console.log('No restaurant object found, creating one');
        result.restaurant = { name: restaurantName || placeholderName };
      } else if (!result.restaurant.name) {
        console.log('Restaurant object found but no name, setting name');
        result.restaurant.name = restaurantName || placeholderName;
      } else if (!restaurantName) {
        // If we have a name from the upload but no manual name, use the uploaded name
        console.log('Using uploaded restaurant name');
        result.restaurant.name = result.restaurant.name;
      }

      // Ensure userEmail is present
      if (!result.userEmail) {
        console.warn('User email not found in response, this might cause issues with data association');
      }

      // Ensure categories array exists
      if (!result.categories || !Array.isArray(result.categories)) {
        console.log('No categories array found, initializing empty array');
        result.categories = [];
      }

      // Process categories and dishes to ensure they have the required fields
      result.categories = result.categories.map((category: any, index: number) => {
        // Ensure category has an id (temporary)
        if (!category.id) {
          category.id = `temp_category_${index}`;
        }

        // Ensure dishes array exists
        if (!category.dishes || !Array.isArray(category.dishes)) {
          category.dishes = [];
        }

        // Process dishes to ensure they have the required fields
        category.dishes = category.dishes.map((dish: any, dishIndex: number) => {
          return {
            id: dish.id || `temp_dish_${index}_${dishIndex}`,
            title: dish.title || 'Untitled Dish',
            description: dish.description || '',
            price: dish.price?.toString() || '0',
            imageUrl: dish.imageUrl || null,
            categoryId: category.id
          };
        });

        return category;
      });

      console.log('Final processed data before dispatch:', {
        restaurant: result.restaurant,
        categoriesCount: result.categories.length,
        userEmail: result.userEmail
      });

      // Dispatch the success event with the processed data
      dispatch('success', { restaurantData: result });
      toasts.success(t('menuUploadSuccess'));
      uploaderStore.setLoading(false, t('completed'), 100);
      setTimeout(() => uploaderStore.reset(), 1000);

    } catch (error) {
      console.error('Error guardando datos del restaurante:', error);
      toasts.error(t('error') + ': No se pudo guardar la información');
      uploaderStore.reset();
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
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="w-full h-36 border-2 border-dashed rounded-xl transition-all duration-200 relative {isDragging ? 'border-blue-400 bg-blue-50' : 'border-blue-200 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-400'}"
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:dragover={handleDragOver}
    on:drop={handleDrop}
  >
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      {#if !$uploaderStore.isLoading}  <!-- Only show dropzone content when NOT loading -->
        <div class="text-center space-y-4">
          {#if isMobile}
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
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          {:else}
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
          {/if}
          <div class="space-y-1">
            <p class="text-base font-medium text-gray-900">{t('uploadMenuFiles')}</p>
            <p class="text-sm text-gray-500">
              {#if isMobile}
                {t('takePhotoOnMobile')}
              {:else}
                {isDragging ? t('dropToUpload') : t('dragAndDropOrClick')}
              {/if}
            </p>
            <p class="text-xs text-gray-400">
              {`${t('maxFileSize')}: ${MAX_FILE_SIZE_MB}MB, ${t('maxPdfPages')}: ${MAX_PDF_PAGES}`}
            </p>
          </div>
        </div>
      {/if} <!-- End of !loading block -->
    </div>
    <input
      type="file"
      id="menu-file-input"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      accept="application/pdf,image/*"
      multiple
      on:change={handleFileChange}
      disabled={$uploaderStore.isLoading}
    />
  </div>

  {#if $uploaderStore.isLoading}
    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div class="bg-blue-600 h-2.5 rounded-full" style="width: {$uploaderStore.progress}%"></div>
    </div>
    <p class="text-sm text-gray-600 text-center">{$uploaderStore.currentStep}</p>
  {/if}

  {#if images.length > 0}
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
                 if (!$uploaderStore.isLoading) {
                   images.splice(index, 1);
                   images = [...images];
                 }
              }}
            >
              <!-- SVG icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div> 