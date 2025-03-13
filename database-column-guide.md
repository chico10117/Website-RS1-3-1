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

## Step 3: Update Store State

Modify the menu store to include the new field in its state:

```typescript
// src/lib/stores/menu-store.ts

// Update the initial state
const initialState: MenuStore = {
  // existing state...
  newColumn: null,
};

// Update the createRestaurant method
createRestaurant(name: string, logo: string | null = null, customPrompt: string | null = null, newColumn: string | null = null) {
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
updateRestaurantInfo(name: string, logo: string | null, customPrompt: string | null = null, slug: string | null = null, newColumn: string | null = null) {
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
  // Prepare restaurant data with the new column
  const restaurantData = {
    // existing data...
    newColumn: state.newColumn,
  };
  
  // Update state with saved data
  return {
    // existing state...
    newColumn: result.restaurant.newColumn,
  };
}
```

## Step 4: Update API Routes

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

### Update restaurant.api.ts (if used)

```typescript
// src/routes/api/restaurants/restaurant.api.ts
export const POST = async ({ request }: { request: Request }) => {
  const data = await request.json();
  
  const [newRestaurant] = await db.insert(restaurants)
    .values({
      // existing values...
      newColumn: data.newColumn || null,
    })
    .returning();
}
```

## Step 5: Update Restaurant Service

```typescript
// src/lib/services/restaurant.service.ts
export async function createOrUpdateRestaurant(
  restaurantData: { 
    // existing properties...
    newColumn?: string | null;
  }, 
  restaurantId?: string
): Promise<Restaurant> {
  // Include the new column in the request body
  const bodyData = isUpdate 
    ? { 
        // existing data...
        newColumn: restaurantData.newColumn,
      }
    : { 
        // existing data...
        newColumn: restaurantData.newColumn,
      };
}
```

## Step 6: Update Menu Service

```typescript
// src/lib/services/menu.service.ts
export async function saveMenuChanges(
  restaurantData: {
    // existing properties...
    newColumn?: string | null;
  },
  currentRestaurantId: string | null
): Promise<SaveResult> {
  const savedRestaurant = await restaurantService.createOrUpdateRestaurant(
    {
      // existing properties...
      newColumn: restaurantData.newColumn ?? currentRestaurant?.newColumn,
    },
    isNewRestaurant ? undefined : currentRestaurantId
  );
}
```

## Step 7: Update UI Components

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
  
  // Include the new property in all dispatch calls
  dispatch('update', {
    // existing properties...
    newColumn: newColumn,
  });
  
  // Include the new property in all updateRestaurantInfo calls
  menuStore.updateRestaurantInfo(
    restaurantName,
    menuLogo,
    customPrompt,
    $currentRestaurant?.slug || null,
    newColumn
  );
  
  // Include the new property in all currentRestaurant.set calls
  currentRestaurant.set({
    ...$currentRestaurant,
    newColumn: newColumn
  });
</script>

<!-- Add UI for the new column -->
<div class="space-y-2 mb-12">
  <label class="block text-sm font-medium text-gray-700">
    {t('newColumnLabel')}
  </label>
  <!-- Add appropriate input element -->
</div>
```

### Update MenuEditor Component

```svelte
<!-- src/lib/components/menu-editor/MenuEditor.svelte -->
<script lang="ts">
  // Update the handleRestaurantUpdate function
  async function handleRestaurantUpdate(event: CustomEvent<{ id?: string; name: string; logo: string | null; customPrompt: string | null; currency: string; color: number; newColumn: string | null }>) {
    const { id, name, logo, customPrompt, newColumn } = event.detail;
    
    if (id) {
      // Update existing restaurant
      menuStore.updateRestaurantInfo(name, logo, customPrompt, $currentRestaurant?.slug || null, newColumn);
    } else {
      // Create new restaurant
      menuStore.createRestaurant(name, logo, customPrompt, newColumn);
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
  color={$currentRestaurant?.color || 1}
  newColumn={$currentRestaurant?.newColumn || null}
  on:update={handleRestaurantUpdate}
/>
```

### Update SaveButton Component

```svelte
<!-- src/lib/components/menu-editor/SaveButton.svelte -->
<script lang="ts">
  // Update the saveChanges function
  async function saveChanges() {
    // Create the restaurant in the store
    menuStore.createRestaurant(
      restaurantName,
      $menuStore.menuLogo,
      $menuStore.customPrompt,
      $menuStore.newColumn
    );
    
    // Update with the proper slug
    menuStore.updateRestaurantInfo(
      restaurantName,
      $menuStore.menuLogo,
      $menuStore.customPrompt,
      newSlug,
      $menuStore.newColumn
    );
  }
</script>
```

## Common Issues and Troubleshooting

1. **Missing Parameters**: Ensure all function calls that use the column are updated with the new parameter.
2. **Type Errors**: Make sure TypeScript types are updated consistently across all files.
3. **Database Errors**: Check that the column name in the schema matches the database column name.
4. **UI Not Updating**: Verify that the store is correctly updating and passing the new field to components.
5. **Data Not Saving**: Ensure the API routes are correctly handling the new field in both request and response.

## Testing Your Changes

1. Add a new value for your column through the UI
2. Save the changes
3. Refresh the page and verify the value persists
4. Check the database to confirm the value was saved correctly

By following these steps, you should be able to successfully add or modify a database column in the Reco application. 