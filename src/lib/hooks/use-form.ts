import { onDestroy } from 'svelte';
import { get } from 'svelte/store';
import { createForm, type ValidationSchema } from '$lib/utils/form-state';
import type { Readable, Writable } from 'svelte/store';

/**
 * Create a form hook with validation
 * @param initialValues Initial form values
 * @param validationSchema Schema for field validation
 * @param onSubmit Function to handle form submission
 * @param onValueChange Callback when values change
 * @returns Form state and handlers
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema: ValidationSchema<T> = {},
  onSubmit?: (values: T) => Promise<void> | void,
  onValueChange?: (field: keyof T, value: any, allValues: T) => void
) {
  const form = createForm(initialValues, validationSchema, onValueChange);
  
  // Create unsubscribe functions array to clean up on component destroy
  const unsubscribes: (() => void)[] = [];
  
  // Register derived stores to be automatically unsubscribed
  function registerStore<T>(store: Readable<T>) {
    const unsubscribe = store.subscribe(() => {});
    unsubscribes.push(unsubscribe);
    return store;
  }
  
  // Register all derived stores
  const values = registerStore(form.values);
  const errors = registerStore(form.errors);
  const touched = registerStore(form.touched);
  const isDirty = registerStore(form.isDirty);
  const isSubmitting = registerStore(form.isSubmitting);
  const isValid = registerStore(form.isValid);
  
  // Clean up subscriptions on component destroy
  onDestroy(() => {
    unsubscribes.forEach(unsubscribe => unsubscribe());
  });
  
  // Create handleSubmit function if onSubmit is provided
  const handleSubmit = onSubmit
    ? form.handleSubmit(onSubmit)
    : undefined;
  
  return {
    // State
    values,
    errors,
    touched,
    isDirty,
    isSubmitting,
    isValid,
    
    // Methods
    setValue: form.setValue,
    setValues: form.setValues,
    setTouched: form.setTouched,
    validateField: form.validateField,
    validateForm: form.validateForm,
    resetForm: form.resetForm,
    handleSubmit,
    
    // Helpers
    getValue: <K extends keyof T>(field: K) => get(values)[field],
    getError: (field: keyof T) => get(errors)[field],
    isTouched: (field: keyof T) => get(touched)[field],
    
    // Handlers for form elements
    handlers: {
      text: (field: keyof T) => ({
        value: get(values)[field] as string,
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          form.setValue(field, target.value);
        },
        onBlur: () => form.setTouched(field)
      }),
      checkbox: (field: keyof T) => ({
        checked: get(values)[field] as boolean,
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          form.setValue(field, target.checked);
        },
        onBlur: () => form.setTouched(field)
      }),
      select: (field: keyof T) => ({
        value: get(values)[field] as string,
        onChange: (e: Event) => {
          const target = e.target as HTMLSelectElement;
          form.setValue(field, target.value);
        },
        onBlur: () => form.setTouched(field)
      }),
      // Special handler for url inputs with validation
      url: (field: keyof T) => ({
        value: get(values)[field] as string || '',
        onChange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const value = target.value === '' ? null : target.value;
          form.setValue(field, value);
        },
        onBlur: () => form.setTouched(field)
      })
    }
  };
} 