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

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      newDish = { ...newDish, imageUrl: data.url };
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error instanceof Error) {
        alert(t('error') + ': ' + error.message);
      }
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
      <div class="flex items-center space-x-2">
        {#if newDish.imageUrl}
          <img 
            src={newDish.imageUrl} 
            alt="New dish"
            class="w-16 h-16 object-cover rounded"
          />
        {/if}
        <div class="relative">
          <button
            class="px-4 py-2 bg-white/80 text-gray-700 rounded border border-gray-300 hover:bg-white/90 transition-colors text-sm font-medium flex items-center gap-2"
            on:click={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => handleImageUpload(e);
              input.click();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {t('uploadImage')}
          </button>
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