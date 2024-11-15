<script lang="ts">
  import { X } from "lucide-svelte";
  import { onMount } from 'svelte';

  interface Dish {
    title: string;
    imageUrl: string;
    price: string;
    description: string;
  }

  
  interface Category {
    _id: string;
    name: string;
    dishes: Dish[];
  }

  let categories: Category[] = [];
  let newCategory = '';
  let selectedCategory: number | null = null;
  let newDish: Dish = { title: '', imageUrl: '', price: '', description: '' };
  let editingDish: Dish = { title: '', imageUrl: '', price: '', description: '' };
  let editingDishIndex: number | null = null;
  let isEditing = false;

  // Add new state variables for menu details
  let menuName = '';
  let menuLogo = '';

  // Add these variables for category editing
  let editingCategoryIndex: number | null = null;
  let editingCategoryName = '';

  // Función para guardar categoría
  async function saveCategory(categoryName: string) {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Agregar la nueva categoría al array existente
      categories = [...categories, data.data];
      console.log('Updated categories after save:', categories);
      
      return data.data;
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category: ' + error.message);
      throw error;
    }
  }

  // Función para guardar plato en la base de datos
  async function saveDish(category: Category, dish: Dish) {
    try {
      if (!category._id) {
        console.error('Category without ID:', category);
        throw new Error('Category ID is missing');
      }

      console.log('Saving dish:', {
        categoryId: category._id,
        dish: dish
      });

      const response = await fetch(`/api/categories/${category._id}/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish)
      });

      const data = await response.json();
      console.log('Server response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Error saving dish');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error saving dish:', error);
      throw error;
    }
  }

  async function addCategory() {
    if (newCategory.trim()) {
      try {
        await saveCategory(newCategory);
        newCategory = '';
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      addCategory();
    }
  }

  // Función para agregar plato (combina la funcionalidad local y la persistencia)
  async function addDish() {
    if (selectedCategory !== null && newDish.title.trim()) {
      try {
        const category = categories[selectedCategory];
        
        // Primero actualizamos la base de datos
        const updatedCategory = await saveDish(category, { ...newDish });
        
        // Luego actualizamos el estado local
        categories[selectedCategory] = updatedCategory;
        categories = [...categories]; // Trigger reactivity
        
        // Reset form
        newDish = { title: '', imageUrl: '', price: '', description: '' };
        
        alert('Plato guardado exitosamente!');
      } catch (error) {
        console.error('Error adding dish:', error);
        alert('Error al guardar plato: ' + error.message);
      }
    } else {
      alert('Por favor selecciona una categoría y completa al menos el título del plato');
    }
  }

  function updateDish() {
    if (selectedCategory !== null && editingDishIndex !== null) {
      categories[selectedCategory].dishes[editingDishIndex] = { ...editingDish };
      categories = categories;
      resetEditForm();
    }
  }

  function editDish(dishIndex: number) {
    if (selectedCategory !== null) {
      const dish = categories[selectedCategory].dishes[dishIndex];
      editingDish = { ...dish };
      editingDishIndex = dishIndex;
      isEditing = true;
    }
  }

  function resetEditForm() {
    editingDish = { title: '', imageUrl: '', price: '', description: '' };
    editingDishIndex = null;
    isEditing = false;
  }

  function removeCategory(index: number) {
    categories = categories.filter((_, i) => i !== index);
    if (selectedCategory === index) {
      selectedCategory = null;
    }
  }

  function removeDish(categoryIndex: number, dishIndex: number) {
    categories[categoryIndex].dishes = categories[categoryIndex].dishes.filter((_, i) => i !== dishIndex);
    categories = categories;
  }

  function handleImageUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      newDish.imageUrl = URL.createObjectURL(file);
      newDish = newDish;
    }
  }

  function handleDishKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      addDish();
    }
  }

  function handleLogoUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      menuLogo = URL.createObjectURL(file);
    }
  }

  function startEditingCategory(index: number) {
    editingCategoryIndex = index;
    editingCategoryName = categories[index].name;
  }

  function updateCategoryName() {
    if (editingCategoryIndex !== null && editingCategoryName.trim()) {
      categories[editingCategoryIndex].name = editingCategoryName;
      categories = categories;
      cancelEditingCategory();
    }
  }

  function cancelEditingCategory() {
    editingCategoryIndex = null;
    editingCategoryName = '';
  }

  function handleCategoryEditKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      updateCategoryName();
    } else if (event.key === 'Escape') {
      cancelEditingCategory();
    }
  }

  // Función para manejar la selección de categoría
  function handleCategorySelect(index: number) {
    selectedCategory = index;
    console.log('Categoría seleccionada:', categories[index]);
  }

  onMount(async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (data.success) {
        categories = data.data;
        console.log('Loaded categories:', categories);
      } else {
        throw new Error(data.error || 'Failed to load categories');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Error loading categories: ' + error.message);
    }
  });
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">QR Menu Creator</h1>
  
  <div class="bg-white rounded-lg shadow p-4 mb-4">
    <h2 class="text-xl font-semibold mb-4">Add Category</h2>
    <div class="flex items-center space-x-2">
      <input
        type="text"
        class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Category name"
        bind:value={newCategory}
        on:keydown={handleKeyPress}
      />
      <button 
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:click={addCategory}
      >
        Add
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-xl font-semibold mb-4">Categories</h2>
      {#each categories as category, index}
        <div class="flex items-center justify-between mb-2">
          {#if editingCategoryIndex === index}
            <!-- Edit mode -->
            <div class="flex-1 flex items-center space-x-2 mr-2">
              <input
                type="text"
                class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                bind:value={editingCategoryName}
                on:keydown={handleCategoryEditKeyPress}
                autofocus
              />
              <button 
                class="p-2 text-green-500 hover:text-green-600"
                on:click={updateCategoryName}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <button 
                class="p-2 text-gray-500 hover:text-gray-600"
                on:click={cancelEditingCategory}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          {:else}
            <!-- Display mode -->
            <button
              class="flex-1 px-4 py-2 text-left {selectedCategory === index ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg mr-2"
              on:click={() => selectedCategory = index}
            >
              {category.name}
            </button>
            <div class="flex space-x-2">
              <button 
                class="p-2 text-gray-500 hover:text-blue-500"
                on:click={() => startEditingCategory(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
              </button>
              <button 
                class="p-2 text-gray-500 hover:text-red-500"
                on:click={() => removeCategory(index)}
              >
                <X class="h-4 w-4" />
              </button>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    {#if selectedCategory !== null}
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-xl font-semibold mb-4">Add Dish to {categories[selectedCategory].name}</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              bind:value={newDish.title}
              on:keydown={handleDishKeyPress}
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              class="w-full"
              on:change={handleImageUpload}
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Price</label>
            <input
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              bind:value={newDish.price}
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              bind:value={newDish.description}
            />
          </div>
          <div class="flex space-x-2">
            <button 
              class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              on:click={addDish}
            >
              Add Dish
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Add this section before Menu Preview -->
  <div class="bg-white rounded-lg shadow p-4 mt-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Logo Upload Section -->
      <div class="space-y-2">
        <label class="block text-sm font-medium mb-1">Menu Logo</label>
        <div class="relative">
          <button 
            class="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
            onclick="document.getElementById('logo-input').click()"
          >
            <span class="text-xs text-gray-500">Change logo</span>
          </button>
          <input
            id="logo-input"
            type="file"
            accept="image/*"
            class="hidden"
            on:change={handleLogoUpload}
          />
        </div>
      </div>

      <!-- Menu Name Section -->
      <div class="space-y-2">
        <label class="block text-sm font-medium mb-1">Menu Name</label>
        <input
          type="text"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter menu name"
          bind:value={menuName}
        />
      </div>
    </div>
  </div>

  <!-- Menu Preview section -->
  <div class="bg-white rounded-lg shadow p-4 mt-4">
    <h2 class="text-xl font-semibold mb-4">Menu Preview</h2>
    
    <!-- Logo and Menu Name Preview -->
    <div class="flex items-center justify-between mb-6 border-b pb-4">
      <div class="flex items-center gap-4">
        {#if menuLogo}
          <img 
            src={menuLogo} 
            alt="Menu logo" 
            class="w-16 h-16 object-contain"
          />
        {/if}
        {#if menuName}
          <h1 class="text-2xl font-bold">{menuName}</h1>
        {/if}
      </div>
    </div>

    <!-- Rest of your menu preview content -->
    {#each categories as category, categoryIndex}
      <div class="mb-4">
        <h3 class="text-xl font-semibold mb-2">{category.name}</h3>
        {#each category.dishes as dish, dishIndex}
          <div class="mb-2 p-2 border rounded-lg">
            {#if isEditing && editingDishIndex === dishIndex && selectedCategory === categoryIndex}
              <!-- Edit Form -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    bind:value={editingDish.title}
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    class="w-full"
                    on:change={handleImageUpload}
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="text"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    bind:value={editingDish.price}
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    bind:value={editingDish.description}
                  />
                </div>
                <div class="flex space-x-2">
                  <button 
                    class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    on:click={updateDish}
                  >
                    Update Dish
                  </button>
                  <button 
                    class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    on:click={resetEditForm}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            {:else}
              <!-- Dish Display -->
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium">{dish.title}</h4>
                  <p class="text-sm text-gray-600">{dish.description}</p>
                  <p class="font-bold">{dish.price}</p>
                </div>
                {#if dish.imageUrl}
                  <img src={dish.imageUrl} alt={dish.title} class="w-20 h-20 object-cover rounded-lg" />
                {/if}
                <div class="flex space-x-2">
                  <button 
                    class="p-2 text-gray-500 hover:text-blue-500"
                    on:click={() => {
                      selectedCategory = categoryIndex;
                      editDish(dishIndex);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                    </svg>
                  </button>
                  <button 
                    class="p-2 text-gray-500 hover:text-red-500"
                    on:click={() => removeDish(categoryIndex, dishIndex)}
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div> 