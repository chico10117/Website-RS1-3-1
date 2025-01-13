<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category, Dish } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';
  import DishList from '../dishes/DishList.svelte';

  export let category: Category;
  export let index: number;
  export let isSelected: boolean;

  const dispatch = createEventDispatcher<{
    update: { index: number; category: Category };
    delete: number;
    toggle: void;
  }>();

  let isEditing = false;
  let editingName = '';

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  function startEditing() {
    isEditing = true;
    editingName = category.name;
  }

  function cancelEditing() {
    isEditing = false;
    editingName = '';
  }

  async function updateCategoryName() {
    if (!editingName.trim()) return;

    try {
      const updatedCategory = {
        ...category,
        name: editingName.trim(),
        dishes: category.dishes || [] // Preserve dishes
      };

      dispatch('update', {
        index,
        category: updatedCategory
      });
      
      isEditing = false;
    } catch (error) {
      console.error('Error updating category:', error);
      if (error instanceof Error) {
        alert(t('error') + ': ' + error.message);
      }
    }
  }

  async function deleteCategory() {
    if (!confirm(t('confirmDeleteCategory'))) return;
    dispatch('delete', index);
  }

  async function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await updateCategoryName();
    } else if (event.key === 'Escape') {
      cancelEditing();
    }
  }

  function handleDishesUpdate(event: CustomEvent<Dish[]>) {
    const updatedDishes = event.detail;
    
    // Create a new category object with the updated dishes
    const updatedCategory = {
      ...category,
      dishes: updatedDishes
    };

    // Dispatch the update event
    dispatch('update', {
      index,
      category: updatedCategory
    });
  }
</script>

<div class="flex flex-col p-2">
  <!-- Category Header -->
  <div 
    class="flex items-center justify-between bg-white/30 backdrop-blur-sm p-2 rounded cursor-pointer hover:bg-white/40 transition-colors"
    on:click={() => dispatch('toggle')}
  >
    {#if isEditing}
      <div class="flex-1 flex items-center space-x-2">
        <input
          type="text"
          class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 font-normal"
          bind:value={editingName}
          on:keydown={handleKeyPress}
          autofocus
        />
        <button 
          class="p-2 text-green-500 hover:text-green-600"
          on:click|stopPropagation={updateCategoryName}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <button 
          class="p-2 text-gray-500 hover:text-gray-600"
          on:click|stopPropagation={cancelEditing}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    {:else}
      <div class="flex-1 font-medium text-gray-800">{category.name}</div>
      <div class="flex space-x-1">
        <button 
          class="p-1 text-gray-500 hover:text-blue-500"
          on:click|stopPropagation={startEditing}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button 
          class="p-1 text-gray-500 hover:text-red-500"
          on:click|stopPropagation={deleteCategory}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    {/if}
  </div>

  <!-- Dishes List -->
  {#if isSelected}
    <div class="mt-2 pl-4">
      <DishList
        dishes={category.dishes || []}
        categoryId={category.id}
        on:update={handleDishesUpdate}
      />
    </div>
  {/if}
</div> 