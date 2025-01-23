<script lang="ts">
  import "../app.css";
  import Header from '$lib/components/Header.svelte';
  import { browser } from '$app/environment';
  import { user } from '$lib/stores/user';
  import { page } from '$app/stores';

  // Initialize user store with server data
  $: if (browser && $page.data.user) {
    user.set($page.data.user);
  }
</script>

<Header />
<slot /> 