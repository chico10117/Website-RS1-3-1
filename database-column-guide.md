# Database Column Modification Guide

This guide outlines the steps needed to add or modify a database column in the Reco application. Follow these steps in order to ensure all parts of the application are updated correctly.

## Step 1: Update Database Schema

First, add the column to the database schema definition:

```typescript
// src/lib/server/schema.ts
export const restaurants = pgTable('restaurants', {
  // existing columns...
  newColumn: text('newColumn'), // Add your new column here
});
```

## Step 2: Update TypeScript Types

Update the TypeScript interface to include the new column:

```typescript
// src/lib/types/menu.types.ts
export interface Restaurant {
  // existing properties...
  newColumn: string | null;
}
```

## Step 3: Update MenuStore Interface

Add the new field to the MenuStore interface to ensure it's included in the state:

```typescript
// src/lib/stores/menu-store.ts
export interface MenuStore {
  // Current data
  restaurants: Restaurant[];
  selectedRestaurant: string | null;
  restaurantName: string;
  menuLogo: string | null;
  customPrompt: string | null;
  phoneNumber: string | null;
  categories: Category[];
  color: string;
  newColumn: string | null; // Add your new field here
  
  // Other properties...
}
```

## Step 4: Update Store State

Modify the menu store to include the new field in its state and methods:

```typescript
// src/lib/stores/menu-store.ts

// Update the initial state
const initialState: MenuStore = {
  // existing state...
  newColumn: null,
};

// Update the selectRestaurant method to load the value from database
async selectRestaurant(restaurantId: string) {
  // ... existing code ...
  
  // Load and merge data for the selected restaurant
  const { restaurant, categories, changedItems } = await loadAndMergeData(restaurantId);
  
  // Update the store with the restaurant and categories
  update(s => {
    return {
      ...s,
      selectedRestaurant: restaurantId,
      restaurantName: restaurant.name,
      // ... other fields ...
      newColumn: restaurant.newColumn || null, // Add your field here
      categories: categories,
      // ... rest of the update ...
    };
  });
}

// Add a dedicated method to update just your new field (recommended for URL-like fields)
updateNewColumn(newColumn: string | null) {
  console.log('updateNewColumn called with:', { newColumn });
  
  update(state => {
    // Find the current restaurant in the state
    const currentRestaurantIndex = state.restaurants.findIndex(r => r.id === state.selectedRestaurant);
    
    // Create a copy of the restaurants array
    const updatedRestaurants = [...state.restaurants];
    
    // Update the current restaurant (if found)
    if (currentRestaurantIndex >= 0) {
      updatedRestaurants[currentRestaurantIndex] = {
        ...updatedRestaurants[currentRestaurantIndex],
        newColumn,
        updatedAt: new Date(),
      };
    }
    
    console.log('Updating store state with:', { newColumn });
    
    // Make sure to mark as changed
    return {
      ...state,
      newColumn,
      restaurants: updatedRestaurants,
      changedItems: {
        ...state.changedItems,
        restaurant: true
      }
    };
  });
},

// Update the createRestaurant method
createRestaurant(name: string, logo: string | null = null, customPrompt: string | null = null, phoneNumber: string | null = null, newColumn: string | null = null) {
  // Include the new column in the temporary restaurant
  const newRestaurant: Restaurant = {
    // existing properties...
    newColumn,
  };
  
  return {
    // existing state...
    newColumn,
  };
}

// Update the updateRestaurantInfo method
updateRestaurantInfo(name: string, logo: string | null, customPrompt: string | null = null, slug: string | null = null, phoneNumber: string | null = null, newColumn: string | null = null) {
  // Include the new column in the updated restaurant
  updatedRestaurants[currentRestaurantIndex] = {
    // existing properties...
    newColumn,
  };
  
  return {
    // existing state...
    newColumn,
  };
}

// Update the saveChanges method
async saveChanges() {
  // Get the latest value directly from the state
  const newColumn = state.newColumn;
  
  // Prepare restaurant data with the new column
  const restaurantData = {
    // existing data...
    newColumn,
  };
  
  // Call the menu service with the new data
  const result = await menuService.saveMenuChanges(
    {
      // ... existing fields ...
      newColumn,
    },
    state.selectedRestaurant
  );
  
  // Update state with saved data
  update(s => {
    return {
      // ... other updates ...
      newColumn: result.restaurant.newColumn,
    };
  });
}
```

## Step 5: Update API Routes

### Update POST Route

```typescript
// src/routes/api/restaurants/+server.ts
export async function POST({ request, cookies, fetch }: RequestEvent) {
  // Extract the new column from the request
  const { id, name, logo, slug, customPrompt, newColumn } = await request.json();
  
  // Include the new column in the insert operation
  const [newRestaurant] = await db.insert(restaurants)
    .values({
      // existing values...
      newColumn: newColumn || null,
    })
    .returning();
}
```

### Update PUT Route

```typescript
// src/routes/api/restaurants/[restaurantId]/+server.ts
export async function PUT({ params, request, cookies, fetch }: RequestEvent) {
  // Extract the data from the request
  const updateData = await request.json();
  
  // Prepare update data
  const updateSet: any = {
    updatedAt: new Date()
  };

  // Handle new column update if provided
  if (updateData.newColumn !== undefined) {
    updateSet.newColumn = updateData.newColumn;
  }
  
  // Update the restaurant
  const [updatedRestaurant] = await db.update(restaurants)
    .set(updateSet)
    .where(eq(restaurants.id, restaurantId as string))
    .returning();
}
```

## Step 6: Update Restaurant Service

```typescript
// src/lib/services/restaurant.service.ts
export async function createOrUpdateRestaurant(
  restaurantData: { 
    // existing properties...
    newColumn?: string | null;
  }, 
  restaurantId?: string
): Promise<Restaurant> {
  // Add validation for your field if needed (especially for URL fields)
  let validatedNewColumn = restaurantData.newColumn;
  
  // Example of validation (if it's a URL field)
  if (validatedNewColumn && typeof validatedNewColumn === 'string') {
    // Ensure it's a valid URL format, convert empty strings to null, etc.
    validatedNewColumn = validatedNewColumn.trim() === '' ? null : validatedNewColumn;
  }
  
  // Include the new column in the request body
  const bodyData = isUpdate 
    ? { 
        // existing data...
        newColumn: validatedNewColumn,
      }
    : { 
        // existing data...
        newColumn: validatedNewColumn,
      };
      
  // Debug the request (helpful for troubleshooting)
  console.log('API request with field:', {
    newColumn: validatedNewColumn,
    body: bodyData
  });
}
```

## Step 7: Update Menu Service

```typescript
// src/lib/services/menu.service.ts
export async function saveMenuChanges(
  restaurantData: {
    // existing properties...
    newColumn?: string | null;
  },
  currentRestaurantId: string | null
): Promise<SaveResult> {
  // CRITICAL: Extract and log the values being sent to createOrUpdateRestaurant
  const newColumn = restaurantData.newColumn ?? currentRestaurant?.newColumn;
  
  console.log('Values being sent to createOrUpdateRestaurant:', {
    updatingNewColumn: restaurantData.newColumn,
    existingNewColumn: currentRestaurant?.newColumn,
    finalNewColumn: newColumn
  });

  const savedRestaurant = await restaurantService.createOrUpdateRestaurant(
    {
      // existing properties...
      newColumn,
    },
    isNewRestaurant ? undefined : currentRestaurantId
  );
  
  // Verify the saved data
  console.log('Restaurant saved with new value:', {
    newColumn: savedRestaurant.newColumn
  });
}
```

## Step 8: Update UI Components

### Update RestaurantInfo Component

```svelte
<!-- src/lib/components/menu-editor/restaurant/RestaurantInfo.svelte -->
<script lang="ts">
  // Add the new property to the component props
  export let newColumn: string | null = null;
  
  // Include the new property in the update event interface
  interface UpdateEvent {
    // existing properties...
    newColumn: string | null;
  }
  
  // Add a handler function for your new field
  function handleNewColumnChange(event: CustomEvent<string | null>) {
    newColumn = event.detail;
    
    // IMPORTANT: Update the menuStore with the dedicated method
    menuStore.updateNewColumn(newColumn);
    
    // Update restaurant info through dispatch
    dispatch('update', {
      id: selectedRestaurant,
      name: restaurantName,
      logo: menuLogo,
      customPrompt,
      phoneNumber,
      color,
      currency,
      newColumn,
      // ... other fields
    } as UpdateEvent);
  }
</script>

<!-- Add UI for the new column -->
<div class="space-y-2 mb-12">
  <label class="block text-sm font-medium text-gray-700">
    {t('newColumnLabel')}
  </label>
  <CustomInput
    id="newColumn"
    value={newColumn}
    on:change={handleNewColumnChange}
  />
</div>
```

### Create a Custom Input Component (if needed)

For URL-like fields, it's recommended to create a dedicated input component:

```svelte
<!-- src/lib/components/menu-editor/restaurant/NewColumnInput.svelte -->
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
    console.log(`${id} initial value:`, value);
  });

  // Also log when value changes
  $: {
    console.log(`${id} value changed to:`, value);
    if (value !== inputValue && value !== null) {
      inputValue = value || '';
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    inputValue = target.value;
    
    // Explicitly handle empty strings
    const valueToDispatch = inputValue.trim() === '' ? null : inputValue;
    
    console.log(`${id} input changed to:`, {
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
```

### Update MenuEditor Component

```svelte
<!-- src/lib/components/menu-editor/MenuEditor.svelte -->
<script lang="ts">
  // Update the handleRestaurantUpdate function
  async function handleRestaurantUpdate(event: CustomEvent<{
    id?: string;
    name: string;
    logo: string | null;
    customPrompt: string | null;
    phoneNumber: string | null;
    currency: string;
    color: string | number;
    newColumn: string | null;
    // ... other fields
  }>) {
    const {
      id,
      name,
      logo,
      customPrompt,
      phoneNumber,
      currency,
      color,
      newColumn,
      // ... other fields
    } = event.detail;
    
    console.log('Updating restaurant with all values:', {
      name, logo, customPrompt, phoneNumber, color, newColumn
    });
    
    if (id) {
      // Update existing restaurant
      menuStore.updateRestaurantInfo(
        name, 
        logo, 
        customPrompt, 
        $currentRestaurant?.slug || null, 
        phoneNumber,
        newColumn
      );
      
      // Force an explicit update for your field to ensure it's set correctly
      if (newColumn !== undefined) {
        console.log('Explicitly updating newColumn value:', newColumn);
        menuStore.updateNewColumn(newColumn);
      }
    } else {
      // Create new restaurant
      menuStore.createRestaurant(
        name, 
        logo, 
        customPrompt, 
        phoneNumber, 
        newColumn
      );
      
      // Force an explicit update for your field
      if (newColumn !== undefined) {
        console.log('Explicitly updating newColumn value:', newColumn);
        menuStore.updateNewColumn(newColumn);
      }
    }
  }
</script>

<!-- Pass the new property to RestaurantInfo -->
<RestaurantInfo 
  restaurantName={$menuStore.restaurantName}
  menuLogo={$menuStore.menuLogo}
  customPrompt={$menuStore.customPrompt}
  selectedRestaurant={$menuStore.selectedRestaurant}
  restaurants={$menuStore.restaurants}
  currency={$currentRestaurant?.currency || '€'}
  color={$currentRestaurant?.color || '#85A3FA'}
  newColumn={$menuStore.newColumn || null}
  on:update={handleRestaurantUpdate}
/>
```

### Update SaveButton Component

```svelte
<!-- src/lib/components/menu-editor/SaveButton.svelte -->
<script lang="ts">
  // Update the saveChanges function
  async function saveChanges() {
    // Debug state before saving
    console.log('Before saving - Complete state:', {
      newColumn: $menuStore.newColumn
    });
    
    // CRITICAL: Validate values before save
    let currentNewColumn = $menuStore.newColumn;
    
    // Example validation for URL fields
    if (currentNewColumn && typeof currentNewColumn === 'string' && currentNewColumn.startsWith('#')) {
      console.warn('Invalid value detected in newColumn, resetting');
      currentNewColumn = null;
      // Force update
      menuStore.updateNewColumn(null);
    }
    
    // If creating a new restaurant
    if (restaurantName && !selectedRestaurant) {
      // Create the restaurant in the store
      menuStore.createRestaurant(
        restaurantName,
        $menuStore.menuLogo,
        $menuStore.customPrompt,
        $menuStore.phoneNumber,
        $menuStore.newColumn
      );
      
      // Update with slug after generation
      menuStore.updateRestaurantInfo(
        restaurantName,
        $menuStore.menuLogo,
        $menuStore.customPrompt,
        newSlug,
        $menuStore.phoneNumber,
        $menuStore.newColumn
      );
    }
    
    // Force update before saving
    menuStore.updateNewColumn(currentNewColumn);
    
    // Save everything
    await menuStore.saveChanges();
  }
</script>
```

## Critical Data Flow Rules

When adding a new column, follow these critical data flow rules to ensure values are correctly saved:

1. **Component Property Binding**: 
   - Ensure all components pass the new field through their props
   - Always bind to `$menuStore.newColumn` or `$currentRestaurant?.newColumn` 

2. **Dedicated Update Method**: 
   - Create a dedicated update method in menuStore (like `updateNewColumn()`)
   - This helps prevent parameter mixing when multiple fields are updated
   - Always mark data as changed with `changedItems.restaurant = true`

3. **Input Component Design**:
   - For URL or text fields, create a dedicated input component
   - Handle empty strings correctly (convert to null)
   - Always log input changes for debugging

4. **Explicit Updates**:
   - In handlers, add an explicit update call to `menuStore.updateNewColumn()`
   - This ensures the value is definitely in the store before saving

5. **Prevent Mixed Values**:
   - Add validation to prevent incorrect values (e.g., color values in URL fields)
   - In SaveButton.svelte, check values right before saving

6. **Track Data Flow**:
   - Add logging at each step of the data flow:
     1. Input component change
     2. RestaurantInfo handler
     3. menuStore update
     4. MenuEditor update
     5. SaveButton preparation
     6. saveChanges call
     7. API request
     8. Database save

7. **Update All Parameters**:
   - When calling `updateRestaurantInfo` or `createRestaurant`, pass all parameters correctly
   - Be aware of parameter order in these functions
   
8. **Handle Race Conditions**:
   - Use a force update pattern before critical operations like save
   - This ensures values are current when the API call is made

## Common Issues and Troubleshooting

1. **Value Mixing**: Values from one field accidentally appearing in another.
   - **Solution**: Use dedicated update methods and validate values before saving.

2. **Lost Updates**: Values not being saved correctly or being overwritten.
   - **Solution**: Force an explicit update with `updateNewColumn()` right before saving.

3. **Parameter Order**: Wrong parameter order in function calls.
   - **Solution**: Check function signatures and use correct parameter order.

4. **Empty String vs Null**: Empty strings being saved instead of null.
   - **Solution**: Convert empty strings to null in input handlers.

5. **Race Conditions**: Values changing between input and save.
   - **Solution**: Add a final explicit update right before saving.

6. **Lost on Refresh**: Data getting lost when switching restaurants.
   - **Solution**: Ensure selectRestaurant properly loads your field from the API.

7. **Type Issues**: TypeScript errors or undefined values.
   - **Solution**: Update all type definitions and use null as default.

## Testing Your Changes

1. **Initial Load**: Verify your field loads correctly from the database
2. **Input Change**: Test that changing the field updates the store
3. **Switching Restaurants**: Make sure values don't get mixed up
4. **Saving**: Confirm the value is included in save operations 
5. **API Debug**: Add console.logs to verify data flow
6. **Refresh**: Test that values persist after page refresh

By following these steps and rules, you should be able to successfully add or modify a database column in the Reco application and ensure proper data flow throughout the system. 