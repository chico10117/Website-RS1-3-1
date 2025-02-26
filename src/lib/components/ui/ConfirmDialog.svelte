<!-- ConfirmDialog.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Button } from './button';

  export let message: string;
  export let show = false;

  // Variables to track viewport position
  let viewportTop = 0;
  let viewportHeight = 0;

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

  // Update viewport position when dialog is shown
  $: if (show) {
    updateViewportPosition();
  }

  // Function to update the viewport position
  function updateViewportPosition() {
    viewportTop = window.scrollY;
    viewportHeight = window.innerHeight;
  }

  // Listen for scroll events when dialog is shown
  onMount(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        if (show) {
          updateViewportPosition();
        }
      };

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  });
</script>

{#if show}
  <!-- Fixed overlay that follows the viewport -->
  <div 
    class="fixed z-50"
    style="top: {viewportTop}px; left: 0; right: 0; height: {viewportHeight}px;"
  >
    <!-- Semi-transparent backdrop with rounded corners -->
    <div class="absolute inset-0 bg-black/50 rounded-xl"></div>
    
    <!-- Centered dialog -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div 
        class="bg-white rounded-md shadow-lg max-w-md w-[400px] overflow-hidden"
        transition:fly={{ y: 20, duration: 200 }}
      >
        <!-- Dialog content -->
        <div class="p-5">
          <p class="text-center text-gray-800 mb-5">{message}</p>
          <div class="flex justify-end gap-2">
            <button 
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              on:click={handleCancel}
            >
              Cancel
            </button>
            <button 
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              on:click={handleConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if} 