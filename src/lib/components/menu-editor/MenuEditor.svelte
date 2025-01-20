<script lang="ts">
  import { menuState } from '$lib/stores/menu-state';
  import RestaurantInfo from './restaurant/RestaurantInfo.svelte';
  import MenuPreview from './preview/MenuPreview.svelte';
  import CategoryList from './categories/CategoryList.svelte';
</script>

<div class="min-h-screen bg-[#1a1b1e] p-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold text-white">Creador de Carta QR</h1>
  </div>

  <div class="flex gap-8">
    <!-- Left Section - Editor -->
    <div class="flex-1 bg-[#25262b] backdrop-blur-md rounded-xl border border-[#2f3136] p-8">
      <RestaurantInfo
        bind:restaurantName={$menuState.restaurantName}
        bind:menuLogo={$menuState.menuLogo}
      />
      <CategoryList
        categories={$menuState.categories}
        selectedRestaurant={$menuState.restaurantId}
      />
    </div>

    <!-- Right Section - Preview -->
    <div class="flex-1 bg-[#25262b] backdrop-blur-md rounded-xl border border-[#2f3136] p-8">
      <MenuPreview
        restaurantName={$menuState.restaurantName}
        menuLogo={$menuState.menuLogo}
        categories={$menuState.categories}
      />
    </div>
  </div>
</div>

<style>
  span {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style> 