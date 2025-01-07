<script lang="ts">
  import { X } from "lucide-svelte";
  import { onMount } from 'svelte';
  import type { Restaurant, Category, Dish } from '$lib/types';

  let restaurants: Restaurant[] = [];
  let selectedRestaurant: string | null = null;
  let categories: Category[] = [];
  let newCategory = '';
  let selectedCategory: number | null = null;
  let newDish: Dish = { 
    id: '',
    title: '', 
    imageUrl: '', 
    price: '', 
    description: '', 
    categoryId: '' 
  };
  let editingDish: Dish = { 
    id: '',
    title: '', 
    imageUrl: '', 
    price: '', 
    description: '', 
    categoryId: '' 
  };
  let editingDishIndex: number | null = null;
  let isEditing = false;

  let menuName = '';
  let menuLogo = '';
  let editingCategoryIndex: number | null = null;
  let editingCategoryName = '';
  let restaurantName = '';
  let isUploading = false;
  let isEditingRestaurant = false;
  let editingRestaurantName = '';
  let currentCategoryIndex: number | null = null;

  // Función para guardar categoría
  async function saveCategory(categoryName: string) {
    try {
      if (!restaurantName) {
        throw new Error('Please enter a restaurant name first');
      }

      // Si no hay restaurante seleccionado, crear uno nuevo
      if (!selectedRestaurant) {
        const restaurant = await saveRestaurant();
        selectedRestaurant = restaurant.id;
      }

      console.log('Saving category for restaurant:', selectedRestaurant);

      // Verificar si la categoría ya existe
      const categoryExists = categories.some(cat => cat.name === categoryName);
      if (categoryExists) {
        throw new Error('Category already exists');
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

      return data.data;
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert('Error saving category: ' + error.message);
      throw error;
    }
  }

  // Función para obtener un restaurante con sus categorías
  async function getRestaurantWithCategories(restaurantId: string) {
    try {
      const response = await fetch(`/api/restaurants?id=${restaurantId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error: any) {
      console.error('Error getting restaurant:', error);
      throw error;
    }
  }

  // Modificar la función saveDish
  async function saveDish(category: Category, dish: Dish) {
    try {
      if (!selectedRestaurant) {
        throw new Error('Restaurant ID is required');
      }

      const dishData = {
        ...dish,
        categoryId: category.id
      };

      const response = await fetch(`/api/restaurants/${selectedRestaurant}/categories/${category.id}/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dishData)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Actualizar las categorías
      const updatedRestaurant = await getRestaurantWithCategories(selectedRestaurant);
      if (updatedRestaurant) {
        categories = updatedRestaurant.categories || [];
      }

      return data.data;
    } catch (error: any) {
      console.error('Error saving dish:', error);
      throw new Error('Error saving dish: ' + error.message);
    }
  }

  async function addCategory() {
    if (newCategory.trim()) {
      try {
        const savedCategory = await saveCategory(newCategory);
        if (savedCategory) {
          // Actualizar las categorías sin duplicar
          const categoryExists = categories.some(cat => cat.name === savedCategory.name);
          if (!categoryExists) {
            categories = [...categories, { ...savedCategory, dishes: [] }];
          }
          newCategory = ''; // Limpiar el input después de guardar
        }
      } catch (error: any) {
        console.error('Error adding category:', error);
        alert('Error adding category: ' + error.message);
      }
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      addCategory();
    }
  }

  // Función para agregar plato
  async function addDish() {
    if (selectedCategory !== null && newDish.title.trim()) {
      try {
        const category = categories[selectedCategory];
        
        // Primero actualizamos la base de datos
        await saveDish(category, newDish);
        
        // Reset form
        newDish = { 
          id: '',
          title: '', 
          imageUrl: '', 
          price: '', 
          description: '', 
          categoryId: '' 
        };
        // Deseleccionar la categoría para cerrar el formulario
        selectedCategory = null;
        
        alert('Plato guardado exitosamente!');
      } catch (error: any) {
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
      if (!category || !dish.id) {
        throw new Error('Category or dish not found');
      }

      // Asegurarnos de enviar todos los campos del plato
      const updatedDish = {
        id: dish.id,
        title: dish.title,
        imageUrl: dish.imageUrl,
        price: dish.price,
        description: dish.description,
        categoryId: category.id
      };

      const response = await fetch(
        `/api/restaurants/${selectedRestaurant}/categories/${category.id}/dishes/${dish.id}`,
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

      // Actualizar las categorías
      const updatedRestaurant = await getRestaurantWithCategories(selectedRestaurant);
      if (updatedRestaurant) {
        categories = updatedRestaurant.categories || [];
      }

      return data.data;
    } catch (error) {
      console.error('Error updating dish:', error);
      if (error instanceof Error) {
        throw new Error('Error updating dish: ' + error.message);
      }
      throw new Error('Error updating dish');
    }
  }

  // Función para iniciar la edición de un plato
  function editDish(dish: any, categoryId: string, index: number) {
    console.log('Edit dish called with:', { dish, categoryId, index });
    
    // Si ya estamos editando este plato, cancelamos la edición
    if (isEditing && editingDish.id === (dish.id || dish._id)) {
      cancelEditDish();
      return;
    }
    
    // Guardamos el índice de la categoría actual
    currentCategoryIndex = index;
    
    // Iniciamos la edición con todos los datos necesarios
    isEditing = true;
    editingDish = {
      id: dish.id || dish._id,
      title: dish.title || '',
      price: dish.price || '',
      description: dish.description || '',
      imageUrl: dish.imageUrl || '',
      categoryId: categoryId
    };

    console.log('Editing dish state initialized:', editingDish);
  }

  function cancelEditDish() {
    isEditing = false;
    currentCategoryIndex = null;
    editingDish = {
      id: '',
      title: '',
      price: '',
      description: '',
      imageUrl: '',
      categoryId: ''
    };
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
      if (!category?.dishes) return;
      
      const dish = category.dishes[dishIndex];
      if (!dish) return;

      const response = await fetch(`/api/restaurants/${selectedRestaurant}/categories/${category.id}/dishes/${dish.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Actualizar las categorías
      const updatedRestaurant = await getRestaurantWithCategories(selectedRestaurant);
      if (updatedRestaurant) {
        categories = updatedRestaurant.categories || [];
      }

      return data.data;
    } catch (error) {
      console.error('Error removing dish:', error);
      if (error instanceof Error) {
        throw new Error('Error removing dish: ' + error.message);
      }
      throw new Error('Error removing dish');
    }
  }

  async function handleImageUpload(e: Event) {
    try {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading dish image...'); // Debug log

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadResult = await uploadResponse.json();
      console.log('Upload response:', uploadResult); // Debug log
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Update the dish image URL
      if (isEditing && editingDish) {
        editingDish.imageUrl = uploadResult.url;
        editingDish = editingDish; // Trigger reactivity
      } else {
        newDish.imageUrl = uploadResult.url;
        newDish = newDish; // Trigger reactivity
      }

      console.log('Image URL saved:', uploadResult.url); // Debug log

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
    }
  }

  function handleDishKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      addDish();
    }
  }

  async function handleLogoUpload(event: Event) {
    try {
      isUploading = true;
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (!file) {
        menuLogo = 'Add logo';
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file...'); // Debug log

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadResult = await uploadResponse.json();
      console.log('Upload response:', uploadResult); // Debug log
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // If we don't have a restaurant yet, create one
      if (!selectedRestaurant) {
        const createResponse = await fetch('/api/restaurants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: restaurantName || 'New Restaurant',
            logo: uploadResult.url
          })
        });

        const createResult = await createResponse.json();
        if (!createResult.success) {
          throw new Error(createResult.error);
        }

        selectedRestaurant = createResult.data._id;
        if (!restaurantName) {
          restaurantName = 'New Restaurant';
        }
      } else {
        // Update existing restaurant with new logo
        const updateResponse = await fetch(`/api/restaurants/${selectedRestaurant}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logo: uploadResult.url })
        });

        const updateResult = await updateResponse.json();
        if (!updateResult.success) {
          throw new Error(updateResult.error);
        }
      }

      menuLogo = uploadResult.url;
      console.log('Logo URL saved:', menuLogo); // Debug log
      alert('Logo updated successfully!');

    } catch (error: any) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo: ' + error.message);
      menuLogo = 'Add logo';
    } finally {
      isUploading = false;
    }
  }

  async function updateRestaurantLogo(restaurantId: string, logoUrl: string) {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logo: logoUrl })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Update local state if needed
      const restaurantIndex = restaurants.findIndex(r => r._id === restaurantId);
      if (restaurantIndex !== -1) {
        restaurants[restaurantIndex].logo = logoUrl;
        restaurants = [...restaurants];
      }

    } catch (error) {
      console.error('Error updating restaurant logo:', error);
      throw error;
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

  // Agregar esta función para manejar la selección del restaurante
  async function handleRestaurantCreated(restaurant: Restaurant) {
    selectedRestaurant = restaurant.id;
    categories = restaurant.categories || [];
    console.log('Selected restaurant:', selectedRestaurant);
  }

  // Modificar la función saveRestaurant existente
  async function saveRestaurant() {
    try {
      if (!restaurantName) {
        throw new Error('Restaurant name is required');
      }

      const restaurantData = {
        name: restaurantName,
        logo: menuLogo || null
      };

      console.log('Saving restaurant with data:', restaurantData);

      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurantData)
      });

      const data = await response.json();
      console.log('Save response:', data);
      
      if (!data.success) {
        throw new Error(data.error);
      }

      selectedRestaurant = data.data.id;
      categories = []; // Inicializar categorías vacías para el nuevo restaurante
      return data.data;
    } catch (error: any) {
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
      
      // Limpiar el formulario de edición y cerrar la vista de edición
      editingDish = { 
        id: '',
        title: '', 
        imageUrl: '', 
        price: '', 
        description: '', 
        categoryId: '' 
      };
      editingDishIndex = null;
      isEditing = false;
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

  async function startEditingRestaurant() {
    isEditingRestaurant = true;
    editingRestaurantName = restaurantName;
  }

  async function updateRestaurantName() {
    if (!selectedRestaurant || !editingRestaurantName.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${selectedRestaurant}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingRestaurantName })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      restaurantName = editingRestaurantName;
      isEditingRestaurant = false;
      
      // Update local state
      const restaurantIndex = restaurants.findIndex(r => r._id === selectedRestaurant);
      if (restaurantIndex !== -1) {
        restaurants[restaurantIndex].name = editingRestaurantName;
        restaurants = [...restaurants];
      }

      alert('Restaurant name updated successfully!');
    } catch (error) {
      console.error('Error updating restaurant name:', error);
      alert('Error updating restaurant name: ' + error.message);
    }
  }

  async function deleteRestaurant() {
    if (!selectedRestaurant || !confirm('Are you sure you want to delete this restaurant?')) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${selectedRestaurant}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Update local state
      restaurants = restaurants.filter(r => r._id !== selectedRestaurant);
      selectedRestaurant = null;
      restaurantName = '';
      categories = [];

      alert('Restaurant deleted successfully!');
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      alert('Error deleting restaurant: ' + error.message);
    }
  }

  function cancelEditingRestaurant() {
    isEditingRestaurant = false;
    editingRestaurantName = '';
  }

  async function handleRestaurantEditKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await updateRestaurantName();
    } else if (event.key === 'Escape') {
      cancelEditingRestaurant();
    }
  }

  function toggleCategory(index: number) {
    if (selectedCategory === index) {
      selectedCategory = null; // Si la categoría ya está seleccionada, la deseleccionamos
    } else {
      selectedCategory = index; // Si es una categoría diferente, la seleccionamos
    }
  }

  // Función para guardar los cambios
  async function saveDishChanges() {
    try {
      if (!selectedRestaurant) {
        throw new Error('No restaurant selected');
      }

      if (currentCategoryIndex === null) {
        throw new Error('No category selected');
      }

      const category = categories[currentCategoryIndex];
      console.log('Selected category:', category);

      const categoryId = category.id || category._id;
      console.log('Category ID:', categoryId);

      if (!categoryId) {
        throw new Error('Invalid category ID');
      }

      if (!editingDish.id) {
        throw new Error('No dish selected');
      }

      const dishData = {
        title: editingDish.title.trim(),
        price: editingDish.price.trim(),
        description: editingDish.description.trim(),
        imageUrl: editingDish.imageUrl || '',
        categoryId: categoryId // Añadimos el categoryId al payload
      };

      console.log('Sending request with:', {
        url: `/api/restaurants/${selectedRestaurant}/categories/${categoryId}/dishes/${editingDish.id}`,
        method: 'PUT',
        data: dishData
      });

      const response = await fetch(
        `/api/restaurants/${selectedRestaurant}/categories/${categoryId}/dishes/${editingDish.id}`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(dishData)
        }
      );

      // Log de la respuesta completa
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // Intentar parsear la respuesta como JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid server response');
      }

      if (!data.success) {
        console.error('Server returned error:', data);
        throw new Error(data.error || 'Failed to update dish');
      }

      // Actualizar el estado local con los datos actualizados
      if (data.data && data.data.categories) {
        categories = data.data.categories;
      } else {
        // Si no recibimos las categorías actualizadas, actualizamos manualmente
        const updatedCategories = [...categories];
        const category = updatedCategories[currentCategoryIndex];
        if (category && category.dishes) {
          const dishIndex = category.dishes.findIndex(d => (d.id || d._id) === editingDish.id);
          if (dishIndex !== -1) {
            category.dishes[dishIndex] = {
              ...category.dishes[dishIndex],
              ...dishData
            };
          }
        }
        categories = updatedCategories;
      }
      
      // Limpiar el formulario
      cancelEditDish();
      alert('Plato actualizado exitosamente!');
    } catch (error: any) {
      console.error('Error updating dish:', error);
      alert('Error al actualizar plato: ' + (error.message || 'Error desconocido'));
    }
  }
</script>
<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">QR Menu Creator</h1>
  
  <div class="flex gap-8">
    <!-- Left Section - Menu Editor -->
    <div class="flex-1 p-8">
      <!-- Restaurant Name Section -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-1">Restaurant Name</label>
        <input
          type="text"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter restaurant name"
          bind:value={restaurantName}
        />
      </div>

      <!-- Menu Logo Section -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-1">Menu Logo</label>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <button 
              class="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
              on:click={() => document.getElementById('logo-input').click()}
            >
              {#if menuLogo}
                <img 
                  src={menuLogo} 
                  alt="Menu logo" 
                  class="w-full h-full object-cover rounded-lg"
                />
              {:else}
                <span class="text-xs text-gray-500">Add logo</span>
              {/if}
            </button>
            <input
              id="logo-input"
              type="file"
              accept="image/*"
              class="hidden"
              on:change={handleLogoUpload}
            />
          </div>
          {#if menuLogo}
            <button 
              class="p-2 text-red-500 hover:text-red-700"
              on:click={() => menuLogo = ''}
            >
              <X size={20} />
            </button>
          {/if}
        </div>
      </div>

      <!-- Categories Section -->
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

        <!-- Categories List -->
        <div class="bg-white rounded-lg shadow p-0">
          <h2 class="shadow p-1 block text-sm font-medium mb-1">Categories</h2>
          {#each categories as category, categoryIndex}
            <div class="flex flex-col p-2">
              <!-- Category Header -->
              <div 
                class="flex items-center justify-between bg-gray-100 p-2 rounded cursor-pointer"
                on:click={() => toggleCategory(categoryIndex)}
              >
                {#if editingCategoryIndex === categoryIndex}
                  <!-- Edit mode for category name -->
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
                      on:click|stopPropagation={updateCategoryName}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    <button 
                      class="p-2 text-gray-500 hover:text-gray-600"
                      on:click|stopPropagation={cancelEditingCategory}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                {:else}
                  <div class="flex-1 font-medium">{category.name}</div>
                  <div class="flex space-x-1">
                    <button 
                      class="p-1 text-gray-500 hover:text-blue-500"
                      on:click|stopPropagation={() => startEditingCategory(categoryIndex)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                      </svg>
                    </button>
                    <button 
                      class="p-1 text-gray-500 hover:text-red-500"
                      on:click|stopPropagation={() => deleteCategory(category._id)}
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                {/if}
              </div>

              <!-- Dishes for this category -->
              <div class="mt-2 space-y-2 pl-4">
                {#if category.dishes && category.dishes.length > 0}
                  {#each category.dishes as dish}
                    <div class="space-y-2">
                      <!-- Dish Display -->
                      <div class="bg-black text-white p-4 rounded">
                        <div class="flex items-center justify-between">
                          <div class="flex-1">
                            <div class="flex items-center justify-between">
                              <span class="text-lg">{dish.title}</span>
                              <button 
                                class="p-1 text-white hover:text-blue-300"
                                on:click={() => editDish(dish, category.id || category._id, categoryIndex)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                                </svg>
                              </button>
                            </div>
                            {#if dish.price}
                              <span class="text-sm">${dish.price}</span>
                            {/if}
                            {#if dish.description}
                              <p class="text-sm text-gray-300 mt-1">{dish.description}</p>
                            {/if}
                          </div>
                        </div>
                      </div>

                      <!-- Edit Form (appears when editing this specific dish) -->
                      {#if isEditing && editingDish.id === dish.id}
                        <div class="bg-white rounded shadow p-4">
                          <h3 class="text-sm font-medium mb-3">Edit Dish</h3>
                          <div class="space-y-3">
                            <div class="flex flex-col gap-1">
                              <label class="text-sm">Title *</label>
                              <input
                                type="text"
                                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                bind:value={editingDish.title}
                                required
                              />
                            </div>
                            <div class="flex flex-col gap-1">
                              <label class="text-sm">Price *</label>
                              <input
                                type="text"
                                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                bind:value={editingDish.price}
                                required
                              />
                            </div>
                            <div class="flex flex-col gap-1">
                              <label class="text-sm">Description</label>
                              <textarea
                                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                bind:value={editingDish.description}
                              />
                            </div>
                            <div class="flex flex-col gap-1">
                              <label class="text-sm">Image</label>
                              {#if editingDish.imageUrl}
                                <img 
                                  src={editingDish.imageUrl} 
                                  alt={editingDish.title}
                                  class="w-32 h-32 object-cover rounded-lg mb-2"
                                />
                              {/if}
                              <input
                                type="file"
                                accept="image/*"
                                class="w-full"
                                on:change={handleImageUpload}
                              />
                            </div>
                            <div class="flex justify-end space-x-2">
                              <button
                                class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                                on:click={cancelEditDish}
                              >
                                Cancel
                              </button>
                              <button
                                class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                on:click={saveDishChanges}
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </div>
                      {/if}
                    </div>
                  {/each}
                {/if}
              </div>

              <!-- Add Dish Form (shows only for selected category) -->
              {#if selectedCategory === categoryIndex}
                <div class="mt-4 bg-white rounded shadow p-4">
                  <h3 class="text-sm font-medium mb-3">Add Dish to {category.name}</h3>
                  <div class="space-y-3">
                    <div class="flex flex-col gap-1">
                      <label class="text-sm">Title</label>
                      <input
                        type="text"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        bind:value={newDish.title}
                      />
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-sm">Price</label>
                      <input
                        type="text"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        bind:value={newDish.price}
                      />
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-sm">Description</label>
                      <textarea
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                        bind:value={newDish.description}
                      />
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-sm">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        class="w-full"
                        on:change={handleImageUpload}
                      />
                    </div>
                    <button
                      class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      on:click={addDish}
                    >
                      Add Dish
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Vertical Divider -->
    <div class="w-px bg-gray-200 mx-8"></div>

    <!-- Right Section - Preview -->
    <div class="flex-1 p-8 bg-gray-50">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-6">Menu Preview</h2>
        
        <!-- Restaurant Info -->
        <div class="flex items-center space-x-4 mb-8">
          {#if menuLogo}
            <img 
              src={menuLogo} 
              alt="Restaurant logo" 
              class="w-16 h-16 object-cover rounded-lg"
            />
          {/if}
          {#if restaurantName}
            <h1 class="text-3xl font-bold">{restaurantName}</h1>
          {/if}
        </div>

        <!-- Categories and Dishes -->
        {#each categories as category}
          <div class="mb-8">
            <h3 class="text-xl font-semibold mb-4">{category.name}</h3>
            {#if category.dishes && category.dishes.length > 0}
              <div class="space-y-4">
                {#each category.dishes as dish}
                  <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    {#if dish.imageUrl}
                      <img 
                        src={dish.imageUrl} 
                        alt={dish.title}
                        class="w-24 h-24 object-cover rounded-lg"
                      />
                    {/if}
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <h4 class="text-lg font-semibold">{dish.title}</h4>
                        <p class="text-lg font-bold">${dish.price}</p>
                      </div>
                      <p class="text-gray-600 mt-1">{dish.description}</p>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div> 