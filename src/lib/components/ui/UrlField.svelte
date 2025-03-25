<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { validateUrl, normalizeUrl } from '$lib/utils/validation';
  import FormField from './FormField.svelte';
  
  export let id: string = '';
  export let name: string = '';
  export let label: string = '';
  export let value: string | null = null;
  export let placeholder: string = '';
  export let error: string | null = null;
  export let touched: boolean = false;
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let helpText: string = '';
  export let autoValidate: boolean = true;
  
  // Use null safety for the UI
  let inputValue = value || '';
  
  // When external value changes
  $: if (value !== inputValue && (value !== null || inputValue !== '')) {
    inputValue = value || '';
  }
  
  const dispatch = createEventDispatcher<{
    change: string | null;
    blur: string | null;
    focus: string | null;
    validate: string | null;
  }>();
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    inputValue = target.value;
    
    // Convert empty strings to null for the model
    const valueToEmit = inputValue.trim() === '' ? null : inputValue;
    
    // Perform validation if autoValidate is enabled
    if (autoValidate) {
      error = validateUrl(valueToEmit);
    }
    
    dispatch('change', valueToEmit);
  }
  
  function handleBlur() {
    // Mark as touched on blur
    touched = true;
    
    // Normalize the URL on blur (add https:// if missing)
    if (inputValue && inputValue.trim() !== '') {
      const normalizedUrl = normalizeUrl(inputValue);
      if (normalizedUrl !== inputValue) {
        inputValue = normalizedUrl || '';
        
        // Dispatch change with the normalized URL
        dispatch('change', normalizedUrl);
      }
    }
    
    // Always validate on blur
    error = validateUrl(inputValue || null);
    dispatch('validate', error);
    dispatch('blur', inputValue === '' ? null : inputValue);
  }
  
  function handleFocus() {
    dispatch('focus', inputValue === '' ? null : inputValue);
  }
</script>

<FormField {id} {label} {error} {touched} {required} {helpText}>
  <input
    {id}
    {name}
    type="url"
    value={inputValue}
    {placeholder}
    {disabled}
    {required}
    class:error={error && touched}
    on:input={handleInput}
    on:blur={handleBlur}
    on:focus={handleFocus}
  />
</FormField> 