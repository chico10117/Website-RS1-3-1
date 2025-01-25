<!-- ConfirmDialog.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Button } from './button';

  export let message: string;
  export let show = false;

  const dispatch = createEventDispatcher<{
    confirm: void;
    cancel: void;
  }>();

  function handleConfirm() {
    dispatch('confirm');
    show = false;
  }

  function handleCancel() {
    dispatch('cancel');
    show = false;
  }
</script>

{#if show}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    transition:fly={{ y: 20, duration: 200 }}
  >
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
      <p class="text-gray-700 dark:text-gray-200 mb-6">{message}</p>
      <div class="flex justify-end gap-4">
        <Button variant="outline" on:click={handleCancel}>Cancel</Button>
        <Button variant="destructive" on:click={handleConfirm}>Delete</Button>
      </div>
    </div>
  </div>
{/if} 