<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let value: string | null = null;
  export let label: string = '';
  export let placeholder: string = '';
  export let id: string = '';

  const dispatch = createEventDispatcher<{
    change: string | null;
  }>();

  let inputValue = value || '';

  // Debug logging
  onMount(() => {
    console.log(`UrlInput ${id} initial value:`, value);
  });

  // Also log when value changes
  $: {
    console.log(`UrlInput ${id} value prop changed to:`, value);
    // Handle prop changes, including becoming null
    if (value === null || value === undefined) {
      if (inputValue !== '') { // Only update if it's actually different
        inputValue = '';
        console.log(`UrlInput ${id} cleared inputValue because prop is null/undefined`);
      }
    } else if (value !== inputValue) {
      inputValue = value;
      console.log(`UrlInput ${id} updated inputValue from prop`);
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    inputValue = target.value;
    
    // Explicitly handle empty strings
    const valueToDispatch = inputValue.trim() === '' ? null : inputValue;
    
    console.log(`UrlInput ${id} input changed to:`, {
      raw: inputValue,
      trimmed: inputValue.trim(),
      isEmpty: inputValue.trim() === '', 
      dispatching: valueToDispatch,
      typeof: typeof valueToDispatch
    });
    
    dispatch('change', valueToDispatch);
  }
</script>

<div class="space-y-2">
  <label for={id} class="block text-sm font-medium text-gray-700">
    {label}
  </label>
  <div class="relative">
    <input
      {id}
      type="text"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2
             focus:ring-blue-500 focus:border-transparent transition-all
             duration-200 ease-in-out bg-white/80 backdrop-blur-sm"
      value={inputValue}
      on:input={handleInput}
      {placeholder}
    />
  </div>
</div>

<style>
  input::placeholder {
    @apply text-gray-400;
  }
</style> 