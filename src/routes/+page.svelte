<script lang="ts">
  import { X } from "lucide-svelte";
  import { onMount } from 'svelte';
  import type { Restaurant, Category, Dish } from '$lib/types';

  interface Dish {
    _id?: string;
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

  let restaurants: Restaurant[] = [];
  let selectedRestaurant: string | null = null;
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

  let restaurantName = '';

  // Función para guardar categoría
  async function saveCategory(categoryName: string) {
    try {
      if (!restaurantName) {
        throw new Error('Please enter a restaurant name first');
      }

      // Si no hay restaurante seleccionado, crear uno nuevo
      if (!selectedRestaurant) {
        const restaurant = await saveRestaurant();
        selectedRestaurant = restaurant._id;
      }

      const response = await fetch(`/api/restaurants/${selectedRestaurant}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Actualizar las categorías
      categories = data.data.categories;
      return data.data;
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category: ' + error.message);
      throw error;
    }
  }

  // Modificar la función saveDish
  async function saveDish(category: Category, dish: Dish) {
    try {
      if (!selectedRestaurant) {
        throw new Error('Restaurant ID is required');
      }

      const response = await fetch(`/api/restaurants/${selectedRestaurant}/categories/${category._id}/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Actualizar las categorías localmente
      const restaurantIndex = restaurants.findIndex(r => r._id === selectedRestaurant);
      if (restaurantIndex !== -1) {
        restaurants[restaurantIndex] = data.data;
        categories = restaurants[restaurantIndex].categories;
      }

      return data.data.categories.find((c: Category) => c._id === category._id);
    } catch (error) {
      console.error('Error saving dish:', error);
      throw new Error('Error saving dish: ' + error.message);
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
        if (updatedCategory) {
          categories[selectedCategory] = updatedCategory;
          categories = [...categories]; // Trigger reactivity
        }
        
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

  // Add this new function to handle dish updates in the database
  async function updateDishInDB(categoryId: string, dishId: string, dish: Dish) {
    try {
      const response = await fetch(`/api/categories/${categoryId}/dishes/${dishId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error updating dish');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating dish:', error);
      throw error;
    }
  }

  // Update the existing updateDish function
  async function updateDish(categoryIndex: number, dish: Dish) {
    try {
      if (!selectedRestaurant) {
        throw new Error('Restaurant ID is required');
      }

      const category = categories[categoryIndex];
      if (!category || !dish._id) {
        throw new Error('Category or dish not found');
      }

      // Asegurarnos de enviar todos los campos del plato
      const updatedDish = {
        _id: dish._id,
        title: dish.title,
        imageUrl: dish.imageUrl,
        price: dish.price,
        description: dish.description
      };

      const response = await fetch(
        `/api/restaurants/${selectedRestaurant}/categories/${category._id}/dishes/${dish._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedDish)
        }
      );

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Actualizar el estado local inmediatamente con todos los campos
      const updatedCategory = data.data.categories.find((c: Category) => c._id === category._id);
      if (updatedCategory) {
        // Asegurarnos de que todos los platos tengan sus campos actualizados
        const updatedDishes = updatedCategory.dishes.map(d => ({
          _id: d._id,
          title: d.title,
          imageUrl: d.imageUrl,
          price: d.price,
          description: d.description
        }));
        
        updatedCategory.dishes = updatedDishes;
        categories[categoryIndex] = updatedCategory;
        categories = [...categories]; // Forzar la reactividad
      }

      return data.data;
    } catch (error) {
      console.error('Error updating dish:', error);
      throw new Error('Error updating dish: ' + error.message);
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

  async function removeDish(categoryIndex: number, dishIndex: number) {
    try {
      const category = categories[categoryIndex];
      const dish = category.dishes[dishIndex];

      const response = await fetch(`/api/categories/${category._id}/dishes/${dish._id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        categories[categoryIndex].dishes = categories[categoryIndex].dishes.filter((_, i) => i !== dishIndex);
        categories = [...categories]; // Trigger reactivity
        alert('Dish deleted successfully!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
      alert('Error deleting dish: ' + error.message);
    }
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

  // Add new function to update category in database
  async function updateCategoryInDB(categoryId: string, name: string) {
    try {
      console.log('Attempting to update category:', { categoryId, name });

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      console.log('Server response status:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Server error response:', errorData);
          throw new Error(errorData.error || 'Failed to update category');
        } else {
          const textError = await response.text();
          console.error('Non-JSON error response:', textError);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('Server success response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Error updating category');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error in updateCategoryInDB:', error);
      throw error;
    }
  }

  // Update the updateCategoryName function to include more logging
  async function updateCategoryName() {
    if (editingCategoryIndex !== null && editingCategoryName.trim()) {
      try {
        if (!selectedRestaurant) {
          throw new Error('Restaurant ID is required');
        }

        const category = categories[editingCategoryIndex];
        
        const response = await fetch(
          `/api/restaurants/${selectedRestaurant}/categories/${category._id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: editingCategoryName })
          }
        );

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error);
        }

        // Update local state with response from server
        categories = data.data.categories;
        
        // Reset editing state
        cancelEditingCategory();
        alert('Category updated successfully!');
      } catch (error) {
        console.error('Error updating category:', error);
        alert('Error updating category: ' + error.message);
      }
    }
  }

  // Update the handleCategoryEditKeyPress function to handle async operation
  async function handleCategoryEditKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await updateCategoryName();
    } else if (event.key === 'Escape') {
      cancelEditingCategory();
    }
  }

  function cancelEditingCategory() {
    editingCategoryIndex = null;
    editingCategoryName = '';
  }

  // Función para manejar la selección de categoría
  function handleCategorySelect(index: number) {
    selectedCategory = index;
    console.log('Categoría seleccionada:', categories[index]);
  }

  // Función para iniciar la edición
  function startEditing(category: Category) {
    editingCategory = category;
    editingName = category.name;
  }

  // Función para guardar la edición
  async function saveEdit() {
    if (!editingCategory) return;

    try {
      const response = await fetch(`/api/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editingName })
      });

      const result = await response.json();

      if (result.success) {
        // Actualizar la lista local de categorías
        categories = categories.map(cat => 
          cat._id === editingCategory?._id 
            ? { ...cat, name: editingName }
            : cat
        );
        
        // Resetear el estado de edición
        editingCategory = null;
        editingName = "";
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category: ' + error.message);
    }
  }

  // Función para cancelar la edición
  function cancelEdit() {
    editingCategory = null;
    editingName = "";
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

  async function deleteCategory(categoryId: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return;
    }

    try {
      if (!selectedRestaurant) {
        throw new Error('Restaurant ID is required');
      }

      const response = await fetch(
        `/api/restaurants/${selectedRestaurant}/categories/${categoryId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Actualizar el estado local con la respuesta del servidor
      categories = data.data.categories;
      
      // Si la categoría eliminada era la seleccionada, deseleccionar
      if (selectedCategory !== null) {
        const deletedIndex = categories.findIndex(cat => cat._id === categoryId);
        if (selectedCategory === deletedIndex) {
          selectedCategory = null;
        }
      }

      alert('Categoría eliminada exitosamente!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar categoría: ' + error.message);
    }
  }

  // Función onMount para cargar los restaurantes al iniciar
  onMount(async () => {
    try {
      const response = await fetch('/api/restaurants');
      const data = await response.json();
      
      if (data.success) {
        restaurants = data.data;
        console.log('Loaded restaurants:', restaurants);
      } else {
        throw new Error(data.error || 'Failed to load restaurants');
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      alert('Error loading restaurants: ' + error.message);
    }
  });

  // Agregar esta función para manejar la selección del restaurante
  async function handleRestaurantCreated(restaurant: Restaurant) {
    selectedRestaurant = restaurant._id;
    categories = restaurant.categories;
    console.log('Selected restaurant:', selectedRestaurant);
  }

  // Modificar la función saveRestaurant existente
  async function saveRestaurant() {
    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: restaurantName
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      return data.data;
    } catch (error) {
      console.error('Error saving restaurant:', error);
      alert('Error saving restaurant: ' + error.message);
      throw error;
    }
  }

  // Función para manejar la edición de un plato
  async function handleEditDish(categoryIndex: number | null, dish: Dish) {
    if (categoryIndex === null) {
      alert('Por favor selecciona una categoría');
      return;
    }
    
    try {
      await updateDish(categoryIndex, dish);
      
      // Forzar una actualización de la vista
      categories = [...categories];
      
      // Limpiar el formulario de edición
      editingDish = { title: '', imageUrl: '', price: '', description: '' };
      alert('Plato actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating dish:', error);
      alert('Error al actualizar plato: ' + error.message);
    }
  }

  async function deleteDish(categoryId: string, dishId: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar este plato?')) {
      return;
    }

    try {
      if (!selectedRestaurant) {
        throw new Error('Restaurant ID is required');
      }

      const response = await fetch(
        `/api/restaurants/${selectedRestaurant}/categories/${categoryId}/dishes/${dishId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Actualizar el estado local con la respuesta del servidor
      categories = data.data.categories;
      
      alert('Plato eliminado exitosamente!');
    } catch (error) {
      console.error('Error deleting dish:', error);
      alert('Error al eliminar plato: ' + error.message);
    }
  }
</script>
<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">QR Menu Creator</h1>
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
   <!-- Menu Name Section -->
   <div class="space-y-2">
    <label class="block text-sm font-medium mb-1">Restaurant Name</label>
    <input
      type="text"
      bind:value={restaurantName}
      placeholder="Enter menu name"
      class="w-full p-2 border rounded"
    />
  </div>
  <div class="shadow p-0 mb-3 space-y-3">
    <h2 class="shadow p-1 block text-sm font-medium mb-1">Category</h2>
    <div class="">
      <input
        type="text"
        class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Category name"
        bind:value={newCategory}
        on:keydown={handleKeyPress}
      />
      <button 
        class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:click={addCategory}
      >
        Add
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-white rounded-lg shadow p-0">
      <h2 class="shadow p-1 block text-sm font-medium mb-1">Categories</h2>
      {#each categories as category, index}
        <div class="flex items-center justify-between p-2">
          {#if editingCategoryIndex === index}
            <!-- Edit mode -->
            <div class="flex-1 flex items-center space-x-2">
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
            <div class="flex items-center gap-2">
              <button
                class="shadow p-2 font-medium {selectedCategory === index ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg"
                on:click={() => selectedCategory = index}
              >
                {category.name}
              </button>
              <div class="flex gap-1">
                <button 
                  class="p-1 text-gray-500 hover:text-blue-500"
                  on:click={() => startEditingCategory(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                  </svg>
                </button>
                <button 
                  class="p-1 text-gray-500 hover:text-red-500"
                  on:click={() => deleteCategory(category._id)}
                >
                  <X class="h-4 w-4" />
                </button>
              </div>
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
     
      </div>
    </div>
  </div>

  <!-- Menu Preview section -->
  <div class="bg-white rounded-lg shadow p-1 mt-1">
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
                    on:click={() => handleEditDish(selectedCategory, editingDish)}
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
                    on:click={() => deleteDish(category._id, dish._id)}
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {/each}
        <!-- Add divider line except for the last category -->
        {#if categoryIndex !== categories.length - 1}
          <div class="border-b border-gray-200 my-4"></div>
        {/if}
      </div>
    {/each}
  </div>
</div> 