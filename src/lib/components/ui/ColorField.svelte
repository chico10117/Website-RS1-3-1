<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { validateColor } from '$lib/utils/validation';
  import FormField from './FormField.svelte';
  
  export let id: string = '';
  export let name: string = '';
  export let label: string = '';
  export let value: string = 'light';
  export let error: string | null = null;
  export let touched: boolean = false;
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let helpText: string = '';
  
  // Predefined color options
  export let colorOptions = [
    { value: 'light', label: 'Light', hex: '#85A3FA' },
    { value: 'custom', label: 'Custom', hex: '' }
  ];
  
  // State for custom color picker
  let showCustomPicker = false;
  let customColorValue = '';
  let tempColorValue = '';
  
  // Initialize custom color if value is hex
  $: {
    if (value.startsWith('#')) {
      customColorValue = value.toUpperCase();
      showCustomPicker = true;
    } else if (value === 'custom' && !customColorValue) {
      customColorValue = '#85A3FA';
      showCustomPicker = true;
    } else if (value !== 'custom') {
      showCustomPicker = false;
    }
  }
  
  const dispatch = createEventDispatcher<{
    change: string;
    input: string;
    blur: string;
    focus: string;
  }>();
  
  // Helper function to determine if the value is a predefined option
  function isPredefinedColor(val: string): boolean {
    return colorOptions.some(option => option.value === val);
  }
  
  // Handle radio button change
  function handleOptionChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    
    // If custom is selected, show picker and use stored custom value
    if (newValue === 'custom') {
      showCustomPicker = true;
      
      // If we already have a custom color, use it
      if (customColorValue) {
        dispatch('change', customColorValue);
      } else {
        // Otherwise use a default custom color
        customColorValue = '#85A3FA';
        dispatch('change', customColorValue);
      }
    } else {
      // For predefined colors, find the hex value and dispatch
      const option = colorOptions.find(opt => opt.value === newValue);
      const hexValue = option?.hex || newValue;
      showCustomPicker = false;
      dispatch('change', hexValue);
    }
  }
  
  // Handle custom color input change
  function handleCustomColorInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    tempColorValue = newValue;
    
    // Validate color format
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      customColorValue = newValue.toUpperCase();
      dispatch('change', customColorValue);
    }
  }
  
  // Handle color picker change
  function handleColorPickerChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    customColorValue = newValue.toUpperCase();
    dispatch('change', customColorValue);
  }
  
  // Accept custom color button
  function acceptCustomColor() {
    if (customColorValue) {
      dispatch('change', customColorValue);
    }
  }
  
  // Cancel custom color button
  function cancelCustomColor() {
    showCustomPicker = false;
    
    // Reset to light theme color if no custom color was set
    if (!isPredefinedColor(value)) {
      const lightColor = colorOptions.find(opt => opt.value === 'light')?.hex || '#85A3FA';
      dispatch('change', lightColor);
    }
  }
</script>

<FormField {id} {label} {error} {touched} {required} {helpText}>
  <div class="space-y-3">
    <!-- Color radio buttons -->
    <div class="space-y-2">
      {#each colorOptions as option}
        <div class="flex items-center">
          <input
            type="radio"
            id={`${id}-${option.value}`}
            name={name || id}
            value={option.value}
            checked={value === option.value || (option.value === 'custom' && value.startsWith('#'))}
            disabled={disabled}
            class="form-radio"
            on:change={handleOptionChange}
          />
          <label for={`${id}-${option.value}`} class="ml-2 block text-sm text-gray-700">
            {option.label}
          </label>
        </div>
      {/each}
    </div>
    
    <!-- Custom color picker -->
    {#if showCustomPicker}
      <div class="mt-3 space-y-2">
        <div class="flex space-x-2">
          <input
            type="text"
            id={`${id}-custom-hex`}
            placeholder="#RRGGBB"
            value={customColorValue}
            class="w-32"
            on:input={handleCustomColorInput}
          />
          <input
            type="color"
            id={`${id}-custom-picker`}
            value={customColorValue || '#85A3FA'}
            class="h-10 w-10 rounded border border-gray-300 p-0"
            on:input={handleColorPickerChange}
          />
          <button
            type="button"
            class="px-2 py-1 bg-blue-500 text-white rounded text-sm"
            on:click={acceptCustomColor}
          >
            OK
          </button>
          <button
            type="button"
            class="px-2 py-1 bg-gray-500 text-white rounded text-sm"
            on:click={cancelCustomColor}
          >
            Cancel
          </button>
        </div>
        
        {#if customColorValue}
          <div class="flex items-center space-x-2">
            <div 
              class="h-6 w-6 rounded border border-gray-300" 
              style={`background-color: ${customColorValue}`}
            ></div>
            <span class="text-sm text-gray-700">Preview</span>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</FormField> 