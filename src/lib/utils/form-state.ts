import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';

/**
 * Interface for field validation
 */
export interface FieldValidator<T extends Record<string, any>> {
  (value: any, formValues: T): string | null;
}

/**
 * Interface for form validation schema
 */
export interface ValidationSchema<T extends Record<string, any>> {
  [key: string]: FieldValidator<T>;
}

/**
 * Interface for form state
 */
export interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Record<keyof T, string | null>;
  touched: Record<keyof T, boolean>;
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Interface for form state manager return
 */
export interface FormStateManager<T extends Record<string, any>> {
  // Form state stores
  form: Writable<FormState<T>>;
  values: Readable<T>;
  errors: Readable<Record<keyof T, string | null>>;
  touched: Readable<Record<keyof T, boolean>>;
  isDirty: Readable<boolean>;
  isSubmitting: Readable<boolean>;
  isValid: Readable<boolean>;
  
  // Methods
  setValues: (values: Partial<T>) => void;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setTouched: (field: keyof T, isTouched?: boolean) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  validateField: (field: keyof T) => string | null;
  validateForm: () => boolean;
  resetForm: (newValues?: Partial<T>) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (event?: Event) => Promise<void>;
}

/**
 * Create a form state manager with validation
 * @param initialValues Initial form values
 * @param validationSchema Schema for field validation
 * @param onValueChange Callback when values change
 * @returns Form state manager
 */
export function createForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema: ValidationSchema<T> = {},
  onValueChange?: (field: keyof T, value: any, allValues: T) => void
): FormStateManager<T> {
  // Ensure initialValues is an object
  const safeInitialValues = initialValues || {} as T;
  
  // Create touched state with all fields untouched
  const initialTouched = Object.keys(safeInitialValues).reduce(
    (acc, key) => ({ ...acc, [key]: false }),
    {} as Record<keyof T, boolean>
  );
  
  // Create error state with all fields valid
  const initialErrors = Object.keys(safeInitialValues).reduce(
    (acc, key) => ({ ...acc, [key]: null }),
    {} as Record<keyof T, string | null>
  );
  
  // Create initial form state
  const initialFormState: FormState<T> = {
    values: { ...safeInitialValues },
    errors: initialErrors,
    touched: initialTouched,
    isDirty: false,
    isSubmitting: false,
    isValid: true
  };
  
  // Create the form store
  const formStore = writable<FormState<T>>(initialFormState);
  
  // Derive individual state pieces
  const values = derived(formStore, $form => $form.values);
  const errors = derived(formStore, $form => $form.errors);
  const touched = derived(formStore, $form => $form.touched);
  const isDirty = derived(formStore, $form => $form.isDirty);
  const isSubmitting = derived(formStore, $form => $form.isSubmitting);
  const isValid = derived(formStore, $form => $form.isValid);
  
  // Validate a single field
  function validateField(field: keyof T): string | null {
    const formValues = get(values);
    const validator = validationSchema[field as string];
    
    if (!validator) {
      return null;
    }
    
    return validator(formValues[field], formValues);
  }
  
  // Validate all fields
  function validateForm(): boolean {
    const formValues = get(values);
    const newErrors: Record<string, string | null> = {};
    let isValid = true;
    
    for (const field of Object.keys(formValues)) {
      const error = validateField(field as keyof T);
      newErrors[field] = error;
      
      if (error) {
        isValid = false;
      }
    }
    
    formStore.update(state => ({
      ...state,
      errors: newErrors as Record<keyof T, string | null>,
      isValid
    }));
    
    return isValid;
  }
  
  // Set a single field value
  function setValue<K extends keyof T>(field: K, value: T[K]) {
    formStore.update(state => {
      // Create new values
      const newValues = { ...state.values, [field]: value };
      
      // Validate the field
      const validator = validationSchema[field as string];
      const error = validator ? validator(value, newValues) : null;
      
      // Check if form is valid
      const newErrors = { ...state.errors, [field]: error };
      const newIsValid = !Object.values(newErrors).some(e => e !== null);
      
      // Call onValueChange callback if provided
      if (onValueChange) {
        onValueChange(field, value, newValues);
      }
      
      return {
        ...state,
        values: newValues,
        errors: newErrors,
        isDirty: true,
        isValid: newIsValid,
        touched: { ...state.touched, [field]: true }
      };
    });
  }
  
  // Set multiple field values at once
  function setValues(newValues: Partial<T>) {
    formStore.update(state => {
      // Create new values by merging
      const updatedValues = { ...state.values, ...newValues };
      
      // Recalculate all errors
      const newErrors: Record<string, string | null> = {};
      let isValid = true;
      
      for (const field of Object.keys(updatedValues)) {
        const validator = validationSchema[field];
        const error = validator ? validator(updatedValues[field], updatedValues) : null;
        newErrors[field] = error;
        
        if (error) {
          isValid = false;
        }
      }
      
      // Call onValueChange callback for each changed field
      if (onValueChange) {
        for (const [field, value] of Object.entries(newValues)) {
          onValueChange(field as keyof T, value, updatedValues);
        }
      }
      
      return {
        ...state,
        values: updatedValues,
        errors: newErrors as Record<keyof T, string | null>,
        isValid,
        isDirty: true
      };
    });
  }
  
  // Set a field as touched
  function setTouched(field: keyof T, isTouched = true) {
    formStore.update(state => ({
      ...state,
      touched: { ...state.touched, [field]: isTouched }
    }));
  }
  
  // Set submitting state
  function setSubmitting(isSubmitting: boolean) {
    formStore.update(state => ({
      ...state,
      isSubmitting
    }));
  }
  
  // Reset the form to initial values or new values
  function resetForm(newValues?: Partial<T>) {
    formStore.update(state => {
      const resetValues = newValues 
        ? { ...safeInitialValues, ...newValues }
        : { ...safeInitialValues };
      
      return {
        ...initialFormState,
        values: resetValues
      };
    });
  }
  
  // Handle form submission
  function handleSubmit(onSubmit: (values: T) => Promise<void> | void) {
    return async (event?: Event) => {
      // Prevent default form submission if event is provided
      if (event) {
        event.preventDefault();
      }
      
      // Validate all fields
      const isValid = validateForm();
      
      if (!isValid) {
        // Mark all fields as touched to show validation errors
        const allTouched = Object.keys(get(values)).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {} as Record<keyof T, boolean>
        );
        
        formStore.update(state => ({
          ...state,
          touched: allTouched
        }));
        
        return;
      }
      
      // Set submitting state
      setSubmitting(true);
      
      try {
        await onSubmit(get(values));
      } finally {
        setSubmitting(false);
      }
    };
  }
  
  return {
    form: formStore,
    values,
    errors,
    touched,
    isDirty,
    isSubmitting,
    isValid,
    setValues,
    setValue,
    setTouched,
    setSubmitting,
    validateField,
    validateForm,
    resetForm,
    handleSubmit
  };
} 