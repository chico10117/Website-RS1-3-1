# Smart Form Components Documentation

## Overview

The smart form components provide a set of reusable, type-safe, and validation-aware input components that simplify form creation and management. These components work seamlessly with the restaurant store and provide a consistent user experience.

## Key Features

- **Built-in validation**: Components handle their own validation and error display
- **Type safety**: Components are fully typed with TypeScript
- **Consistent styling**: All components share the same visual design
- **Event-based API**: Components emit typed events for easy integration
- **Simplified null handling**: Components handle null values and empty strings properly
- **Accessibility**: Components follow accessibility best practices

## Component List

1. **FormField**: Base component for form fields with labels and error handling
2. **TextField**: Text input component for general text entry
3. **UrlField**: URL input with validation and normalization
4. **PhoneField**: Phone number input with formatting and validation
5. **ColorField**: Color picker with predefined and custom color options

## Usage Examples

### Form Field

```svelte
<FormField id="example" label="Example Field" error={error} touched={true}>
  <input id="example" type="text" value="Example value" />
</FormField>
```

### Text Field

```svelte
<script>
  let name = 'John Doe';
  let error = null;
  let touched = false;
  
  function handleChange(event) {
    name = event.detail;
    // Do something with the new value
  }
</script>

<TextField
  id="name"
  name="name"
  label="Full Name"
  value={name}
  placeholder="Enter your full name"
  error={error}
  touched={touched}
  required={true}
  helpText="Please enter your full name as it appears on your ID"
  on:change={handleChange}
/>
```

### URL Field

```svelte
<script>
  let websiteUrl = 'https://example.com';
  let error = null;
  let touched = false;
  
  function handleUrlChange(event) {
    // event.detail will be the URL or null if empty
    websiteUrl = event.detail;
  }
</script>

<UrlField
  id="website"
  label="Website URL"
  value={websiteUrl}
  placeholder="https://yourwebsite.com"
  error={error}
  touched={touched}
  on:change={handleUrlChange}
/>
```

### Phone Field

```svelte
<script>
  let phoneNumber = '+12345678900';
  let error = null;
  let touched = false;
  
  function handlePhoneChange(event) {
    // event.detail will be the formatted phone number or null if empty
    phoneNumber = event.detail;
  }
</script>

<PhoneField
  id="phone"
  label="Phone Number"
  value={phoneNumber}
  placeholder="+1 234 567 8900"
  error={error}
  touched={touched}
  on:change={handlePhoneChange}
/>
```

### Color Field

```svelte
<script>
  let color = 'light';
  let error = null;
  let touched = false;
  
  const colorOptions = [
    { value: 'light', label: 'Light', hex: '#85A3FA' },
    { value: 'dark', label: 'Dark', hex: '#233044' },
    { value: 'custom', label: 'Custom', hex: '' }
  ];
  
  function handleColorChange(event) {
    color = event.detail;
  }
</script>

<ColorField
  id="themeColor"
  label="Theme Color"
  value={color}
  error={error}
  touched={touched}
  colorOptions={colorOptions}
  on:change={handleColorChange}
/>
```

## Integration with Form State Management

The components work seamlessly with the form state management utilities:

```svelte
<script>
  import { useForm } from '$lib/hooks/use-form';
  import TextField from '$lib/components/ui/TextField.svelte';
  import UrlField from '$lib/components/ui/UrlField.svelte';
  import { validateUrl } from '$lib/utils/validation';
  
  // Initial form values
  const initialValues = {
    name: '',
    website: null,
    email: ''
  };
  
  // Validation schema
  const validationSchema = {
    name: (value) => !value ? 'Name is required' : null,
    website: (value) => validateUrl(value),
    email: (value) => !value ? 'Email is required' : null
  };
  
  // Form submission handler
  async function handleSubmit(values) {
    console.log('Submitting:', values);
    // Save to API, etc.
  }
  
  // Create form with validation and submission handler
  const form = useForm(initialValues, validationSchema, handleSubmit);
</script>

<form on:submit|preventDefault={form.handleSubmit}>
  <TextField
    id="name"
    label="Name"
    value={$form.values.name}
    error={$form.errors.name}
    touched={$form.touched.name}
    required={true}
    on:change={(e) => form.setValue('name', e.detail)}
    on:blur={() => form.setTouched('name')}
  />
  
  <UrlField
    id="website"
    label="Website"
    value={$form.values.website}
    error={$form.errors.website}
    touched={$form.touched.website}
    on:change={(e) => form.setValue('website', e.detail)}
    on:blur={() => form.setTouched('website')}
  />
  
  <button type="submit" disabled={!$form.isValid || $form.isSubmitting}>
    {$form.isSubmitting ? 'Submitting...' : 'Submit'}
  </button>
</form>
```

## Component Props

### Common Props (All Components)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| id | string | '' | Unique ID for the field |
| name | string | '' | Name attribute for the input |
| label | string | '' | Label text |
| error | string \| null | null | Error message |
| touched | boolean | false | Whether the field has been touched |
| required | boolean | false | Whether the field is required |
| disabled | boolean | false | Whether the field is disabled |
| helpText | string | '' | Help text to display below the field |

### Component-Specific Props

#### TextField
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | '' | Current value |
| placeholder | string | '' | Placeholder text |
| type | 'text' \| 'email' \| 'password' \| 'number' \| 'tel' | 'text' | Input type |
| autocomplete | string | '' | Autocomplete attribute |

#### UrlField
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string \| null | null | Current URL value |
| placeholder | string | '' | Placeholder text |
| autoValidate | boolean | true | Whether to validate on input |

#### PhoneField
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string \| null | null | Current phone number |
| placeholder | string | '' | Placeholder text |
| autoValidate | boolean | true | Whether to validate on input |

#### ColorField
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | 'light' | Current color value |
| colorOptions | Array | [...] | Array of color options |

## Events

All components emit the following events:

| Event | Detail | Description |
|-------|--------|-------------|
| change | value | Fired when the value changes |
| blur | value | Fired when the field loses focus |
| focus | value | Fired when the field gains focus |

The **UrlField** and **PhoneField** components also emit:

| Event | Detail | Description |
|-------|--------|-------------|
| validate | error | Fired when validation occurs with error result |

## Implementation Notes

- **Null Handling**: UrlField and PhoneField convert empty strings to null
- **URL Normalization**: UrlField automatically adds https:// to URLs that don't have a protocol
- **Phone Formatting**: PhoneField automatically formats phone numbers and filters invalid characters
- **Color Persistence**: ColorField remembers custom colors and keeps them between selections
- **Validation Timing**: Fields validate on change (if autoValidate is true) and always on blur 