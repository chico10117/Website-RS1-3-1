<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category, Dish } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores/menu-store';
  import DishList from '../dishes/DishList.svelte';
  import { toasts } from '$lib/stores/toast';
  import { currentRestaurant } from '$lib/stores/restaurant';

  export let category: Category;
  export let index: number;
  export let isSelected: boolean;
  export let currency: string = '€';

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

  // Use the currency from currentRestaurant if available
  $: if ($currentRestaurant && $currentRestaurant.currency) {
    currency = $currentRestaurant.currency;
  }

  function startEditing() {
    isEditing = true;
    editingName = category.name;
    // Expand the category if it's not already selected
    if (!isSelected) {
      dispatch('toggle');
    }
  }

  function cancelEditing() {
    isEditing = false;
    editingName = '';
    // Note: We are not collapsing on cancel, as per the thought process.
    // If the user expanded it manually before editing, collapsing might be unexpected.
  }

  async function updateCategoryName() {
    if (!editingName.trim()) return;

    try {
      // Update the category in menuStore directly
      menuStore.updateCategory(category.id, editingName.trim());
      
      // Create updated category object for the parent component
      const updatedCategory = {
        ...category,
        name: editingName.trim(),
        dishes: category.dishes || [] // Preserve dishes
      };

      // Dispatch update event for backward compatibility
      dispatch('update', {
        index,
        category: updatedCategory
      });
      
      isEditing = false;
      // Collapse the category after successful update if it was selected
      if (isSelected) {
        dispatch('toggle');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  async function deleteCategory() {
    // Remove the confirmation dialog and directly delete the category
    try {
      // Delete the category in menuStore directly
      menuStore.deleteCategory(category.id);
      
      // Dispatch delete event for backward compatibility
      dispatch('delete', index);
      
      // Show success toast
      toasts.success(t('categoryDeleteSuccess') || t('deleteSuccess'));
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
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
    class="flex items-center justify-between bg-white/30 backdrop-blur-sm p-2 rounded hover:bg-white/40 transition-colors"
  >
    <!-- Drag Handle (draggable by default via parent) -->
    <div class="category-drag-handle mr-2 cursor-grab text-gray-500 hover:text-gray-700 p-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </div>

    <!-- Toggle Button (prevent drag) -->
    <button 
      class="mr-2 p-1 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center h-6 w-6"
      on:click|stopPropagation={() => dispatch('toggle')}
      draggable="false"
    >
      {#if isSelected}
        <!-- Minus icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
        </svg>
      {:else}
        <!-- Plus icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      {/if}
    </button>

    {#if isEditing}
      <!-- Editing View (prevent drag) -->
      <div class="flex-1 flex items-center space-x-2" draggable="false">
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
      <!-- Display View (prevent drag on name and actions) -->
      <div class="flex-1 font-medium text-gray-800" draggable="false">{category.name}</div>
      <div class="flex space-x-1" draggable="false">
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
        {currency}
        on:update={handleDishesUpdate}
      />
    </div>
  {/if}
</div> 