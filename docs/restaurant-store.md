# Restaurant Store Documentation

## Overview

The restaurant store provides a centralized, type-safe way to manage restaurant data. It uses a fields-as-objects pattern that eliminates common problems like parameter order dependencies and cross-field contamination.

## Key Features

- **Type-safe field updates**: Uses TypeScript interfaces to ensure correct field types
- **Simplified API**: Single method to update any field or multiple fields at once
- **Validation**: Built-in field validation with error tracking
- **Change tracking**: Tracks which items have been changed for efficient saving
- **Centralized state**: Single source of truth for restaurant data

## Usage Examples

### Initialize the Store

```typescript
import { restaurantStore } from '$lib/stores/restaurant-store';

// In your component's onMount or setup code
await restaurantStore.initialize();
```

### Load a Restaurant

```typescript
// Load a restaurant by ID
await restaurantStore.selectRestaurant(restaurantId);
```

### Access Restaurant Data

```svelte
<script>
  import { restaurantStore } from '$lib/stores/restaurant-store';
  
  // Subscribe to store state
  $: currentRestaurant = $restaurantStore.currentRestaurant;
  $: fields = $restaurantStore.fields;
  $: hasUnsavedChanges = $restaurantStore.hasUnsavedChanges;
</script>

<!-- Use the data in your template -->
<h1>{fields.name}</h1>
```

### Update a Field

```typescript
// Update a single field
restaurantStore.updateField('name', 'New Restaurant Name');

// Update multiple fields at once
restaurantStore.updateFields({
  name: 'New Restaurant Name',
  phoneNumber: '+1 234 567 8900',
  color: '#FF5500'
});
```

### Save Changes

```typescript
try {
  await restaurantStore.saveChanges();
  toasts.success('Changes saved successfully');
} catch (error) {
  toasts.error('Failed to save changes');
}
```

### Create a New Restaurant

```typescript
// Initialize with a name
restaurantStore.createRestaurant('My New Restaurant');

// Update other fields
restaurantStore.updateField('phoneNumber', '+1 234 567 8900');

// Save the new restaurant
await restaurantStore.saveChanges();
```

### Working with Categories and Dishes

```typescript
// Add a category
restaurantStore.addCategory('Desserts');

// Add a dish to a category
restaurantStore.addDish(categoryId, {
  title: 'Chocolate Cake',
  price: '8.99',
  description: 'Rich chocolate cake with icing',
  imageUrl: null
});

// Update a dish
restaurantStore.updateDish(dishId, {
  price: '9.99',
  description: 'Rich chocolate cake with vanilla icing'
});

// Delete a dish
restaurantStore.deleteDish(dishId);

// Delete a category (and all its dishes)
restaurantStore.deleteCategory(categoryId);
```

## Interface with Form Components

The store works seamlessly with our smart form components:

```svelte
<script>
  import { restaurantStore } from '$lib/stores/restaurant-store';
  import TextField from '$lib/components/ui/TextField.svelte';
  import UrlField from '$lib/components/ui/UrlField.svelte';

  $: fields = $restaurantStore.fields;
  $: errors = $restaurantStore.errors;
</script>

<TextField
  id="restaurantName"
  label="Restaurant Name"
  value={fields.name}
  error={errors.name}
  on:change={(e) => restaurantStore.updateField('name', e.detail)}
/>

<UrlField
  id="reservas"
  label="Reservations URL"
  value={fields.reservas}
  error={errors.reservas}
  on:change={(e) => restaurantStore.updateField('reservas', e.detail)}
/>
```

## Store Structure

### State

```typescript
interface RestaurantStoreState {
  // Current data
  restaurants: Restaurant[];
  selectedRestaurant: string | null;
  fields: RestaurantFieldUpdate;
  categories: Category[];
  
  // Tracking changes
  changedItems: {
    restaurant: boolean;
    categories: Set<string>;
    dishes: Set<string>;
    deletedCategories: Set<string>;
    deletedDishes: Set<string>;
  };
  
  // UI state
  isSaving: boolean;
  lastSaveTime: Date | null;
  isLoading: boolean;
  errors: RestaurantValidationErrors;
}
```

### Field Updates

```typescript
interface RestaurantFieldUpdate {
  id?: string;
  name?: string;
  logo?: string | null;
  customPrompt?: string | null;
  slug?: string | null;
  phoneNumber?: string | null;
  reservas?: string | null;
  redes_sociales?: string | null;
  color?: string;
  currency?: string;
}
```

## API Methods

### Main Store Methods

- `initialize()`: Load all restaurants for the current user
- `selectRestaurant(id)`: Load a specific restaurant and its data
- `createRestaurant(name)`: Create a new restaurant
- `updateField(field, value)`: Update a single field
- `updateFields(fieldsObject)`: Update multiple fields at once
- `saveChanges()`: Save all changes to the database
- `resetErrors()`: Clear all form errors

### Category and Dish Methods

- `addCategory(name)`: Add a new category
- `updateCategory(id, name)`: Update a category name
- `deleteCategory(id)`: Delete a category
- `addDish(categoryId, dishData)`: Add a dish to a category
- `updateDish(id, dishData)`: Update dish data
- `deleteDish(id)`: Delete a dish

## Derived Stores

- `currentRestaurant`: The currently selected restaurant object
- `hasUnsavedChanges`: Whether there are any unsaved changes

## Validation

Built-in validation is performed on:
- Restaurant name (required)
- URLs (must be valid URLs)
- Phone numbers (must be valid phone format)
- Colors (must be valid hex color or predefined option)

Validation errors are stored in the `errors` field of the store state. 