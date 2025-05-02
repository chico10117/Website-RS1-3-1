<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Dish } from '$lib/types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores/menu-store';
  import { toasts } from '$lib/stores/toast';
  import { currentRestaurant } from '$lib/stores/restaurant';

  export let categoryId: string;

  const dispatch = createEventDispatcher<{
    add: Dish;
  }>();

  interface NewDish {
    id: string;
    title: string;
    price: string;  // Keep as string for form input
    description: string;
    imageUrl: string | null;
    categoryId: string;
  }

  let newDish: NewDish = {
    id: '',
    title: '',
    price: '',
    description: '',
    imageUrl: null,
    categoryId: ''
  };

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][currentLanguage] || key;
  };

  async function handleImageUpload(event: Event) {
    try {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        const errorDiv = document.getElementById('dish-form-error');
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
        const errorDiv = document.getElementById('dish-form-error');
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

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing upload response:', parseError);
        throw new Error(t('invalidServerResponse'));
      }
      
      if (!data.success) {
        throw new Error(data.error || t('fileUploadError'));
      }

      newDish = { ...newDish, imageUrl: data.url };
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorDiv = document.getElementById('dish-form-error');
      const errorText = errorDiv?.querySelector('span');
      if (errorDiv && errorText) {
        errorText.textContent = error instanceof Error ? error.message : t('fileUploadError');
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
          errorDiv.classList.add('hidden');
        }, 3000);
      }
    } finally {
      // Reset the file input
      const input = event.target as HTMLInputElement;
      input.value = '';
    }
  }

  async function addDish() {
    if (!newDish.title.trim() || !newDish.price) {
      toasts.error(t('error') + ': ' + t('titleAndPriceRequired'));
      return;
    }

    try {
      // Add the dish directly to the menuStore
      menuStore.addDish(categoryId, {
        title: newDish.title.trim(),
        price: newDish.price,
        description: newDish.description.trim(),
        imageUrl: newDish.imageUrl
      });
      
      // Also dispatch the event for backward compatibility
      const dish: Dish = {
        id: crypto.randomUUID(),
        categoryId,
        title: newDish.title.trim(),
        price: newDish.price,
        description: newDish.description.trim(),
        imageUrl: newDish.imageUrl
      };
      
      // Dispatch the event
      dispatch('add', dish);
      
      // Reset form
      newDish = {
        id: '',
        title: '',
        price: '',
        description: '',
        imageUrl: null,
        categoryId: ''
      };
    } catch (error) {
      console.error('Error adding dish:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      addDish();
    }
  }
</script>

<div class="bg-white/60 backdrop-blur-md rounded-lg border border-white/50 p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-xs font-semibold text-gray-700 mb-1 block w-[50px] whitespace-nowrap">{t('title')}*</label>
        <input
          type="text"
          class="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent font-normal transition-all duration-200"
          bind:value={newDish.title}
          on:keydown={handleKeyPress}
          required
        />
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-700 mb-1 block w-[25px]">{t('price')}*</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{$menuStore.currency || '€'}</span>
          <input
            type="text"
            class="w-[120px] pl-7 pr-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent font-normal transition-all duration-200"
            bind:value={newDish.price}
            on:keydown={handleKeyPress}
            required
          />
        </div>
      </div>
    </div>
    <div>
      <label class="text-xs font-semibold text-gray-700 mb-1 block">{t('description')}</label>
      <textarea
        class="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent h-16 resize-none font-normal transition-all duration-200"
        bind:value={newDish.description}
        on:keydown={handleKeyPress}
      />
    </div>
    <div>
      <label class="text-xs font-semibold text-gray-700 mb-1 block">{t('image')}</label>
      <div class="flex flex-col space-y-3">
        {#if newDish.imageUrl}
          <div class="relative inline-block">
            <img 
              src={newDish.imageUrl} 
              alt="New dish"
              class="w-20 h-20 object-cover rounded-lg shadow-sm transition-transform duration-200 hover:scale-105"
            />
            <button
              type="button"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              on:click={() => newDish = { ...newDish, imageUrl: null }}
              title={t('removeImage') || 'Remove image'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        {/if}
        <div class="relative">
          <form
            class="inline-block"
            on:submit|preventDefault={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/jpeg,image/png,image/webp';
              input.onchange = (e) => handleImageUpload(e);
              input.click();
            }}
          >
            <button
              type="submit"
              class="px-4 py-2 bg-white/90 text-gray-700 rounded-md border border-gray-200 hover:bg-white hover:border-gray-300 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {t('uploadImage')}
            </button>
          </form>
        </div>
        <div id="dish-form-error" class="text-sm text-white bg-red-500 px-4 py-2 rounded-lg shadow-lg hidden w-fit">
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end pt-2">
      <button
        class="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium transition-colors duration-200 shadow-sm hover:shadow"
        on:click={addDish}
      >
        {t('addDish')}
      </button>
    </div>
  </div>
</div> 