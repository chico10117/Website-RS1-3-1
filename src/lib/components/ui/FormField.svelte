<script lang="ts">
  export let id: string = '';
  export let label: string = '';
  export let error: string | null = null;
  export let touched: boolean = false;
  export let required: boolean = false;
  export let helpText: string = '';
  
  // Compute whether to show the error
  $: showError = error && touched;
</script>

<div class="form-field space-y-1">
  {#if label}
    <label 
      for={id} 
      class="block text-sm font-medium text-gray-700"
    >
      {label} {#if required}<span class="text-red-500">*</span>{/if}
    </label>
  {/if}
  
  <div class="relative">
    <slot />
    
    {#if helpText && !showError}
      <p class="mt-1 text-sm text-gray-500">
        {helpText}
      </p>
    {/if}
    
    {#if showError}
      <p class="mt-1 text-sm text-red-600">
        {error}
      </p>
    {/if}
  </div>
</div>

<style>
  :global(.form-field input:focus),
  :global(.form-field select:focus),
  :global(.form-field textarea:focus) {
    @apply ring-2 ring-blue-500 border-transparent;
  }
  
  :global(.form-field input),
  :global(.form-field select),
  :global(.form-field textarea) {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md 
           transition-all duration-200 ease-in-out bg-white/80 backdrop-blur-sm;
  }
  
  :global(.form-field input::placeholder),
  :global(.form-field textarea::placeholder) {
    @apply text-gray-400;
  }
  
  :global(.form-field.error input),
  :global(.form-field.error select),
  :global(.form-field.error textarea) {
    @apply border-red-500;
  }
</style> 