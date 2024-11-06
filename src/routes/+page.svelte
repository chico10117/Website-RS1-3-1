<script lang="ts">
  import { X } from "lucide-svelte";

  interface Dish {
    title: string;
    imageUrl: string;
    price: string;
    description: string;
  }

  interface Category {
    name: string;
    dishes: Dish[];
  }

  let categories: Category[] = [];
  let newCategory = '';
  let selectedCategory: number | null = null;
  let newDish: Dish = { title: '', imageUrl: '', price: '', description: '' };

  function addCategory() {
    if (newCategory.trim()) {
      categories = [...categories, { name: newCategory, dishes: [] }];
      newCategory = '';
    }
  }

  function addDish() {
    if (selectedCategory !== null && newDish.title.trim()) {
      categories[selectedCategory].dishes = [...categories[selectedCategory].dishes, { ...newDish }];
      categories = categories;
      newDish = { title: '', imageUrl: '', price: '', description: '' };
    }
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
          <button
            class="flex-1 px-4 py-2 text-left {selectedCategory === index ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg mr-2"
            on:click={() => selectedCategory = index}
          >
            {category.name}
          </button>
          <button 
            class="p-2 text-gray-500 hover:text-red-500 rounded-lg"
            on:click={() => removeCategory(index)}
          >
            <X class="h-4 w-4" />
          </button>
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
          <button 
            class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            on:click={addDish}
          >
            Add Dish
          </button>
        </div>
      </div>
    {/if}
  </div>

  <div class="bg-white rounded-lg shadow p-4 mt-4">
    <h2 class="text-xl font-semibold mb-4">Menu Preview</h2>
    {#each categories as category, categoryIndex}
      <div class="mb-4">
        <h3 class="text-xl font-semibold mb-2">{category.name}</h3>
        {#each category.dishes as dish, dishIndex}
          <div class="mb-2 p-2 border rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium">{dish.title}</h4>
                <p class="text-sm text-gray-600">{dish.description}</p>
                <p class="font-bold">{dish.price}</p>
              </div>
              {#if dish.imageUrl}
                <img src={dish.imageUrl} alt={dish.title} class="w-20 h-20 object-cover rounded-lg" />
              {/if}
              <button 
                class="p-2 text-gray-500 hover:text-red-500"
                on:click={() => removeDish(categoryIndex, dishIndex)}
              >
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div> 