<script lang="ts">
  import MenuEditor from '$lib/components/menu-editor/MenuEditor.svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import type { PageData } from './$types';

  export let data: PageData;

  // Initialize the current restaurant from server data
  $: if (data.restaurant) {
    currentRestaurant.set(data.restaurant);
  }
</script>

<MenuEditor /> 