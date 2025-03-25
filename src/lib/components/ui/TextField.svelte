<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import FormField from './FormField.svelte';
  
  export let id: string = '';
  export let name: string = '';
  export let label: string = '';
  export let value: string = '';
  export let placeholder: string = '';
  export let error: string | null = null;
  export let touched: boolean = false;
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let readonly: boolean = false;
  export let helpText: string = '';
  export let type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  export let autocomplete: string = '';
  export let min: string | number = '';
  export let max: string | number = '';
  export let step: string | number = '';
  
  const dispatch = createEventDispatcher<{
    input: string;
    change: string;
    blur: string;
    focus: string;
  }>();
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch('input', value);
  }
  
  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch('change', value);
  }
  
  function handleBlur(event: FocusEvent) {
    dispatch('blur', value);
  }
  
  function handleFocus(event: FocusEvent) {
    dispatch('focus', value);
  }
</script>

<FormField {id} {label} {error} {touched} {required} {helpText}>
  <input
    {id}
    {name}
    type={type}
    value={value}
    {placeholder}
    {autocomplete}
    {disabled}
    {readonly}
    {required}
    min={min.toString()}
    max={max.toString()} 
    step={step.toString()}
    class:error={error && touched}
    on:input={handleInput}
    on:change={handleChange}
    on:blur={handleBlur}
    on:focus={handleFocus}
  />
</FormField> 