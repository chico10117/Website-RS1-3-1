# Menu Editor Component Documentation

## Overview
The Menu Editor is a comprehensive web application component built with SvelteKit that allows restaurant owners to manage their menu items. The application follows a modern architecture with a centralized state management approach using Svelte stores.

## Current Architecture

### Directory Structure
```
src/lib/
├── components/menu-editor/     # UI Components
│   ├── MenuEditor.svelte      # Main container component
│   ├── RestaurantSelector.svelte # Restaurant selection component
│   ├── restaurant/           
│   │   └── RestaurantInfo.svelte
│   ├── categories/
│   │   ├── CategoryList.svelte
│   │   ├── CategoryItem.svelte
│   │   └── AddCategory.svelte
│   ├── dishes/
│   │   ├── DishList.svelte
│   │   ├── DishItem.svelte
│   │   └── DishForm.svelte
│   └── preview/
│       └── MenuPreview.svelte
├── services/                   # API Services
│   ├── restaurant.service.ts
│   ├── category.service.ts
│   ├── dish.service.ts
│   └── menu.service.ts
├── stores/                     # State Management
│   ├── menu-store.ts          # Primary centralized store
│   ├── restaurant.ts          # Restaurant-specific store
│   ├── menu-state.ts          # Legacy store (being phased out)
│   ├── menu-cache.ts          # Legacy cache store (being phased out)
│   ├── language.ts            # Internationalization store
│   ├── toast.ts               # Notification store
│   └── user.ts                # User authentication store
└── types/                     # TypeScript Types
    └── menu.types.ts
```

### Core Architecture Components

#### 1. State Management
The application has evolved from a two-tiered state management approach to a more centralized store system:

- **menu-store.ts** (Primary Store)
  - Centralized state management for the entire menu editor
  - Tracks both data and UI state
  - Handles change tracking for saving operations
  - Provides methods for all CRUD operations
  ```typescript
  interface MenuStore {
    // Current data
    restaurants: Restaurant[];
    selectedRestaurant: string | null;
    restaurantName: string;
    menuLogo: string | null;
    customPrompt: string | null;
    phoneNumber: string | null;
    categories: Category[];
    
    // Tracking changes
    changedItems: {
      restaurant: boolean;
      categories: Set<string>; // IDs of changed categories
      dishes: Set<string>;     // IDs of changed dishes
      deletedCategories: Set<string>; // IDs of categories to delete
      deletedDishes: Set<string>;     // IDs of dishes to delete
    };
    
    // UI state
    isSaving: boolean;
    lastSaveTime: Date | null;
  }
  ```

- **restaurant.ts**
  - Focused store for restaurant data
  - Handles restaurant-specific operations
  - Maintains the currently selected restaurant

- **Legacy Stores** (Being Phased Out)
  - menu-state.ts: Previously used for main state management
  - menu-cache.ts: Previously used for tracking changes

#### 2. Services Layer
Handles all API interactions and data transformations:

- **restaurant.service.ts**
  - Restaurant CRUD operations
  - Restaurant data validation

- **category.service.ts**
  - Category management
  - Category-specific validations

- **dish.service.ts**
  - Dish CRUD operations
  - Dish data transformations
  - Image handling for dishes

- **menu.service.ts**
  - Coordinates complex operations
  - Handles multi-entity updates

#### 3. Component Architecture
The UI is composed of modular components:

- **MenuEditor.svelte**
  - Main container component
  - Coordinates between components
  - Manages overall UI state
  - Handles data flow between components

- **RestaurantSelector.svelte**
  - Allows selection of restaurants
  - Displays restaurant list
  - Handles restaurant creation

- **RestaurantInfo.svelte**
  - Displays and edits restaurant details
  - Handles restaurant logo management

- **CategoryList.svelte & CategoryItem.svelte**
  - Manages category display and editing
  - Handles category CRUD operations

- **DishList.svelte & DishItem.svelte**
  - Manages dish display and editing
  - Handles dish CRUD operations

- **MenuPreview.svelte**
  - Real-time preview of the menu
  - Displays restaurant, categories, and dishes
  - Updates reactively as changes are made

#### 4. Type System
Strong TypeScript typing for all entities:

```typescript
interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  customPrompt: string | null;
  userId: string;
  currency: string;
  color: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  restaurantId: string;
  dishes?: Dish[];
}

interface Dish {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string | null;
  categoryId: string;
}
```

## Data Flow

The current architecture follows a more streamlined data flow:

1. **User Interaction** → Component events trigger store methods
2. **Store Methods** → Update local state and track changes
3. **Service Calls** → Triggered by store methods for API operations
4. **UI Updates** → Components reactively update based on store changes

## Current State Management Approach

The application is transitioning from a two-tiered state management system to a more centralized approach:

### Previous Approach (Being Phased Out)
- **menu-state.ts**: Managed current application state
- **menu-cache.ts**: Tracked unsaved changes separately

### Current Approach
- **menu-store.ts**: Centralized store that handles both current state and change tracking
- **restaurant.ts**: Specialized store for restaurant-specific operations

This transition simplifies the architecture by:
1. Reducing the number of stores that need to be coordinated
2. Centralizing change tracking within the main store
3. Providing a single source of truth for the application state

## Benefits of Current Architecture

1. **Simplified State Management**
   - Single source of truth in menu-store.ts
   - Easier to reason about state changes
   - More predictable data flow

2. **Improved Component Communication**
   - Components subscribe to the same store
   - Reduced prop drilling
   - More reactive updates

3. **Better Change Tracking**
   - Integrated change tracking in the main store
   - Clearer save/discard operations
   - More reliable state synchronization

4. **Enhanced Maintainability**
   - Clearer separation of concerns
   - More modular components
   - Easier to extend and modify

## Future Improvements

1. Complete the transition away from legacy stores
2. Enhance error handling and recovery
3. Improve performance with more selective store updates
4. Add more comprehensive testing
5. Implement undo/redo functionality
6. Add drag-and-drop reordering for categories and dishes
7. Enhance the preview with more customization options
8. Implement offline support with service workers
9. Add real-time collaboration features

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm run dev`
4. Access the application at `http://localhost:5173` 