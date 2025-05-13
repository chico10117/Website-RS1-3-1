# Menu Editor Application Documentation

## Overview
The Menu Editor is a comprehensive web application built with SvelteKit (using Svelte 5 features like Runes) designed for restaurant owners to manage their menus efficiently. Users log in via Google OAuth2 to access the editor, where they can create, view, edit, and delete restaurants, categories, and dishes. The application utilizes a modern tech stack including Neon.tech PostgreSQL with Drizzle ORM for data persistence and is deployed on Vercel.

## Core Features
- User authentication via Google OAuth2.
- CRUD operations for Restaurants.
- CRUD operations for Categories within a Restaurant.
- CRUD operations for Dishes within a Category.
- Dynamic menu preview.
- Link user profiles with their managed restaurants.
- Customizable restaurant details (logo, colors, typography, etc. - *partially implemented/planned*).
- Slug generation for unique restaurant access (*needs refinement*).
- Ability to upload menu files (*needs refinement*).


## Tech Stack
- **Framework:** SvelteKit (with Svelte 5 Runes)
- **Language:** TypeScript
- **Database:** Neon.tech PostgreSQL
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Authentication:** Auth.js / SvelteKitAuth (using Google OAuth2 provider)
- **Internationalization (i18n):** Paraglide.js
- **Deployment:** Vercel
- **Package Manager:** pnpm

## Current Architecture

### Directory Structure
```
src
├── app.css
├── app.d.ts
├── app.html
├── hooks.server.ts
├── lib
│   ├── components
│   │   ├── Header.svelte
│   │   ├── LanguageSwitch.svelte
│   │   ├── menu-editor
│   │   │   ├── MenuEditor.svelte
│   │   │   ├── RestaurantSelector.svelte
│   │   │   ├── SaveButton.svelte
│   │   │   ├── categories
│   │   │   │   ├── AddCategory.svelte
│   │   │   │   ├── CategoryItem.svelte
│   │   │   │   └── CategoryList.svelte
│   │   │   ├── dishes
│   │   │   │   ├── DishForm.svelte
│   │   │   │   ├── DishItem.svelte
│   │   │   │   └── DishList.svelte
│   │   │   ├── preview
│   │   │   │   └── MenuPreview.svelte
│   │   │   └── restaurant
│   │   │       ├── ColorPicker.svelte
│   │   │       ├── CurrencyPicker.svelte
│   │   │       ├── CustomPromptInput.svelte
│   │   │       ├── LogoUploader.svelte
│   │   │       ├── MenuUploader.svelte
│   │   │       ├── PhoneInput.svelte
│   │   │       ├── RestaurantInfo.svelte
│   │   │       ├── RestaurantNameInput.svelte
│   │   │       ├── ThemeColorSection.svelte
│   │   │       ├── UrlInputSection.svelte
│   │   │       └── UrlInput.svelte
│   │   └── ui
│   │       ├── ConfirmDialog.svelte
│   │       ├── LanguageSwitch.svelte
│   │       ├── Toast.svelte
│   │       ├── button
│   │       │   ├── button.svelte
│   │       │   ├── index.ts
│   │       │   └── variants.ts
│   │       ├── card
│   │       │   ├── card-content.svelte
│   │       │   ├── card.svelte
│   │       │   └── index.ts
│   │       ├── checkbox
│   │       │   ├── checkbox.svelte
│   │       │   └── index.ts
│   │       ├── input
│   │       │   ├── index.ts
│   │       │   └── input.svelte
│   │       └── modal
│   │           └── modal.svelte
│   ├── config
│   │   ├── auth.ts
│   │   └── env.ts
│   ├── data
│   │   └── restaurants
│   │       ├── README.md
│   │       ├── restaurant-data-prueba-reco-1739808527066.ts
│   │       ├── restaurant-data-prueba-reco-1739808730896.ts
│   │       ├── restaurant-data-prueba-reco-1739808887868.ts
│   │       ├── restaurant-data-prueba-reco-1739809055675.ts
│   │       ├── restaurant-data-prueba-reco-1739809230507.ts
│   │       ├── restaurant-data-prueba-reco-1739809258645.ts
│   │       ├── restaurant-data-prueba-reco-1739809332833.ts
│   │       └── restaurant-data-restaurante-prueba-reco-1739809361774.ts
│   ├── env.d.ts
│   ├── i18n
│   │   └── translations.ts
│   ├── server
│   │   ├── auth
│   │   │   └── auth-server.ts
│   │   ├── database.ts
│   │   ├── email
│   │   │   └── email-server.ts
│   │   ├── migrate.ts
│   │   └── schema.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── dish.service.ts
│   │   ├── menu.service.ts
│   │   └── restaurant.service.ts
│   ├── stores
│   │   ├── language.ts
│   │   ├── menu-store.ts
│   │   ├── restaurant.ts
│   │   ├── toast.ts
│   │   └── user.ts
│   ├── types
│   │   ├── menu.types.ts
│   │   └── server-types.ts
│   ├── types.ts
│   ├── utils
│   │   ├── RestaurantInfo.helpers.ts
│   │   ├── color.helpers.ts
│   │   └── slug.ts
│   └── utils.ts
└── routes
    ├── +layout.js
    ├── +layout.server.ts
    ├── +layout.svelte
    ├── +page.server.ts
    ├── +page.svelte
    ├── api
    │   ├── auth
    │   │   ├── apple
    │   │   │   └── +server.ts
    │   │   ├── auth.server.ts
    │   │   ├── check
    │   │   │   └── +server.ts
    │   │   ├── facebook
    │   │   │   └── +server.ts
    │   │   ├── google
    │   │   │   └── +server.ts
    │   │   ├── logout
    │   │   │   └── +server.ts
    │   │   └── me
    │   │       └── +server.ts
    │   ├── categories
    │   │   └── [categoryId]
    │   │       └── dishes
    │   │           ├── [dishId]
    │   │           │   └── +server.ts
    │   │           └── +server.ts
    │   ├── process-images
    │   │   └── +server.ts
    │   ├── restaurants
    │   │   ├── +server.ts
    │   │   ├── [restaurantId]
    │   │   │   ├── +server.ts
    │   │   │   └── categories
    │   │   │       ├── [categoryId]
    │   │   │       │   └── +server.ts
    │   │   │       └── +server.ts
    │   │   └── restaurant.api.ts
    │   ├── seed
    │   │   └── +server.ts
    │   ├── slug
    │   │   ├── +server.ts
    │   │   └── check
    │   │       └── +server.ts
    │   └── upload
    │       ├── +server.ts
    │       └── upload.api.ts
    ├── login
    │   └── +page.svelte
    └── pdftoimages
        └── +page.svelte

# (Other root files: svelte.config.js, vite.config.js, package.json, etc.)
```

### Core Architecture Components

#### 1. State Management (Svelte 5 Runes)
The application leverages Svelte 5 Runes for reactive state management, primarily through centralized stores:

- **menu-store.ts:** Manages the state for the menu editor, including restaurant data, categories, dishes, selected items, UI state (e.g., `isSaving`), and change tracking. Uses `$state` for reactive variables and `$derived` for computed values. Effects (`$effect`) are used for reactions to state changes (e.g., triggering saves, logging).
- **user.store.ts:** Holds authenticated user information and session state.
- **Component State:** Local component state is managed using `$state` within `.svelte` files or associated `.svelte.ts` logic files/classes where necessary for complex component logic.

#### 2. Services Layer / Database Interaction
- Located in `src/lib/services/` and `src/lib/db/`.
- **Drizzle ORM:** Defines the database schema (`src/lib/db/schema.ts`) mirroring PostgreSQL tables (users, restaurants, categories, dishes).
- **Drizzle Client:** Configured to connect to the Neon.tech PostgreSQL database.
- **Service Files:** Encapsulate database query logic using Drizzle for CRUD operations on restaurants, categories, and dishes. These services are typically called from SvelteKit API routes or server `load` functions.

#### 3. Component Architecture
- Follows Svelte best practices with modular components.
- **UI Components:** Reusable UI elements built with Svelte and styled with Tailwind CSS, often leveraging Shadcn UI components from `src/lib/components/ui`. The `cn()` utility helps manage Tailwind classes.
- **Feature Components:** Larger components responsible for specific features (e.g., `MenuEditor.svelte`, `RestaurantSelector.svelte`, `DishList.svelte`).
- **Props:** Data is passed down using `$props()`. `$bindable()` is used for two-way binding where appropriate.

#### 4. Routing and API
- **File-Based Routing:** SvelteKit's routing system in `src/routes/` defines pages and API endpoints.
- **Load Functions:** Server `load` functions are used to fetch data before a page renders, ensuring data is available server-side or client-side as needed.
- **API Routes:** Located under `src/routes/api/`, handling requests from the client (e.g., saving menu changes) and interacting with the service layer.
- **Form Actions:** SvelteKit form actions are used for progressive enhancement, handling form submissions server-side.

#### 5. Authentication
- Implemented using `Auth.js` (formerly NextAuth.js / SvelteKitAuth).
- **Google OAuth2 Provider:** Configured for user login.
- **Session Management:** Handled via server hooks (`hooks.server.ts`) and potentially a `user.store.ts` on the client.
- **Protected Routes:** Routes under `(app)` or similar groups require authentication, managed by layout checks or hooks.

## Data Flow

The application follows a typical SvelteKit data flow pattern, leveraging server `load` functions, API routes, Svelte 5 Runes for state management, and services for database interaction.

**Scenario 1: Initial Page Load (e.g., Loading the Menu Editor)**

1.  **Request:** User navigates to the menu editor page (e.g., `/menu`).
2.  **Authentication Check:** SvelteKit's `hooks.server.ts` intercepts the request. It likely checks for a valid user session (using `Auth.js` helpers). If the user is not authenticated, they are redirected to the login page (`/login`).
3.  **Server `load` Function:** If authenticated, the `+page.server.ts` (or `+layout.server.ts`) associated with the `/menu` route executes its `load` function.
4.  **Data Fetching (Server-Side):**
    *   The `load` function typically retrieves the user's session data (including user ID).
    *   It calls relevant functions from the **Service Layer** (`src/lib/services/` - e.g., `restaurant.service.ts`).
    *   These service functions use the **Drizzle Client** (`src/lib/db/index.ts`) to query the **Neon.tech PostgreSQL Database** for the user's restaurants.
5.  **Data Return:** The `load` function returns the fetched data (e.g., list of restaurants) to the SvelteKit framework.
6.  **Page Rendering (Server/Client):**
    *   SvelteKit renders the page component (e.g., `src/routes/menu/+page.svelte`).
    *   The data returned from `load` is available to the page component.
7.  **Client-Side Hydration/Initialization:**
    *   The page component receives the initial data.
    *   It might use this data to initialize client-side **Stores** (`src/lib/stores/`, e.g., `menu-store.ts`) using `$state`.
    *   Components like `RestaurantSelector.svelte` subscribe to the relevant store (`menu-store.ts`) and display the list of restaurants.

**Scenario 2: User Interaction & Saving Changes (e.g., Editing a Dish Title)**

1.  **User Interaction:** The user edits the title of a dish within a `DishItem.svelte` component.
2.  **Component State Update:** The `input` event triggers an update.
    *   The component's local state (potentially using `$state` directly or via a method in the `menu-store`) is updated with the new title.
3.  **Store Update & Change Tracking:**
    *   The `menu-store.ts` updates the corresponding dish object within its reactive `$state` data.
    *   Crucially, the store also **tracks this change**, often by adding the dish's ID to a `changedItems.dishes` Set within the store's state.
4.  **UI Reactivity:** Any component subscribed to the `menu-store.ts` (like the `MenuPreview.svelte` or the `DishItem.svelte` itself) automatically reflects the updated dish title due to Svelte's reactivity system (powered by Runes).
5.  **Save Action:** The user clicks the `SaveButton.svelte` component.
6.  **Trigger Save Logic:** The button's `on:click` handler calls a `saveChanges` method (or similar) within the `menu-store.ts`.
7.  **API Call Preparation:**
    *   The `saveChanges` method identifies all items marked in the `changedItems` sets (restaurants, categories, dishes, plus any deleted items).
    *   It constructs a payload containing only the necessary data for the changed/deleted items.
    *   It likely sets an `isSaving` flag (`$state(true)`) in the store to provide UI feedback (e.g., disabling the save button).
8.  **Client-Side API Call:** The store uses the browser's `fetch` API to send a request (e.g., `POST` or `PATCH`) to a relevant SvelteKit **API Route** (e.g., `/api/restaurants/[restaurantId]` or a more general `/api/menu/save`). The payload includes the changes.
9.  **API Route Handling (`+server.ts`):**
    *   The API route handler receives the request.
    *   It parses and validates the incoming payload.
    *   It performs another authentication/authorization check to ensure the user has permission to modify the target data.
10. **Server-Side Service Interaction:**
    *   The API route handler calls the appropriate **Service Layer** functions (`restaurant.service.ts`, `category.service.ts`, `dish.service.ts`).
11. **Database Interaction:**
    *   Service functions use the **Drizzle Client** to execute `UPDATE`, `INSERT`, or `DELETE` SQL commands against the **Neon.tech Database**.
    *   Transactions might be used if multiple related updates need to occur atomically.
12. **API Response:** The API route sends a response back to the client, typically indicating success or failure (with error details if applicable).
13. **Client-Side Response Handling:**
    *   The `fetch` call on the client receives the response.
    *   The `menu-store.ts` handles the response:
        *   On success: Clears the relevant IDs from the `changedItems` sets, updates `lastSaveTime`, potentially shows a success toast message (via `toast.store.ts`), and sets `isSaving` back to `$state(false)`.
        *   On failure: Displays an error message (via `toast.store.ts`), leaves the changes in the store (allowing the user to retry), and sets `isSaving` back to `$state(false)`.

This detailed flow highlights the interplay between SvelteKit's server-side capabilities, client-side reactivity with Runes, API routes for mutations, and the separation of concerns provided by the service layer and ORM.

## Database Schema (Defined in `src/lib/server/schema.ts`)

The database schema is defined using Drizzle ORM for PostgreSQL.

**`users` Table:**
*   `id`: `uuid` (Primary Key, Default: Random)
*   `email`: `text` (Not Null, Unique)
*   `name`: `text` (Nullable)
*   `picture`: `text` (Nullable)
*   `createdAt`: `timestamp` (Default: Now)
*   `updatedAt`: `timestamp` (Default: Now)

**`restaurants` Table:**
*   `id`: `uuid` (Primary Key, Default: Random)
*   `name`: `text` (Not Null)
*   `slug`: `text` (Not Null, Unique)
*   `logo`: `text` (Nullable)
*   `userId`: `uuid` (Not Null, Foreign Key -> `users.id`, On Delete: Cascade)
*   `customPrompt`: `text` (Nullable)
*   `currency`: `text` (Not Null, Default: '€')
*   `color`: `text` (Not Null, Default: '1') - *Note: Consider if `integer` or a more specific type is appropriate.*
*   `phoneNumber`: `bigint` (mode: 'number', Nullable)
*   `reservas`: `text` (Nullable) - *Note: Consider if a structured type like JSONB or separate table might be better.*
*   `redes_sociales`: `text` (Nullable) - *Note: Consider if a structured type like JSONB or separate table might be better.*
*   `createdAt`: `timestamp` (Default: Now)
*   `updatedAt`: `timestamp` (Default: Now)

**`categories` Table:**
*   `id`: `uuid` (Primary Key, Default: Random)
*   `name`: `text` (Not Null)
*   `restaurantId`: `uuid` (Nullable, Foreign Key -> `restaurants.id`, On Delete: Cascade)
*   `createdAt`: `timestamp` (Default: Now)
*   `updatedAt`: `timestamp` (Default: Now)
*   **Constraints:** `unique(name, restaurantId)` - Category names must be unique within a restaurant.

**`dishes` Table:**
*   `id`: `uuid` (Primary Key, Default: Random)
*   `title`: `text` (Not Null)
*   `imageUrl`: `text` (Nullable)
*   `price`: `decimal(10, 2)` (Nullable)
*   `description`: `text` (Nullable)
*   `categoryId`: `uuid` (Nullable, Foreign Key -> `categories.id`, On Delete: Cascade)
*   `createdAt`: `timestamp` (Default: Now)
*   `updatedAt`: `timestamp` (Default: Now)

## Deployment
In vercel

##############################################

## Understanding `+server.ts` Files in Your SvelteKit API

In your SvelteKit project, files named `+server.ts` (or `+server.js`) are the cornerstone for creating backend API endpoints. The way these files are structured within your `src/routes/` directory directly dictates the URL paths of your API.

Here's a breakdown of their function, particularly in the context of your `src/routes/api/restaurants/` structure:

### 1. Defining API Endpoints via File-System Routing

SvelteKit uses a file-system based router. This means the location of a `+server.ts` file within the `src/routes` directory defines the API endpoint's URL.

*   A file at `src/routes/api/some-path/+server.ts` will create an API endpoint accessible at `/api/some-path`.
*   Dynamic segments in the path are created using square brackets, e.g., `src/routes/api/items/[itemId]/+server.ts` creates an endpoint like `/api/items/123`, where `123` becomes a parameter.

### 2. Handling HTTP Methods

Inside each `+server.ts` file, you export functions named after standard HTTP methods (e.g., `GET`, `POST`, `PUT`, `DELETE`, `PATCH`). Each exported function becomes a handler for requests made to the file's corresponding URL using that specific HTTP method.

*   **`export async function GET({ params, request, cookies, url, locals, platform, fetch }) { ... }`**: Handles GET requests to fetch data.
*   **`export async function POST({ params, request, ... }) { ... }`**: Handles POST requests, typically for creating new resources.
*   **`export async function PUT({ params, request, ... }) { ... }`**: Handles PUT requests, usually for updating existing resources.
*   **`export async function DELETE({ params, request, ... }) { ... }`**: Handles DELETE requests for removing resources.

### 3. Request Handling and Context

Each of these exported HTTP method functions receives a `RequestEvent` object as its argument. This object provides crucial context and utilities for handling the incoming request, including:

*   `request`: The standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object, allowing you to access headers, body (e.g., `await request.json()`, `await request.formData()`), etc.
*   `params`: An object containing the values of any dynamic route segments. For example, in `/api/restaurants/[restaurantId]/+server.ts`, `params.restaurantId` would hold the actual ID from the URL.
*   `url`: A [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object representing the incoming request's URL, useful for query parameters.
*   `cookies`: An API for getting and setting cookies.
*   `locals`: An object to pass data between hooks and endpoint handlers (e.g., authenticated user data).
*   `fetch`: A `fetch` API, augmented by SvelteKit, that can make requests to other internal or external endpoints.

### 4. Returning Responses

The handler functions are expected to return a standard [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object. SvelteKit provides a convenient `json()` helper function from `@sveltejs/kit` to easily return JSON responses with appropriate headers and status codes.

```typescript
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
  // ... logic to fetch data ...
  const data = { id: params.someId, message: "Hello from the API" };
  return json({ success: true, data: data }, { status: 200 });
}