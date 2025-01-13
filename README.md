# Menu Editor Component Documentation

## Overview
The Menu Editor is a comprehensive web application component built with SvelteKit that allows restaurant owners to manage their menu items. The application has been refactored into smaller, maintainable components following the Single Responsibility Principle.

## Component Structure
```
src/lib/components/menu-editor/
├── MenuEditor.svelte           # Main container component
├── restaurant/
│   └── RestaurantInfo.svelte   # Restaurant details management
├── categories/
│   ├── CategoryList.svelte     # Category list container
│   ├── CategoryItem.svelte     # Individual category component
│   └── AddCategory.svelte      # New category form
├── dishes/
│   ├── DishList.svelte        # Dish list container
│   ├── DishItem.svelte        # Individual dish component
│   └── DishForm.svelte        # Add/edit dish form
└── preview/
    └── MenuPreview.svelte     # Live menu preview
```

## Components in Detail

### MenuEditor.svelte
- **Purpose**: Main container component that orchestrates the entire menu editor
- **State Management**:
  - `restaurants`: Array of all restaurants
  - `selectedRestaurant`: Currently selected restaurant ID
  - `categories`: Array of menu categories
  - `restaurantName`: Current restaurant name
  - `menuLogo`: Current restaurant logo URL
- **Key Features**:
  - Initializes the application state
  - Handles communication between child components
  - Manages the overall layout

### RestaurantInfo.svelte
- **Purpose**: Manages restaurant details and logo
- **Props**:
  - `restaurantName`: string
  - `menuLogo`: string
  - `selectedRestaurant`: string | null
  - `restaurants`: Restaurant[]
- **Events**:
  - `update`: Emitted when restaurant details are updated
  - `select`: Emitted when a restaurant is selected
- **Features**:
  - Restaurant name editing
  - Logo upload and management
  - Restaurant creation

### Categories Components

#### CategoryList.svelte
- **Purpose**: Container for category management
- **Props**:
  - `categories`: Category[]
  - `selectedRestaurant`: string | null
- **Events**:
  - `update`: Emitted when categories are modified
- **Features**:
  - Category list rendering
  - Category selection
  - Category CRUD operations

#### CategoryItem.svelte
- **Purpose**: Individual category display and management
- **Props**:
  - `category`: Category
  - `index`: number
  - `isSelected`: boolean
- **Events**:
  - `update`: Category modification
  - `delete`: Category deletion
  - `toggle`: Category selection
- **Features**:
  - Category name editing
  - Category deletion
  - Dish list expansion/collapse

#### AddCategory.svelte
- **Purpose**: New category creation form
- **Props**:
  - `selectedRestaurant`: string | null
- **Events**:
  - `add`: New category creation
- **Features**:
  - Category name input
  - Form validation
  - API integration

### Dishes Components

#### DishList.svelte
- **Purpose**: Container for dishes in a category
- **Props**:
  - `dishes`: Dish[]
  - `categoryId`: string
- **Events**:
  - `update`: Dish list modifications
- **Features**:
  - Dish list rendering
  - Dish CRUD operations

#### DishItem.svelte
- **Purpose**: Individual dish display and management
- **Props**:
  - `dish`: Dish
  - `isEditing`: boolean
  - `categoryId`: string
- **Events**:
  - `edit`: Edit mode toggle
  - `update`: Dish modification
  - `delete`: Dish deletion
- **Features**:
  - Dish details display
  - Dish editing form
  - Image upload

#### DishForm.svelte
- **Purpose**: Add/edit dish form
- **Props**:
  - `categoryId`: string
- **Events**:
  - `add`: New dish creation
- **Features**:
  - Dish details input
  - Image upload
  - Form validation

### MenuPreview.svelte
- **Purpose**: Live preview of the menu
- **Props**:
  - `restaurantName`: string
  - `menuLogo`: string
  - `categories`: Category[]
- **Features**:
  - Responsive menu display
  - Real-time updates
  - Professional layout

## State Management
The application uses a top-down state management approach:
1. Main state is managed in `MenuEditor.svelte`
2. State is passed down through props
3. Child components communicate changes through events
4. Parent components update state and propagate changes

## Event Flow
```
MenuEditor
├── RestaurantInfo
│   └── Events: update, select
├── CategoryList
│   ├── Events: update
│   └── CategoryItem
│       ├── Events: update, delete, toggle
│       └── DishList
│           ├── Events: update
│           └── DishItem
│               └── Events: edit, update, delete
└── MenuPreview
```

## API Integration
Components interact with the following API endpoints:
- `/api/restaurants`: Restaurant CRUD operations
- `/api/restaurants/:id/categories`: Category management
- `/api/categories/:id/dishes`: Dish management
- `/api/upload`: Image upload handling

## Styling
- Uses Tailwind CSS for styling
- Consistent design system across components
- Responsive layout
- Modern glassmorphism design with backdrop blur effects

## Benefits of Refactoring
1. **Improved Maintainability**:
   - Each component has a single responsibility
   - Easier to locate and fix bugs
   - Simpler testing

2. **Better Code Organization**:
   - Clear component hierarchy
   - Logical file structure
   - Separated concerns

3. **Enhanced Reusability**:
   - Components can be used independently
   - Easy to add new features
   - Consistent patterns

4. **Optimized Performance**:
   - Smaller component updates
   - Better state management
   - Reduced re-renders

5. **Developer Experience**:
   - Clear code ownership
   - Easier onboarding
   - Better collaboration

## Type Definitions
```typescript
interface Restaurant {
  id: string;
  name: string;
  logo?: string;
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  dishes: Dish[];
}

interface Dish {
  id: string;
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  categoryId: string;
}
```

## Internationalization
- Uses a translation system with reactive language switching
- Supports multiple languages through `translations.ts`
- Language state managed through `language.ts` store

## Error Handling
- Consistent error handling across components
- User-friendly error messages
- API error management
- Form validation

## Future Improvements
1. Implement caching for better performance
2. Add offline support with service workers
3. Enhance image optimization
4. Add drag-and-drop reordering
5. Implement undo/redo functionality
6. Add batch operations for dishes
7. Enhance search and filtering capabilities
