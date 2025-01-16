<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Dish } from '$lib/types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';

  export let categoryId: string;

  const dispatch = createEventDispatcher<{
    add: Dish;
  }>();

  let newDish: Dish = {
    id: '',
    title: '',
    price: '',
    description: '',
    imageUrl: '',
    categoryId: ''
  };

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

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
        body: formData
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
    if (!newDish.title.trim() || !newDish.price.trim()) {
      alert(t('error') + ': ' + t('titleAndPriceRequired'));
      return;
    }

    try {
      // Create a new dish with a temporary ID
      const dish: Dish = {
        ...newDish,
        id: crypto.randomUUID(),
        categoryId,
        title: newDish.title.trim(),
        price: newDish.price.trim(),
        description: newDish.description.trim()
      };

      // Update cache
      menuCache.updateDish(dish.id, 'create', dish);
      
      // Dispatch the event
      dispatch('add', dish);
      
      // Reset form
      newDish = {
        id: '',
        title: '',
        price: '',
        description: '',
        imageUrl: '',
        categoryId: ''
      };
    } catch (error) {
      console.error('Error adding dish:', error);
      if (error instanceof Error) {
        alert(t('error') + ': ' + error.message);
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

<div class="bg-white/40 backdrop-blur-md rounded-lg border border-white/50 p-3">
  <div class="space-y-2">
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="text-xs font-semibold text-gray-600">{t('title')} *</label>
        <input
          type="text"
          class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
          bind:value={newDish.title}
          on:keydown={handleKeyPress}
          required
        />
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-600">{t('price')} *</label>
        <input
          type="text"
          class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
          bind:value={newDish.price}
          on:keydown={handleKeyPress}
          required
        />
      </div>
    </div>
    <div>
      <label class="text-xs font-semibold text-gray-600">{t('description')}</label>
      <textarea
        class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 h-16 resize-none font-normal"
        bind:value={newDish.description}
        on:keydown={handleKeyPress}
      />
    </div>
    <div>
      <label class="text-xs font-semibold text-gray-600">{t('image')}</label>
      <div class="flex flex-col space-y-2">
        {#if newDish.imageUrl}
          <img 
            src={newDish.imageUrl} 
            alt="New dish"
            class="w-16 h-16 object-cover rounded"
          />
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
              class="px-4 py-2 bg-white/80 text-gray-700 rounded border border-gray-300 hover:bg-white/90 transition-colors text-sm font-medium flex items-center gap-2"
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
        class="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        on:click={addDish}
      >
        {t('addDish')}
      </button>
    </div>
  </div>
</div> 