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

  let editingCategory: Category | null = null;
  let editingName = '';

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
    } catch (error: unknown) {
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
      if (selectedRestaurant) {
        const updatedRestaurant = await getRestaurantWithCategories(selectedRestaurant);
        if (updatedRestaurant) {
          categories = updatedRestaurant.categories || [];
        }
      }

      return data.data;
    } catch (error: unknown) {
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

    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      menuLogo = uploadResult.url;

      // If we don't have a restaurant yet but have a name, create one
      if (!selectedRestaurant && restaurantName) {
        const restaurant = await saveRestaurant();
        selectedRestaurant = restaurant.id;
      }

      // Update the restaurant with the new logo if we have one
      if (selectedRestaurant) {
        const response = await fetch(`/api/restaurants/${selectedRestaurant}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: restaurantName,
            logo: menuLogo 
          })
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error);
        }

        // Update the restaurant in the restaurants array
        const restaurantIndex = restaurants.findIndex(r => r.id === selectedRestaurant);
        if (restaurantIndex !== -1) {
          restaurants[restaurantIndex] = {
            ...restaurants[restaurantIndex],
            logo: menuLogo
          };
          restaurants = [...restaurants];
        }
      }

      isUploading = false;
    } catch (error: unknown) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
        if (!category || !category.id) {
          throw new Error('Category not found');
        }

        const response = await fetch(
          `/api/restaurants/${selectedRestaurant}/categories/${category.id}`,
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

        // Update the local state with the updated category
        categories = categories.map((cat, index) => 
          index === editingCategoryIndex 
            ? { ...cat, name: editingCategoryName }
            : cat
        );
        
        // Reset editing state
        cancelEditingCategory();
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
      const response = await fetch(`/api/restaurants/${selectedRestaurant}/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editingName })
      });

      const result = await response.json();

      if (result.success) {
        // Update the local state
        categories = categories.map(cat => 
          cat.id === editingCategory?.id 
            ? { ...cat, name: editingName }
            : cat
        );
        
        // Reset editing state
        editingCategory = null;
        editingName = "";
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      console.error('Error updating category:', error);
      alert('Error updating category: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
    } catch (error: unknown) {
      console.error('Error loading restaurants:', error);
      alert('Error loading restaurants: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

      // Update local state
      const deletedIndex = categories.findIndex(cat => cat.id === categoryId);
      categories = categories.filter(cat => cat.id !== categoryId);
      
      // If the deleted category was selected, deselect it
      if (selectedCategory === deletedIndex) {
        selectedCategory = null;
      }

      alert('Categoría eliminada exitosamente!');
    } catch (error: unknown) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar categoría: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  // Agregar esta función para manejar la selección del restaurante
  async function handleRestaurantCreated(restaurant: Restaurant) {
    selectedRestaurant = restaurant.id;
    categories = restaurant.categories || [];
    console.log('Selected restaurant:', selectedRestaurant);
  }

  // Modificar la función saveRestaurant existente
  async function saveRestaurant(): Promise<Restaurant> {
    try {
      if (!restaurantName?.trim()) {
        throw new Error('Restaurant name is required');
      }

      // Check if a restaurant with this name already exists in the local state
      const existingRestaurant = restaurants.find(r => 
        r.name.toLowerCase() === restaurantName.trim().toLowerCase()
      );

      if (existingRestaurant) {
        throw new Error('A restaurant with this name already exists');
      }

      const restaurantData = {
        name: restaurantName.trim(),
        logo: menuLogo || null
      };

      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurantData)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create restaurant');
      }

      // Add the new restaurant to the local state
      const newRestaurant = result.data as Restaurant;
      restaurants = [...restaurants, newRestaurant];
      
      // Select the new restaurant
      selectedRestaurant = newRestaurant.id;
      categories = []; // Initialize empty categories for the new restaurant
      
      return newRestaurant;
    } catch (error: unknown) {
      console.error('Error saving restaurant:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Error saving restaurant: ' + errorMessage);
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
        body: JSON.stringify({ 
          name: editingRestaurantName,
          logo: menuLogo // Include the current logo in the update
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Update both name and logo in local state
      restaurantName = editingRestaurantName;
      isEditingRestaurant = false;
      
      // Update the restaurant in the restaurants array
      const restaurantIndex = restaurants.findIndex(r => r.id === selectedRestaurant);
      if (restaurantIndex !== -1) {
        restaurants[restaurantIndex] = {
          ...restaurants[restaurantIndex],
          name: editingRestaurantName,
          logo: menuLogo
        };
        restaurants = [...restaurants];
      }

      alert('Restaurant updated successfully!');
    } catch (error: unknown) {
      console.error('Error updating restaurant:', error);
      alert('Error updating restaurant: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
      restaurants = restaurants.filter(r => r.id !== selectedRestaurant);
      selectedRestaurant = null;
      restaurantName = '';
      categories = [];

      alert('Restaurant deleted successfully!');
    } catch (error: unknown) {
      console.error('Error deleting restaurant:', error);
      alert('Error deleting restaurant: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

      const currentCategory = categories[currentCategoryIndex];
      console.log('Selected category:', currentCategory);

      const categoryId = currentCategory.id;
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
        categoryId: categoryId
      };

      const response = await fetch(
        `/api/restaurants/${selectedRestaurant}/categories/${categoryId}/dishes/${editingDish.id}`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dishData)
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update dish');
      }

      // Update the dish in the local state
      const updatedCategories = [...categories];
      const updatedCategory = updatedCategories[currentCategoryIndex];
      if (updatedCategory && updatedCategory.dishes) {
        const dishIndex = updatedCategory.dishes.findIndex(d => d.id === editingDish.id);
        if (dishIndex !== -1) {
          updatedCategory.dishes[dishIndex] = {
            ...updatedCategory.dishes[dishIndex],
            ...dishData
          };
        }
      }
      categories = updatedCategories;
      
      // Clear the form
      cancelEditDish();
      alert('Dish updated successfully!');
    } catch (error: unknown) {
      console.error('Error updating dish:', error);
      alert('Error updating dish: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  function handleLogoClick() {
    if (!restaurantName) {
      alert('Please enter a restaurant name first');
      return;
    }
    const logoInput = document.getElementById('logo-input');
    if (logoInput) {
      logoInput.click();
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
        <div class="flex items-center space-x-2">
          {#if isEditingRestaurant}
            <div class="flex-1 flex items-center space-x-2">
              <input
                type="text"
                class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                bind:value={editingRestaurantName}
                on:keydown={handleRestaurantEditKeyPress}
                autofocus
              />
              <button 
                class="p-2 text-green-500 hover:text-green-600"
                on:click={updateRestaurantName}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <button 
                class="p-2 text-gray-500 hover:text-gray-600"
                on:click={cancelEditingRestaurant}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          {:else}
            <div class="flex-1 flex items-center justify-between">
              <input
                type="text"
                class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter restaurant name"
                bind:value={restaurantName}
                readonly={selectedRestaurant}
              />
              {#if selectedRestaurant}
                <button 
                  class="p-2 text-gray-500 hover:text-blue-500 ml-2"
                  on:click={startEditingRestaurant}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                  </svg>
                </button>
              {/if}
            </div>
          {/if}
        </div>
      </div>

      <!-- Menu Logo Section -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-1">Menu Logo</label>
        <div class="flex items-center space-x-2">
          <div class="relative">
            <button 
              class="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors {!restaurantName ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
              on:click={handleLogoClick}
            >
              {#if menuLogo}
                <img 
                  src={menuLogo} 
                  alt="Menu logo" 
                  class="w-full h-full object-cover rounded-lg"
                />
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="text-xs text-gray-500 mt-1">Add logo</span>
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
              on:click={() => {
                const removeLogo = async () => {
                  try {
                    if (selectedRestaurant) {
                      const response = await fetch(`/api/restaurants/${selectedRestaurant}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          name: restaurantName,
                          logo: null 
                        })
                      });

                      const data = await response.json();
                      
                      if (!data.success) {
                        throw new Error(data.error);
                      }

                      // Update the restaurant in the restaurants array
                      const restaurantIndex = restaurants.findIndex(r => r.id === selectedRestaurant);
                      if (restaurantIndex !== -1) {
                        restaurants[restaurantIndex] = {
                          ...restaurants[restaurantIndex],
                          logo: null
                        };
                        restaurants = [...restaurants];
                      }
                    }
                    menuLogo = '';
                  } catch (error) {
                    console.error('Error removing logo:', error);
                    alert('Error removing logo: ' + (error instanceof Error ? error.message : 'Unknown error'));
                  }
                };

                removeLogo();
              }}
            >
              <X size={20} />
            </button>
          {/if}
        </div>
      </div>

      <!-- Categories Section -->
      <div class="shadow p-0 mb-3 space-y-3">
        <h2 class="shadow p-1 block text-sm font-medium mb-1">Categories</h2>
        <div class="flex items-center space-x-2">
          <input
            type="text"
            class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Category name"
            bind:value={newCategory}
            on:keydown={handleKeyPress}
          />
          <button 
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={addCategory}
            disabled={!selectedRestaurant}
          >
            Add
          </button>
        </div>

        <!-- Categories List -->
        <div class="bg-white rounded-lg shadow">
          {#each categories as category, categoryIndex}
            <div class="border-b last:border-b-0">
              <div class="flex items-center justify-between p-3">
                {#if editingCategoryIndex === categoryIndex}
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
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      class="p-2 text-gray-500 hover:text-gray-600"
                      on:click={cancelEditingCategory}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                {:else}
                  <span class="flex-1">{category.name}</span>
                  <div class="flex items-center space-x-2">
                    <button 
                      class="p-2 text-gray-500 hover:text-blue-500"
                      on:click={() => startEditingCategory(categoryIndex)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      class="p-2 text-gray-500 hover:text-red-500"
                      on:click={() => deleteCategory(category.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                {/if}
              </div>
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