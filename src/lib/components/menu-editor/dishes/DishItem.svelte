<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Dish } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores/menu-store';
  import { toasts } from '$lib/stores/toast';
  import { currentRestaurant } from '$lib/stores/restaurant';

  export let dish: Dish;
  export let isEditing: boolean;
  export let categoryId: string;
  export let currency: string = '€';

  const dispatch = createEventDispatcher<{
    edit: void;
    update: Dish;
    delete: string;
  }>();

  let editingDish: Dish = { ...dish };

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][currentLanguage] || key;
  };

  // Use the currency from currentRestaurant if available
  $: if ($currentRestaurant && $currentRestaurant.currency) {
    currency = $currentRestaurant.currency;
  }

  async function handleImageUpload(event: Event) {
    try {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        const errorDiv = document.getElementById('dish-item-error');
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
        const errorDiv = document.getElementById('dish-item-error');
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

      editingDish = { ...editingDish, imageUrl: data.url };
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorDiv = document.getElementById('dish-item-error');
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

  async function saveDishChanges() {
    try {
      // Update dish in menuStore
      menuStore.updateDish(dish.id, {
        title: editingDish.title,
        price: editingDish.price,
        description: editingDish.description,
        imageUrl: editingDish.imageUrl
      });
      
      // Also dispatch update event for backward compatibility
      dispatch('update', editingDish);
    } catch (error) {
      console.error('Error updating dish:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  async function deleteDish() {
    try {
      // Delete the dish in menuStore directly
      menuStore.deleteDish(dish.id);
      
      // Dispatch delete event for backward compatibility
      dispatch('delete', dish.id);
      
      // Show success toast
      toasts.success(t('dishDeleteSuccess') || t('deleteSuccess'));
    } catch (error) {
      console.error('Error deleting dish:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }
</script>

<div class="space-y-2">
  <!-- Dish Display -->
  <div class="bg-gray-900/80 backdrop-blur-sm text-white p-4 rounded-lg border border-gray-800/50">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <span class="text-lg font-medium">{dish.title}</span>
          <div class="flex items-center space-x-1">
            <button 
              class="p-1 text-white hover:text-blue-300"
              on:click={() => dispatch('edit')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              class="p-1 text-white hover:text-red-300"
              on:click={deleteDish}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        {#if dish.price}
          <span class="text-sm font-medium">{currency}{dish.price}</span>
        {/if}
        {#if dish.description}
          <p class="text-sm font-normal text-gray-300 mt-1">{dish.description}</p>
        {/if}
      </div>
    </div>
  </div>

  <!-- Edit Form -->
  {#if isEditing}
    <div class="bg-white/40 backdrop-blur-md rounded-lg border border-white/50 p-3">
      <div class="space-y-2">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-xs font-semibold text-gray-600">{t('title')} *</label>
            <input
              type="text"
              class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
              bind:value={editingDish.title}
              required
            />
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-600">{t('price')} *</label>
            <input
              type="text"
              class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
              bind:value={editingDish.price}
              required
            />
          </div>
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600">{t('description')}</label>
          <textarea
            class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 h-16 resize-none font-normal"
            bind:value={editingDish.description}
          />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600">{t('image')}</label>
          <div class="flex items-center space-x-2">
            {#if editingDish.imageUrl}
              <div class="relative">
                <img 
                  src={editingDish.imageUrl} 
                  alt={editingDish.title}
                  class="w-16 h-16 object-cover rounded"
                />
                <button
                  type="button"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  on:click={() => editingDish = { ...editingDish, imageUrl: null }}
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
                  class="px-4 py-2 bg-white/80 text-gray-700 rounded border border-gray-300 hover:bg-white/90 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {t('uploadImage')}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 pt-2">
          <button
            class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 font-medium"
            on:click={() => dispatch('edit')}
          >
            {t('cancel')}
          </button>
          <button
            class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
            on:click={saveDishChanges}
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Error Message -->
  <div id="dish-item-error" class="hidden absolute top-full left-0 mt-2 pt-2 text-sm text-white bg-red-500 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out min-w-[200px] whitespace-nowrap">
    <div class="flex items-center space-x-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <span></span>
    </div>
  </div>
</div> 