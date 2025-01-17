<!-- Toast.svelte -->
<script lang="ts">
  import { toasts } from '$lib/stores/toast';
  import { fly } from 'svelte/transition';
</script>

<div class="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
  <div class="space-y-2 pointer-events-auto">
    {#each $toasts as toast (toast.id)}
      <div
        transition:fly={{ y: 20, duration: 300 }}
        class="p-4 rounded-lg shadow-lg backdrop-blur-md border max-w-md w-full text-center {toast.type === 'success' 
          ? 'bg-green-500/90 text-white border-green-400' 
          : toast.type === 'error' 
          ? 'bg-red-500/90 text-white border-red-400' 
          : 'bg-blue-500/90 text-white border-blue-400'}"
      >
        {toast.message}
      </div>
    {/each}
  </div>
</div> 